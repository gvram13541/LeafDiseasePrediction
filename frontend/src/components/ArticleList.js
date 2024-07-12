import React from 'react';
import './ArticleList.css';

function ArticleList({ articles }) {
  return (
    <div className="article-list">
      <h2>Related Articles</h2>
      <div className="article-grid">
        {articles.map((article, index) => (
          <div key={index} className="article-item">
            <h3>{article.title}</h3>
            <p>{article.snippet}</p>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleList;