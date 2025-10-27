import { getMontYear } from '../helper/date.ts'
import { getDecodedToken } from '../token.js'

/**
 * @param { Date } date
 */
function sendEmail(date: Date): void {
  const token = getDecodedToken() as {
    lastname: string
    firstname: string
  }
  const user = `${token.lastname} ${token.firstname}`

  const email = 'example@domain.com'
  const subject = `Factures ${getMontYear(date)}`
  const greetings = new Date().getHours() < 20 ? 'Bonjour' : 'Bonsoir'
  const body = `\n${greetings},\n\nVeuillez trouver ci-joint les factures pour ${getMontYear(date)}.\n\nCordialement,\n${user}`
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export { sendEmail }
