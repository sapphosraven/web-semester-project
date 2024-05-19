import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Badge } from "react-bootstrap";
import ArticleCard from "./ArticleCard";
import SideBar from "./SideBar";
import "../global.css";

function CategoryPage() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const articlesToDisplay = articles.slice(0, 9);

  useEffect(() => {
    // Fetch articles by category from your backend API
    axios
      .get(`/articles/${category}`)
      .then((response) => {
        setArticles(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        setError(error);
        setIsLoading(false);
      });
  }, [category]);

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "white" }}>Error: {error.message}</div>;
  }

  return (
    <Container className="text-white position-relative" fluid>
      <Row>
        <Col md={8} className="mb-4">
          {/* Modified Heading */}
          <h2 className="text-start mb-2">{category.toUpperCase()} Articles</h2>
          <div className="horizontal-line"></div>
          <Row xs={1} md={3} className="g-4">
            {articlesToDisplay.map((article) => (
              <Col key={article._id}>
                <ArticleCard article={article} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={4} className="sidebar-col" style={{ top: "5rem" }}>
          <SideBar />
        </Col>
      </Row>
    </Container>
  );
}

export default CategoryPage;
