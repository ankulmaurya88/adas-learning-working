# api_gateway/app.py
import os, json, asyncio
from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
import paho.mqtt.client as mqtt
import uvicorn

MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))

app = FastAPI(title="Autopilot Speed API")

latest = {"speed_mps": 0.0, "variance": 1.0, "ts": None}
ws_clients = set()

def on_message(client, userdata, msg):
    global latest
    try:
        latest = json.loads(msg.payload.decode())
    except Exception:
        pass
    # Fan-out to WS clients
    data = json.dumps(latest)
    for ws in list(ws_clients):
        asyncio.run_coroutine_threadsafe(ws.send_text(data), asyncio.get_event_loop())

mqtt_client = mqtt.Client(client_id="api_gateway")
mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_HOST, MQTT_PORT, 60)
mqtt_client.subscribe("vehicle/speed", qos=1)
mqtt_client.loop_start()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/vehicle/speed")
def get_speed():
    return JSONResponse(latest)

@app.websocket("/ws/speed")
async def ws_speed(ws: WebSocket):
    await ws.accept()
    ws_clients.add(ws)
    # Send current snapshot immediately
    await ws.send_text(json.dumps(latest))
    try:
        while True:
            # Keep alive; we don't expect client messages
            await asyncio.sleep(10)
    except Exception:
        pass
    finally:
        ws_clients.discard(ws)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
