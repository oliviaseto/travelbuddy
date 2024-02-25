import React from 'react';

function PreviousResponses({ responses }) {
  return (
    <div className="previous-responses">
      {responses.map((response, index) => (
        <div key={index} className="response">
          <p>Question: {response.question}</p>
          <p>{response.response}</p>
        </div>
      ))}
    </div>
  );
}

export default PreviousResponses;
