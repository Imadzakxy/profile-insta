# 📱 Instagram Stats - imad.zak.xy

**Développeur**: Zak-Mad  
**Stack**: HTML, CSS, JavaScript + Instagram API  
**Hébergement**: GitHub Pages  

---

## 🎯 Description

Page web qui affiche en direct les statistiques Instagram :
- Nombre d'abonnés
- Nombre d'abonnements
- Nombre de stories publiées

Avec une animation de galaxie spirale et un design moderne.

---

## ✨ Fonctionnalités

- ✅ Affichage live des stats Instagram
- ✅ Cache local (1h pour profil, 2min pour stories)
- ✅ Galaxie animée (2000 étoiles)
- ✅ Spotlight qui suit la souris
- ✅ Boutons Follow et Message
- ✅ Responsive mobile

---

## 📁 Structure
   
profile-insta/
├── docs/
│ ├── index.html # Page principale
│ ├── style.css # Styles + animations
│ ├── script.js # Récupération des données
│ ├── galaxy/
│ │ └── galaxytest.js # Animation galaxie
│ └── public/ # Images (profil, bannière, logo)
└── README.md

---

## 🚀 Installation

### 1. Cloner le projet:
```bash
git clone https://github.com/zak-mad/profile-insta.git
cd profile-insta
```

### 2. Configurer les tokens:
Édite docs/script.js et remplace les lignes 1-3 :
```js
TOKEN_IGAA = "TON_TOKEN_INSTAGRAM"
TOKEN_EAA = "TON_TOKEN_FACEBOOK"
INSTA_BUSINESS_ID = "TON_ID_INSTAGRAM_BUSINESS"
```
### 3. Déployer sur GitHub Pages:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
Active GitHub Pages dans :
Settings → Pages → Source: main/docs

---

# 🔧 Configuration des tokens Instagram

1. Va sur [developers.facebook.com](https://developers.facebook.com)
2. Crée une application → Ajoute le produit "Instagram Graph API"
3. Ajoute ton compte Instagram comme testeur
4. Génère un token avec les permissions :  
   `instagram_business_basic, instagram_business_manage_insights`
5. Récupère ton `INSTA_BUSINESS_ID` via l'API

---

# 📊 Données affichées

| Donnée | API Endpoint | Cache |
|--------|--------------|-------|
| Abonnés | `/me?fields=followers_count` | 1 heure |
| Abonnements | `/me?fields=follows_count` | 1 heure |
| Nombre stories | `/{id}/stories` | 2 minutes |

---

# 🛠️ Technologies

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript Vanilla
- Instagram Graph API v25.0
- GitHub Pages

---

# ⚠️ Limitations

- Les tokens expirent tous les 60 jours (à renouveler)
- Pas de "temps réel" absolu (cache 1h/2min)
- Nécessite un compte Instagram Business

---

# 📝 Maintenance

**Renouveler les tokens (tous les 60 jours) :**

1. Génère un nouveau token sur [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Remplace dans `docs/script.js`
3. Push sur GitHub
