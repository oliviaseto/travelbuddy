import logo from './logo.svg';
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
  const [destination, setDestination] = useState(""); 
  const [dates, setDates] = useState(""); 

  const handleDestinationChange = (event) => {
    setDestination(event.target.value); 
  };

  const handleDatesChange = (event) => {
    setDates(event.target.value); 
  }; 

  return (
    <div className="App">
      <header id='main' className="App-header">
        <div> Welcome to TravelBuddy! </div>
        <button class="aboutusbutton" onClick={() => scrollTo('aboutUs')}>About Us</button>
      </header>
      <div id='aboutUs' className="About">
        <AboutUs></AboutUs>
      </div>

        <form>
          <label>
            Where are you traveling to?
            <input
                className='destination_input'
                type='text'
                name='destination'
                placeholder=''
                value={destination}
                onChange={handleDestinationChange}
            />
          </label>
          <br />
          <label>
            When are you going?
            <input
                className='dates_input'
                type='text'
                name='dates'
                placeholder=''
                value={dates}
                onChange={handleDatesChange}
            />
          </label>
        </form>
        </div>
  );
}

export default App;
