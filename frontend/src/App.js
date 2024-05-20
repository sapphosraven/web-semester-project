import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";

import ArticlePage from "./components/ArticlePage";
import TopNavbar from "./components/TopNavbar";
import CategoryPage from "./components/CategoryPage";
import Footer from "./components/BFooter";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import MerchPage from "./components/MerchPage";
import ShopItemPage from "./components/ItemPage";
import CartPage from "./components/CartPage";
import { AuthProvider } from "./AuthContext"; // Import your context

function App() {
  return (
    <div className="App">
      <Router>
        <TopNavbar />
        <Routes>
          <AuthProvider>
            <Route path="/" element={<HomePage />} />
            <Route path="/users/signup" element={<SignUpPage />} />
            <Route path="/users/login" element={<LoginPage />} />
            <Route path="/articles/:id" element={<ArticlePage />} />
            <Route
              path="/articles/category/:category"
              element={<CategoryPage />}
            />
            <Route path="/users/${userId}" element={<ProfilePage />} />

            <Route path="/shopItems" element={<MerchPage />} />
            <Route path="/shopItems/:id" element={<ShopItemPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/users/signup" element={<SignUpPage />} />
            <Route path="/users/login" element={<LoginPage />} />
            <Route path="/articles/:id" element={<ArticlePage />} />
            <Route
              path="/articles/category/:category"
              element={<CategoryPage />}
            />
            <Route path="/users/${userId}" element={<ProfilePage />} />
          </AuthProvider>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}
export default App;
