# Documentation Complète du Microservice Séances

## Introduction

Ce document fournit une documentation complète du microservice de gestion des séances de cinéma, incluant son architecture, ses fonctionnalités, les technologies utilisées et les décisions de conception.

## Contexte du Projet

Ce microservice fait partie d'une architecture logicielle plus large pour la gestion d'un système de cinéma. Il est spécifiquement responsable de la gestion des séances de cinéma et des salles associées. Le service expose une API REST pour créer, lire, modifier et supprimer des salles et des séances.

## Architecture Globale

### Schéma d'Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                     Microservice Séances                        │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌───────────────────┐  │
│  │  API REST   │    │  Base de    │    │  Autres           │  │
│  │  (Express)  │◄───►│  Données    │    │  Microservices   │  │
│  │             │    │  (MySQL)    │    │  (Films, etc.)    │  │
│  └─────────────┘    └─────────────┘    └───────────────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Rôle dans l'Écosystème

Ce microservice:
- Gère les données des salles de cinéma (numéro, capacité, type)
- Gère les séances de cinéma (date, film, salle, prix)
- Permet la réservation de places pour les séances
- Fournit des endpoints pour l'intégration avec d'autres services

## Technologies Utilisées

### Backend

**Node.js avec Express**
- **Pourquoi ?** : Node.js est choisi pour sa rapidité de développement et sa capacité à gérer des requêtes asynchrones efficacement. Express est le framework web standard pour Node.js, offrant une structure minimaliste et flexible.
- **Version** : Node.js (version définie par l'environnement), Express ^4.22.1

### Base de Données

**MySQL avec Sequelize ORM**
- **Pourquoi MySQL ?** : MySQL est un système de gestion de base de données relationnelle mature, largement utilisé et bien adapté pour les applications transactionnelles comme un système de réservation.
- **Pourquoi Sequelize ?** : Sequelize est un ORM (Object-Relational Mapping) pour Node.js qui permet de travailler avec des bases de données relationnelles en utilisant des objets JavaScript. Il offre des fonctionnalités comme les migrations, les associations entre modèles et la gestion des transactions.
- **Versions** : mysql2 ^3.16.0, sequelize ^6.37.7

### Middleware et Utilitaires

- **CORS** : Pour permettre les requêtes cross-origin, essentiel pour une API accessible depuis différents clients web.
- **Morgan** : Pour le logging des requêtes HTTP, utile pour le débogage et le monitoring.
- **Dotenv** : Pour la gestion des variables d'environnement, permettant une configuration flexible selon les environnements (développement, production, test).
- **Cookie-parser** : Pour la gestion des cookies, bien que peu utilisé dans ce microservice.

### Outils de Développement

- **Nodemon** : Pour le rechargement automatique du serveur pendant le développement.
- **Docker** : Pour la conteneurisation de l'application et de la base de données, assurant une portabilité et une cohérence entre les environnements.

## Structure du Projet

```
.
├── bin/
│   └── www                  # Point d'entrée du serveur
├── src/
│   ├── config/             # Configuration de la base de données
│   ├── controllers/        # Logique métier des endpoints
│   ├── middleware/         # Middleware Express
│   ├── models/             # Modèles Sequelize
│   ├── routes/             # Définition des routes
│   ├── utils/              # Classes utilitaires
│   └── validators/         # Validation des requêtes
├── .env.example            # Exemple de fichier d'environnement
├── app.js                  # Configuration principale de l'application
├── docker-compose.yml      # Configuration Docker Compose
├── Dockerfile              # Configuration Docker
├── package.json            # Dépendances et scripts
└── README.md               # Documentation de base
```

## Modèles de Données

### Modèle Room (Salle)

```javascript
Room {
  id: INTEGER (PK, auto-incrément)
  room_number: INTEGER (unique, obligatoire)
  seat_number: INTEGER (nombre de places)
  room_type: STRING (optionnel, ex: "IMAX", "3D")
}
```

**Relations** : Une salle peut avoir plusieurs séances (relation One-to-Many avec Show).

### Modèle Show (Séance)

```javascript
Show {
  id: INTEGER (PK, auto-incrément)
  date: DATE (date et heure de la séance)
  price: FLOAT (prix du billet)
  id_movie: INTEGER (référence logique vers le microservice Films)
  id_room: INTEGER (FK vers Room.id)
  seats_taken: INTEGER (nombre de places réservées, par défaut 0)
}
```

**Relations** : Une séance appartient à une salle (relation Many-to-One avec Room).

## Endpoints API

### Endpoints pour les Salles (Room)

| Méthode | Route               | Description                          | Validation                          |
|---------|---------------------|--------------------------------------|-------------------------------------|
| GET     | `/api/room`         | Liste toutes les salles              | -                                   |
| GET     | `/api/room/:id`     | Détails d'une salle spécifique       | `id` doit être un entier positif    |
| POST    | `/api/room`         | Crée une nouvelle salle              | `room_number`, `seat_number` requis |
| PUT     | `/api/room/:id`     | Modifie une salle                    | `id` doit être un entier positif    |
| DELETE  | `/api/room/:id`     | Supprime une salle                   | `id` doit être un entier positif    |

### Endpoints pour les Séances (Show)

| Méthode | Route                          | Description                              | Validation                          |
|---------|--------------------------------|------------------------------------------|-------------------------------------|
| GET     | `/api/show`                    | Liste toutes les séances                  | -                                   |
| GET     | `/api/show/:id`                | Détails d'une séance spécifique           | `id` doit être un entier positif    |
| GET     | `/api/show/room/:id_room`      | Liste les séances pour une salle          | `id_room` doit être un entier positif|
| POST    | `/api/show`                    | Crée une nouvelle séance                  | `date`, `price`, `id_movie`, `id_room` requis |
| POST    | `/api/show/:id/reserve`        | Réserve des places pour une séance        | `id` doit être un entier positif    |
| PUT     | `/api/show/:id`                | Modifie une séance                        | `id` doit être un entier positif    |
| PATCH   | `/api/show/:id`                | Modifie partiellement une séance          | `id` doit être un entier positif    |
| DELETE  | `/api/show/:id`                | Supprime une séance                       | `id` doit être un entier positif    |

## Fonctionnalités Clés

### Gestion des Salles

- **Création** : Permet d'ajouter une nouvelle salle avec un numéro unique, un nombre de places et un type optionnel.
- **Modification** : Permet de mettre à jour les informations d'une salle existante.
- **Suppression** : Permet de supprimer une salle de la base de données.
- **Liste** : Fournit une liste de toutes les salles disponibles.

### Gestion des Séances

- **Création** : Permet de créer une nouvelle séance en spécifiant la date, le prix, le film (via `id_movie`) et la salle.
- **Modification** : Permet de mettre à jour les informations d'une séance existante.
- **Suppression** : Permet de supprimer une séance de la base de données.
- **Liste** : Fournit une liste de toutes les séances, avec la possibilité de filtrer par salle.

### Réservation de Places

- **Fonctionnement** : L'endpoint `POST /api/show/:id/reserve` permet de réserver un certain nombre de places pour une séance. Il vérifie que la salle a suffisamment de places disponibles et met à jour le compteur `seats_taken`.
- **Gestion des Conflits** : Si le nombre de places demandées dépasse la capacité de la salle, une erreur 409 est retournée.
- **Transactions** : La réservation utilise une transaction de base de données pour garantir l'intégrité des données.

## Gestion des Erreurs

### Classes d'Erreurs

- **AppError** : Classe de base pour les erreurs applicatives, avec un code de statut et un message.
- **ApiError** : Classe pour les erreurs de validation des requêtes, incluant des détails sur les erreurs de validation.

### Middleware de Gestion des Erreurs

Le middleware `errorHandler` intercept les erreurs et retourne une réponse JSON standardisée :

```json
{
  "status": "fail" | "error",
  "message": "Message d'erreur"
}
```

### Exemples d'Erreurs

- **400 Bad Request** : Requête invalide (champs manquants, format incorrect).
- **404 Not Found** : Ressource non trouvée (salle ou séance inexistante).
- **409 Conflict** : Conflit de réservation (places insuffisantes).
- **500 Internal Server Error** : Erreur serveur.

## Validation des Requêtes

Le projet utilise `express-validator` pour valider les requêtes entrantes. Les validations sont définies dans le dossier `src/validators/` et appliquées via le middleware `validateRequest`.

### Exemples de Validation

- **Création d'une Salle** : Vérifie que `room_number` et `seat_number` sont des entiers positifs.
- **Création d'une Séance** : Vérifie que `date` est au format ISO-8601 et que `id_movie` et `id_room` sont des entiers positifs.

## Configuration et Environnement

### Variables d'Environnement

| Variable      | Description                          | Valeur par Défaut  |
|---------------|--------------------------------------|--------------------|
| DB_NAME       | Nom de la base de données            | microservice       |
| DB_USER       | Utilisateur de la base de données    | app                |
| DB_PASSWORD   | Mot de passe de la base de données   | app                |
| DB_HOST       | Hôte de la base de données           | db                 |
| DB_PORT       | Port de la base de données           | 3306               |
| PORT          | Port de l'API                        | 3000               |
| NODE_ENV      | Environnement                        | development        |

### Configuration de la Base de Données

La configuration de la base de données est définie dans `src/config/database.js` et utilise Sequelize pour se connecter à MySQL. Au démarrage, l'application effectue une authentification et une synchronisation des modèles avec la base de données (`sequelize.sync({ alter: true })`).

## Docker et Déploiement

### Dockerfile

Le `Dockerfile` définit l'image Docker pour l'application :

- Utilise l'image `node:latest` comme base.
- Copie les fichiers de l'application.
- Installe les dépendances avec `yarn install`.
- Expose le port 3000.
- Lance l'application avec `yarn start`.

### Docker Compose

Le fichier `docker-compose.yml` définit deux services :

1. **API** : Le service de l'application, accessible sur le port 3300.
2. **DB** : Le service MySQL, accessible sur le port 3307.

Pour lancer l'application avec Docker Compose :

```bash
docker compose up --build
```

## Bonnes Pratiques et Décisions de Conception

### Utilisation des Transactions

Les opérations critiques, comme la réservation de places, utilisent des transactions de base de données pour garantir l'intégrité des données. Cela évite les problèmes de concurrence et assure que les opérations sont atomiques.

### Validation des Requêtes

La validation des requêtes est centralisée dans des fichiers dédiés (`validators/`) et appliquée via un middleware. Cela permet une séparation claire des préoccupations et une réutilisation facile des règles de validation.

### Gestion des Erreurs

La gestion des erreurs est standardisée via un middleware dédié, assurant que toutes les erreurs sont traitées de manière cohérente et que les réponses d'erreur sont formatées uniformément.

### Utilisation des Modèles Sequelize

Les modèles Sequelize sont définis de manière claire et concise, avec des associations explicites entre les modèles. Cela facilite la maintenance et l'évolution du schéma de la base de données.

### Documentation

Le projet inclut une documentation de base dans le `README.md`, qui est complétée par ce document. La documentation est essentielle pour la maintenance et l'intégration avec d'autres services.

## Points d'Amélioration

### Incohérences dans le Modèle

- **Champ `price`** : Le contrôleur exige un champ `price` lors de la création d'une séance, mais le modèle Sequelize ne déclare pas ce champ. Cela peut entraîner des problèmes de persistance.
- **Champ `seats_taken`** : La réservation utilise `seats_taken`, mais ce champ n'est pas déclaré dans le modèle `Show` (bien qu'il soit présent dans le code lu).

### Suggestions d'Amélioration

1. **Corriger les Incohérences** : Assurer que tous les champs utilisés dans les contrôleurs sont déclarés dans les modèles Sequelize.
2. **Ajouter des Tests** : Implémenter des tests unitaires et d'intégration pour garantir la fiabilité du code.
3. **Améliorer la Documentation** : Ajouter des exemples de requêtes et de réponses pour chaque endpoint.
4. **Sécurité** : Ajouter des mécanismes d'authentification et d'autorisation pour sécuriser l'API.
5. **Monitoring** : Intégrer des outils de monitoring pour suivre les performances et les erreurs en production.

## Conclusion

Ce microservice de gestion des séances de cinéma est une application bien structurée, utilisant des technologies modernes et des bonnes pratiques de développement. Il offre une API REST complète pour la gestion des salles et des séances, avec des fonctionnalités avancées comme la réservation de places. Bien qu'il y ait quelques incohérences mineures à corriger, le projet est solide et prêt à être intégré dans un écosystème plus large de microservices.

## Annexes

### Exemples de Requêtes

#### Créer une Salle

```bash
POST /api/room
Content-Type: application/json

{
  "room_number": 1,
  "seat_number": 120,
  "room_type": "IMAX"
}
```

#### Créer une Séance

```bash
POST /api/show
Content-Type: application/json

{
  "date": "2024-10-01T20:00:00.000Z",
  "price": 12.5,
  "id_movie": 5,
  "id_room": 1
}
```

#### Réserver des Places

```bash
POST /api/show/1/reserve
Content-Type: application/json

{
  "seats": 2
}
```

### Exemples de Réponses

#### Liste des Salles

```json
[
  {
    "id": 1,
    "room_number": 1,
    "seat_number": 120,
    "room_type": "IMAX"
  }
]
```

#### Détails d'une Séance

```json
{
  "id": 1,
  "date": "2024-10-01T20:00:00.000Z",
  "price": 12.5,
  "id_movie": 5,
  "id_room": 1,
  "seats_taken": 0,
  "Room": {
    "id": 1,
    "room_number": 1,
    "seat_number": 120,
    "room_type": "IMAX"
  }
}
```

#### Erreur de Validation

```json
{
  "status": "fail",
  "message": "Room number must be a positive integer"
}
```

### Commandes Utiles

#### Lancer en Local

```bash
yarn install
yarn dev
```

#### Lancer en Production

```bash
yarn start
```

#### Build Docker

```bash
docker build -t microservice-seance .
```

#### Run Docker

```bash
docker run --rm -p 3000:3000 \
  -e DB_NAME=seance_db \
  -e DB_USER=root \
  -e DB_PASSWORD=secret \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  microservice-seance
```

## Historique des Commits

D'après l'historique Git, les commits récents incluent :

- Ajout de la réservation de places pour les séances
- Ajout de l'attribut `price`
- Fusion de branches et corrections mineures

## Auteurs et Contributions

Ce document a été généré automatiquement par Mistral Vibe, un agent d'IA, basé sur l'analyse du code source du projet.

## Licence

Le projet est privé et n'inclut pas de licence open source dans le fichier `package.json`.

---

Fin du document. Pour toute question ou clarification, veuillez consulter le code source ou contacter l'équipe de développement.