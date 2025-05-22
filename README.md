# 🚧 Gestion Travaux PWA

Gestion Travaux PWA est une application web progressive (PWA) développée avec Framework7 et JavaScript, permettant de gérer les prestations de travaux d’un utilisateur. Elle offre une expérience mobile moderne avec des fonctionnalités comme les notifications push, la mise en cache hors ligne et l'adaptation multi-plateformes.

# 📦 Fonctionnalités

- Création et gestion d’un compte utilisateur

- Gestion des clients et des prestations associées

- Support complet PWA :
    - Mise en cache des pages et données

    - Compatible avec les systèmes iOS, Android et desktop


# 🧩 Prérequis

### Avant d’utiliser cette application, vous devez :
- Installer et configurer l’API back-end nécessaire au fonctionnement.

- Créer un projet Firebase pour activer les notifications push. Suivez la documentation officielle ici : Firebase Cloud Messaging

### Créez un fichier .env.local à la racine du projet et ajoutez les clés de configuration suivantes :

FIREBASE_API_KEY="<votre_api_key>"
AUTH_DOMAIN_FIREBASE="<votre_domaine>"
PROJECT_ID="<votre_id_projet>"
STORAGE_BUCKET_FIREBASE="<votre_storage_bucket>"
MESSAGING_SENDER_ID="<votre_messaging_id>"
APP_ID="<votre_app_id>"
VAPID_KEY="<votre_vapid_key>"

🚀 Installation du projet

### Installez les dépendances via npm ou yarn :

npm install ou yarn

## 🛠️ Scripts disponibles
Script	Description

```yarn dev```	# Démarre le serveur en mode développement

```yarn build``` # Compile l'application pour la production

```yarn start``` # Lance le serveur (mode développement)```

```yarn start prod``` # Lance l'application en production

## Démarrer le projet en mode développement
```yarn start```

## Construire l'application pour la production
```yarn build```

## Démarrer l'application en mode production
```yarn start prod```


# 📱 Technologies utilisées

- Framework7 (UI mobile-friendly)

- JavaScript (ES6+)

- Firebase Cloud Messaging

- PWA (Service Worker, Cache API)