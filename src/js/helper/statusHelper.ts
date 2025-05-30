const getProgressColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'en cours':
      return 'orange'
    case 'terminé':
      return 'green'
    case 'annulé':
      return 'red'
    default:
      return 'gray'
  }
}

export { getProgressColor }
