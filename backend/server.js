const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000; // Use port 5000 or environment variable
const passport = require("passport"); // Import passport
const session = require("express-session");

// Middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
); // Replace 'your_secret_key' with a strong secret
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.post("/users/login", passport.authenticate("local"), (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 3600000 });
  res.json({ message: "Logged in successfully", token, userId: req.user._id });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    // Get URI from .env
  })
  .then(() => {
    console.log("Connected to MongoDB");

    //only imported if connected
    const UserModel = require("./models/user");
    const ArticleModel = require("./models/article");
    const QuizModel = require("./models/quiz");
    const ShopItemModel = require("./models/shopItem");
    const OrderModel = require("./models/order");
    const CommentModel = require("./models/comment");

    // Import Routes
    const userRoutes = require("./routes/userRoutes");
    const articleRoutes = require("./routes/articleRoutes");
    const quizRoutes = require("./routes/quizRoutes");
    const shopItemRoutes = require("./routes/shopItemRoutes");
    const orderRoutes = require("./routes/orderRoutes");
    const commentRoutes = require("./routes/commentRoutes");

    // Use Routes
    app.use("/users", userRoutes);
    app.use("/articles", articleRoutes);
    app.use("/quizzes", quizRoutes);
    app.use("/shopItems", shopItemRoutes);
    app.use("/orders", orderRoutes);
    app.use("/comments", commentRoutes);

    async function checkCollectionsExist() {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      const collectionNames = collections.map((collection) => collection.name);

      const requiredCollections = [
        "users",
        "articles",
        "quizzes",
        "shopitems",
        "orders",
        "comments",
      ];

      for (const collection of requiredCollections) {
        if (!collectionNames.includes(collection)) {
          console.error(
            `Collection "${collection}" does not exist. Creating...`
          );
          await mongoose.connection.db.createCollection(collection);
        }
      }
    }

    checkCollectionsExist()
      .then(() => {
        console.log("Collections checked and created if necessary");
        // Start your server here (app.listen(...))
      })
      .catch((err) => {
        console.error("Error checking/creating collections:", err);
        process.exit(1); // Exit the process if there's an error
      });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes (Placeholder)
app.get("/", (req, res) => {
  res.send("Welcome to Motorsport News Website API!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
