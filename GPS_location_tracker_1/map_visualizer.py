import folium

def plot_locations(locations, filename='map.html', start_zoom=12):
    """Create a folium map and save to filename.

    locations: list of dicts with keys 'latitude','longitude','address'
    """
    if not locations:
        raise ValueError('No locations to plot')

    # center on last known point
    last = locations[-1]
    m = folium.Map(location=[last['latitude'], last['longitude']], zoom_start=start_zoom)

    for loc in locations:
        folium.Marker([loc['latitude'], loc['longitude']], popup=loc.get('address', '')).add_to(m)

    m.save(filename)