# fusion_service/app.py
import os, json, math, queue, threading, time
from datetime import datetime, timezone
import paho.mqtt.client as mqtt

MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))

# Sensor-specific noise (m/s)^2 — tune per real hardware
R_BY_SENSOR = {
    "can": 0.05**2,
    "wheel_encoder": 0.07**2,
    "gps": 0.6**2,
    "imu": 0.4**2,
}

# Simple 1D KF for speed
class KF1D:
    def __init__(self, x0=0.0, P0=1.0, q=0.01):
        self.x = x0   # state: speed (m/s)
        self.P = P0   # variance
        self.q = q    # process noise
        self.last_ts = None

    def predict(self, dt):
        # x' = x ; P' = P + q*dt
        self.P = self.P + self.q * max(dt, 1e-3)

    def update(self, z, R):
        K = self.P / (self.P + R)
        self.x = self.x + K * (z - self.x)
        self.P = (1 - K) * self.P

kf = KF1D()
q_in = queue.Queue()

def now():
    return datetime.now(timezone.utc).isoformat()

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        q_in.put(payload)
    except Exception:
        pass

def fusion_loop(out_client):
    while True:
        try:
            meas = q_in.get(timeout=1.0)
        except queue.Empty:
            continue

        z = float(meas["speed_mps"])
        src = meas.get("source","gps")
        R = R_BY_SENSOR.get(src, 0.5**2)

        # Predict with nominal dt
        kf.predict(dt=0.2)
        # Update with measurement
        kf.update(z, R)

        fused = {
            "speed_mps": kf.x,
            "variance": kf.P,
            "ts": now()
        }
        out_client.publish("vehicle/speed", json.dumps(fused), qos=1, retain=True)

client_in = mqtt.Client(client_id="fusion_in")
client_in.on_message = on_message
client_in.connect(MQTT_HOST, MQTT_PORT, 60)
client_in.subscribe("sensors/+/speed", qos=1)
client_in.loop_start()

client_out = mqtt.Client(client_id="fusion_out")
client_out.connect(MQTT_HOST, MQTT_PORT, 60)
client_out.loop_start()

threading.Thread(target=fusion_loop, args=(client_out,), daemon=True).start()

while True:
    time.sleep(1)
