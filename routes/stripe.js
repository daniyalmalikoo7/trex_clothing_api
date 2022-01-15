const { default: Stripe } = require("stripe");

const router = require("express").Router();
const stripe = require("stripe")(
  "sk_test_51KDASNBRqg9vuV5BlWaw3dSxq6hwkSeQzVt4Ai5Etr1pDz0NwCbKO36QMK37kv6j92lwGpFlHN5D2Uohg1oQlZzU00efUO6ugx"
);
// const stripeKey = process.env.STRIPE_KEY;
router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        console.log(stripeErr);
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
