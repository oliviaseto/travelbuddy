import './AboutUs.css';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for DatePicker
import { OpenAI } from 'openai';

const API_KEY = "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";

function AboutUs() {
  const [destination, setDestination] = useState(""); 
  const [dates] = useState(""); 
  const [reply, setReply] = useState("");
  const [startDate, setStartDate] = useState(new Date()); // State for DatePicker
  const [endDate, setEndDate] = useState(new Date());

  const client = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

  const handleDestinationChange = (event) => {
    setDestination(event.target.value); 
  };


  const callOpenAIAPI = async () => {
    console.log("Calling the OpenAI API");
    
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Do I need a visa for a trip to ${destination} during ${dates}?`
          }
        ],
        max_tokens: 100,
      });
      const data = response.choices[0].message.content;
      setReply(data); 
    } catch (error) {
      console.error('Error:', error);
      setReply("Error occurred while fetching data. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await callOpenAIAPI(); 
  };

  return (
    <div className="AboutUs">
      <div className="About-content">
          <h1>About Us</h1>
          <div className ="text-container">
            <p className="left-text">Traveling soon? Don't have time <br></br>to plan an itinerary?</p>
            <p className="right-text">Presenting, your own <br></br>personal travel itinerary planner, <br></br>powered by AI.</p>
            <p className="left-text">To get started, please enter your <br></br>destination, as well as your vacation dates.</p>
            <p className="right-text">We will generate a customized itinerary,<br></br> packing guide, estimated costs, etc.<br></br> as you continue to tell us your vacation <br></br>desires.</p>
          </div>
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
              <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
            <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      />
          </label>
          <br />
          <button type="submit">Submit</button> {/* Corrected button type */}
        </form>
        {reply && <p className="reply">{reply}</p>}
      </div> 
    </div>                 
  );
}
export default AboutUs;
