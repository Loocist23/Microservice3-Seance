# API micro service : Architecture logicielle
Cette API permet de créer des salles de cinéma ainsi que des programmations de séances. <br>

## Utilisation
### Lancement Docker
----
Cloner dans un premier temps le repo sur votre poste en local.<br>
Une fois placé dans le repo cloné lancez cette commande : `docker compose up --build`.<br>
ATTENTION : il est nécessaire d'avoir Docker d'installé sur son poste.<br><br>
Pour arrêter le container, il suffit de faire : `docker compose down`
<br><br>
Pour faire les appels API, il vous suffit de mettre en suffixe des routes : `http://localhost:3300/`

### Appels API 
----
#### 🟢 GET /api/room  
Récupère la liste de toutes les salles disponibles.

#### 🟢 GET /api/room/:id  
Récupère une salle par son identifiant.

#### 🟢 POST /api/room  
Crée une nouvelle salle.  
Body attendu :
```
{
  "room_number": 40,
  "seat_number": 100,
  "room_type": "Dolby"
}
```

#### 🟢 PUT /api/room/:id  
Modifie une salle existante.  
Exemple de body :
```
{
  "seat_number": 120,
  "room_type": "IMAX"
}
```

#### 🟢 DELETE /api/room/:id  
Supprime une salle par son identifiant.

#### 🔵 GET /api/show  
Récupère toutes les séances avec les informations de la salle associée.

#### 🔵 GET /api/show/:id  
Récupère une séance par son identifiant.

#### 🔵 GET /api/show/room/:id_room  
Récupère toutes les séances associées à une salle donnée.

#### 🔵 POST /api/show  
Crée une nouvelle séance.  
Body attendu :
```
{
  "date": "2026-01-10T20:30:00",
  "id_movie": 5,
  "id_room": 2
}
```

**id_room** doit correspondre à une salle existante.  
**id_movie** correspond à l’identifiant du film (géré par un autre microservice).

#### 🔵 PUT /api/show/:id  
Modifie une séance existante.  
Exemple de body :
```
{
  "date": "2026-01-11T18:00:00",
  "id_room": 3
}
```

Si id_room est modifié, la salle doit exister.

#### 🔵 DELETE /api/show/:id  
Supprime une séance par son identifiant.


Codes de réponse HTTP
```
200 : Succès  
201 : Ressource créée  
400 : Données manquantes ou invalides  
404 : Ressource introuvable  
500 : Erreur serveur
```
