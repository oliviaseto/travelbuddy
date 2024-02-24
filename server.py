from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from chat import ask_chat

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/chat', methods=['POST'])
@cross_origin()
def chat():
    data = request.json
    destination = data['destination']
    dates = data['dates']
    reply = ask_chat(destination, dates)
    return jsonify({'reply': reply})  # Return JSON response

if __name__ == '__main__':
    app.run(debug=True)
