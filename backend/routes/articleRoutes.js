const express = require('express');
const router = express.Router();
const ArticleModel = require('../models/article');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all articles
router.get('/', async (req, res) => {
    try {
        const articles = await ArticleModel.find().populate('author', 'username'); // Populate author name
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific article
router.get('/:id', getArticle, (req, res) => {
    res.json(res.article);
});

// CREATE a new article
router.post('/', upload.array('images'), async (req, res) => {
    const article = new ArticleModel({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        category: req.body.category,
        images: req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }))
    });
    try {
        const newArticle = await article.save();
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE an article
router.patch('/:id', getArticle, upload.array('images'), async (req, res) => {
    if (req.body.title != null) {
        res.article.title = req.body.title;
    }
    if (req.body.content != null) {
        res.article.content = req.body.content;
    }
    if (req.body.category != null) {
        res.article.category = req.body.category;
    }
    if (req.files.length > 0) {
        res.article.images = req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));
    }
    try {
        const updatedArticle = await res.article.save();
        res.json(updatedArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE an article
router.delete('/:id', getArticle, async (req, res) => {
    try {
        await res.article.remove();
        res.json({ message: 'Deleted Article' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get an article by ID
async function getArticle(req, res, next) {
    try {
        const article = await ArticleModel.findById(req.params.id).populate('author', 'username');
        if (article == null) {
            return res.status(404).json({ message: 'Cannot find article' });
        }
        res.article = article;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;
