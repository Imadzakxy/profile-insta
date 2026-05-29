// === TOKENS ===
const TOKEN_IGAA = "IGAAiZCN41ymk9BZAFlYVDkweGxqMDVoWjZAOUWtmYlJidGh0Q2VUVWtzNm82Y01hNVNtOUZAFWW9jNXgzdXVDT2J0RXo1cEg3aWdkOXpIVUc2emFCbU9lVHN4OTdwWUlMYld0R21rX0NhREdzNGh0b2J0RFhGNzVDOUtJMVQ3YlJGNAZDZD";
const TOKEN_EAA = "EAAOgrSL9PJ4BRruvyooG9rfWDHAQrw4wKIleaV1hv8BqxtrnTVNdQTdBZAOzNi2DPbPxH2P0yBSGyBsZBPjfsw158aGldgYZBZCOcOzFwmNdKmRrJKZBLM9g5WxJx4KOeQ1ZACLA66glMZAEDMn0ZCgt0AMd2FZAfYaQt7TQAJurPQVmN6tBtPqSTnq0YnoERuOnobqGENpIeAz5N1eQaS8gsa3UCZBSBFLjrvpy4D";

// TON VRAI INSTAGRAM BUSINESS ID
const INSTA_BUSINESS_ID = "17841431532867544";

// === 1. FOLLOWERS + ABONNEMENTS (IGAA) ===
fetch(`https://graph.instagram.com/v25.0/me?fields=id,username,followers_count,follows_count&access_token=${TOKEN_IGAA}`)
.then(reponse => reponse.json())
.then(donnees => {
if (donnees.error) {
    console.error("Erreur API IGAA:", donnees.error);
    document.getElementById("username").innerHTML = "Erreur";
    return;
}

if (donnees.username) document.getElementById("username").innerHTML = donnees.username;
if (donnees.followers_count) document.getElementById("followers-count").innerHTML = donnees.followers_count.toLocaleString();
if (donnees.follows_count) document.getElementById("following-count").innerHTML = donnees.follows_count.toLocaleString();
})
.catch(erreur => {
console.error("Erreur:", erreur);
document.getElementById("followers-count").innerHTML = "Erreur";
});

// === 2. STORIES (EAA) ===
fetch(`https://graph.facebook.com/v25.0/${INSTA_BUSINESS_ID}/stories?fields=id&access_token=${TOKEN_EAA}`)
.then(r => r.json())
.then(data => {
    if (data.error) {
    console.error("Erreur API EAA:", data.error);
    document.getElementById("story-count").innerHTML = "erreur";
    return;
    }
    if (data.data && data.data.length > 0) {
    document.getElementById("story-count").innerHTML = data.data.length;
    } else {
    document.getElementById("story-count").innerHTML = "0";
    }
})
.catch(err => {
    console.error("Erreur stories:", err);
    document.getElementById("story-count").innerHTML = "erreur";
});

// Récupérer le nom d'utilisateur et mettre à jour les liens des boutons
if (donnees.username) {
    document.getElementById("username").innerHTML = donnees.username;
    
    // Mettre à jour le lien du bouton message (DM)
    const dmLink = document.getElementById("dm-link");
    if (dmLink) {
        dmLink.href = `https://www.instagram.com/direct/t/${donnees.username}`;
    }
    
    // Mettre à jour le lien du bouton follow (profil)
    const followLink = document.getElementById("follow-link");
    if (followLink) {
        followLink.href = `https://www.instagram.com/${donnees.username}`;
    }
}

// Afficher la photo de profil (solution alternative)
const profPic = document.querySelector(".prof-pic");
if (profPic) {
    // Utilise directement l'URL de ton image hébergée
    profPic.style.backgroundImage = "url('./public/taki.jpg')";
    profPic.style.backgroundSize = "cover";
    profPic.style.backgroundPosition = "center";
}