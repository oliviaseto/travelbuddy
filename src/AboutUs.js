import './AboutUs.css';
import React, { useState } from 'react';

function AboutUs() {
  const [destination, setDestination] = useState(""); 
  const [dates, setDates] = useState(""); 
  const [reply, setReply] = useState("");

  const handleDestinationChange = (event) => {
    setDestination(event.target.value); 
  };

  const handleDatesChange = (event) => {
    setDates(event.target.value); 
  }; 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify({
            destination: destination,
            dates: dates
        })
      }); 

      // const data = await response.json(); // Parse response as JSON
      const data = response
      console.log("data: ", data);
      console.log(data.reply);
      setReply(data.reply);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="AboutUs">
      <div className="About-content">
          <h1>About Us</h1>
          <p> Traveling soon? Input your destination and dates and we will give you a personalized itinerary! </p>
      </div>
      <div className="chat">
        <form onSubmit={handleSubmit}>
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
          <br />
          <button type="submitbutton">Submit</button>
      </form>
      {reply && <p className="reply">{reply}</p>}
    </div> 
  </div>                 
  );
}
export default AboutUs;