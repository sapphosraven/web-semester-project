const express = require("express");
const router = express.Router();
const ArticleModel = require("../models/article");
const multer = require("multer");
const mongoose = require("mongoose");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all articles (no filtering)
router.get("/", async (req, res) => {
  try {
    const articles = await ArticleModel.find().populate("author", "username");
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all articles of a specific category
router.get("/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase(); // Make category lowercase

    const articles = await ArticleModel.find({ category }).populate(
      "author",
      "username"
    );
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific article
router.get("/article/:id", getArticle, (req, res) => {
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
async function getArticle(req, res, next) {
  let article;
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // If req.params.id is a valid ObjectId, use findById
      article = await ArticleModel.findById(req.params.id).populate(
        "author",
        "username"
      );
    } else {
      // If req.params.id is not a valid ObjectId, assume it's a category
      article = await ArticleModel.find({
        category: req.params.id.toLowerCase(),
      }).populate("author", "username");
      // If we got multiple articles, we'll only return the first one
      if (article.length > 0) article = article[0];
    }

    if (!article) {
      return res.status(404).json({ message: "Cannot find article" });
    }
    res.article = article;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
