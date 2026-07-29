import type ClientEventInterface from './ClientEventInterface'

export default interface WorkEventDayInterface {
  id: number
  title: string
  startDate: string
  endDate: string
  color: string
  client?: ClientEventInterface | null
}
