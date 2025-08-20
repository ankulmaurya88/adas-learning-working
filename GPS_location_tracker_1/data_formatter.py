def format_location(lat, lon, address):
    return {
        'latitude': round(lat, 6),
        'longitude': round(lon, 6),
        'address': address
    }