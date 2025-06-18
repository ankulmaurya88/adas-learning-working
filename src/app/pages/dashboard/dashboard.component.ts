import { Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { SpeedometerComponent } from '../../components/speedometer/speedometer.component';
import { MapComponent } from '../../components/map/map.component';


@Component({
  selector: 'app-dashboard',

  imports:[SpeedometerComponent,MapComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('cardStagger', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('100ms', [
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class DashboardComponent {
  adasFeatures = [
    {
      name: 'Blind Spot Detection',
      description: 'Monitors blind spots for safer lane changes.',
      status: 'active',
      icon: '👀',
    },
    {
      name: 'Tire Pressure Monitoring',
      description: 'Tracks tire pressure in real-time.',
      status: 'warning',
      icon: '⚠️',
    },
    {
      name: 'Pedestrian Detection',
      description: 'Detects nearby pedestrians and alerts the driver.',
      status: 'active',
      icon: '🚶‍♂️',
    },
    {
      name: 'Lane Keeping Assist',
      description: 'Helps keep the vehicle centered in its lane.',
      status: 'error',
      icon: '🛣️',
    },
  ];
}
