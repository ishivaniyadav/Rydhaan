const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.send("Stripe payment backend is live!!");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: "Car Rental"
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `https://ishivaniyadav.github.io/Rydhaan/stripe-payment/success.html`,
      cancel_url: `https://ishivaniyadav.github.io/Rydhaan/stripe-payment/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Payment Session Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));