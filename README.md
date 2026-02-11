# Microservice Seance

Microservice 3 du projet "Architecture logicielle" : gestion des seances de cinema et des salles associees. Ce service expose une API REST pour creer, lister, modifier et supprimer des salles et des seances. Les seances referencent un film via `id_movie` (reference logique vers le microservice Films).

## Fonctionnalites
- CRUD des salles (numero, nombre de places, type de salle)
- CRUD des seances (date, salle, film via id_movie)
- Recuperation des seances par salle
- Inclusion des infos de salle dans `GET /api/show`, `GET /api/show/:id` et `GET /api/show/room/:id_room`
- Reservation de places pour une seance (`POST /api/show/:id/reserve`)

## Stack technique
- NodeJS (Express, ES modules)
- Sequelize + MySQL
- CORS + logs HTTP avec morgan

## Modele de donnees
Room (table `Room`)
- id: int, auto increment
- room_number: int (unique)
- seat_number: int
- room_type: string (optionnel)

Show (table `Show`)
- id: int, auto increment
- date: datetime (ISO-8601)
- id_movie: int (reference logique vers microservice Films)
- id_room: int (FK vers Room.id)

## API
Base URL : `http://localhost:3000` (ou `PORT`)

Endpoints principaux

| Methode | Route | Description |
| --- | --- | --- |
| GET | `/` | Infos service |
| GET | `/api/room` | Liste des salles |
| GET | `/api/room/:id` | Detail d'une salle |
| POST | `/api/room` | Creer une salle |
| PUT | `/api/room/:id` | Modifier une salle |
| DELETE | `/api/room/:id` | Supprimer une salle |
| GET | `/api/show` | Liste des seances |
| GET | `/api/show/:id` | Detail d'une seance |
| GET | `/api/show/room/:id_room` | Seances par salle |
| POST | `/api/show` | Creer une seance |
| POST | `/api/show/:id/reserve` | Reserver des places |
| PUT | `/api/show/:id` | Modifier une seance |
| PATCH | `/api/show/:id` | Modifier partiellement une seance |
| DELETE | `/api/show/:id` | Supprimer une seance |

Notes
- Les reponses de seance incluent la salle associee sous la cle `Room` (association Sequelize).
- `POST /api/show/:id/reserve` accepte un nombre de places via `seats`, `places`, `quantity` ou `count`.

Important
- Le controleur exige un champ `price` lors de la creation d'une seance, mais le modele Sequelize ne declare pas ce champ. Il n'est donc pas persiste dans l'etat actuel.
- La reservation utilise `seats_taken`, mais ce champ n'est pas declare dans le modele `Show`.

Exemples de payload

Creer une salle
```json
{
  "room_number": 1,
  "seat_number": 120,
  "room_type": "IMAX"
}
```

Creer une seance
```json
{
  "date": "2024-10-01T20:00:00.000Z",
  "price": 12.5,
  "id_movie": 5,
  "id_room": 1
}
```

## Configuration
Variables d'environnement requises
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`

Variables optionnelles
- `PORT` (defaut: 3000)
- `NODE_ENV` (defaut: development)

Au demarrage, l'application fait un `sequelize.authenticate()` puis un `sequelize.sync({ alter: true })`.

Exemple `.env`
```bash
DB_NAME=seance_db
DB_USER=root
DB_PASSWORD=secret
DB_HOST=127.0.0.1
DB_PORT=3306
PORT=3000
```

## Format d'erreur
En cas d'erreur, la reponse est du type:
```json
{
  "status": "fail",
  "message": "Room dont exist"
}
```

## Lancer en local
```bash
yarn install
yarn dev
```

Lancer en production
```bash
yarn start
```

## Docker
Build
```bash
docker build -t microservice-seance .
```

Run
```bash
docker run --rm -p 3000:3000 \
  -e DB_NAME=seance_db \
  -e DB_USER=root \
  -e DB_PASSWORD=secret \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  microservice-seance
```

## Docker Compose
Le fichier `docker-compose.yml` lance:
- API sur `http://localhost:3300`
- MySQL sur `localhost:3307`

Lancement
```bash
docker compose up --build
```
