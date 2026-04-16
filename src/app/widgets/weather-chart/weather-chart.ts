import { Component, ViewChild, ElementRef} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { curveNatural } from 'd3-shape';
@Component({
  selector: 'app-weather-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './weather-chart.html',
  styleUrl: './weather-chart.scss',
})

export class WeatherChart {

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  curve = curveNatural;

  view: [number, number] = [400, 300];
  ngAfterViewInit() {
    const resizeObserver = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      this.view = [rect.width, rect.height];
    });

    resizeObserver.observe(this.chartContainer.nativeElement);
  }


  data = [
    {
      "name": "Temperature",
      "series": [
        { "name": "Mon", "value": 22 },
        { "name": "Tue", "value": 20 },
        { "name": "Wed", "value": 19 },
        { "name": "Thu", "value": 21 },
        { "name": "Fri", "value": 19 },
        { "name": "Sat", "value": 21 },
        { "name": "Sun", "value": 18 }
      ]
    }
  ];
}
