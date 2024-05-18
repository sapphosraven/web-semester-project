const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");

// Multer configuration for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific user
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

// CREATE a new user
router.post("/", upload.single("profileImage"), async (req, res) => {
  try {
    // Check if username or email already exists
    const existingUser = await UserModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    if (req.file) {
      // Image was uploaded
      const allowedMimeTypes = ["image/jpeg", "image/png"];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res
          .status(400)
          .json({
            message: "Invalid file type. Only JPEG and PNG images allowed.",
          });
      }

      // If user doesn't exist, hash password and create new user
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const profileImage = req.file
        ? {
            // If image is provided
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : { data: null, contentType: null }; // Set to null if no image

      const user = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        profileImage: profileImage, // Use the updated profileImage object
      });

      const newUser = await user.save();
      res.status(201).json(newUser);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a user's profile picture
router.patch(
  "/:id/profileImage",
  getUser,
  upload.single("profileImage"),
  async (req, res) => {
    const allowedMimeTypes = ["image/jpeg", "image/png"];

    if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({
          message: "Invalid file type. Only JPEG and PNG images allowed.",
        });
    }

    res.user.profileImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    try {
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// UPDATE a user
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    res.user.password = hashedPassword;
  }
  if (req.file) {
    // Update profile image if provided
    res.user.profileImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a user
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a user by ID
async function getUser(req, res, next) {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    res.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
