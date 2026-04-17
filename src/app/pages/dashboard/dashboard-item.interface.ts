import { GridsterItem, GridsterItemConfig} from 'angular-gridster2'
import { WidgetConfig } from '../../widgets/model/widget.interface'

export interface DashboardItem extends GridsterItemConfig {
  widget: WidgetConfig
}