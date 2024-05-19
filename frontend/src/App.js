import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
<<<<<<< HEAD
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage"; 
//import ArticlePage from "./components/ArticlePage";
=======
import ArticlePage from "./components/ArticlePage";
import SignUpPage from "./components/SignUpPage";
>>>>>>> 1f50318cac55623b2b844d28706b1458420a53eb
import TopNavbar from "./components/TopNavbar";
//import CategoryPage from "./components/CategoryPage"; // Import your new component
import Footer from "./components/BFooter";


function App() {
  return (
    <div className="App">
      <Router>
        <TopNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="users/signup" component={SignUpPage} />
          <Route path="/articles/:id" element={<ArticlePage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
