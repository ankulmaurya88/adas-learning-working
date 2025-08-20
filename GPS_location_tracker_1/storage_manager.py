import json
from datetime import datetime

class StorageManager:
    def __init__(self, filename='gps_logs.jsonl'):
        self.filename = filename

    def save(self, data):
        entry = {'timestamp': datetime.utcnow().isoformat(), **data}
        with open(self.filename, 'a') as f:
            f.write(json.dumps(entry) + '\n')