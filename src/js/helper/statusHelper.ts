import { ProgressionEnum } from '../enum/ProgressionEnum'

const getProgressColor = (status: string): string => {
  switch (status) {
    case ProgressionEnum.IN_PROGRESS:
      return 'bg-color-orange'
    case ProgressionEnum.DONE:
      return 'bg-color-green'
    default:
      return 'bg-color-red'
  }
}

export { getProgressColor }
