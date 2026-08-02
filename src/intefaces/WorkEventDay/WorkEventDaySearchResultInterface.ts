import type ClientEventInterface from './ClientEventInterface'

export default interface WorkEventDaySearchResultInterface {
  id: number
  title: string
  startDate: string
  endDate: string
  client: ClientEventInterface | null
}
