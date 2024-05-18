import React, { useEffect, useState } from 'react';
import { fetchArticles } from '../services/api';

const HomePage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles().then(response => {
      setArticles(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Latest Articles</h1>
      <div className="row">
        {articles.map(article => (
          <div className="col-md-4" key={article.id}>
            <div className="card mb-4">
              <img src={article.imageUrl} className="card-img-top" alt={article.title} />
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{article.description}</p>
                <a href={`/article/${article.id}`} className="btn btn-primary">Read More</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
