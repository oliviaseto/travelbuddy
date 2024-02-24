import './App.css';
import AboutUs from './AboutUs';
import React, { useState } from 'react';


function App() {

  const[onClick,setOnClick]=useState(false);

  const scrollTo = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop,
         behavior: 'smooth',
      });
    }
    setOnClick(!onClick); // Toggle the state to close the menu (if it's open)  
  };    

  return (
    <div className="App">
      <header id='main' className="App-header">
        <div> Welcome to TravelBuddy! </div>
        <button onClick={() => scrollTo('aboutUs')}>About Us</button>
      </header>
      <div id='aboutUs' className="About">
        <div>
          <h1>About Me</h1>
            </div>
              <AboutUs></AboutUs>
            </div>
        </div>
  );
}

export default App;
