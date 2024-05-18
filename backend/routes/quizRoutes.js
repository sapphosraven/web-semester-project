const express = require('express');
const router = express.Router();
const QuizModel = require('../models/quiz');
const multer = require('multer');
const mongoose = require('mongoose');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await QuizModel.find();
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific quiz by ID
router.get('/:id', getQuiz, (req, res) => {
    res.json(res.quiz);
});

// CREATE a new quiz
router.post('/', upload.single('image'), async (req, res) => {
    const quiz = new QuizModel({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        questions: req.body.questions.map(question => ({
            _id: new mongoose.Types.ObjectId(), 
            ...question
        })),
        image: req.file ? {
            data: req.file.buffer,
            contentType: req.file.mimetype
        } : null
    });

    try {
        const newQuiz = await quiz.save();
        res.status(201).json(newQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a quiz by ID
router.patch('/:id', getQuiz, upload.single('image'), async (req, res) => {
    if (req.body.title) {
        res.quiz.title = req.body.title;
    }
    if (req.body.questions) {
        res.quiz.questions = req.body.questions.map(question => ({
            _id: new mongoose.Types.ObjectId(),
            ...question
        }));
    }
    if (req.file) { // Update image if provided
        res.quiz.image = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }
    try {
        const updatedQuiz = await res.quiz.save();
        res.json(updatedQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a quiz by ID
router.delete('/:id', getQuiz, async (req, res) => {
    try {
        await res.quiz.remove();
        res.json({ message: 'Deleted Quiz' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get a quiz by ID
async function getQuiz(req, res, next) {
    try {
        const quiz = await QuizModel.findById(req.params.id);
        if (quiz == null) {
            return res.status(404).json({ message: 'Cannot find quiz' });
        }
        res.quiz = quiz;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;

