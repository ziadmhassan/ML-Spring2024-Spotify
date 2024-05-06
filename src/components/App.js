import React, { useState } from 'react';
import '../styles/App.css';
import PredictionResult from './PredictionResult';

function App() {
  let audiofeatures = [
    'duration_ms', 'release_date', 'danceability', 'energy', 'loudness',
    'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence',
    'tempo', 'time_signature', 'mode', 'key', 'explicit', 'popularity'
  ];

  const [inputData, setInputData] = useState(new Array(16).fill(''));
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
        requestData = {
          inputMode: 'manual',          
          sample: {
            duration_ms: inputData[0],
            release_date: inputData[1],
            danceability: inputData[2],
            energy: inputData[3],
            loudness: inputData[4],
            speechiness: inputData[5],
            acousticness: inputData[6],
            instrumentalness: inputData[7],
            liveness: inputData[8],
            valence: inputData[9],
            tempo: inputData[10],
            time_signature: inputData[11],
            mode: inputData[12],
            key: inputData[13],
            explicit: inputData[14],
            popularity: inputData[15]
          }
        };
      } else if (inputMode === 'spotify') {
        // print the spotify link
        console.log(spotifyLink.trim());
        requestData = {
          inputMode: 'spotify',
          data: spotifyLink
        };
      }
      console.log(requestData); 
      const apiUrl = 'https://ziadm.pythonanywhere.com/predict';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Charset': 'UTF-8'
        },
        body: JSON.stringify(requestData)
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
                  // Conditional class based on the value of 'value'
                  {...(value === 'popularity' ? {} : { required: true })}
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
