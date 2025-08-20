import requests

def play_song(device_id, song_uri, token):
    url = f"https://api.spotify.com/v1/me/player/play?device_id={device_id}"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"uris": [song_uri]}
    response = requests.put(url, headers=headers, json=data)
    return response.status_code

def pause_song(token):
    url = "https://api.spotify.com/v1/me/player/pause"
    headers = {"Authorization": f"Bearer {token}"}
    return requests.put(url, headers=headers).status_code

def next_song(token):
    url = "https://api.spotify.com/v1/me/player/next"
    headers = {"Authorization": f"Bearer {token}"}
    return requests.post(url, headers=headers).status_code
