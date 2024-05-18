const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const faker = require("faker");
require("dotenv").config();

const mongoString = process.env.MONGODB_URI;

mongoose
  .connect(mongoString, {})
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const UserModel = require("./models/user");
const ArticleModel = require("./models/article");
const QuizModel = require("./models/quiz");
const ShopItemModel = require("./models/shopItem");
const OrderModel = require("./models/order");
const CommentModel = require("./models/comment");

// Function to load image data from a file
function loadImageData(imageNumber) {
  const imagePath = path.join(__dirname, "sample_images", `${imageNumber}.jpg`);
  const imageBuffer = fs.readFileSync(imagePath);
  return {
    data: imageBuffer,
    contentType: "image/jpeg",
  };
}
// Dummy categories
const articleCategories = [
  "F1",
  "MotoGP",
  "NASCAR",
  "IndyCar",
  "WEC",
  "WRC",
  "IMSA",
  "DTM",
];
const shopItemCategories = ["T-shirts", "Hats", "Accessories"];

async function seedData() {
  try {
    // Seed Users
    const hashedPassword1 = await bcrypt.hash("password123", 10);
    const hashedPassword2 = await bcrypt.hash("password456", 10);
    const user1 = await UserModel.create({
      username: "user1",
      email: "user1@example.com",
      password: hashedPassword1,
      role: "user",
      profileImage: {
        data: null,
        contentType: null,
      },
    });
    const user2 = await UserModel.create({
      username: "admin1",
      email: "admin1@example.com",
      password: hashedPassword2,
      role: "admin",
      profileImage: {
        data: null,
        contentType: null,
      },
    });

    // Seed Articles (Assign articles to admin as they will create them)
    const articles = [];
    for (let i = 1; i <= 3; i++) {
      articles.push({
        _id: new mongoose.Types.ObjectId(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        author: user2._id, // Admin is the author now
        images: [loadImageData(i)],
        category:
          articleCategories[
            Math.floor(Math.random() * articleCategories.length)
          ],
      });
    }
    await ArticleModel.insertMany(articles);

    // Seed Quizzes (Assign quizzes to admin as they will create them)
    const quizzes = [];
    for (let i = 4; i <= 6; i++) {
      const numQuestions = 5;
      let questions = [];
      for (let j = 0; j < numQuestions; j++) {
        const numOptions = 4;
        let options = [];
        for (let k = 0; k < numOptions; k++) {
          options.push(faker.lorem.word());
        }
        questions.push({
          _id: new mongoose.Types.ObjectId(),
          questionText: faker.lorem.sentence(),
          options: options,
          correctAnswer: options[Math.floor(Math.random() * numOptions)],
        });
      }
      quizzes.push({
        _id: new mongoose.Types.ObjectId(),
        title: faker.lorem.sentence(),
        questions: questions,
        images: [loadImageData(i)],
      });
    }
    await QuizModel.insertMany(quizzes);

    // Seed Shop Items (Assign shop items to admin as they will create them)
    const shopItems = [];
    for (let i = 7; i <= 9; i++) {
      shopItems.push({
        _id: new mongoose.Types.ObjectId(),
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        price: faker.commerce.price(),
        images: [loadImageData(i)],
        stock: faker.datatype.number({ min: 10, max: 100 }),
      });
    }
    await ShopItemModel.insertMany(shopItems);

    // Seed Orders and Comments (Adjust as needed)
    const order1 = await OrderModel.create({
      _id: new mongoose.Types.ObjectId(),
      user: user1._id,
      items: [{ shopItem: shopItems[0]._id, quantity: 2 }],
      totalAmount: shopItems[0].price * 2,
    });

    await CommentModel.create({
      _id: new mongoose.Types.ObjectId(),
      user: user1._id,
      content: "Great article!",
      article: articles[0]._id,
    });
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedData();
