import { sendTokenMessaging } from '../notification'

export default class TokenHandler {
  public async handle(token: string): Promise<void> {
    localStorage.setItem('token', token)
    await sendTokenMessaging(token)
  }
}
