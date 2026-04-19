import { Component, effect, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Forecast } from '../../widgets/forecast/forecast';
import { WeatherChart } from '../../widgets/weather-chart/weather-chart';
import { WeatherMap } from '../../widgets/weather-map/weather-map';
import { GridsterItem, Gridster, GridsterConfig } from 'angular-gridster2';
import { DashboardItem } from './dashboard-item.interface';
import { Weather } from '../../core/weather';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Gridster, GridsterItem, Forecast, WeatherChart, WeatherMap],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  editMode = false;
  widgetId = 0;
  constructor(private titleService: Title, private weather: Weather) {
    effect(() => {
      if (this.weather.openDef()) {
        this.dashboard = [...this.defaultDashboard];
        this.weather.openDef.set(false);
      }
      else this.dashboard = [...this.dashboard];
    })
  }
  options: GridsterConfig = {
    draggable: { enabled: false },
    resizable: { enabled: false },
    maxCols: 6 * 2,
    maxRows: 3 * 2,
    gridType: 'fit',
    outerMargin: true,
    minCols: 6 * 2,
    minRows: 3 * 2,
    ColWidth: 172 / 2,
    RowHeight: 128,
    pushItems: true,
    swap: true
  };
  dashboard: DashboardItem[] = [];
  get defaultDashboard(): DashboardItem[] {
    const city = this.weather.city();
    return [
      { cols: 8, rows: 4, y: 0, x: 0, widget: { type: 'forecast' } },
      { cols: 4, rows: 4, y: 0, x: 8, widget: { type: 'map', city, layer: 'temperature' } },
      { cols: 4, rows: 2, y: 4, x: 0, widget: { type: 'chart', metric: 'humidity' } },
      { cols: 4, rows: 2, y: 4, x: 4, widget: { type: 'chart', metric: 'temperature', period: 'week' } },
      { cols: 4, rows: 2, y: 4, x: 8, widget: { type: 'chart', metric: 'pressure', period: 'month' } },
    ];
  }
  ngOnInit() {
    this.titleService.setTitle('Weather Dashboard');
    this.dashboard = [];
  }
  private getWidgetDefaults(type: string): Partial<DashboardItem> {
    const defaults: Record<string, Partial<DashboardItem>> = {
      'map': { cols: 3, rows: 3, minItemCols: 2, minItemRows: 3 },
      'forecast': { cols: 2, rows: 2, minItemCols: 2, minItemRows: 2 },
      'chart': { cols: 2, rows: 1, minItemCols: 2, minItemRows: 1 },
    };
    return defaults[type] ?? { cols: 1, rows: 1 };
  }
  addWidget(): void {
    this.dashboard.push({
      cols: 1,
      rows: 1,
      y: 0,
      x: 0,
      ...this.getWidgetDefaults('chart'),
      widget: {
        type: 'map'
      }
    });
  }
  toggleEditMode() {
    this.editMode = !this.editMode

    this.options = {
      ...this.options,
      draggable: { enabled: this.editMode },
      resizable: { enabled: this.editMode },
    }
  }
}