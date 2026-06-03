// === TOKENS ===
const TOKEN_IGAA = "IGAAiZCN41ymk9BZAFlYVDkweGxqMDVoWjZAOUWtmYlJidGh0Q2VUVWtzNm82Y01hNVNtOUZAFWW9jNXgzdXVDT2J0RXo1cEg3aWdkOXpIVUc2emFCbU9lVHN4OTdwWUlMYld0R21rX0NhREdzNGh0b2J0RFhGNzVDOUtJMVQ3YlJGNAZDZD";
const TOKEN_EAA = "EAAOgrSL9PJ4BRuHcBkFZBKjReOLjmWzv77qngckrahgZA4dNZA3eulx8oiuA9VZCG7sQsbyR4A3fmhxO7Ok5ZATbnyvgNyk3MmGNDtTT4ed7cqsnnOSDcY9nWZCy4ogXYuZACvZCZCbq2lX3kXYgrEVY9ORTT2ODT7cQLGOLzgq5ZBkWHqpRlkMLSx0zmcBG4fRVaH";
const INSTA_BUSINESS_ID = "17841431532867544";

// Cache durations
const CACHE_DURATION = {
    profile: 3600000,  // 1 heure pour profil (followers changent rarement)
    stories: 120000    // 2 minutes pour stories (mises à jour fréquentes)
};

let usernameEl;
let followersCountEl;
let followingCountEl;
let storyCountEl;
let pageEl;

const getCacheKey = (type) => `insta_${type}`;

const getFromCache = (type) => {
    const cached = localStorage.getItem(getCacheKey(type));
    if (!cached) return null;

    try {
        const { value, timestamp } = JSON.parse(cached);
        const duration = CACHE_DURATION[type] ?? CACHE_DURATION.profile;

        if (Date.now() - timestamp > duration) {
            localStorage.removeItem(getCacheKey(type));
            return null;
        }

        return value;
    } catch {
        localStorage.removeItem(getCacheKey(type));
        return null;
    }
};

const saveToCache = (type, value) => {
    localStorage.setItem(getCacheKey(type), JSON.stringify({ value, timestamp: Date.now() }));
};

const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
    }
    return response.json();
};

const openExternal = (url) => window.open(url, '_blank', 'noopener');

const displayProfileData = (data) => {
    if (data.username) usernameEl.textContent = data.username;
    if (typeof data.followers_count === 'number') followersCountEl.textContent = data.followers_count.toLocaleString();
    if (typeof data.follows_count === 'number') followingCountEl.textContent = data.follows_count.toLocaleString();
};

const displayStoriesData = (data) => {
    storyCountEl.textContent = String(data.data?.length ?? 0);
};

const fetchInstagramData = async () => {
    const cached = getFromCache('profile');
    if (cached) {
        displayProfileData(cached);
        return;
    }

    try {
        const url = `https://graph.instagram.com/v25.0/me?fields=id,username,followers_count,follows_count&access_token=${TOKEN_IGAA}`;
        const data = await fetchJson(url);

        if (data.error) {
            console.error('Erreur API IGAA:', data.error);
            usernameEl.textContent = 'Erreur';
            return;
        }

        saveToCache('profile', data);
        displayProfileData(data);
    } catch (error) {
        console.error('Erreur:', error);
        followersCountEl.textContent = 'Erreur';
    }
};

const fetchStoriesData = async () => {
    const cached = getFromCache('stories');
    if (cached) {
        displayStoriesData(cached);
        return;
    }

    try {
        const url = `https://graph.facebook.com/v25.0/${INSTA_BUSINESS_ID}/stories?fields=id&access_token=${TOKEN_EAA}`;
        const data = await fetchJson(url);

        if (data.error) {
            console.error('Erreur API EAA:', data.error);
            storyCountEl.textContent = 'erreur';
            return;
        }

        saveToCache('stories', data);
        displayStoriesData(data);
    } catch (error) {
        console.error('Erreur stories:', error);
        storyCountEl.textContent = 'erreur';
    }
};

const initPage = () => {
    usernameEl = document.getElementById('username');
    followersCountEl = document.getElementById('followers-count');
    followingCountEl = document.getElementById('following-count');
    storyCountEl = document.getElementById('story-count');
    pageEl = document.querySelector('.page');

    fetchInstagramData();
    fetchStoriesData();

    document.getElementById('bot1')?.addEventListener('click', () => {
        openExternal(`https://instagram.com/${usernameEl.textContent || 'imad.zak.xy'}`);
    }, { passive: true });

    document.getElementById('bot2')?.addEventListener('click', () => {
        openExternal(`https://instagram.com/direct/t/${usernameEl.textContent || 'imad.zak.xy'}`);
    }, { passive: true });

    if (pageEl) {
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    pageEl.style.setProperty('--mouse-x', `${e.clientX}px`);
                    pageEl.style.setProperty('--mouse-y', `${e.clientY}px`);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
};

document.addEventListener('DOMContentLoaded', initPage);
