const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: [{
        questionText: String,
        options: [String],
        correctAnswer: String,
    }],
    images: [{
        data: Buffer,
        contentType: String,
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', quizSchema);
