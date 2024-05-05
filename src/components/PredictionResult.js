import React from 'react';

function PredictionResult({ prediction }) {
  return (
    <div>
      <h2>Prediction Result</h2>
      <p>The predicted soundtrack popularity is: {prediction > 0.5 ? "Popular ": "Not Popular "}</p> 
      <p>Confidence: {prediction > 0.5 ? prediction: 1 - prediction}</p>
    </div>
  );
}

export default PredictionResult;
