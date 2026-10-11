import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import type Framework7 from 'framework7'
import type { Notification as F7Notification } from 'framework7/types'
import { firebase } from './firebase'
import RegisterTokenNotificationPushService from './service/RegisterTokenNotificationPushService'

export const messaging = getMessaging(firebase)

// Absent on iOS Safari outside an installed PWA and in some webviews
const isNotificationSupported = (): boolean => 'Notification' in window

let progressionNotification: F7Notification.Notification | null = null

const handleAskNotification = () => {
  Notification.requestPermission()
    .then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, { vapidKey: process.env.VAPID_KEY }).then(
          (currentToken) => {
            if (currentToken) {
              console.info('New token :', currentToken)
            }
          },
        )
      }
    })
    .catch((error) => {
      console.error('Error in request permission', error)
    })
}

function askUserPermissionForSendANotificationPush() {
  if (!isNotificationSupported()) return

  if (Notification.permission !== 'denied') {
    handleAskNotification()
  } else {
    console.warn('User has refused notifications')
  }
}

const sendTokenMessaging = async () => {
  if (!isNotificationSupported() || Notification.permission !== 'granted')
    return

  getToken(messaging, { vapidKey: process.env.VAPID_KEY }).then(
    async (currentToken) => {
      if (currentToken) {
        await new RegisterTokenNotificationPushService().registerToken(
          currentToken,
        )
      }
    },
  )
}

/**
 * Android Chrome and installed PWAs forbid `new Notification()`:
 * go through the service worker registration when there is one.
 */
const showSystemNotification = async (
  title: string,
  options: NotificationOptions,
): Promise<void> => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return
  }

  const registration = await navigator.serviceWorker?.getRegistration()
  if (registration) {
    await registration.showNotification(title, options)
    return
  }

  new Notification(title, options)
}

function sendNotificationPushForProgression($f7: Framework7) {
  const notificationTitle = 'Progression des prestations'
  const notificationOptions: NotificationOptions = {
    body: "Veuillez mettre à jour l'état des prestations.",
    silent: false,
    icon: `${window.location.origin}/icons/favicon.png`,
  }

  if (!progressionNotification) {
    progressionNotification = $f7.notification.create({
      icon: '<i class="icon icon-f7"></i>',
      title: notificationTitle,
      subtitle: notificationOptions.body,
      text: 'Cliquer sur (x) pour fermer la notification',
      closeButton: true,
    })
  }
  progressionNotification.open()

  showSystemNotification(notificationTitle, notificationOptions).catch(
    (error) => console.error('Error while showing notification', error),
  )
}

export {
  sendNotificationPushForProgression,
  askUserPermissionForSendANotificationPush,
  sendTokenMessaging,
}
