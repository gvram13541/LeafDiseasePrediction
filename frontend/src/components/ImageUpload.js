import React, { useState, useRef, useEffect } from 'react';
import './ImageUpload.css'; 

function ImageUpload({ onPrediction, setImage, image }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!image) {
      setFile(null); 
    }
  }, [image]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Prediction:', data);
      onPrediction(data);
    } catch (error) {
      console.error('Error predicting disease:', error);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setShowCamera(false);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video) return; 
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
        const capturedFile = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
        setFile(capturedFile);
        setImage(capturedFile);
        stopCamera();
    }, 'image/jpeg');
  };

  return (
    <div className="image-upload">
      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <label htmlFor="file-input" className="file-input-label">Choose File</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            id="file-input"
          />
        </div>
        <button type="button" onClick={startCamera} className="camera-button">Take from Camera</button>
        <button type="submit" className="submit-button" disabled={!file || loading}>
          {loading ? 'Predicting...' : 'Predict Disease'}
        </button>
      </form>
      
      {showCamera && (
        <div className="camera-container">
          <video ref={videoRef} autoPlay className="camera-preview" />
          <button onClick={captureImage} className="capture-button">Capture</button>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {file && (
        <div className="file-preview">
          <h3>Selected Image:</h3>
          <img src={URL.createObjectURL(file)} alt="Selected" className="preview-image" />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
