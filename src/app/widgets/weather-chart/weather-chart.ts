import { Component, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { curveNatural } from 'd3-shape';
import { WidgetConfig } from '../model/widget.interface';
@Component({
  selector: 'app-weather-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './weather-chart.html',
  styleUrl: './weather-chart.scss',
})

export class WeatherChart implements OnChanges { 

  @Input({required: true})   config!: WidgetConfig;

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  curve = curveNatural;

  view: [number, number] = [400, 300];
  metricNames = {
    temperature: 'Temperature',
    humidity: 'Humidity',
    pressure: 'Pressure'
  };
  ngOnChanges(changes: SimpleChanges) {
  if (changes['config'] && this.config) {
    this.setChartData();
  }
}
  ngAfterViewInit() {
    const resizeObserver = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      this.view = [rect.width, rect.height];
    });

    resizeObserver.observe(this.chartContainer.nativeElement);

   if (this.config) this.setChartData();
  }

  data = [
    {
      "name": "",
      "series": [
        { "name": "Mon", "value": 22 },
        { "name": "Tue", "value": 20 },
        { "name": "Wed", "value": 19 },
        { "name": "Thu", "value": 21 },
        { "name": "Fri", "value": 19 },
        { "name": "Sat", "value": 21 },
        { "name": "Sun", "value": 18 }
      ]
    }];
  setChartData() {
    
  const name = this.metricNames[
    this.config.metric || 'temperature'
  ];

  this.data = [
    {
      name: name,
      series: [
        { name: "Mon", value: 22 },
        { name: "Tue", value: 20 },
        { name: "Wed", value: 19 },
        { name: "Thu", value: 21 },
        { name: "Fri", value: 19 },
        { name: "Sat", value: 21 },
        { name: "Sun", value: 18 }
      ]
    }
  ];
  }
}
