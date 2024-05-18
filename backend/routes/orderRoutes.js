const express = require("express");
const router = express.Router();
const OrderModel = require("../models/order");
const ShopItemModel = require("../models/shopItem");
const mongoose = require("mongoose");

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("user", "username")
      .populate("items.shopItem");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific order
router.get("/:id", getOrder, (req, res) => {
  res.json(res.order);
});

// CREATE a new order
router.post("/", async (req, res) => {
  const order = new OrderModel({
    _id: new mongoose.Types.ObjectId(),
    user: req.body.user,
    items: req.body.items,
    totalAmount: req.body.totalAmount,
  });
  try {
    // Check stock availability before creating the order
    for (const item of order.items) {
      const shopItem = await ShopItemModel.findById(item.shopItem);
      if (!shopItem || shopItem.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: "Insufficient stock for item: " + shopItem.name });
      }
      shopItem.stock -= item.quantity;
      await shopItem.save();
    }

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an order (e.g., change status)
router.patch("/:id", getOrder, async (req, res) => {
  if (req.body.status != null) {
    res.order.status = req.body.status;
  }
  // You might want to add more fields to update here
  try {
    const updatedOrder = await res.order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an order
router.delete("/:id", getOrder, async (req, res) => {
  try {
    await res.order.remove();
    res.json({ message: "Deleted Order" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get an order by ID
async function getOrder(req, res, next) {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("user", "username")
      .populate("items.shopItem");
    if (order == null) {
      return res.status(404).json({ message: "Cannot find order" });
    }
    res.order = order;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
