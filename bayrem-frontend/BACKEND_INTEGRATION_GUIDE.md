# 🚀 GUIDE D'INTÉGRATION & HANDOVER API — BAYREM RÉFRIGÉRATION
> **De :** Team Leader Frontend  
> **À :** Équipe Backend  
> **Sujet :** Spécifications techniques et contrats d'interface pour le branchement de l'API  

Bienvenue sur le projet **Bayrem Réfrigération** ! Ce document a pour but de vous fournir toutes les clés pour concevoir et déployer un backend robuste, parfaitement aligné avec l'architecture de notre application React (Vite + Vanilla CSS). 

Actuellement, le frontend fonctionne avec un système de données simulées (Mocks) extrêmement fidèle à la réalité. Pour connecter votre API, il vous suffira de basculer une variable dans notre couche d'abstraction réseau.

---

## 1. ⚙️ Architecture Réseau & Switch d'Environnement

Toutes les requêtes HTTP du frontend sont centralisées dans le fichier suivant :
👉 `src/api/api.js`

### Comment activer votre API ?
Dans ce fichier, changez la constante `USE_MOCK` à `false` :
```javascript
// src/api/api.js
const USE_MOCK = false; // Désactive le mock et active les appels fetch réels
const BASE_URL = 'http://localhost:8080/api'; // Modifiez cette URL selon votre serveur (dev/prod)
```

### Gestion des en-têtes d'authentification (JWT)
Toutes les routes d'administration sécurisées requièrent un en-tête d'autorisation standard :
```javascript
Authorization: Bearer <token_jwt>
```
Le token est automatiquement extrait du `localStorage` sous la clé `token` par le frontend.

---

## 2. 📋 Contrats d'Interface & Endpoints API

Voici la liste exhaustive des endpoints attendus par le frontend, regroupés par domaine de responsabilité.

### 2.1. Authentification & Sécurité
| Méthode | Action | Endpoint | En-têtes | Corps de Requête / Réponse |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | Connexion Admin | `/auth/login` | `Content-Type: application/json` | **Requête :** `{ "email": "...", "motDePasse": "..." }`<br>**Réponse (200) :** `{ "token": "JWT_STRING", "role": "ADMIN", "nom": "..." }` |

---

### 2.2. Gestion du Magasin & Localisation
Le frontend utilise ces informations pour le bandeau d'en-tête (téléphones, horaires) et pour le **nouveau badge flottant Google Maps** ("Trouver un revendeur") ainsi que la page Contact.

| Méthode | Action | Endpoint | Corps / Paramètres |
| :--- | :--- | :--- | :--- |
| **GET** | Infos Générales | `/magasin/info` | **Réponse (200) :**<br>```json\n{\n  "nom": "Bayrem Réfrigération",\n  "adresse": "Route de Boumerdès, Alger",\n  "telephone1": "22 46 53 43",\n  "telephone2": "53 96 53 43",\n  "email": "alfrigo48@gmail.com",\n  "googleMapsUrl": "https://maps.google.com/...",\n  "latitude": 36.7538,\n  "longitude": 3.0588\n}\n``` |

---

### 2.3. Gestion du Slider (Page d'Accueil)
Permet de gérer le carrousel principal de la page d'accueil.

| Méthode | Action | Endpoint | En-têtes | Détails / Formats attendus |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Lister les slides triés | `/slider` | Aucun | Doit renvoyer le tableau des slides trié par ordre croissant (`ordre`). Réponse : `Slide[]` |
| **POST** | Ajouter un slide | `/admin/slider` | `Authorization` / `multipart/form-data` | **Payload :** Contient l'image de la diapo (`image`), `titre`, `sousTitre` et `ordre`. |
| **PUT** | Modifier un slide | `/admin/slider/:id` | `Authorization` / `multipart/form-data` | **Payload :** Permet la mise à jour partielle des champs du slide. |
| **DELETE** | Supprimer un slide | `/admin/slider/:id` | `Authorization` | **Règle métier critique :** Voir Section 4. |

---

### 2.4. Catégories & Architecture du Catalogue
Les catégories structurent la navigation principale et le mégamenu.

| Méthode | Action | Endpoint | Corps / Format de Réponse |
| :--- | :--- | :--- | :--- |
| **GET** | Lister les catégories | `/categories` | **Réponse (200) :** Un tableau de catégories contenant des sous-catégories imbriquées.<br>```json\n[\n  {\n    "id": 1,\n    "nom": "Snack",\n    "slug": "snack",\n    "imageUrl": "...",\n    "sousCategories": [\n      { "id": 101, "nom": "Friteuses", "slug": "friteuses" }\n    ]\n  }\n]\n``` |

---

### 2.5. Gestion des Produits (Catalogue & Recherche)
C'est le module le plus complexe avec de nombreux filtres gérés par le catalogue.

| Méthode | Action | Endpoint | Paramètres de Requête (Query Params) & Réponses |
| :--- | :--- | :--- | :--- |
| **GET** | Lister les produits filtrés | `/produits` | **Query Params acceptés par le frontend :**<br>- `search` *(string)* : Recherche textuelle sur le nom/description.<br>- `categorieId` *(number)* : Filtre par catégorie principale.<br>- `sousCategorieId` *(number)* : Filtre par sous-catégorie.<br>- `prixMin` & `prixMax` *(number, en milliers de DA)* : Tranche de prix (promo incluse).<br>- `promotion` *(boolean)* : Si `true`, n'affiche que les produits avec `estEnPromotion = true`.<br>- `tri` *(string)* : `prix_asc` (du moins cher au plus cher) ou `prix_desc` (inverse).<br>- `page` *(number, défaut 1)* & `limite` *(number, défaut 12)* : Pagination.<br><br>**Réponse paginée attendue (200) :**<br>```json\n{\n  "total": 45,\n  "page": 1,\n  "limite": 12,\n  "produits": [ Product[] ]\n}\n``` |
| **GET** | Détail d'un produit | `/produits/:id` | **Réponse (200) :** Objet `Product` unique complet. |
| **GET** | Produits Vedettes (Promo) | `/produits/vedette` | **Réponse (200) :** Renvoie les 8 premiers produits en promotion pour la grille d'accueil. |
| **POST** | Ajouter un produit | `/admin/produits` | `multipart/form-data` avec fichier image (`image`) et attributs texte. |
| **PUT** | Modifier un produit | `/admin/produits/:id` | `multipart/form-data` pour modification de l'image et des métadonnées. |
| **DELETE** | Supprimer un produit | `/admin/produits/:id` | En-tête `Authorization` requis. |

---

## 3. 💾 Modèles de Données Recommandés (Schémas)

### 3.1. Produit (Product)
```typescript
interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;               // Prix de base en dinars algériens (ex: 185000 pour 185 000 DA)
  prixPromo?: number;         // Prix après réduction (optionnel)
  pourcentagePromo?: number;  // Calculé automatiquement ou renseigné (ex: 15 pour -15%)
  estEnPromotion: boolean;    // Flag déterminant l'affichage des macarons promotionnels
  imageUrl: string;           // URL absolue de l'image sur votre CDN ou serveur de fichiers
  categorieId: number;        // Clé étrangère vers la catégorie
  sousCategorieId?: number;   // Clé étrangère vers la sous-catégorie
  estEnStock: boolean;        // Gère l'affichage du statut de disponibilité
}
```

### 3.2. Carrousel Slide
```typescript
interface Slide {
  id: number;
  titre: string;
  sousTitre: string;
  imageUrl: string;
  ordre: number;              // Position de tri dans l'affichage (1, 2, 3...)
}
```

---

## 4. 🧠 Règles Métiers Critiques attendues du Backend

Pour assurer la cohérence de l'expérience utilisateur, le backend doit implémenter ces quelques règles logiques clés :

1. **Calcul des Ristournes (Promotions) :**
   Lors de la création/modification d'un produit, si un `prixPromo` est fourni et est inférieur au `prix` de base :
   - Définir `estEnPromotion = true`.
   - Calculer automatiquement le pourcentage de réduction :  
     $$\text{pourcentagePromo} = \text{round}\left( \frac{\text{prix} - \text{prixPromo}}{\text{prix}} \times 100 \right)$$

2. **Réordonnancement Automatique des Diapos (Slider) :**
   Lorsqu'un slide est **supprimé** (par exemple, à la position d'ordre `3`), pour éviter les trous dans la séquence d'affichage, le backend doit automatiquement décaler et décrémenter de `-1` le champ `ordre` de toutes les diapos dont l'ordre était supérieur à celui de la diapo supprimée.
   
3. **Robustesse du Filtrage par Tranche de Prix :**
   Le frontend envoie les paramètres `prixMin` et `prixMax` exprimés en **milliers de DA** (par exemple, un utilisateur saisissant `100` filtre pour un prix de `100 000 DA`). Le backend doit donc multiplier ces paramètres par `1000` lors de la requête SQL/NoSQL, et comparer la valeur avec le prix de vente final effectif (c'est-à-dire `prixPromo` si le produit est en promotion, sinon `prix`).

---

## 5. 🛠️ Recommandations pour l'Équipe Backend

* **CORS (Cross-Origin Resource Sharing) :**  
  Activez le support CORS sur votre serveur backend pour autoriser les requêtes venant de l'origine du frontend en développement (`http://localhost:5173`) et votre domaine de production.
* **Upload d'images :**  
  Configurez un dossier statique public sur votre serveur ou intégrez un stockage cloud pour stocker les images téléversées depuis le tableau de bord d'administration (Produits et Slides), puis renvoyez l'URL absolue correspondante dans les payloads de réponse.
* **Sécurisation de l'API d'Administration :**  
  Toutes les routes préfixées par `/api/admin/` doivent impérativement vérifier la validité du token JWT transmis et s'assurer que le rôle de l'utilisateur est bien `ADMIN` afin d'éviter toute faille de sécurité.

Nous sommes à votre entière disposition sur Slack/Teams si vous avez la moindre question concernant l'intégration de ces interfaces. Faisons de cette plateforme une expérience inoubliable !

*Bon code !* 🚀  
**— Le Lead Developer Frontend**
