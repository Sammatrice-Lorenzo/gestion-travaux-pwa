import type { ClientFormInteface } from './ClientFormInteface'

export interface ClientInterface extends ClientFormInteface {
  id: number
  user: {
    id: number
  }
  name: string
}
