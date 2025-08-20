from geopy.geocoders import Nominatim
import random

class GPSTracker:
    """Simple GPS tracker. Default is 'mock' mode for easy testing.

    Set mode='device' to integrate a real GPS source (GPSD, serial port, etc.)
    """
    def __init__(self, mode='mock', geolocator_user_agent='modular_gps_tracker'):
        self.mode = mode
        if mode != 'mock':
            # geopy reverse geocoding helper
            self.geolocator = Nominatim(user_agent=geolocator_user_agent)

    def get_coordinates(self):
        if self.mode == 'mock':
            # return pseudo-random coords (good for demos)
            lat = random.uniform(-90, 90)
            lon = random.uniform(-180, 180)
            return lat, lon
        else:
            # Integration point for real GPS device
            raise NotImplementedError('Device mode not implemented in demo')

    def get_address(self, lat, lon):
        if hasattr(self, 'geolocator'):
            try:
                location = self.geolocator.reverse((lat, lon), language='en', exactly_one=True, timeout=10)
                return location.address if location else 'Unknown Location'
            except Exception as e:
                return f'Reverse geocoding failed: {e}'
        return 'Unknown Location'