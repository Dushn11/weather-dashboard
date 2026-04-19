export interface WidgetConfig {
  type: 'chart' | 'map' | 'forecast'
  metric?: 'temperature' | 'humidity' | 'pressure'
  period?: 'day' | 'week' | 'month'
  city?: string
  zoom?: number;
   layer?: 'temperature' | 'wind' | 'humidity' | 'clouds' | 'precipitation';
}