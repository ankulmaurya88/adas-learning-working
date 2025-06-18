// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-speedometer',
//   imports:[CommonModule],
//   templateUrl: './speedometer.component.html',
//   styleUrls: ['./speedometer.component.css']
// })
// export class SpeedometerComponent implements OnInit {
//   speed = 0;
//   rotationAngle = 0;

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.updateSpeed(); // Start polling
//   }

//   updateSpeed(): void {
//     setInterval(() => {
//       this.http.get<any>('http://localhost:5000/api/speed').subscribe({
//         next: data => {
//           this.speed = data?.speed || 0;
//           this.rotationAngle = this.mapSpeedToAngle(this.speed);
//         },
//         error: () => {
//           // Fallback to demo mode if API fails
//           this.speed = Math.floor(Math.random() * 121); // 0 to 120 mph
//           this.rotationAngle = this.mapSpeedToAngle(this.speed);
//         }
//       });
//     }, 1000); // Update every second
//   }

//   mapSpeedToAngle(speed: number): number {
//     // Map 0–120 mph to -120deg to +120deg (centered needle)
//     return (speed / 120) * 240 - 120;
//   }
// }



// // import { Component, OnInit } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// // @Component({
// //   selector: 'app-speedometer',
// //   standalone: true, // ✅ Required if using 'imports' in component directly
// //   imports: [CommonModule],
// //   templateUrl: './speedometer.component.html',
// //   styleUrls: ['./speedometer.component.css']
// // })
// // export class SpeedometerComponent implements OnInit {
// //   speed = 0;
// //   rotationAngle = 0;

// //   constructor(private http: HttpClient) {}

// //   ngOnInit(): void {
// //     this.loadMockSpeed();
// //   }

// //   loadMockSpeed(): void {
// //     setInterval(() => {
// //       this.http.get<any>('assets/mock-speed.json').subscribe({
// //         next: data => {
// //           this.speed = data?.speed || 0;
// //           this.rotationAngle = this.mapSpeedToAngle(this.speed);
// //         },
// //         error: () => {
// //           // Optional: fallback to demo value
// //           this.speed = Math.floor(Math.random() * 121);
// //           this.rotationAngle = this.mapSpeedToAngle(this.speed);
// //         }
// //       });
// //     }, 1000); // Poll every second
// //   }

// //   mapSpeedToAngle(speed: number): number {
// //     // Convert 0–120 mph to -120° to +120° needle rotation
// //     return (speed / 120) * 240 - 120;
// //   }
// // }


import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-speedometer',
  imports: [CommonModule],
  templateUrl: './speedometer.component.html',
  styleUrls: ['./speedometer.component.css']
})
export class SpeedometerComponent implements OnInit {
  speed: number = 0;           // Current speed
  rotationAngle: number = -120; // Needle rotation in degrees (-120° = 0 mph)
  
  // Speed ticks and their angles around the dial
  ticks = [
    { value: 0, angle: -120 },
    { value: 20, angle: -90 },
    { value: 40, angle: -60 },
    { value: 60, angle: -30 },
    { value: 80, angle: 0  },
    { value: 100, angle: 30 },
    { value: 120, angle: 60 },
    { value: 140, angle: 90 },
    { value: 160, angle: 120 },
  ];

  ngOnInit() {
    // Example: increase speed gradually for demo
    let speedValue = 0;
    setInterval(() => {
      speedValue += 5;
      if (speedValue > 160) speedValue = 0;
      this.setSpeed(speedValue);
    }, 1000);
  }

  setSpeed(value: number) {
    this.speed = value;
    // Map speed (0-160) linearly to rotation (-120° to 120°)
    this.rotationAngle = this.map(value, 0, 160, -120, 120);
  }

  // Utility to map a number from one range to another
  private map(x: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
    return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }
}
