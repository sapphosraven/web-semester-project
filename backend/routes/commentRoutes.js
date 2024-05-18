const express = require('express');
const router = express.Router();
const CommentModel = require('../models/comment');
const ArticleModel = require('../models/article');

// GET all comments for a specific article
router.get('/article/:articleId', async (req, res) => {
    try {
        const comments = await CommentModel.find({ article: req.params.articleId });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific comment by ID
router.get('/:id', getComment, (req, res) => {
    res.json(res.comment);
});

// CREATE a new comment on an article
router.post('/article/:articleId', async (req, res) => {
    const articleId = req.params.articleId;

    try {
        const article = await ArticleModel.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const comment = new CommentModel({
            _id: new mongoose.Types.ObjectId(),
            user: req.body.user, // Assuming user ID is provided in the request body
            content: req.body.content,
            article: articleId
        });

        const newComment = await comment.save();

        // Update the article with the new comment's ID
        article.comments.push(newComment._id);
        await article.save();

        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a comment by ID
router.delete('/:id', getComment, async (req, res) => {
    try {
        const articleId = res.comment.article;
        const article = await ArticleModel.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        // Remove comment ID from the article's comments array
        article.comments.pull(res.comment);
        await article.save();

        await res.comment.remove(); // Remove the comment itself
        res.json({ message: 'Deleted Comment' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Middleware to get a comment by ID
async function getComment(req, res, next) {
    try {
        const comment = await CommentModel.findById(req.params.id);
        if (comment == null) {
            return res.status(404).json({ message: 'Cannot find comment' });
        }
        res.comment = comment;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;
