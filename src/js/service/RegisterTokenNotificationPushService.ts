import { getUrl } from '../urlGenerator'
import { apiCredentials } from './SessionService'

export default class RegisterTokenNotificationPushService {
  public async registerToken(currentToken: string): Promise<void> {
    const url = getUrl('/api/token_notification_pushes')

    await fetch(url, {
      method: 'POST',
      credentials: apiCredentials,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: currentToken,
        userAgent: navigator.userAgent,
      }),
    })
  }
}
