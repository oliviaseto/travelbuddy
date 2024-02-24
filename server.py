from flask import Flask, request, jsonify
from chat import ask_chat

app = Flask(__name__)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    destination = data['destination']
    dates = data['dates']
    reply = ask_chat(destination, dates)
    # return jsonify({'reply': reply})
    return reply

if __name__ == '__main__':
    app.run(debug=True)
