const Order = require("../models/Order");
const CryptoJS = require("crypto-js");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    console.log("Error");

    res.status(500).json(err.message);
  }
});

//Update

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log("updatedOrder", updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//Delete

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET USER ORDERS

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.id });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  console.log("date", date);
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(date.setMonth(date.getMonth() - 1));

  console.log("lastMonth", lastMonth);
  console.log("previousMonth", previousMonth);
  //   console.log("previousYear", lastYear);

  try {
    //Aggregation operations group values from multiple documents together,
    // and can perform a variety of operations on the grouped data to return a single result
    const income = await Order.aggregate([
      {
        //This is a filtering operation and thus this can reduce the amount of documents that are given as input to the next stage.
        $match: { createdAt: { $gte: previousMonth } },
      },
      {
        //Used to select some specific fields from a collection
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        //This does the actual aggregation as discussed above
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    console.log("income", income);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
