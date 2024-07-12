import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Results from './components/Results';
import ArticleList from './components/ArticleList';
import VideoList from './components/VideoList';
import './styles.css';
import './components/ArticleList.css'; 
import './components/VideoList.css';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showArticles, setShowArticles] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [image, setImage] = useState(null);

  const handlePrediction = (result) => {
    console.log('Prediction:', result);
    setPrediction(result);
    fetchArticles(result.prediction);
    fetchVideos(result.prediction);
  };

  const fetchArticles = async (query) => {
    const response = await fetch(`http://localhost:8000/articles?query=${query}`);
    const data = await response.json();
    setArticles(data);
  };

  const fetchVideos = async (query) => {
    const response = await fetch(`http://localhost:8000/videos?query=${query}`);
    const data = await response.json();
    setVideos(data);
  };

  const handleShowArticles = () => {
    setShowArticles(true);
    setShowVideos(false);
  };

  const handleShowVideos = () => {
    setShowVideos(true);
    setShowArticles(false);
  };

  const handleHomeClick = () => {
    setPrediction(null);
    setArticles([]);
    setVideos([]);
    setShowArticles(false);
    setShowVideos(false);
    setImage(null);
  };

  return (
    <div className="App container">
      <nav className="navbar">
        <button onClick={handleHomeClick} className="home-button">
          Home
        </button>
      </nav>
      <h1>Leaf Disease Detection</h1>
      <main>
        <ImageUpload onPrediction={handlePrediction} setImage={setImage} image={image} />
        {prediction && (
          <Results
            prediction={prediction}
            onShowArticles={handleShowArticles}
            onShowVideos={handleShowVideos}
          />
        )}
        {showArticles && <ArticleList articles={articles} />}
        {showVideos && <VideoList videos={videos} />}
      </main>
    </div>
  );
}

export default App;
