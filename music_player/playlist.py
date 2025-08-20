import requests

def create_playlist(user_id, token, name="My Playlist"):
    url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    data = {"name": name, "public": False}
    response = requests.post(url, headers=headers, json=data)
    return response.json()

def add_song_to_playlist(playlist_id, song_uri, token):
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    data = {"uris": [song_uri]}
    return requests.post(url, headers=headers, json=data).json()

def get_playlist_tracks(playlist_id, token):
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = {"Authorization": f"Bearer {token}"}
    return requests.get(url, headers=headers).json()
