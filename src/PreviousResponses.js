import React from 'react';

function PreviousResponses({ responses }) {
  return (
    <div className="previous-responses">
      {responses.map((response, index) => (
        <div key={index} className="response">
          <p><strong>Question:</strong> {response.question}</p>
          <p><strong>Response:</strong> {response.response}</p>
        </div>
      ))}
    </div>
  );
}

export default PreviousResponses;
