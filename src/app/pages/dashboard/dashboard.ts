import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Forecast } from '../../widgets/forecast/forecast';
import { WeatherChart } from '../../widgets/weather-chart/weather-chart';
import { GridsterItem, Gridster, GridsterConfig, GridsterItemConfig } from 'angular-gridster2';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Gridster, GridsterItem, Forecast, WeatherChart],
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
        maxCols: 6,
        maxRows: 3,
        gridType: 'fit',
        outerMargin: true,
        minCols: 6,
        minRows: 3,
        ColWidth: 172,
        RowHeight: 128*2,
        pushItems: true,
        swap: false
      };
      this.dashboard = [
        { cols: 1, rows: 1, y: 0, x: 1, type: 'forecast1' },
        { cols: 1, rows: 1, y: 0, x: 2, type: 'forecast1' },
        { cols: 2, rows: 2, y: 0, x: 3, type: 'weatherChart' },
      ];
    }
  }
}