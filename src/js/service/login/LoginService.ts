import type Framework7 from 'framework7'
import type LoginInterface from '../../../intefaces/Login/LoginInterface'
import toastError from '../../components/toastError'
import * as messages from '../../messages'
import { getUrl } from '../../urlGenerator'
import TokenHandler from '../TokenHandlerService'
import AuthentificationService from '../authentification/AuthentificationService'
import LoginCacheService from '../cache/LoginCacheService'
import { handleSubmitForm } from '../form/formErrorInputs'
import { loginSchema } from '../schema/login/loginSchema'

export default class LoginService {
  constructor(private app: Framework7) {}

  private _authService = new AuthentificationService()
  private _cacheService = new LoginCacheService()
  private _tokenHandler = new TokenHandler()

  public async login(formLogin: LoginInterface): Promise<void> {
    const url: URL = getUrl('/api/login')

    if (!handleSubmitForm(formLogin, loginSchema, 'form-login')) return

    this.app.preloader.show()
    await caches.delete('v1')

    const cachedResponse = await this._cacheService.getCachedResponse(url)
    if (cachedResponse) {
      this.handleSuccess()
    }

    try {
      const response: Response = await this._authService.login(
        formLogin.email,
        formLogin.password,
      )
      const data = await response.clone().json()

      if (data.code === 401) {
        toastError(this.app, 'Vos identifiants sont incorrects!')
        return
      }

      if (process.env.NODE_ENV === 'production') {
        await this._cacheService.storeInCache(url, response.clone())
      }

      await this._tokenHandler.handle(data.token)
      this.handleSuccess()
    } catch (error) {
      console.error('Login error:', error)
      this.app.dialog.alert(messages.ERROR_SERVER)
    } finally {
      this.app.preloader.hide()
    }
  }

  private handleSuccess(): void {
    this.app.views.main.router.navigate('/prestation/')
  }
}
