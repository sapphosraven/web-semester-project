import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap"; // Import Bootstrap components
import ArticleCard from "./ArticleCard"; // Import ArticleCard component
import SideBar from "./SideBar"; // Import SideBar component
import "../global.css";

function CategoryPage() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    // Fetch latest articles from your backend API
    axios
      .get("/articles")
      .then((response) => {
        console.log("Received response: ", response.data);
        setArticles(response.data);
        setIsLoading(false); // Data fetched, set isLoading to false
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        setError(error); // Set error message
        setIsLoading(false); // Stop loading even if there's an error
      });
  }, [category]);

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error message if fetching fails
  }

  // Filter articles before displaying
  const filteredArticles = articles.filter(
    (article) => article.category.toLowerCase() === category.toLowerCase()
  );

  // Slice the filtered articles for the first 9
  const articlesToDisplay = filteredArticles;

  return (
    <Container className="text-white position-relative" fluid>
      {" "}
      {/* Use fluid container */}
      <Row>
        <Col md={8} className="mb-4">
          {/* Modified Heading */}
          <h2 className="text-start mb-2">{category.toUpperCase()} Articles</h2>
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

export default CategoryPage;
