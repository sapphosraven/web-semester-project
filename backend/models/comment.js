const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    shopItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
