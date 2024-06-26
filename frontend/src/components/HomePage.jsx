import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap"; // Import Bootstrap components
import ArticleCard from "./ArticleCard"; // Import ArticleCard component
import SideBar from "./SideBar"; // Import SideBar component
import "../global.css";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const articlesToDisplay = articles.slice(0, 9); // Display only the first 10 articles

  useEffect(() => {
    // Fetch latest articles from your backend API
    axios
      .get("/articles")
      .then((response) => {
        setArticles(response.data);
        setIsLoading(false); // Data fetched, set isLoading to false
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        setError(error); // Set error message
        setIsLoading(false); // Stop loading even if there's an error
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error message if fetching fails
  }

  return (
    <Container className="text-white position-relative" fluid>
      {" "}
      {/* Use fluid container */}
      <Row>
        <Col md={8} className="mb-4">
          {/* Modified Heading */}
          <h2 className="text-start mb-2">Recent Articles</h2>
          <hr className="horizontal-line"></hr>
          <Row xs={1} md={3} className="g-4">
            {articlesToDisplay.map((article) => (
              <Col key={article._id}>
                <ArticleCard article={article} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={4} className="sidebar-col">
          <SideBar />
        </Col>
      </Row>
    </Container>
  );
}

//TODO for MVP, this is necessary and needs to be done before anything else, this is the minimal viable product, no compromises on this
//TODO: add routing to display category pages fix that
//TODO: make the login and signup pages
//TODO: connect to the login and signup pages
//TODO: make the profile page with conditional rendering for crud (all if admin, own if user)


//TODO for improving everything, in order of decreasing priority
//TODO: Add comments functionality, the front end of it, crud with backend, can only comment when signed in, can only delete own comment, no replies
//TODO: Add quizzes
//TODO: Add merch shop, check out, cart, and orders to profile after the fact




export default HomePage;
