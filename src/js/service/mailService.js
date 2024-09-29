import { getMontYear } from "../date"
import { getDecodedToken } from "../token"

/**
 * @param { Date } date 
 */
function sendEmail(date) {
    const token = getDecodedToken()
    const user = `${token.lastname} ${token.firstname}`

    const email = "example@domain.com"
    const subject = `Factures ${getMontYear(date)}`
    const greetings = (new Date()).getHours() < 20 ? 'Bonjour' : 'Bonsoir' 
    const body = `
    ${greetings},
    
    Veuillez trouver ci-jointes les factures pour ${getMontYear(date)}.
    
    Cordialement,
    ${user}
    `
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export { sendEmail }