import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { firebase } from './firebase'

export const messaging = getMessaging(firebase)

const handleAskNotification = () => {
  Notification.requestPermission()
    .then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, { vapidKey: process.env.VAPID_KEY }).then(
          (currentToken) => {
            if (currentToken) {
              console.info('Nouveau token obtenu :', currentToken)
            }
          },
        )
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la demande de permission', error)
    })
}

const sendNotification = () => {
  getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY }).then(
    (currentToken) => {
      if (!currentToken) throw new Error('Aucun token Firebase')
      console.info('Token FCM :', currentToken)
    },
  )
}

export function askUserPermissionForSendANotificationPush() {
  if (Notification.permission === 'granted') {
    sendNotification()
  } else if (Notification.permission !== 'denied') {
    handleAskNotification()
  } else {
    console.warn('User has refused notifications')
  }
}

export function sendNotificationPushForProgression($f7) {
  const notificationTitle = 'Progression des prestations'
  const notificationOptions = {
    body: "Veuillez mettre à jour l'état des prestations.",
    silent: false,
  }

  let notificationWithButton
  if (!notificationWithButton) {
    notificationWithButton = $f7.notification.create({
      icon: '<i class="icon icon-f7"></i>',
      title: 'Progression des prestations',
      subtitle: "Veuillez mettre à jour l'état des prestations.",
      text: 'Cliquer sur (x) pour fermer la notification',
      closeButton: true,
    })
  }
  // Open it
  notificationWithButton.open()

  new Notification(notificationTitle, notificationOptions)
}
