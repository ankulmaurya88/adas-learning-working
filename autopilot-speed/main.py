# autopilot-speed/main.py
from fastapi import FastAPI
from api_gateway.app import app as api_app
from fusion_service.app import app as fusion_app

main_app = FastAPI(title="Autopilot Car Speedometer")

# Mount services
main_app.mount("/api", api_app)
main_app.mount("/fusion", fusion_app)

app = main_app
