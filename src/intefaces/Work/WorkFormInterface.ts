import type { BaseWorkInterface } from './BaseWorkInteface'

export default interface WorkFormInterface extends BaseWorkInterface {
  client: number
  start: string
  end: string
  equipements?: string[]
}
