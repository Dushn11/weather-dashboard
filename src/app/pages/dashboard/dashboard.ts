import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Forecast } from '../../widgets/forecast/forecast';
import { WeatherChart } from '../../widgets/weather-chart/weather-chart';
import { GridsterItem, Gridster, GridsterConfig} from 'angular-gridster2';
import { DashboardItem } from './dashboard-item.interface';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Gridster, GridsterItem, Forecast, WeatherChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  widgetId = 0;
  constructor( private titleService: Title ) { }
  options: GridsterConfig = {};
  dashboard: DashboardItem [] = [];

  ngOnInit(): void {
    this.titleService.setTitle('Weather Dashboard');
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
        {
        cols: 1,
        rows: 1,
        y: 0,
        x: 0,
        widget: {
          type: 'forecast'
        }
      },
      {
        cols: 2,
        rows: 2,
        y: 0,
        x: 1,
        widget: {
          type: 'chart',
          metric: 'temperature'
        }
      },
      {
        cols: 2,
        rows: 1,
        y: 2,
        x: 3,
        widget: {
          type: 'chart',
          metric: 'humidity'
        }
      }
      ];

    }
  }