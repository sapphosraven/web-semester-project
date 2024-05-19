const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");

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
        return res.status(400).json({
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
      return res.status(400).json({
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
    await UserModel.deleteOne({ _id: req.params.id }); // Use deleteOne()
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN route
router.post("/user/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username });
    if (!user) return res.status(401).json({ message: "Invalid username" });

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Error Handling for JWT_SECRET
    if (!token) {
      return res.status(500).json({
        message: "Error generating JWT token. Please check your JWT_SECRET.",
      });
    }

    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Logged in successfully", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SIGN UP route
router.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    // Check if username or email already exists
    const existingUser = await UserModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingUser) {
      return res.status(409).json({
        // 409 Conflict
        message: "Username or email already exists",
      });
    }

    // Validate image type if provided
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only JPEG and PNG images allowed.",
      });
    }

    // If user doesn't exist, hash password and create new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role, // Consider setting a default role if not provided
      profileImage: req.file
        ? {
            // If image is provided
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : { data: null, contentType: null },
    });

    const newUser = await user.save();

    // Generate JWT token after successful signup
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });

    res
      .status(201)
      .json({ message: "Signed up successfully", token, user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGOUT route
router.post("/user/logout", (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", { httpOnly: true });
  res.sendStatus(200); // OK (or send a JSON response if you prefer)
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
