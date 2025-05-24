import type ClientEventInterface from './ClientEventInterface'

export interface EventItemInteface {
  id: number
  title: string
  startTime: string
  endTime: string
  color: string
  client: ClientEventInterface | null
}
