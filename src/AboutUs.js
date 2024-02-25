import './AboutUs.css';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for DatePicker
import { OpenAI } from 'openai';

const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY;

function AboutUs() {
  const [destination, setDestination] = useState(""); 
  const [startDate, setStartDate] = useState(new Date()); // State for DatePicker
  const [endDate, setEndDate] = useState(new Date());
  const [error,setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const client = new OpenAI({ apiKey: OPENAI_KEY, dangerouslyAllowBrowser: true });

  const handleDestinationChange = (event) => {
    setDestination(event.target.value); 
  };
  const validateDestination = () => {
    // You can implement your validation logic here
    // For example, check if the destination is in a predefined list of valid destinations
    if (!destination|| destination.trim() === "") {
      setError("Please input a valid destination"); // Set error message if the destination is not valid
      setParsedData(null);
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
    
    setLoading(true);

    try {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "system", "content": "You're an experienced travel advisor, well-versed in exploring the world's wonders and curating unforgettable experiences. Your expertise in understanding travel preferences and destinations allows you to craft tailored recommendation."},
          {"role": "user", "content": `Can you plan me a vacation itinerary for ${destination} during ${startDate} and ${endDate}? Separate the itinerary by days. Include an overall packing guide for the expected weather during the intended stay, not per day.`}
        ],
        max_tokens: 1000,
      });
      const data = response.choices[0].message.content;
      console.log(data);
      const parsedData = parseItineraryAndPackingGuide(data);
      setParsedData(parsedData);
      console.log(parsedData)
    } catch (error) {
      console.error('Error:', error);
      setError("Error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await callOpenAIAPI(); 
  };

  const parseItineraryAndPackingGuide = (text) => {
    const itineraryRegex = /Day \d+:(.+?)(?=Day \d+|$)/gs;
    const packingGuideRegex = /Clothing:(.+)/;

    const itineraryMatches = text.matchAll(itineraryRegex);
    const packingGuideMatch = text.match(packingGuideRegex);

    const itinerary = [];
    for (const match of itineraryMatches) {
        const dayInfo = match[1].trim().split('\n');
        const date = dayInfo.shift().trim();
        const activities = dayInfo.map(activity => activity.trim());
        itinerary.push({ date, activities });
    }

    let packingGuide = "";
    if (packingGuideMatch) {
        packingGuide = packingGuideMatch[1].trim();
    }

    return { itinerary, packingGuide };
  };

  return (
    <div className="AboutUs">
      <div className="About-content">
        <h1>About Us</h1>
        <div className="text-container">
          <p className="left-text">Traveling soon? Don't have time <br />to plan an itinerary?</p>
          <p className="right-text">Presenting, your own <br />personal travel itinerary planner, <br />powered by AI.</p>
          <p className="left-text">To get started, please enter your <br />destination, as well as your vacation dates.</p>
          <p className="right-text">We will generate a customized itinerary,<br />packing guide, estimated costs, etc.<br />as you continue to tell us your vacation <br />desires.</p>
        </div>
      </div>
      <div className="chat">
        <form className="input-form" onSubmit={handleSubmit}>
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
            className="datepicker"
            placeholderText='Start Date'
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            />
            <DatePicker 
            className="datepicker"
            placeholderText='End Date'
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            />
          </label>
          <br />
          <button type="submit" className="submitbutton">Submit</button>
        </form>
        {loading && <p>Loading...</p>}
        {parsedData && (
          <div className="parsed-data">
            <div className="text-container">
              <h2>Itinerary</h2>
              {parsedData.itinerary.map((day, index) => (
                <div key={index}>
                  <h3><strong>{day.date}</strong></h3>
                  {day.activities.map((activity, idx) => (
                    <p key={idx}>{activity}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );  
}
export default AboutUs;
