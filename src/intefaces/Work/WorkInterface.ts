import type { ClientInterface } from '../Client/ClientInterface'
import type { BaseWorkInterface } from './BaseWorkInteface'

export default interface WorkInterface extends BaseWorkInterface {
  client: ClientInterface
  equipements: string[]
}
