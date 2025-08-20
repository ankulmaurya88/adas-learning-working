# common/models.py
from pydantic import BaseModel
from typing import Literal
from datetime import datetime

class SensorSpeed(BaseModel):
    source: Literal["can","wheel_encoder","gps","imu"]
    speed_mps: float
    ts: datetime

class FusedSpeed(BaseModel):
    speed_mps: float
    variance: float
    ts: datetime
