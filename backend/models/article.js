const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [{
        data: Buffer,
        contentType: String,
    }],
    category: { type: String, enum: ['F1', 'MotoGP', 'NASCAR', 'IndyCar', 'WEC', 'WRC', 'IMSA', 'DTM'], required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', articleSchema);
