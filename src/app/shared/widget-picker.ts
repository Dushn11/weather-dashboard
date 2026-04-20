import { Component, EventEmitter, input, Output } from '@angular/core';

export interface WidgetConfig {
  type: 'forecast' | 'chart' | 'map';
  metric?: string;
  period?: string;
  layer?: string;
  city?: string;
}

@Component({
  selector: 'app-widget-picker',
  standalone: true,
  templateUrl: './widget-picker.html',
  styleUrl: './widget-picker.scss',
})
export class WidgetPicker {
    isOpen = input(false); 
  @Output() closed = new EventEmitter<void>();
  @Output() widgetAdded = new EventEmitter<WidgetConfig>();

  selected: string | null = null;
  chartMetric = 'temperature';
  chartPeriod = 'week';
  mapLayer = 'temperature';

  widgets = [
    {
      type: 'forecast',
      label: 'Forecast',
      icon: 'fas fa-cloud-sun',
      desc: 'Current weather & daily overview',
    },
    {
      type: 'chart',
      label: 'Chart',
      icon: 'fas fa-chart-line',
      desc: 'Temp, humidity or pressure graph',
    },
    {
      type: 'map',
      label: 'Map',
      icon: 'fas fa-map',
      desc: 'Weather layer map',
    },
  ];

  metrics = [
    { value: 'temperature', label: 'Temperature' },
    { value: 'humidity', label: 'Humidity' },
    { value: 'pressure', label: 'Pressure' },
  ];

  periods = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  layers = [
    { value: 'temperature', label: 'Temperature' },
    { value: 'precipitation', label: 'Precipitation' },
    { value: 'wind', label: 'Wind' },
    { value: 'clouds', label: 'Clouds' },
  ];

  select(type: string) {
    this.selected = type;
  }

  close() {
    this.selected = null;
    this.closed.emit();
  }

  confirm() {
    if (!this.selected) return;

    const config: WidgetConfig = { type: this.selected as any };
    if (this.selected === 'chart') {
      config.metric = this.chartMetric;
      config.period = this.chartPeriod;
    }
    if (this.selected === 'map') {
      config.layer = this.mapLayer;
    }

    this.widgetAdded.emit(config);
    this.close();
  }
}
