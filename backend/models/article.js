const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  images: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
  category: {
    type: String,
    enum: ["F1", "MOTOGP", "NASCAR", "INDYCAR", "WEC", "WRC", "IMSA", "DTM"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", articleSchema);
