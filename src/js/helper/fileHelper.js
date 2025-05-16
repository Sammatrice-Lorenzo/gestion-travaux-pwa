import { clearCache } from '../cache'

const downloadFile = async (data, nameFile) => {
  const blobUrl = window.URL.createObjectURL(data)

  const link = document.createElement('a')
  link.href = blobUrl
  link.download = nameFile

  link.style.display = 'none'
  link.click()
  await clearCache()
}

export { downloadFile }
