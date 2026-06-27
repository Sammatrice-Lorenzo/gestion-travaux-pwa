import type Framework7 from 'framework7'
import type LoginInterface from '../../../intefaces/Login/LoginInterface'
import toastError from '../../components/toastError'
import * as messages from '../../messages'
import { fetchCurrentUser } from '../SessionService'
import TokenHandler from '../TokenHandlerService'
import AuthentificationService from '../authentification/AuthentificationService'
import { handleSubmitForm } from '../form/formErrorInputs'
import { loginSchema } from '../schema/login/loginSchema'

export default class LoginService {
  constructor(private app: Framework7) {}

  private _authService = new AuthentificationService()
  private _tokenHandler = new TokenHandler()

  public async login(formLogin: LoginInterface): Promise<void> {
    if (!handleSubmitForm(formLogin, loginSchema, 'form-login')) return

    this.app.preloader.show()
    await caches.delete('v1')

    try {
      const response: Response = await this._authService.login(
        formLogin.email,
        formLogin.password,
      )

      if (response.status === 401) {
        toastError(this.app, 'Vos identifiants sont incorrects!')
        return
      }

      if (!response.ok) {
        this.app.dialog.alert(messages.ERROR_SERVER)
        return
      }

      await fetchCurrentUser()
      await this._tokenHandler.handle()
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
