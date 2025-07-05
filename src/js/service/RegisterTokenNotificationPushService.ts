import { getUrl } from '../urlGenerator'

export default class RegisterTokenNotificationPushService {
  public async registerToken(
    userToken: string,
    currentToken: string,
  ): Promise<void> {
    const url = getUrl('/api/token_notification_pushes')

    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: currentToken,
        userAgent: navigator.userAgent,
      }),
    })
  }
}
