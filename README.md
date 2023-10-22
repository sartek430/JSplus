# Météo +

## Description

Ce projet est un site météorologique qui permet de voir la météo de la ville de votre choix, proposant un dashboard entièrement personnalisable pour chacun des utilisateurs.

De plus, les utilisateurs peuvent s'ajouter en contact afin de pouvoir visualiser le dashboard de leurs amis !

## Hébergement

Le site est hébergé sur Github Pages, via l'URL suivante : https://sartek430.github.io/MeteoPlus/

Le back est quant à lui hébergé sur FlyIO, via l'URL suivante : https://meteoplus.fly.dev/

## Projets techniques

### Frontend

Le frontend est réalisé en ReactJS, voir le wiki pour plus d'informations.

Pour lancer le projet :

```bash
cd frontend
nvm use 20.8.0
npm install
npm run dev
```

### Backend

Le backend est réalisé en NestJS, voir le wiki pour plus d'informations.

Pour lancer le projet :

```bash
cd backend
nvm use 20.8.0
npm install
npm run start:dev
```

#### Base de données

La base de données est en MySQL, voici les différentes tables :

- users
- widget
- invits
- contacts

Pour voir leur structure, voir le code en back-end via les fichiers `entity` au sein de chaque module.

## Auteurs

| Prénom | Rôle                  |
| ------ | --------------------- |
| Hugo   | Développeur Front-end |
| Yan    | Développeur Front-end |
| Jules  | Développeur Fullstack |
