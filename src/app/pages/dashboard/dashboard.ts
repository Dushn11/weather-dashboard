import { Component, effect, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Forecast } from '../../widgets/forecast/forecast';
import { WeatherChart } from '../../widgets/weather-chart/weather-chart';
import { WeatherMap } from '../../widgets/weather-map/weather-map';
import { GridsterItem, Gridster, GridsterConfig } from 'angular-gridster2';
import { DashboardItem } from './dashboard-item.interface';
import { Weather } from '../../core/weather';
import { WidgetPicker, WidgetConfig } from '../../shared/widget-picker';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Gridster, GridsterItem, Forecast, WeatherChart, WeatherMap, WidgetPicker],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  editMode = false;
  widgetPickerOpen = signal(false);
  dashboard = signal<DashboardItem[]>([]);

  constructor(private titleService: Title, private weather: Weather) {
    effect(() => {
      if (this.weather.openDef()) {
        const def = this.defaultDashboard;
        this.weather.openDef.set(false);
        this.dashboard.set(def);
        localStorage.setItem('dashboard', JSON.stringify(def));
      }
    });
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
    swap: true,
    itemChangeCallback: () => this.save(),
    itemResizeCallback: () => this.save(),
  };

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
    const saved = localStorage.getItem('dashboard');
    this.dashboard.set(saved ? JSON.parse(saved) : []);
  }
  private save() {
    localStorage.setItem('dashboard', JSON.stringify(this.dashboard()));

  }

  private getWidgetDefaults(type: string): Partial<DashboardItem> {
    const defaults: Record<string, Partial<DashboardItem>> = {
      map: { cols: 4, rows: 4, minItemCols: 3, minItemRows: 4 },
      forecast: { cols: 8, rows: 4, minItemCols: 3, minItemRows: 5 },
      chart: { cols: 4, rows: 2, minItemCols: 2, minItemRows: 2 },
    };
    return defaults[type] ?? { cols: 3, rows: 2 };
  }

  openWidgetPicker(): void {
    this.widgetPickerOpen.set(true);
  }

  onWidgetAdded(config: WidgetConfig): void {
    const city = this.weather.city();
    const defaults = this.getWidgetDefaults(config.type);
    this.dashboard.update(items => [
      ...items,
      {
        cols: (defaults as any).cols ?? 4,
        rows: (defaults as any).rows ?? 2,
        y: 0,
        x: 0,
        ...(defaults as any),
        widget: {
          ...config,
          ...(config.type === 'map' ? { city } : {}),
        },
      },
    ]);
    this.save();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.options = {
      ...this.options,
      draggable: { enabled: this.editMode },
      resizable: { enabled: this.editMode },
    };
  }
}