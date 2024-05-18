import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import ArticlePage from './components/ArticlePage';
import QuizPage from './components/QuizPage';
import ShopPage from './components/ShopPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './components/ProfilePage';
import NavBar from './components/NavBar';
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-4">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/article/:id" component={ArticlePage} />
          <Route path="/quiz/:id" component={QuizPage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/profile" component={ProfilePage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
