import { Component, OnInit, AfterViewInit, Input, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { WidgetConfig } from '../model/widget.interface';

@Component({
  selector: 'app-weather-map',
  standalone: true,
  imports: [],
  templateUrl: './weather-map.html',
  styleUrl: './weather-map.scss',
})
export class WeatherMap implements AfterViewInit, OnDestroy {
  @Input() config!: WidgetConfig;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: L.Map;
  private marker!: L.Marker;

  private defaultCenter: L.LatLngExpression = [51.505, -0.09]; // Default to London
  private defaultZoom = 10;

  ngAfterViewInit(): void {
    this.initMap();
  }
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView(this.defaultCenter, this.defaultZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Добавляем маркер, если указан город
    if (this.config?.city) {
      this.addMarkerForCity(this.config.city);
    }
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }
   private async addMarkerForCity(city: string): Promise<void> {
    try {
      // Получаем координаты города через Nominatim API (OpenStreetMap)
      const coordinates = await this.getCityCoordinates(city);
      
      if (coordinates) {
        // Удаляем старый маркер если есть
        if (this.marker) {
          this.marker.remove();
        }
        
        // Добавляем новый маркер
        this.marker = L.marker(coordinates).addTo(this.map);
        
        // Добавляем всплывающее окно
        this.marker.bindPopup(`<b>${city}</b>`).openPopup();
        
        // Центрируем карту на маркере
        this.map.setView(coordinates, this.defaultZoom);
      }
    } catch (error) {
      console.error('Error adding marker for city:', city, error);
    }
  }
  private async getCityCoordinates(city: string): Promise<L.LatLngExpression | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data && data[0]) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }
   updateCity(city: string): void {
    if (city && this.map) {
      this.addMarkerForCity(city);
    }
  }
}
