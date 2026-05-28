# Instagram Profile - imad.zak.xy

**Développeur**: Zak-Mad  
**Stack**: HTML/CSS/JavaScript + Cloudflare Workers + Instagram Graph API  
**Hosting**: GitHub Pages

---

## 🎯 Description

Site vitrine affichant les statistiques Instagram en temps quasi-réel pour le compte `imad.zak.xy`.

### Fonctionnalités

- ✅ Affichage dynamique du nombre de followers
- ✅ Total de likes sur tous les posts
- ✅ Nombre de publications
- ✅ Mise à jour automatique (toutes les heures)
- ✅ Cache intelligent pour optimiser les performances
- ✅ Design responsive et moderne

---

## 🏗️ Architecture

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│  GitHub Pages   │──────▶│ Cloudflare Worker│──────▶│ Instagram Graph │
│  (Frontend)     │◀──────│   (Proxy)        │◀──────│      API        │
└─────────────────┘       └──────────────────┘       └─────────────────┘
   HTML/CSS/JS              Secrets sécurisés           Données Instagram
   Static hosting           + CORS handling             (followers, posts)
```

### Pourquoi un Proxy?

- 🔒 **Sécurité**: Le token API n'est jamais exposé côté client
- 🌐 **CORS**: Cloudflare gère les requêtes cross-origin
- ⚡ **Performance**: Cache CDN intégré
- 💰 **Gratuit**: Cloudflare Workers offre 100k requêtes/jour gratuitement

---

## 📁 Structure du Projet

```
profile-insta/
├── index.html          # Page principale avec JavaScript
├── style.css           # Styles CSS
├── worker.js           # Code du Cloudflare Worker (à déployer)
├── README_SETUP.md     # Guide de configuration détaillé
└── README.md           # Ce fichier
```

---

## 🚀 Démarrage Rapide

### 1. Prérequis

- Compte Instagram Business ou Créateur (`imad.zak.xy`)
- Compte Facebook (pour lier la page)
- Compte [Meta for Developers](https://developers.facebook.com/)
- Compte [Cloudflare](https://workers.cloudflare.com/)

### 2. Configuration Instagram API

Suivez le guide complet dans [`README_SETUP.md`](README_SETUP.md) pour:
- Convertir votre compte en Business
- Créer une app Meta Developer
- Obtenir un Access Token long-term (60 jours)
- Récupérer votre Instagram User ID

### 3. Déployer le Cloudflare Worker

1. Créez un Worker sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Copiez le code de [`worker.js`](worker.js)
3. Ajoutez les secrets:
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_USER_ID`
4. Notez l'URL du Worker (ex: `https://instagram-proxy.xxx.workers.dev`)

### 4. Configurer le Frontend

Dans [`index.html`](index.html), ligne ~68:
```javascript
const PROXY_URL = 'https://VOTRE-WORKER.workers.dev/api/instagram';
```

### 5. Déployer sur GitHub Pages

```bash
git add .
git commit -m "Initial commit - Instagram profile"
git push origin main
```

Activez GitHub Pages dans les settings du repository.

---

## 🔄 Comment ça Marche

### Flux de Données

1. **Client** charge la page → JavaScript exécute `fetchInstagramData()`
2. **Vérification du cache** local (localStorage, 1 heure)
3. Si cache expiré → **Requête au Cloudflare Worker**
4. **Worker** appelle l'API Instagram Graph avec le token sécurisé
5. **Instagram** retourne les données JSON
6. **Worker** agrège les données et les renvoie au client
7. **Client** met à jour l'affichage et stocke en cache

### Endpoints Utilisés

- **Media**: `GET /{user-id}/media?fields=like_count,comments_count,...`
- **Insights**: `GET /{user-id}/insights?metric=follower_count`

---

## ⚙️ Configuration Avancée

### Modifier la Fréquence de Mise à Jour

Dans [`index.html`](index.html):
```javascript
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure (en millisecondes)
```

### Ajouter Plus de Posts

Dans [`worker.js`](worker.js):
```javascript
limit=20  // Augmentez cette valeur (max 100)
```

### Personnaliser le Format d'Affichage

Modifiez la fonction `formatNumber()` dans [`index.html`](index.html).

---

## 📊 Limitations

| Donnée | Disponibilité | Fréquence |
|--------|---------------|-----------|
| Nombre de followers | ✅ Oui | 1 heure |
| Liste des followers | ❌ Non | - |
| Nombre de posts | ✅ Oui | 1 heure |
| Likes par post | ✅ Oui | 1 heure |
| Comments par post | ✅ Oui | 1 heure |
| Temps réel absolu | ❌ Non | Limitation API |

**Note**: Instagram ne fournit pas d'API pour la liste complète des followers ou les mises à jour en temps réel absolu.

---

## 🛠️ Technologies Utilisées

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Cloudflare Workers (JavaScript)
- **API**: Instagram Graph API v18.0
- **Hosting**: GitHub Pages
- **Cache**: localStorage (client) + Cloudflare CDN (server)

---

## 📝 Maintenance

### Renouveler le Token (tous les 60 jours)

1. Générez un nouveau token via [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Mettez à jour le secret `INSTAGRAM_ACCESS_TOKEN` dans Cloudflare Dashboard
3. Attendez 1 heure pour l'expiration du cache

### Monitoring

- Consultez les logs dans Cloudflare Workers Dashboard
- Vérifiez la console navigateur pour les erreurs client

---

## 🆘 Support

En cas de problème:
1. Vérifiez [`README_SETUP.md`](README_SETUP.md) pour la configuration
2. Consultez les logs Cloudflare Worker
3. Vérifiez que le compte Instagram est bien Business/Créateur
4. Assurez-vous que le token n'a pas expiré

---

## 📄 License

Ce projet est développé par **Zak-Mad** pour usage personnel.

---

## 🔗 Liens Utiles

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [GitHub Pages Docs](https://pages.github.com/)
- [Meta for Developers](https://developers.facebook.com/)

---

**Développé avec ❤️ par Zak-Mad** | 2026
