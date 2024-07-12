import React from 'react';
import './Results.css';

function Results({ prediction, onShowArticles, onShowVideos }) {
  console.log("Renering prection", prediction);
  if (!prediction) {
    return <div className="results">No prediction available</div>;
  }

  const { prediction: diseaseName, confidence, disease_info: diseaseInfo } = prediction;

  const formatDiseaseName = (name) => {
    return name.replace(/_/g, ' ');
  };

  return (
    <div className="results">
      <h2>Prediction Results</h2>
      <p><strong>Disease:</strong> {diseaseName ? formatDiseaseName(diseaseName) : 'No disease detected'}</p>
      <p><strong>Confidence:</strong> {confidence ? (confidence * 100).toFixed(2) + '%' : 'No confidence available'}</p>
      {diseaseInfo && (
        <>
          <h3>Disease Information</h3>
          <p>{diseaseInfo.description || 'No description available'}</p>
          {diseaseInfo.link && (
            <img src={diseaseInfo.link} alt={diseaseInfo.name || 'Disease image'} />
          )}
        </>
      )}
      <div className="buttons">
        <button onClick={onShowArticles} className="view-articles-button">
          View Related Articles
        </button>
        <button onClick={onShowVideos} className="view-videos-button">
          View Related Videos
        </button>
      </div>
    </div>
  );
}

export default Results;
