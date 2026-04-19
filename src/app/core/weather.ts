import { Injectable, signal } from '@angular/core';

export interface CurrentWeather {
  city: string;
  temp: number;
  condition: string;
  wind: number;
  humidity: number;
  pressure: number;
  icon: string;
}

export interface ForecastPoint {
  time: string;
  temp: number;
  humidity: number;
  pressure: number;
}

@Injectable({
  providedIn: 'root',
})
export class Weather {
  apiKey = '05728feb27db86f639c44f18255febcd';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  // Сигналы
  openDef = signal(false);
  city = signal('Warsaw');
  currentWeather = signal<CurrentWeather | null>(null);
  forecast = signal<ForecastPoint[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  OpenDefault() {
    this.openDef.set(true);
  }

  async fetchCurrentWeather(city: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();

      this.currentWeather.set({
        city: data.name,
        temp: Math.round(data.main.temp),
        condition: data.weather[0].description,
        wind: data.wind.speed,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        icon: data.weather[0].icon
      });
      this.city.set(data.name);
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }

  async fetchForecast(city: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await fetch(
        `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();

      this.forecast.set(
        data.list.map((item: any) => ({
          time: item.dt_txt,
          temp: Math.round(item.main.temp),
          humidity: item.main.humidity,
          pressure: item.main.pressure,
        }))
      );
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }

  getForecastByPeriod(metric: 'temperature' | 'humidity' | 'pressure', period: 'day' | 'week' | 'month') {
  const all = this.forecast();
  const metricKey: Record<string, keyof ForecastPoint> = {
    'temperature': 'temp',
    'humidity': 'humidity',
    'pressure': 'pressure'
  };
  const key = metricKey[metric];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let points = all;

  if (period === 'day') {
    points = all.slice(0, 8); // 24ч
  } else if (period === 'week') {
    // одна точка в день — ближайшая к 12:00
    const byDay: Record<string, any> = {};
    all.forEach(point => {
      const date = new Date(point.time);
      const dateKey = point.time.slice(0, 10); // "2026-04-19"
      const hours = date.getHours();
      if (!byDay[dateKey] || Math.abs(hours - 12) < Math.abs(new Date(byDay[dateKey].time).getHours() - 12)) {
        byDay[dateKey] = point;
      }
    });
    points = Object.values(byDay);
  } else {
    points = all;
  }

  return [{
    name: metric,
    series: points.map(point => {
      const date = new Date(point.time);
      const day = dayNames[date.getDay()];
      const dateNum = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');

      let label: string;
      if (period === 'day') label = `${hours}:00`;
      else label = `${day} ${dateNum}`;

      return { name: label, value: point[key] as number };
    })
  }];
}
suggestions = signal<string[]>([]);

async fetchSuggestions(query: string): Promise<void> {
  if (query.length < 2) {
    this.suggestions.set([]);
    return;
  }
  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`
    );
    const data = await res.json();
    this.suggestions.set(data.map((item: any) => 
      item.country ? `${item.name}, ${item.country}` : item.name
    ));
  } catch (e) {
    this.suggestions.set([]);
  }
}
async searchCity(city: string): Promise<void> {
  this.city.set(city);
  await Promise.all([
    this.fetchCurrentWeather(city),
    this.fetchForecast(city)
  ]);
  this.openDef.set(true); // триггерит сброс дашборда
}
navCities = signal<CurrentWeather[]>([]);

async fetchNavCities(): Promise<void> {
  const cities = ['Krakow', 'Warsaw', 'Gdansk', 'Katowice'];
  const results = await Promise.all(
    cities.map(city => 
      fetch(`${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`)
        .then(r => r.json())
        .then(data => ({
          city: data.name,
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description,
          wind: data.wind.speed,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          icon: data.weather[0].icon
        }))
    )
  );
  this.navCities.set(results);
}
}