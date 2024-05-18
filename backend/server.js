const UserModel = require('./models/user');
const ArticleModel = require('./models/article');
const QuizModel = require('./models/quiz');
const ShopItemModel = require('./models/shopItem');
const OrderModel = require('./models/order');
const CommentModel = require('./models/comment');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Use port 5000 or environment variable

// Middleware
app.use(cors());
app.use(express.json()); 

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { // Get URI from .env
}).then(() => {

    console.log('Connected to MongoDB')
    
  async function checkCollectionsExist() {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
  
    const requiredCollections = ['users', 'articles', 'quizzes', 'shopitems', 'orders', 'comments']; 
  
    for (const collection of requiredCollections) {
      if (!collectionNames.includes(collection)) {
        console.error(`Collection "${collection}" does not exist. Creating...`);
        await mongoose.connection.db.createCollection(collection);
      }
    }
  }
  
  checkCollectionsExist().then(() => {
    console.log('Collections checked and created if necessary');
    // Start your server here (app.listen(...))
  }).catch(err => {
    console.error('Error checking/creating collections:', err);
    process.exit(1); // Exit the process if there's an error
  });
  
})
  .catch(err => console.error('MongoDB connection error:', err));


// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('Welcome to Motorsport News Website API!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});