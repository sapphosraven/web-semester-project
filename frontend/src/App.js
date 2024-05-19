import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./components/AuthContext"; // Import your context
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import ArticlePage from "./components/ArticlePage";
import CategoryPage from "./components/CategoryPage";
import TopNavbar from "./components/TopNavbar";
import Footer from "./components/BFooter"; // Create Footer component if you haven't yet
import MerchPage from "./components/MerchPage";
import ShopItemPage from "./components/ItemPage";
import CartPage from "./components/CartPage";
import ProfilePage from "./components/ProfilePage"; // Import ProfilePage

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <TopNavbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users/signup" element={<SignUpPage />} />
            <Route path="/users/login" element={<LoginPage />} />
            <Route path="/articles/:id" element={<ArticlePage />} />
            <Route
              path="/articles/category/:category"
              element={<CategoryPage />}
            />
            <Route element={<ProtectedRoute />}>
              {" "}
              {/* Protected Route for Profile Page */}
              <Route path="/users/:userId" element={<ProfilePage />} />
            </Route>
            <Route path="/shopItems" element={<MerchPage />} />
            <Route path="/shopItems/:id" element={<ShopItemPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

function ProtectedRoute({ children, ...rest }) {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/login" />; // Or your preferred redirect
}

export default App;
