# Gestion Travaux PWA

Ce projet est une application PWA qui permet de la gestion des travaux plus précisément des prestations d'un utilisateur.

Pour utiliser cette application il faut d'abord avoir installé la partie back-end, le projet d'API.

Le projet permet de créer un utilisateur, il pourra créer ses propres clients et puis ses prestations.
On retrouve les fonctionnalités de PWA comme : Notification push, Mise en cache, adaption avec les différents systèmes d'exploitation.


Il faudra créer un fichier .env.local à la racine du projet et ajouter cette config pour les notification push (il faut avoir  déjà un projet firebase https://firebase.google.com/docs/cloud-messaging?hl=fr) :

#### Conf FIREBASE pour les notifications push :
FIREBASE_API_KEY=<"votre_api_key">

AUTH_DOMAIN_FIREBASE="<votre_doamine>"

PROJECT_ID="<votre_rid_projet">

STORAGE_BUCKET_FIREBASE="<votr_strorage>"

MESSAGING_SENDER_ID="<votre_messagin_id">

APP_ID="<votr_app_id">
VAPID_KEY="<votre_vapid_key">


## Installation projet

Dans le terminal lancer la commande suivante :
```
npm install
```
ou 
```
yarn
```
Cela permet d'installer toute les dépendances
## NPM Scripts

* 🔥 `start` - run development server
* 🔥 `start prod` - run production server
* 🔧 `dev` - run development server
* 🔧 `prod` - run production server
* 🔧 `build` - build web app for production

Pour lancer ces commande vous pouvez utiliser yarn : 
```bash
# Cette commande va lancer le serveur
yarn start
```
Si vous voulez lancer les services worker il faut taper la commande build :

```
yarn build
```

et après l'environnement de production 

```
yarn start prod
```

Pour vous connecter directement, vous pouvez utiliser les identifiants suivants : 

email : user@test.com

password : 1234
