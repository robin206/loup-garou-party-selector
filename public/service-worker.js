
// Nom du cache
const CACHE_NAME = 'loup-garou-v1';

// Liste des ressources à mettre en cache
const RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  
  // JavaScript et CSS principaux
  '/assets/index-*.js', // Pattern pour les fichiers JS générés
  '/assets/index-*.css', // Pattern pour les fichiers CSS générés
  
  // Images
  '/img/sampler_loup.svg',
  '/img/sampler_ours.svg',
  '/img/sampler_clocher.svg',
  '/img/sampler_tonnerre.svg',
  '/img/perso_chienloup.svg',
  '/img/perso_chienloup2.svg',
  '/img/perso_chevalier.svg',
  '/img/perso_comedien.svg',
  '/img/perso_corbeau.svg',
  '/img/perso_fille.svg',
  '/img/fond.png',
  '/img/mute.svg',
  '/img/perso_amoureux.svg',
  '/img/perso_ancien.svg',
  '/img/perso_ange.svg',
  '/img/perso_berger.svg',
  '/img/perso_bouc.svg',
  '/img/perso_chasseur.svg',
  '/img/perso_cupidon.svg',
  '/img/perso_enfant.svg',
  '/img/perso_flute.svg',
  '/img/perso_freres.svg',
  '/img/perso_gardechampetre.svg',
  '/img/perso_gitane.svg',
  '/img/perso_grandloup.svg',
  '/img/perso_idiot.svg',
  '/img/perso_infectloup.svg',
  '/img/perso_juge.svg',
  '/img/perso_loup.svg',
  '/img/perso_loupblanc.svg',
  '/img/perso_maire.svg',
  '/img/perso_montreur.svg',
  '/img/perso_parrain.svg',
  '/img/perso_renard.svg',
  '/img/perso_salvateur.svg',
  '/img/perso_sectaire.svg',
  '/img/perso_servante.svg',
  '/img/perso_soeurs.svg',
  '/img/perso_sorciere.svg',
  '/img/perso_villageois.svg',
  '/img/perso_villageoises.svg',
  '/img/perso_voleur.svg',
  '/img/perso_voyante.svg',
  
  // Sons
  '/audio/ambiance_Violin.mp3',
  '/audio/ambiance_blackpearl.webm',
  '/audio/ambiance_braveheart.webm',
  '/audio/ambiance_clear-haken.webm',
  '/audio/ambiance_cobblevillage.webm',
  '/audio/ambiance_cosmo.webm',
  '/audio/ambiance_dark.mp3',
  '/audio/ambiance_defautnuit.webm',
  '/audio/ambiance_diablo.webm',
  '/audio/ambiance_elwynnforest.webm',
  '/audio/ambiance_naruto.webm',
  '/audio/jour.webm',
  '/audio/nuit.webm',
  '/audio/vote.webm',
  '/audio/suspense.webm',
  '/audio/revelation.webm',
  '/audio/tension.webm',
  '/audio/victoire.webm',
  '/audio/defaite.webm',
  '/audio/sampler/sampler_loup.ogg',
  '/audio/sampler/sampler_ours.ogg',
  '/audio/sampler/sampler_clocher.ogg',
  '/audio/sampler/sampler_tonnerre.ogg'
];

// Installation du service worker et mise en cache des ressources
self.addEventListener('install', (event) => {
  // Priorité: forcer le remplacement immédiat du précédent service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert et préchargement des ressources');
        return cache.addAll(RESOURCES_TO_CACHE);
      })
  );
});

// Activation du service worker et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  // Priorité: prendre le contrôle de toutes les pages clientes immédiatement
  event.waitUntil(self.clients.claim());
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache "Cache First, Network Fallback" pour le offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si la ressource est dans le cache, on la retourne immédiatement
        if (response) {
          return response;
        }

        // Sinon, on essaie de la récupérer depuis le réseau
        return fetch(event.request.clone())
          .then((networkResponse) => {
            // Pas de mise en cache si la réponse n'est pas valide
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Mise en cache de la nouvelle ressource récupérée
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('Ressource mise en cache:', event.request.url);
              });

            return networkResponse;
          })
          .catch((error) => {
            // En mode offline avec une ressource non mise en cache
            console.error('Erreur de récupération:', error);
            
            // Si c'est une image, retourner une image par défaut
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
              return caches.match('/placeholder.svg');
            }
            
            // Pour les autres types, retourner un message d'erreur
            return new Response('Application en mode hors ligne - Ressource non disponible', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Log les erreurs non interceptées
self.addEventListener('error', function(event) {
  console.error('Service Worker error:', event.message);
});

// Gestion des messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

