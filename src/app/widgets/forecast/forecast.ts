import { Component } from '@angular/core';

@Component({
  selector: 'app-forecast',
  imports: [],
  templateUrl: './forecast.html',
  styleUrl: './forecast.scss',
})
export class Forecast {
  forecastData = {
    city: 'Warsaw',
    temp: 18,
    condition: 'Cloudy',
    wind: 12
  };
}
