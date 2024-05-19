import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import ArticleCard from "./ArticleCard";
import SideBar from "./SideBar";
import "../global.css";

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching article with id:", id); 
    axios
      .get(`/articles/${id}`)
      .then((response) => {
        console.log("Received response:", response.data);
        setArticle(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching article:", error);
        setError(error.message || "An error occurred"); // Set a more user-friendly error message
        setIsLoading(false);
      });
  }, [id]); 

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "white" }}>Error: {error}</div>;
  }

  // If article exists and has content, display it
  if (article && article.content) {
    return (
      <Container className="text-white position-relative" fluid>
      <Row>
        <Col md={8} className="mb-4">
          {article ? (
            <>
              <h2 className="text-start mb-2">{article.title}</h2>
              <hr className="horizontal-line"></hr>
              <div className="article-content">
                <p>{article.content}</p>
              </div>
            </>
          ) : (
            <div>No article found.</div>
          )}
        </Col>
        <Col md={4} className="sidebar-col">
          <SideBar />
        </Col>
      </Row>
      </Container>
    );
  } else {
    // Handle the case where article is not found or doesn't have content
    return <div style={{ color: "white" }}>Article not found or content is missing.</div>;
  }
}

export default ArticlePage;
