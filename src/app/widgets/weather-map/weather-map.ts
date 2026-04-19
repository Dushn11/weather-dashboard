import { Component, AfterViewInit, Input, OnDestroy, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { WidgetConfig } from '../model/widget.interface';
import { Weather } from '../../core/weather';

@Component({
  selector: 'app-weather-map',
  standalone: true,
  imports: [],
  templateUrl: './weather-map.html',
  styleUrl: './weather-map.scss',
})
export class WeatherMap implements AfterViewInit, OnDestroy, OnChanges {
  @Input() editMode: boolean = false;
  @Input() config!: WidgetConfig;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: L.Map;
  private marker!: L.Marker;
  private weatherLayer!: L.TileLayer;
  private resizeObserver!: ResizeObserver;

  private defaultCenter: L.LatLngExpression = [51.505, -0.09];
  private defaultZoom = 10;

  private weatherLayers: Record<string, string> = {
    temperature: 'temp_new',
    wind: 'wind_new',
    humidity: 'humidity_new',
    clouds: 'clouds_new',
    precipitation: 'precipitation_new'
  };

  constructor(private weather: Weather) {}

  ngAfterViewInit(): void {
    this.initMap();
    requestAnimationFrame(() => this.map.invalidateSize());
    this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.map) {
      if (this.config?.city) {
        this.addMarkerForCity(this.config.city);
        this.weather.fetchCurrentWeather(this.config.city);
      }
      if (this.config?.layer) {
        this.setWeatherLayer(this.config.layer);
      }
    }
  }

  private initMap(): void {
    (this.mapContainer.nativeElement as HTMLElement).innerHTML = '';
    if (this.map) this.map.remove();

    this.map = L.map(this.mapContainer.nativeElement).setView(this.defaultCenter, this.defaultZoom);

   L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri',
  maxZoom: 20,
}).addTo(this.map);

    if (this.config?.city) {
      this.addMarkerForCity(this.config.city);
      this.weather.fetchCurrentWeather(this.config.city);
    }

    if (this.config?.layer) {
      this.setWeatherLayer(this.config.layer);
    }
  }

  private setWeatherLayer(type: string): void {
    if (!this.map) return;
    this.weatherLayer?.remove();

    const layerName = this.weatherLayers[type];
    if (!layerName) return;

    this.weatherLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${this.weather.apiKey}`,
      { opacity: 0.9, zIndex: 2 }
    ).addTo(this.map);
  }

  private async addMarkerForCity(city: string): Promise<void> {
    try {
      const coords = await this.getCityCoordinates(city);
      if (!coords) return;
      this.marker?.remove();
      this.marker = L.marker(coords).addTo(this.map);
      this.marker.bindPopup(`<b>${city}</b>`).openPopup();
      this.map.setView(coords, this.defaultZoom);
    } catch (e) {
      console.error('Marker error:', e);
    }
  }

  private async getCityCoordinates(city: string): Promise<L.LatLngExpression | null> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`
      );
      const data = await res.json();
      if (data?.[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      return null;
    } catch (e) {
      return null;
    }
  }

  updateCity(city: string): void {
    if (city && this.map) {
      this.addMarkerForCity(city);
      this.weather.fetchCurrentWeather(city);
    }
  }
}