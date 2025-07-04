import { getUrl } from '../../urlGenerator'

export default class AuthentificationService {
  private readonly url = '/api/login'

  async login(email: string, password: string): Promise<Response> {
    return await fetch(getUrl(this.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    })
  }
}
