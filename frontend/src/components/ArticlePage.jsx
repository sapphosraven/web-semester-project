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
    // Fetch the specific article by ID from your backend API
    axios
      .get(`/articles/${id}`)
      .then((response) => {
        setArticle(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching article:", error);
        setError(error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
}

export default ArticlePage;
