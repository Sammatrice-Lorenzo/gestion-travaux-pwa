import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { firebase } from './firebase'
import RegisterTokenNotificationPushService from './service/RegisterTokenNotificationPushService'

export const messaging = getMessaging(firebase)

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
  if (Notification.permission !== 'denied') {
    handleAskNotification()
  } else {
    console.warn('User has refused notifications')
  }
}

const sendTokenMessaging = async (userToken) => {
  if (Notification.permission !== 'granted') return

  getToken(messaging, { vapidKey: process.env.VAPID_KEY }).then(
    async (currentToken) => {
      if (currentToken) {
        await new RegisterTokenNotificationPushService().registerToken(
          userToken,
          currentToken,
        )
      }
    },
  )
}

function sendNotificationPushForProgression($f7) {
  const notificationTitle = 'Progression des prestations'
  const notificationOptions = {
    body: "Veuillez mettre à jour l'état des prestations.",
    silent: false,
    icon: `${window.location.hostname}/icons/favicon.png`,
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

export {
  sendNotificationPushForProgression,
  askUserPermissionForSendANotificationPush,
  sendTokenMessaging,
}
