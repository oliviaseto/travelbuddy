from flask import Flask, request, jsonify
from flask_cors import CORS
from chat import ask_chat

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    destination = data['destination']
    dates = data['dates']
    reply = ask_chat(destination, dates)
    return jsonify({'reply': reply})  # Return JSON response

if __name__ == '__main__':
    app.run(debug=True)
