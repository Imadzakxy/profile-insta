// === TOKENS ===
const TOKEN_IGAA = "IGAAiZCN41ymk9BZAFlYVDkweGxqMDVoWjZAOUWtmYlJidGh0Q2VUVWtzNm82Y01hNVNtOUZAFWW9jNXgzdXVDT2J0RXo1cEg3aWdkOXpIVUc2emFCbU9lVHN4OTdwWUlMYld0R21rX0NhREdzNGh0b2J0RFhGNzVDOUtJMVQ3YlJGNAZDZD";
const TOKEN_EAA = "EAAOgrSL9PJ4BRuHcBkFZBKjReOLjmWzv77qngckrahgZA4dNZA3eulx8oiuA9VZCG7sQsbyR4A3fmhxO7Ok5ZATbnyvgNyk3MmGNDtTT4ed7cqsnnOSDcY9nWZCy4ogXYuZACvZCZCbq2lX3kXYgrEVY9ORTT2ODT7cQLGOLzgq5ZBkWHqpRlkMLSx0zmcBG4fRVaH";

// TON VRAI INSTAGRAM BUSINESS ID
const INSTA_BUSINESS_ID = "17841431532867544";

// === 1. Username + Followers + Following (IGAA) ===
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
    
    // Modifier le lien du bouton message
    const dmLink = document.getElementById("dm-link");
    if (dmLink) {
        dmLink.onclick = () => {
            window.open(`https://www.instagram.com/direct/t/${donnees.username}`, "_blank");
        };
    }
    
    // Modifier le lien du bouton follow
    const followLink = document.getElementById("follow-link");
    if (followLink) {
        followLink.onclick = () => {
            window.open(`https://www.instagram.com/${donnees.username}`, "_blank");
        };
    }
}

// Récupérer la photo de profil avec le token EAA
//ca na pas marcher prsq c un lien pour telecharger limage
/*
fetch(`https://graph.facebook.com/v25.0/me?fields=picture{url}&access_token=${TOKEN_EAA}`)
    .then(r => r.json())
    .then(data => {
        if (data.picture && data.picture.data && data.picture.data.url) {
            const photoUrl = data.picture.data.url;
            document.querySelector(".prof-pic").style.backgroundImage = `url(${photoUrl})`;
            document.querySelector(".prof-pic").style.backgroundSize = "cover";
            document.querySelector(".prof-pic").style.backgroundPosition = "center";
        }
    })
    .catch(err => console.error("Erreur photo:", err));
*/