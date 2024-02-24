import './AboutUs.css';
import React, { useState } from 'react';

function AboutUs() {
    const [destination, setDestination] = useState(""); 
  const [dates, setDates] = useState(""); 

  const handleDestinationChange = (event) => {
    setDestination(event.target.value); 
  };

  const handleDatesChange = (event) => {
    setDates(event.target.value); 
  }; 
    return (
        <div className="AboutUs">
            <div className="About-content">
                <h1>About Us</h1>
                <p> Traveling soon? Input your destination and dates and we will give you a personalized itinerary! </p>
                
            </div>
        <div className="chat">
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
        </div>             
            
    );

}
export default AboutUs;