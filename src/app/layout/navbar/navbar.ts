import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Weather } from '../../core/weather';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  searchQuery = '';

 constructor(public weather: Weather) {
  this.weather.fetchNavCities();
}

  search(): void {
  if (!this.searchQuery.trim()) return;
  this.weather.searchCity(this.searchQuery);
  this.weather.suggestions.set([]);
  this.searchQuery = '';
}

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.search();
  }
  onInput(): void {
  this.weather.fetchSuggestions(this.searchQuery);
}

selectSuggestion(city: string): void {
  this.searchQuery = city.split(',')[0].trim();
  this.weather.suggestions.set([]);
  this.search();
}

}
  