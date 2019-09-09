import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";
import VideoRoom from "./components/VideoRoom";

function App() {
    return (
        <div className="App">
            <Header/>
            <VideoRoom />
        </div>
    );
}

export default App;
