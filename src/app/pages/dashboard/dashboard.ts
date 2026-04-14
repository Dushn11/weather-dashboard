import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Forecast } from '../../components/forecast/forecast';
import { GridsterItem, Gridster, GridsterConfig, GridsterItemConfig } from 'angular-gridster2';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Gridster, GridsterItem, Forecast],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  isBrowser = false;
  constructor(
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  options: GridsterConfig = {};
  dashboard: GridsterItemConfig[] = [];
  ngOnInit(): void {
    this.titleService.setTitle('Weather Dashboard');
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.options = {
        draggable: { enabled: true },
        resizable: { enabled: true },
      };
      this.dashboard = [
        { cols: 2, rows: 1, y: 0, x: 1, type: 'forecast1' },
      ];
    }
  }
}