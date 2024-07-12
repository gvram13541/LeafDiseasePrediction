import React from 'react';
import './VideoList.css';

function VideoList({ videos }) {
  return (
    <div className="video-list">
      <h2>Related Videos</h2>
      <div className="video-grid">
        {videos.map((video, index) => (
          <div key={index} className="video-item">
            <img src={video.thumbnail} alt={video.title} />
            <h3>{video.title}</h3>
            <a
              href={`https://www.youtube.com/watch?v=${video.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="watch-button"
            >
              Watch on YouTube
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoList;