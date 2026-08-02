import type Framework7 from 'framework7'
import { clearCache } from '../cache'
import { getUrl, getUrlUser } from '../urlGenerator'

export type CurrentUser = {
  id: number
  email: string
  firstname: string
  lastname: string
}

let currentUser: CurrentUser | null = null

export const apiCredentials: RequestCredentials = 'include'

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await fetch(getUrlUser(), {
      method: 'GET',
      credentials: apiCredentials,
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      currentUser = null
      return null
    }

    currentUser = (await response.json()) as CurrentUser
    return currentUser
  } catch (error) {
    console.error('Session error:', error)
    currentUser = null
    return null
  }
}

export function isAuthenticated(): boolean {
  return currentUser !== null
}

export function getCurrentUser(): CurrentUser | null {
  return currentUser
}

export function clearSession(): void {
  currentUser = null
}

export async function logout(app: Framework7): Promise<void> {
  try {
    await fetch(getUrl('/api/logout'), {
      method: 'POST',
      credentials: apiCredentials,
    })
  } catch (error) {
    console.error('Logout error:', error)
  }

  clearSession()

  if (process.env.NODE_ENV === 'production') {
    await clearCache()
  }

  app.views.main.router.navigate('/', {
    clearPreviousHistory: true,
    animate: false,
  })
}
