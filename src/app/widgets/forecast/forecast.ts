import { Component, OnInit } from '@angular/core';
import { Weather, CurrentWeather } from '../../core/weather';

@Component({
  selector: 'app-forecast',
  imports: [],
  templateUrl: './forecast.html',
  styleUrl: './forecast.scss',
})
export class Forecast implements OnInit {
  constructor(private weather: Weather) {}

  ngOnInit() {
    this.weather.fetchCurrentWeather('Warsaw');
  }

  get forecastData() {
    return this.weather.currentWeather();
  }
}
