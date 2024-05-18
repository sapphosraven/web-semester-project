const express = require("express");
const router = express.Router();
const ShopItemModel = require("../models/shopItem");
const multer = require("multer");
const mongoose = require("mongoose");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all shop items
router.get("/", async (req, res) => {
  try {
    const shopItems = await ShopItemModel.find();
    res.json(shopItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific shop item
router.get("/:id", getShopItem, (req, res) => {
  res.json(res.shopItem);
});

// CREATE a new shop item
router.post("/", upload.array("images"), async (req, res) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];

  for (const file of req.files) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only JPEG and PNG images allowed.",
      });
    }
  }
  const shopItem = new ShopItemModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    images: req.files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
    })),
  });
  try {
    const newShopItem = await shopItem.save();
    res.status(201).json(newShopItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a shop item
router.patch("/:id", getShopItem, upload.array("images"), async (req, res) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];

  for (const file of req.files) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res
        .status(400)
        .json({
          message: "Invalid file type. Only JPEG and PNG images allowed.",
        });
    }
  }
  if (req.body.name != null) {
    res.shopItem.name = req.body.name;
  }
  if (req.body.description != null) {
    res.shopItem.description = req.body.description;
  }
  if (req.body.price != null) {
    res.shopItem.price = req.body.price;
  }
  if (req.body.stock != null) {
    res.shopItem.stock = req.body.stock;
  }
  if (req.files.length > 0) {
    // Update images if provided
    res.shopItem.images = req.files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));
  }
  try {
    const updatedShopItem = await res.shopItem.save();
    res.json(updatedShopItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a shop item
router.delete("/:id", getShopItem, async (req, res) => {
  try {
    await res.shopItem.remove();
    res.json({ message: "Deleted Shop Item" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a shop item by ID
async function getShopItem(req, res, next) {
  try {
    const shopItem = await ShopItemModel.findById(req.params.id);
    if (shopItem == null) {
      return res.status(404).json({ message: "Cannot find shop item" });
    }
    res.shopItem = shopItem;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
