import { monthsEnum } from '../enum/monthEnum'

const formatDate = (date: string): string => {
  return new Date(date).toLocaleString([], {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

const getTime = (date: string): string => {
  const adjustedDate = new Date(date)
  adjustedDate.setHours(adjustedDate.getHours() - 2)

  const hours =
    adjustedDate.getHours() < 10
      ? `0${adjustedDate.getHours()}`
      : adjustedDate.getHours()

  return `${hours}:${adjustedDate.getMinutes().toString().padStart(2, '0')}`
}

const getMontYear = (date: Date | string) => {
  const adjustedDate = new Date(date)
  const month = monthsEnum.getMonths()[adjustedDate.getMonth()]

  return `${month} ${adjustedDate.getFullYear()}`
}

const toDatetimeLocalString = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export { formatDate, getTime, getMontYear, toDatetimeLocalString }
