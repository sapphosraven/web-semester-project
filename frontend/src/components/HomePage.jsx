import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap"; // Import Bootstrap components
import ArticleCard from "./ArticleCard"; // Import your ArticleCard component
import "../global.css";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

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
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error message if fetching fails
  }

  return (
    <Container>
      <h1 className="text-center mb-4">Welcome to Motorsport News</h1>
      <Row xs={1} md={3} className="g-4">
        {" "}
        {/* Grid layout for articles */}
        {articles.map((article) => (
          <Col key={article._id}>
            <ArticleCard article={article} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HomePage;
