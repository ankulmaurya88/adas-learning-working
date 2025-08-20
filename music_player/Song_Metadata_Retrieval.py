from access_token import get_token
import requests


def get_song_metadata(song_id, token):
    url = f"https://api.spotify.com/v1/tracks/{song_id}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    return response.json()

# Example
token = get_token()
song = get_song_metadata("3n3Ppam7vgaVa1iaRUc9Lp", token)  # Example song ID
print(song["name"], "-", song["artists"][0]["name"])
