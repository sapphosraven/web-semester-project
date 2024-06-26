const express = require("express");
const router = express.Router();
const ArticleModel = require("../models/article");
const multer = require("multer");
const mongoose = require("mongoose");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// GET all articles (optional query parameter for category)
router.get("/", async (req, res) => {
  try {
    let query = {};
    if (req.query.category) {
      query.category = req.query.category.toLowerCase(); // Make category lowercase for case-insensitive matching
    }
    const articles = await ArticleModel.find(query).populate(
      "author",
      "username"
    );
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// GET a specific article
router.get("/:id", getArticle, (req, res) => {
  res.json(res.article);
});

// CREATE a new article
router.post("/", upload.array("images"), async (req, res) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];

  // Validate image types
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type. Only JPEG and PNG images allowed.",
        });
      }
    }
  }

  const article = new ArticleModel({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    category: req.body.category,
    images:
      req.files && req.files.length > 0
        ? req.files.map((file) => ({
            data: file.buffer,
            contentType: file.mimetype,
          }))
        : null,
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// UPDATE an article
router.patch("/:id", getArticle, upload.array("images"), async (req, res) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];

  // Validate image types
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type. Only JPEG and PNG images allowed.",
        });
      }
    }
  }
  if (req.body.title != null) {
    res.article.title = req.body.title;
  }
  if (req.body.content != null) {
    res.article.content = req.body.content;
  }
  if (req.body.category != null) {
    res.article.category = req.body.category;
  }
  if (req.files) {
    if (req.files.length > 0) {
      res.article.images = req.files.map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
      }));
    }
  }
  try {
    const updatedArticle = await res.article.save();
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an article
router.delete("/:id", getArticle, async (req, res) => {
  try {
    await ArticleModel.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted Article" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all articles of a specific category
router.get("/category/:category", async (req, res) => {
  try {
    console.log("Received category:", req.params.category);
    const category = req.params.category.toUpperCase();

    const articles = await ArticleModel.find({ category }).populate(
      "author",
      "username"
    );
    if (!articles) {
      return res
        .status(404)
        .json({ message: "No articles found for this category" });
    }
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific article
router.get("/article/:id", getArticle, (req, res) => {
  res.json(res.article);
});
// Middleware to get an article by ID
async function getArticle(req, res, next) {
  let article;
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // Check if ID is a valid ObjectId (24 hex characters)
      article = await ArticleModel.findById(req.params.id).populate(
        "author",
        "username"
      );
    } else {
      return res.status(404).json({ message: "Cannot find article" });
    }

    if (article == null) {
      return res.status(404).json({ message: "Cannot find article" });
    }
    res.article = article;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
module.exports = router;
