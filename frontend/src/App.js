import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
//import ArticlePage from "./components/ArticlePage";
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
        <Route path="/signup" component={SignUpPage} />
        <Route path="/login" component={LoginPage} />
      </Routes>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
