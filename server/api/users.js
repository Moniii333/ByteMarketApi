const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername, getUser, getUserById, addUserShippingInfo, selectUserShipmentInfo, getAllRegisteredUsers } = require('../db');
const { requireUser } = require('./utils');
const { JWT_SECRET = 'neverTell' } = process.env;
const validator = require('validator');


// POST /api/users/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password'
    });
  }

  try {
    const user = await getUser({username, password});
    if(!user) {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      })
    } else {
      const userId = user.id
      const token = jwt.sign({id: userId, username: user.username}, JWT_SECRET, { expiresIn: '1w' });
      res.send({ user, message: "you're logged in!", token });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const queriedUser = await getUserByUsername(username);
    if (queriedUser) {
      res.status(422);
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    } else if (!validator.isEmail(email)) {
      res.status(400);
      next({
        name: 'InvalidEmailError',
        message: 'Invalid email address'
      }); 
    }  else if (password.length < 8) {
      res.status(400);
      next({
        name: 'PasswordLengthError',
        message: 'Password Too Short!'
      });
    } else {
      const user = await createUser({
        username,
        password,
        email
      });
      if (!user) {
        next({
          name: 'UserCreationError',
          message: 'There was a problem registering your account. Please try again.',
        });
      } else {
        const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, { expiresIn: '1w' });
        res.status(200).send({ user, message: "You're signed up!", token });
      }
    }
  } catch (error) {
    next(error)
  }
})

// POST /api/users/me
router.post('/me', requireUser, async (req, res, next) => {
  try{
    const user = await getUserById(req.user.id)
    if(!user) {
      res.status(401);
      next({
        name: 'InvalidUserId',
        message: 'User id is incorrect'
      });
    } else {
      const { first_name, last_name, address } = req.body

      if(!first_name || !last_name) {
        res.status(400)
        next({
          name: 'MissingInfo',
          message: 'First name and last name are required for updating shipping information',
        })
      } else {
        // update the users shipment info
        const updatedShipmentInfo = await addUserShippingInfo(user.id,{ first_name, last_name, address })
        res.status(200).send({ message: 'Shipping information has been added!', updatedShipmentInfo})
      }
    }
  } catch(error) {
    next(error)
  }
})

// GET /api/users/me
router.get('/me', requireUser, async (req, res, next) => {
  try {
    const userId = req.user.id
    const userData = req.user

    // get users shipment info if any
    const shippingInfo = await selectUserShipmentInfo({ user_id: userId})

    if(!shippingInfo) {
      res.send(userData)
    } else {
      res.send({ user: userData, userShipmentInfo: shippingInfo})
    }
  } catch (error) {
    next(error)
  }
})

// /api/users/allusers
router.get('/allusers', requireUser, async (req, res, next) => {
  try{
    const allUsers = await getAllRegisteredUsers()
    if(allUsers){
      res.send(allUsers)
    }
  }catch(error){
    next(error)
  }
})

module.exports = router;