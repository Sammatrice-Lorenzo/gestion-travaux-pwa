import { firebase } from './firebase'
import { getMessaging, getToken, onMessage  } from "firebase/messaging"

export const messaging = getMessaging(firebase)

let token = ""
export function askUserPermissionForSendANotificationPush() {

    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            getToken(messaging, {vapidKey: process.env.VAPID_KEY}).then((currentToken) => {
                if (currentToken) {
                    token = currentToken
                }
            })
        }
    }).catch((error) => {
        console.log('Error requesting permission', error)
    })
}

export function sendNotificationPushForProgression($f7) {

    const notificationTitle = 'Progression des prestations'
    const notificationOptions = {
        body: 'Veuillez mettre à jour l\'état des prestations.',
        silent: false
    }

    let notificationWithButton
    if (!notificationWithButton) {
        notificationWithButton = $f7.notification.create({
        icon: '<i class="icon icon-f7"></i>',
        title: 'Progression des prestations',
        subtitle: 'Veuillez mettre à jour l\'état des prestations.',
        text: 'Cliquer sur (x) pour fermer la notification',
        closeButton: true,
        });
    }
    // Open it
    notificationWithButton.open();

    new Notification(notificationTitle, notificationOptions)
}
