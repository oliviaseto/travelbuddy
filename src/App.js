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
  const backgroundImages = [
    "images/greece1.png",
    "images/greece2.png",
    'images/beijing.png',
    'images/china.png',
    'images/autumn1.jpg',
    'images/korea.jpg',
    'images/lake.jpg',
    'images/lake2.png',
    'images/newyork.png',
    'images/savannah.png',
    'images/winter1.jpg'
  ];

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

  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentBackgroundIndex(randomIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFadeInEffect();

  return (
    <div className="App">
      <header id='main' className="App-header" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImages[currentBackgroundIndex]})` }}>
        <div className="fade-in" > Welcome to TravelBuddy! </div>
        <button className="aboutusbutton fade-in" onClick={() => scrollTo('aboutUs')}>Get Started</button>
      </header>
      <div id='aboutUs' className="About">
        <AboutUs></AboutUs>
      </div>
    </div>
  );
}

export default App;