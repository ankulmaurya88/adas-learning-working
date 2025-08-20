# sensor_reader/app.py
import os, time, json, random
from datetime import datetime, timezone
import paho.mqtt.client as mqtt

MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MODE = os.getenv("MODE", "mock")

client = mqtt.Client(client_id="sensor_reader")
client.connect(MQTT_HOST, MQTT_PORT, 60)
client.loop_start()

def now():
    return datetime.now(timezone.utc).isoformat()

def publish(topic, payload):
    client.publish(topic, json.dumps(payload), qos=1, retain=False)

def read_mock():
    # Simulate realistic drift/noise; base ~ 20 m/s (~72 km/h)
    base = 20.0 + 2.0 * random.sin(time.time()/5.0)
    # Typical noise: GPS high noise, CAN low noise, IMU velocity integrated -> drift
    return {
        "can": base + random.uniform(-0.3, 0.3),
        "wheel_encoder": base + random.uniform(-0.2, 0.2),
        "gps": base + random.uniform(-1.0, 1.0),
        "imu": base + random.uniform(-0.8, 0.8),
    }

while True:
    if MODE == "mock":
        s = read_mock()
        publish("sensors/can/speed",  {"source":"can","speed_mps":s["can"],"ts":now()})
        publish("sensors/wheel/speed",{"source":"wheel_encoder","speed_mps":s["wheel_encoder"],"ts":now()})
        publish("sensors/gps/speed",  {"source":"gps","speed_mps":s["gps"],"ts":now()})
        publish("sensors/imu/speed",  {"source":"imu","speed_mps":s["imu"],"ts":now()})
    else:
        # TODO: replace with real readers; publish same payload format
        pass

    time.sleep(0.2)  # 5 Hz
