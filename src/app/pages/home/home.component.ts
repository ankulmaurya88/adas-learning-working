import { Component } from '@angular/core';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { ControlPanelComponent } from '../../components/control-panel/control-panel.component';
import { AlertPanelComponent } from '../../components/alert-panel/alert-panel.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SpeedometerComponent } from '../../components/speedometer/speedometer.component';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent,DashboardComponent,VideoPlayerComponent,ControlPanelComponent,AlertPanelComponent,FooterComponent,SpeedometerComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
