import React from 'react';

function AdditionalInformationForm({ formSubmitted, handleFormSubmit, userInput, handleUserInputChange, newOutput, loading }) {
  return (
    <>
      {formSubmitted && (
        <form className="input-form" onSubmit={handleFormSubmit}>
          <label>
            <div>Any other travel information you're looking for?</div>
            <div>
              <input
                className='user-input'
                type='text'
                name='user-input'
                placeholder='Enter here'
                value={userInput}
                onChange={handleUserInputChange}
              />
            </div>
          </label>
          <br />
          <button type="submit" className="submitbutton">Submit</button>
        </form>
      )}
      {/* {newOutput && <div className="output">{newOutput}</div>} */}
      {loading && <p>Loading...</p>}
    </>
  );
}

export default AdditionalInformationForm;