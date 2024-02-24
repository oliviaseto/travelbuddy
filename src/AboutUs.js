import './AboutUs.css';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for DatePicker
import { OpenAI } from 'openai';

const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY;

function AboutUs() {
  const [destination, setDestination] = useState(""); 
  const [reply, setReply] = useState("");
  const [startDate, setStartDate] = useState(new Date()); // State for DatePicker
  const [endDate, setEndDate] = useState(new Date());
  const [error,setError] = useState("");


  const client = new OpenAI({ apiKey: OPENAI_KEY, dangerouslyAllowBrowser: true });

  const handleDestinationChange = (event) => {
    setDestination(event.target.value); 
  };
  const validateDestination = () => {
    // You can implement your validation logic here
    // For example, check if the destination is in a predefined list of valid destinations
    if (!destination|| destination.trim() === "") {
      setError("Please input a valid destination"); // Set error message if the destination is not valid
      setReply("");
      return false;
    } else {
      setError(""); // Reset error message if the destination is not valid
      return true;
    }
  };
  

  const callOpenAIAPI = async () => {
    if (!validateDestination()) {
      return; // Exit the function if the destination is not valid
    }
    console.log("Calling the OpenAI API");
    
    try {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Can you plan me a vacation itinerary for ${destination} during ${startDate} and ${endDate}?`
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
          {error && <p className="error-message">{error}</p>} {/* Display error message if the destination is not valid */}
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
