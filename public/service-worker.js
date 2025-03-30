
// Nom et version du cache
const CACHE_NAME = 'loup-garou-v2';

// Liste des ressources à mettre en cache
const RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  
  // JavaScript et CSS principaux
  '/assets/index-*.js', // Pattern pour les fichiers JS générés
  '/assets/index-*.css', // Pattern pour les fichiers CSS générés
  
  // Images de l'application
  '/img/launch/android-icon-48x48.png',
  '/img/launch/android-icon-72x72.png',
  '/img/launch/android-icon-96x96.png',
  '/img/launch/android-icon-192x192.png',
  '/img/launch/startup.png',
  
  // Images pour l'interface
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
  
  // Fichiers audio
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
  // Force le remplacement immédiat du précédent service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert et préchargement des ressources');
        
        // Utiliser Promise.allSettled pour gérer les échecs individuels sans interrompre le processus
        return Promise.allSettled(
          RESOURCES_TO_CACHE.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Impossible de mettre en cache ${url}:`, error);
              // Continue malgré l'erreur
            })
          )
        );
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

// Stratégie de cache améliorée: "Cache First, Network Fallback" avec mise à jour en arrière-plan
self.addEventListener('fetch', (event) => {
  // Ignore les requêtes qui ne sont pas GET
  if (event.request.method !== 'GET') return;
  
  // Ignore les requêtes vers d'autres domaines
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  
  // Pour les fichiers audio et images, utiliser stale-while-revalidate
  const isAsset = /\.(mp3|webm|ogg|svg|png|jpg|jpeg|gif|ico)$/i.test(url.pathname);
  
  if (isAsset) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Même si on a une version en cache, on essaie de la mettre à jour en arrière-plan
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // Mettre en cache la nouvelle version si valide
              if (networkResponse && networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });
              }
              return networkResponse;
            })
            .catch(() => {
              console.log('Utilisation de la version en cache pour', event.request.url);
              // Si le réseau échoue, on reste sur la version en cache
            });
          
          // Retourner immédiatement la version en cache si disponible
          return cachedResponse || fetchPromise;
        })
    );
  } else {
    // Pour les autres ressources, utiliser cache-first
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Sinon, on essaie de la récupérer depuis le réseau
          return fetch(event.request)
            .then((networkResponse) => {
              // Ne pas mettre en cache les réponses non valides
              if (!networkResponse || networkResponse.status !== 200) {
                return networkResponse;
              }

              // Mise en cache de la nouvelle ressource récupérée
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return networkResponse;
            })
            .catch((error) => {
              console.error('Erreur de récupération:', error);
              
              // Si c'est une requête HTML, retourner la page d'index pour le SPA
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/');
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
  }
});

// Log les erreurs non interceptées
self.addEventListener('error', function(event) {
  console.error('Service Worker error:', event.message);
});

// Gestion des messages pour le rechargement
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
