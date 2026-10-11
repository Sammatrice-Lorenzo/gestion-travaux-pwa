import { getMontYear } from '../helper/date'
import { getCurrentUser } from '../token'

/**
 * @param { Date } date
 */
function sendEmail(date: Date): void {
  const user = getCurrentUser()
  if (!user) return

  const userName = `${user.lastname} ${user.firstname}`

  const email = 'example@domain.com'
  const subject = `Factures ${getMontYear(date)}`
  const greetings = new Date().getHours() < 20 ? 'Bonjour' : 'Bonsoir'
  const body = `\n${greetings},\n\nVeuillez trouver ci-joint les factures pour ${getMontYear(date)}.\n\nCordialement,\n${userName}`
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export { sendEmail }
