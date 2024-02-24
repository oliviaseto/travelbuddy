import './App.css';
import AboutUs from './AboutUs';
import React, { useState, useEffect } from 'react';

function useFadeInEffect() {
  useEffect(() => {
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
      threshold: 0.5,
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        } else {
          entry.target.classList.add('appear');
          appearOnScroll.unobserve(entry.target);
        }
      });
    }, appearOptions);

    faders.forEach(fader => {
      appearOnScroll.observe(fader);
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY === 0) {
        faders.forEach(fader => {
          fader.classList.remove('appear');
          appearOnScroll.observe(fader);
        });
      }
    });

    // Cleanup function to disconnect the IntersectionObserver when the component unmounts
    return () => {
      faders.forEach(fader => appearOnScroll.unobserve(fader));
      window.removeEventListener('scroll', () => {});
    };
  }, []); 
}

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

  useFadeInEffect();

  return (
    <div className="App">
      <header id='main' className="App-header">
        <div className="fade-in" > Welcome to TravelBuddy! </div>
        <button class="aboutusbutton fade-in" onClick={() => scrollTo('aboutUs')}>About Us</button>
      </header>
      <div id='aboutUs' className="About fade-in">
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