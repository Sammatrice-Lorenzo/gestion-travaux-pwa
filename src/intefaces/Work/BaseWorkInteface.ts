import type { ProgressionEnum } from '../../js/enum/ProgressionEnum'

export interface BaseWorkInterface {
  name: string
  city: string
  progression: ProgressionEnum
  totalAmount: number
  start: string | Date
  end: string | Date
}
