
// import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-routing-machine';



import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  imports:[CommonModule,FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: any;
  private vehicleMarker: any;
  private routePath: L.LatLng[] = [];
  private polyline: L.Polyline | undefined;

  mapInitialized: boolean = false;

    
 
  private routingControl: any;
  destinationAddress: string = '';
  private destinationMarker: L.Marker | undefined;

  // destinationAddress: string = '';
  // private destinationMarker: L.Marker | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initMap();
  }

  




private initMap(): void {
  // Initialize map without setting initial view
  this.map = L.map('map');

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(this.map);

  // Attempt to get user's current location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Set map view to current location with default zoom level
      const zoomLevel = 13;
      this.map.setView([lat, lng], zoomLevel);

      // Add a marker or circle to indicate user location
      L.circle([lat, lng], {
        radius: 25,
        color: 'green',
        fillColor: '#3f3',
        fillOpacity: 0.5,
      }).addTo(this.map).bindPopup('You are here').openPopup();
    },
    (error) => {
      console.warn('Could not access GPS:', error);

      // Fallback to India if location access fails
      this.map.setView([20.5937, 78.9629], 5);

      // Optional: show fallback marker
      L.circle([20.5937, 78.9629], {
        radius: 50000,
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.4,
      }).addTo(this.map).bindPopup('Fallback location: India').openPopup();
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
}




// private initMap(): void {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const lat = position.coords.latitude;
//       const lng = position.coords.longitude;

//       // Step 1: Initialize map only after location is available
//       this.map = L.map('map').setView([lat, lng], 15);

//       // Step 2: Add OpenStreetMap tiles
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors'
//       }).addTo(this.map);

//       // Step 3: Mark current location
//       L.circle([lat, lng], {
//         radius: 25,
//         color: 'green',
//         fillColor: '#3f3',
//         fillOpacity: 0.5,
//       }).addTo(this.map).bindPopup('You are here').openPopup();

//       // ✅ Indicate map is ready
//       this.mapInitialized = true;
//     },
//     (error) => {
//       console.warn('Could not access GPS:', error);

//       // Fallback map if location access fails
//       this.map = L.map('map').setView([20.5937, 78.9629], 5);
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors'
//       }).addTo(this.map);

//       L.circle([20.5937, 78.9629], {
//         radius: 50000,
//         color: 'red',
//         fillColor: '#f03',
//         fillOpacity: 0.3,
//       }).addTo(this.map).bindPopup('Fallback: India').openPopup();

//       // ✅ Still show map even in fallback
//       this.mapInitialized = true;
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0
//     }
//   );
// }




  startTracking(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const carIcon = L.icon({
          iconUrl: 'assets/car.png',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        this.vehicleMarker = L.marker([lat, lng], { icon: carIcon }).addTo(this.map);
        this.map.setView([lat, lng], 15);
        this.trackPosition();
      },
      (error) => {
        console.error('Location access denied or error:', error);
        alert('⚠️ Location permission is required to run the tracking system.');
      },
      { enableHighAccuracy: true }
    );
  }

  private trackPosition(): void {
    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newPoint = L.latLng(lat, lng);

        this.vehicleMarker.setLatLng(newPoint);
        this.map.panTo(newPoint);

        this.routePath.push(newPoint);
        if (this.polyline) {
          this.polyline.setLatLngs(this.routePath);
        } else {
          this.polyline = L.polyline(this.routePath, { color: 'blue' }).addTo(this.map);
        }
      },
      (error) => console.error('Tracking error:', error),
      { enableHighAccuracy: true }
    );
  }

  
goToDestination(): void {
    if (!this.destinationAddress) {
      alert("Enter a destination first!");
      return;
    }

    const encoded = encodeURIComponent(this.destinationAddress);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`;

    this.http.get<any[]>(url).subscribe((results) => {
      if (results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);

        // Remove old destination marker
        if (this.destinationMarker) this.map.removeLayer(this.destinationMarker);

        // Add destination marker
        this.destinationMarker = L.marker([lat, lon])
          .addTo(this.map)
          .bindPopup('Destination')
          .openPopup();

        // Draw route
        this.drawRouteToDestination(lat, lon);
      } else {
        alert("Destination not found.");
      }
    });
  }




  private drawRouteToDestination(destLat: number, destLng: number): void {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const currentLat = position.coords.latitude;
      const currentLng = position.coords.longitude;

      if (this.routingControl) {
        this.map.removeControl(this.routingControl);
      }

      // Create routing with type cast to `any` to avoid TS errors
      const routingOptions: any = {
        waypoints: [
          L.latLng(currentLat, currentLng),
          L.latLng(destLat, destLng)
        ],
        lineOptions: {
          styles: [{ color: 'darkblue', opacity: 0.8, weight: 5 }],
          extendToWaypoints: true,
          missingRouteTolerance: 10
        },
        routeWhileDragging: false,
        draggableWaypoints: false,
        addWaypoints: false,
        createMarker: () => null // suppress default markers
      };

      this.routingControl = L.Routing.control(routingOptions).addTo(this.map);
    },
    (err) => {
      console.error("Failed to fetch current location for route", err);
      alert("Could not access GPS to draw route.");
    },
    { enableHighAccuracy: true }
  );
}


}










  

