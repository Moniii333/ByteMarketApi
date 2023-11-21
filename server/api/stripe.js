const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeKey);
const { getUserById } = require('../db/users');

// /stripe/create-checkout-session
router.post('/create-checkout-session/:id', async (req, res) => {
  const items = req.body.items

  // proceed to process items
  const lineItems = items.map(item => ({
    price_data: {
      currency: item.price_data.currency,
      unit_amount: item.price_data.unit_amount * 100,
      product_data: {
        name: item.price_data.product_data.name,
      },
    },
    quantity: item.quantity,
  }))

  const userId = req.params.id
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