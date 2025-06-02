import { ProgressionEnum } from '../enum/ProgressionEnum'

const getProgressColor = (status: string): string => {
  switch (status) {
    case ProgressionEnum.IN_PROGRESS:
      return 'orange'
    case ProgressionEnum.DONE:
      return 'green'
    default:
      return 'gray'
  }
}

export { getProgressColor }
