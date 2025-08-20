from flask import Flask, request, jsonify
from datetime import datetime
import json

app = Flask(__name__)
LOG_FILE = 'server_received.jsonl'

@app.route('/api/location', methods=['POST'])
def location():
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'no json provided'}), 400
    entry = {'received_at': datetime.utcnow().isoformat(), 'data': data}
    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(entry) + '\n')
    print('Received:', entry)
    return jsonify({'status': 'success', 'message': 'Location received'}), 200

if __name__ == '__main__':
    # debug=True prints received payloads to your console to observe live behavior
    app.run(port=5000, debug=True)