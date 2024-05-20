import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { UserProvider, UserContext } from "./context/UserContext"; // Make sure you're importing the correct context
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import ArticlePage from "./components/ArticlePage";
import CategoryPage from "./components/CategoryPage";
import TopNavbar from "./components/TopNavbar";
import Footer from "./components/BFooter";
import MerchPage from "./components/MerchPage";
import ShopItemPage from "./components/ItemPage";
import CartPage from "./components/CartPage";
import ProfilePage from "./components/ProfilePage";
import { Buffer } from "buffer";
window.Buffer = Buffer;
function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
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
            <Route path="/shopItems" element={<MerchPage />} />
            <Route path="/shopItems/:id" element={<ShopItemPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/users/:id" element={<ProfilePage />} />
          </Routes>
          <Footer />
        </Router>
      </UserProvider>
    </div>
  );
}
function ProtectedRoute({ children, ...rest }) {
  const { user } = useContext(UserContext);
  const location = useLocation();

  if (!user) {
    // User is not authenticated, redirect to login page with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // User is authenticated, allow access to the route
  return children;
}

export default App;
