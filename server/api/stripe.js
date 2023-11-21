const express = require('express');
const router = express.Router();
const { requireUser } = require('./utils');
require('dotenv').config();
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeKey);
const { getUserById } = require('../db/users');

// router.use(requireUser)

// /stripe/create-checkout-session
router.post('/create-checkout-session/:id', async (req, res) => {
  const items = req.body.items
  console.log('items:', items)
  let lineItems = []
  items.forEach((item) => {
    console.log('price:', item.price_data.unit_amount)
    lineItems.push(
      {
        price_data: {
          currency: 'usd',
          product: item.id,
          unit_amount: item.unit_amount * 100,
          product_data: {
            name: item.name,
          }
        },
        quantity: item.quantity,
      })
  })

  const userId = req.params.id
  console.log('user:', userId)
  const user = getUserById(userId)

  const session = await stripe.checkout.sessions.create({
    customer: user.id,
    client_reference_id: user.username,
    line_items: lineItems,
    mode: 'payment',
    success_url: 'http://localhost:5173/success',
    cancel_url: 'http://localhost:5173/cancel'
  })

  res.send(JSON.stringify({
    url: session.url
  }))
})

module.exports = router