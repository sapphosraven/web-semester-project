import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";

import ArticlePage from "./components/ArticlePage";
import TopNavbar from "./components/TopNavbar";
//import CategoryPage from "./components/CategoryPage"; // Import your new component
import Footer from "./components/BFooter";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <div className="App">

      <Router>
        <TopNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users/signup" element ={<SignUpPage />} /> 
          <Route path="/users/login" element={<LoginPage/>} /> 
          <Route path="/articles/:id" element={<ArticlePage />} />

        </Routes>
        <Footer />
      </Router>

    </div>
  );
}

export default App;
