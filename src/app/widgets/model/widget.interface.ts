export interface WidgetConfig {
  type: 'chart' | 'map' | 'forecast'
  metric?: 'temperature' | 'humidity' | 'pressure'
  period?: 'day' | 'week' | 'month'
  city?: string
}