const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const multer = require('multer');

// Multer configuration for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific user
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

// CREATE a new user
router.post('/', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a user's profile picture
router.patch('/:id/profileImage', getUser, upload.single('profileImage'), async (req, res) => {
    res.user.profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype
    };
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a user
router.patch('/:id', getUser, async (req, res) => {
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
    if (req.file) {  // Update profile image if provided
        res.user.profileImage = {
            data: req.file.buffer,
            contentType: req.file.mimetype
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
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: 'Deleted User' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get a user by ID
async function getUser(req, res, next) {
    try {
        const user = await UserModel.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        res.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;
