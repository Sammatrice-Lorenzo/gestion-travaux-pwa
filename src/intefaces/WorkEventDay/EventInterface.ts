import type ClientEventInterface from './ClientEventInterface'

export default interface EventsInterface {
  id?: number
  date: Date
  title: string
  startHours: string
  endHours: string
  color: string
  client: ClientEventInterface
}
