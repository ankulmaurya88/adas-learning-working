import time
from gps_tracker import GPSTracker
from data_formatter import format_location
from storage_manager import StorageManager
from api_client import APIClient
from map_visualizer import plot_locations


def run_tracker(iterations=5, delay=2, use_api=True):
    gps = GPSTracker(mode='mock')
    storage = StorageManager()
    api = APIClient()

    collected = []

    for i in range(iterations):
        lat, lon = gps.get_coordinates()
        address = gps.get_address(lat, lon)
        formatted = format_location(lat, lon, address)

        print('Location Captured:', formatted)
        storage.save(formatted)
        collected.append(formatted)

        if use_api:
            status, msg = api.send_location(formatted)
            if status is None:
                print('API send failed:', msg)
            else:
                print('API Response:', status, msg)

        time.sleep(delay)

    plot_locations(collected)
    print('Map saved to map.html')


if __name__ == '__main__':
    run_tracker()