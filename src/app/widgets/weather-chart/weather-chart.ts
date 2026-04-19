import { Component, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { curveNatural } from 'd3-shape';
import { WidgetConfig } from '../model/widget.interface';
import { Weather } from '../../core/weather';

@Component({
  selector: 'app-weather-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './weather-chart.html',
  styleUrl: './weather-chart.scss',
})
export class WeatherChart implements OnChanges, AfterViewInit {

  @Input({ required: true }) config!: WidgetConfig;
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  constructor(private weather: Weather) {}

  curve = curveNatural;
  view: [number, number] = [400, 300];
  data: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && this.config) {
      this.weather.fetchForecast(this.config.city ?? 'Warsaw').then(() => {
        this.data = this.weather.getForecastByPeriod(
          this.config.metric ?? 'temperature',
          this.config.period ?? 'day'
        );
      });
    }
  }

  ngAfterViewInit() {
    const resizeObserver = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      this.view = [rect.width, rect.height];
    });
    resizeObserver.observe(this.chartContainer.nativeElement);
  }
  colorScheme: any = {
  domain: ['#81c2ff']
};

get yAxisLabel(): string {
  const labels: Record<string, string> = {
    temperature: '°C',
    humidity: '%',
    pressure: 'hPa'
  };
  return labels[this.config?.metric ?? 'temperature'];
}
}