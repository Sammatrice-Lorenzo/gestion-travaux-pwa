import { sendTokenMessaging } from '../notification'

export default class TokenHandler {
  public async handle(): Promise<void> {
    await sendTokenMessaging()
  }
}
