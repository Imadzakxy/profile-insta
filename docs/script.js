// === TOKENS ===
const TOKEN_IGAA = "IGAAiZCN41ymk9BZAFlYVDkweGxqMDVoWjZAOUWtmYlJidGh0Q2VUVWtzNm82Y01hNVNtOUZAFWW9jNXgzdXVDT2J0RXo1cEg3aWdkOXpIVUc2emFCbU9lVHN4OTdwWUlMYld0R21rX0NhREdzNGh0b2J0RFhGNzVDOUtJMVQ3YlJGNAZDZD";
const TOKEN_EAA = "EAAOgrSL9PJ4BRuHcBkFZBKjReOLjmWzv77qngckrahgZA4dNZA3eulx8oiuA9VZCG7sQsbyR4A3fmhxO7Ok5ZATbnyvgNyk3MmGNDtTT4ed7cqsnnOSDcY9nWZCy4ogXYuZACvZCZCbq2lX3kXYgrEVY9ORTT2ODT7cQLGOLzgq5ZBkWHqpRlkMLSx0zmcBG4fRVaH";
const INSTA_BUSINESS_ID = "17841431532867544";

// Cache durations
const CACHE_DURATION = {
    profile: 3600000,  // 1 heure pour profil (followers changent rarement)
    stories: 120000    // 2 minutes pour stories (mises à jour fréquentes)
};

// === CACHE HELPERS ===
function getCacheKey(type) {
    return `insta_${type}`;
}

function getFromCache(type) {
    const cached = localStorage.getItem(getCacheKey(type));
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const duration = CACHE_DURATION[type] || CACHE_DURATION.profile;
    
    if (Date.now() - data.timestamp > duration) {
        localStorage.removeItem(getCacheKey(type));
        return null;
    }
    return data.value;
}

function saveToCache(type, value) {
    localStorage.setItem(getCacheKey(type), JSON.stringify({
        value: value,
        timestamp: Date.now()
    }));
}

// === 1. Username + Followers + Following (IGAA) - AVEC CACHE ===
function fetchInstagramData() {
    const cached = getFromCache('profile');
    if (cached) {
        displayProfileData(cached);
        return;
    }

    fetch(`https://graph.instagram.com/v25.0/me?fields=id,username,followers_count,follows_count&access_token=${TOKEN_IGAA}`)
    .then(reponse => reponse.json())
    .then(donnees => {
        if (donnees.error) {
            console.error("Erreur API IGAA:", donnees.error);
            document.getElementById("username").innerHTML = "Erreur";
            return;
        }
        saveToCache('profile', donnees);
        displayProfileData(donnees);
    })
    .catch(erreur => {
        console.error("Erreur:", erreur);
        document.getElementById("followers-count").innerHTML = "Erreur";
    });
}

function displayProfileData(donnees) {
    if (donnees.username) document.getElementById("username").innerHTML = donnees.username;
    if (donnees.followers_count) document.getElementById("followers-count").innerHTML = donnees.followers_count.toLocaleString();
    if (donnees.follows_count) document.getElementById("following-count").innerHTML = donnees.follows_count.toLocaleString();
}

// === 2. STORIES (EAA) - AVEC CACHE ===
function fetchStoriesData() {
    const cached = getFromCache('stories');
    if (cached) {
        displayStoriesData(cached);
        return;
    }

    fetch(`https://graph.facebook.com/v25.0/${INSTA_BUSINESS_ID}/stories?fields=id&access_token=${TOKEN_EAA}`)
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            console.error("Erreur API EAA:", data.error);
            document.getElementById("story-count").innerHTML = "erreur";
            return;
        }
        saveToCache('stories', data);
        displayStoriesData(data);
    })
    .catch(err => {
        console.error("Erreur stories:", err);
        document.getElementById("story-count").innerHTML = "erreur";
    });
}

function displayStoriesData(data) {
    if (data.data && data.data.length > 0) {
        document.getElementById("story-count").innerHTML = data.data.length;
    } else {
        document.getElementById("story-count").innerHTML = "0";
    }
}

// === BUTTONS + API CALLS ===
document.addEventListener('DOMContentLoaded', () => {
    // Fetch data avec cache
    fetchInstagramData();
    fetchStoriesData();

    // Button listeners
    const followBtn = document.getElementById('bot1');
    const messageBtn = document.getElementById('bot2');
    const usernameElement = document.getElementById('username');

    if (followBtn) {
        followBtn.addEventListener('click', () => {
            const username = usernameElement.textContent || 'imad.zak.xy';
            window.open(`https://instagram.com/${username}`, '_blank');
        }, { passive: true });
    }

    if (messageBtn) {
        messageBtn.addEventListener('click', () => {
            const username = usernameElement.textContent || 'imad.zak.xy';
            window.open(`https://instagram.com/direct/t/${username}`, '_blank');
        }, { passive: true });
    }

    // Mouse spotlight effect - optimisé
    const page = document.querySelector('.page');
    if (page) {
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    page.style.setProperty('--mouse-x', `${e.clientX}px`);
                    page.style.setProperty('--mouse-y', `${e.clientY}px`);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
});