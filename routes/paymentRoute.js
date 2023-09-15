const stripe = require("stripe")(
  "sk_test_51NpuY0SBg5SfVh4bkpRjMKI31oX798QcmYzjUsNoX1EpF2Z2WNiI66e0kJpLyssuayC4CTvvXWOrIlClPbirC4qi00f6LtNSYG"
);
const express = require("express");
require("dotenv").config();
const router = express.Router();

router.post("/createCharge", async (req, res) => {
  const { product, token } = req.body;

  stripe.customers
    .create({
      email: token.email,
    })
    .then(async (customer) => {
      await stripe.charges
        .create({
          amount: 2000,
          currency: "INR",
          customer: customer.id,
          description: `Purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
          // amount: 1000, // Amount in cents
          // currency: "INR",
          // customer: customer.id,
          // description: "Product Purchase",
        })
        .then((result) => {
          res.json(result);
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
