📱 INSTAGRAM STATS - imad.zak.xy
================================

Développeur : Zak-Mad
Stack : HTML, CSS, JavaScript + Instagram API
Hébergement : GitHub Pages

================================
DESCRIPTION
================================

Page web qui affiche en direct les statistiques Instagram :
- Nombre d'abonnés
- Nombre d'abonnements  
- Nombre de stories publiées

Avec animation de galaxie spirale et design moderne.

================================
FONCTIONNALITES
================================

✅ Affichage live des stats Instagram
✅ Cache local (1h pour profil, 2min pour stories)
✅ Galaxie animée (2000 étoiles)
✅ Spotlight qui suit la souris
✅ Boutons Follow et Message
✅ Responsive mobile

================================
STRUCTURE DU PROJET
================================

profile-insta/
├── docs/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── galaxy/
│   │   └── galaxytest.js
│   └── public/
│       ├── taki.jpg
│       ├── baniere.jpg
│       ├── logo.png
│       └── toxic_icon.png
└── README.txt

================================
INSTALLATION
================================

1. Cloner le projet :
   git clone https://github.com/zak-mad/profile-insta.git
   cd profile-insta

2. Configurer les tokens dans docs/script.js :
   TOKEN_IGAA = "TON_TOKEN_INSTAGRAM"
   TOKEN_EAA = "TON_TOKEN_FACEBOOK"
   INSTA_BUSINESS_ID = "TON_ID_BUSINESS"

3. Déployer sur GitHub Pages :
   git add .
   git commit -m "Initial commit"
   git push origin main

4. Activer GitHub Pages dans :
   Settings → Pages → Source: main/docs

================================
OBTENIR LES TOKENS INSTAGRAM
================================

1. Va sur developers.facebook.com
2. Crée une application
3. Ajoute le produit "Instagram Graph API"
4. Ajoute ton compte Instagram comme testeur
5. Génère un token avec les permissions :
   instagram_business_basic, instagram_business_manage_insights
6. Récupère ton INSTA_BUSINESS_ID via l'API

================================
DONNEES AFFICHÉES
================================

| Donnée | API | Cache |
|--------|-----|-------|
| Abonnés | /me?fields=followers_count | 1 heure |
| Abonnements | /me?fields=follows_count | 1 heure |
| Stories | /{id}/stories | 2 minutes |

================================
TECHNOLOGIES
================================

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript Vanilla
- Instagram Graph API v25.0
- GitHub Pages

================================
LIMITATIONS
================================

- Les tokens expirent tous les 60 jours
- Pas de temps réel absolu (cache 1h/2min)
- Nécessite un compte Instagram Business

================================
MAINTENANCE
================================

Renouveler les tokens (tous les 60 jours) :
1. Génère un nouveau token sur Graph API Explorer
2. Remplace dans docs/script.js
3. Push sur GitHub

================================
CONTACT
================================

Développé avec ❤️ par Zak-Mad
GitHub : github.com/zak-mad
Email : zak.mad@example.com

================================
