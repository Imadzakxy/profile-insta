require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour servir les fichiers statiques (CSS, images)
app.use(express.static(__dirname));

// Route API pour récupérer les stats Instagram (le token est caché ici)
app.get('/api/stats', async (req, res) => {
    try {
        const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
        const instagramId = process.env.INSTAGRAM_ID;
        
        if (!accessToken || !instagramId) {
            return res.status(500).json({ error: 'Configuration manquante' });
        }
        
        const apiUrl = `https://graph.instagram.com/v25.0/me?fields=followers_count,media_count,username&access_token=${accessToken}`;
        
        console.log('📡 Appel API Instagram...');
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.error) {
            console.error('❌ Erreur API:', data.error);
            return res.status(400).json({ error: data.error.message });
        }
        
        console.log('✅ Stats récupérées:', data);
        res.json(data);
        
    } catch (error) {
        console.error('❌ Erreur serveur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route pour servir ta page HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📊 API stats disponible sur http://localhost:${PORT}/api/stats`);
});