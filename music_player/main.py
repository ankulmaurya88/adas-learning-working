from fastapi import FastAPI, Query
from auth import get_auth_url, get_token
from music import play_song, pause_song, next_song
from playlist import create_playlist, add_song_to_playlist, get_playlist_tracks

app = FastAPI()

@app.get("/login")
def login():
    return {"auth_url": get_auth_url()}

@app.get("/callback")
def callback(code: str):
    return get_token(code)

@app.post("/music/play")
def play(song_uri: str, device_id: str, token: str):
    return {"status": play_song(device_id, song_uri, token)}

@app.post("/music/pause")
def pause(token: str):
    return {"status": pause_song(token)}

@app.post("/music/next")
def next_track(token: str):
    return {"status": next_song(token)}

@app.post("/playlist/create")
def playlist(user_id: str, name: str, token: str):
    return create_playlist(user_id, token, name)

@app.post("/playlist/add")
def add_song(playlist_id: str, song_uri: str, token: str):
    return add_song_to_playlist(playlist_id, song_uri, token)

@app.get("/playlist/tracks")
def playlist_tracks(playlist_id: str, token: str):
    return get_playlist_tracks(playlist_id, token)
