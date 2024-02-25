import './AboutUs.css';
import AdditionalInformationForm from './AdditionalInformationForm';
import PreviousResponses from './PreviousResponses';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for DatePicker
import { OpenAI } from 'openai';
import jsPDF from 'jspdf';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY;

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

function AboutUs() {
  const [chatHistory, setChatHistory] = useState([]);
  const [destination, setDestination] = useState(""); 
  const [startDate, setStartDate] = useState(null); // State for DatePicker
  const [endDate, setEndDate] = useState(null);
  const [error,setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [previousResponses, setPreviousResponses] = useState([]);
  const [newOutput, setNewOutput] = useState("");

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
  
  const addMessage = (role, content) => {
    setChatHistory((prevChatHistory) => [...prevChatHistory, { role, content }]);
  };

  const callOpenAIAPI = async () => {
    if (!validateDestination()) {
      return; // Exit the function if the destination is not valid
    }
    console.log("Calling the OpenAI API");
    
    setLoading(true);

    try {
      const userQuestion = `Can you plan me a vacation itinerary for ${destination} during ${startDate} and ${endDate}? Separate it by days. Include a packing guide as well for the expected weather during the intended stay.`;

      addMessage("user", userQuestion);
      
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages:  [{"role": "system", "content": "You're an experienced travel advisor, well-versed in exploring the world's wonders and curating unforgettable experiences. Your expertise in understanding travel preferences and destinations allows you to craft tailored recommendation."},
        {"role": "user", "content":`Can you plan me a vacation itinerary for ${destination} during ${startDate} and ${endDate}? Separate it by days. Include a packing guide as well for the expected weather during the intended stay.`}],
        max_tokens: 1000,
      });
      const data = response.choices[0].message.content;
      console.log(data);
      const parsedData = parseItineraryAndPackingGuide(data);
      setParsedData(parsedData);
      console.log(parsedData);
      addMessage("assistant", data);
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      setError("Error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const saveChatHistory = () => {
    const pdfName = window.prompt('Enter PDF name (without extension):');

  if (!pdfName) {
    // User canceled or entered an empty name
    return;
  }

  const filename = `${pdfName}.pdf`;

  const pdf = new jsPDF();
    chatHistory.forEach((message, index) => {
    const text = `${message.role}: ${message.content}`;
    const maxWidth = 180;
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, 10, 10 + index * 10);
  });
  pdf.save(filename);
  setChatHistory([]);
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

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    await callOpenAIAPINewQuestion();
  };

  const callOpenAIAPINewQuestion = async () => {
    console.log("Calling the OpenAI API");

    setLoading(true);

    try {
      const userQuestion = userInput;

      addMessage("user", userQuestion);

      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages:  [{"role": "system", "content": "You're an experienced travel advisor, well-versed in exploring the world's wonders and curating unforgettable experiences. Your expertise in understanding travel preferences and destinations allows you to craft tailored recommendation."},
        {"role": "user", "content":userInput}],
        max_tokens: 1000,
      });
      const data = response.choices[0].message.content;
      console.log(data);
      addMessage("assistant", data);
      setFormSubmitted(true);
      setNewOutput(data);
      handleNewResponse(userInput, data);
    } catch (error) {
      console.error('Error:', error);
      setError("Error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const handleNewResponse = (question, response) => {
    const updatedResponses = [...previousResponses, { question, response }];
    setPreviousResponses(updatedResponses);
  };

  useFadeInEffect();

  return (
    <div className="AboutUs">
      <Parallax pages={7}>
        <ParallaxLayer offset={0}>
        <div className="About-content">

          <h1>About Us</h1>
        </div>
        </ParallaxLayer>
        <div>
            <ParallaxLayer offset={1} speed={0.5} factor={0.5}>
              <p className="about-text">Traveling soon? Don't have time <br />to plan an itinerary?</p>
            </ParallaxLayer>
            <ParallaxLayer offset={2} speed={0.5}factor={0.5}>
              <p className="about-text">Presenting, your own <br />personal travel itinerary planner, <br />powered by AI.</p>
            </ParallaxLayer>
            <ParallaxLayer offset={3} speed={0.5}factor={0.5}>
              <p className="about-text">To get started, please enter your <br />destination, as well as your vacation dates.</p>
            </ParallaxLayer>
            <ParallaxLayer offset={4} speed={0.5}factor={0.5}>
              <p className="about-text">We will generate a customized itinerary,<br />packing guide, estimated costs, etc.<br />as you continue to tell us your vacation <br />desires.</p>
            </ParallaxLayer>
        </div>
      <ParallaxLayer offset={5}>
      <div className="chat">
        <form className="input-form" onSubmit={handleSubmit}>
          <label>
            <div>Where are you traveling to?</div>
            <div>
            <input
              className='destination-input'
              type='text'
              name='destination'
              placeholder='Enter a Location'
              value={destination}
              onChange={handleDestinationChange}
              required
            />
            </div>
          </label>
          {error && <p className="error-message">{error}</p>} {/* Display error message if the destination is not valid */}
          <br />
          <label>
            <div>When are you going?</div>
            <div className="datepicker-container">
            <DatePicker 
            className="datepicker"
            placeholderText='Start Date'
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            required
            />
            </div>
            <div className="datepicker-container">
            <DatePicker 
            className="datepicker"
            placeholderText='End Date'
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            required
            />
            </div>
          </label>
          <br />
          <button type="submit" className="submitbutton">Submit</button>
        </form>
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
        <div className="text-container">
          <PreviousResponses responses={previousResponses} />
        </div>
        <AdditionalInformationForm
          formSubmitted={formSubmitted}
          handleFormSubmit={handleFormSubmit}
          userInput={userInput}
          handleUserInputChange={handleUserInputChange}
          newOutput={newOutput}
          loading={loading}
        />
      </div>
      <button onClick={saveChatHistory} className="submitbutton" >Download Chat History</button>
      </ParallaxLayer>
      </Parallax>
    </div>
  );  
}
export default AboutUs;
