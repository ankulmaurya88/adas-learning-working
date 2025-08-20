import requests

class APIClient:
    def __init__(self, endpoint='http://localhost:5000/api/location', timeout=5):
        self.endpoint = endpoint
        self.timeout = timeout

    def send_location(self, data):
        try:
            resp = requests.post(self.endpoint, json=data, timeout=self.timeout)
            return resp.status_code, resp.text
        except requests.RequestException as e:
            return None, f'Failed to send: {e}'