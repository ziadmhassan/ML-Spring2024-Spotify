import React, { useState } from 'react';
import '../styles/App.css';
import PredictionResult from './PredictionResult';

function App() {
  let audiofeatures = [
    'duration_ms', 'release_date', 'danceability', 'energy', 'loudness',
    'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence',
    'tempo', 'time_signature', 'mode', 'key', 'explicit'
  ];

  const [inputData, setInputData] = useState(new Array(15).fill(''));
  const [prediction, setPrediction] = useState(null);
  const [inputMode, setInputMode] = useState(null);
  const [spotifyLink, setSpotifyLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualInput = () => {
    setInputMode('manual');
    setPrediction(null);
  };

  const handleSpotifyLinkInput = () => {
    setInputMode('spotify');
    setPrediction(null);
  };

  const handleInputChangeSpotifyLink = (e) => {
    const { value } = e.target;
    setSpotifyLink(value);
  };

  const handlePrediction = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading indicator

    try {
      let requestData = {};

      if (inputMode === 'manual') {
        let ohe = inputData.slice(11, 15);
        let notohe = inputData.slice(0, 11);
        // one hot encode the last 4 features
        let oneHotEncoded = [
          ohe[0] === '0' ? 1 : 0,
          ohe[0] === '1' ? 1 : 0,
          ohe[0] === '3' ? 1 : 0,
          ohe[0] === '4' ? 1 : 0,
          ohe[0] === '5' ? 1 : 0,
          ohe[1] === '0' ? 1 : 0,
          ohe[1] === '1' ? 1 : 0,
          ohe[2] === '0' ? 1 : 0,
          ohe[2] === '1' ? 1 : 0,
          ohe[2] === '2' ? 1 : 0,
          ohe[2] === '3' ? 1 : 0,
          ohe[2] === '4' ? 1 : 0,
          ohe[2] === '5' ? 1 : 0,
          ohe[2] === '6' ? 1 : 0,
          ohe[2] === '7' ? 1 : 0,
          ohe[2] === '8' ? 1 : 0,
          ohe[2] === '9' ? 1 : 0,
          ohe[2] === '10' ? 1 : 0,
          ohe[2] === '11' ? 1 : 0,
          ohe[3] === '0' ? 1 : 0,
          ohe[3] === '1' ? 1 : 0
        ];
        requestData = {
          inputMode: 'manual',
          data: {
            sample: notohe.concat(oneHotEncoded)
          }
        };
      } else if (inputMode === 'spotify') {
        requestData = {
          inputMode: 'spotify',
          data: {
            spotifyLink: spotifyLink.trim()
          }
        };
      }
      console.log(requestData.data); 
      const apiUrl = 'https://ziadm.pythonanywhere.com/predict';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData.data)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setPrediction(data.Prediction[0]); // Update prediction state with the result from the API
    } catch (error) {
      console.error('Prediction error:', error);
      setPrediction(error.message); // Set error message in prediction state
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Soundtrack Popularity Predictor</h1>
      </header>

      <div className="InputSelection">
        <button className="InputButton" onClick={handleManualInput}>Input Manually</button>
        <button className="InputButton" onClick={handleSpotifyLinkInput}>Spotify Link</button>
      </div>

      {inputMode === 'manual' && (
        <div className="InputFormApp">
          <div className="InputFormContainer">
            <label className="InputLabel">Enter Audio Features Values:</label>
            <form onSubmit={handlePrediction}>
              <div className="GridContainer">
                {audiofeatures.map((value, index) => (
                  <input
                    key={audiofeatures[index]}
                    type="text"
                    value={inputData[index]} // Bind input value to state
                    onChange={(e) => setInputData((prevData) => {
                      const updatedData = [...prevData];
                      updatedData[index] = e.target.value;
                      return updatedData;
                    })}
                    placeholder={value} // Use audio feature name as placeholder
                    className="GridInput"
                    required
                  />
                ))}
              </div>
              <button type="submit" className="PredictButton">Predict</button>
            </form>
          </div>
        </div>
      )}

      {inputMode === 'spotify' && (
        <div className="SpotifyInput">
          <label htmlFor="spotifyLink">Enter Spotify Link:</label>
          <form onSubmit={handlePrediction}>
            <input
              type="text"
              id="spotifyLink"
              name="spotifyLink"
              value={spotifyLink}
              onChange={handleInputChangeSpotifyLink}
              className="InputText"
              required
            />
            <button type="submit" className="PredictButton">Predict</button>
          </form>
        </div>
      )}

      {/* Display loading screen if loading state is true */}
      {loading && (
        <div className="LoadingScreen">
          <p>Loading...</p>
        </div>
      )}

      {prediction !== null && !loading && <PredictionResult prediction={prediction} />}

      <footer className="App-footer">
        <p>© 2024 Soundtrack Popularity Predictor by Islam and Ziad Hassan</p>
      </footer>
    </div>
  );
}

export default App;
