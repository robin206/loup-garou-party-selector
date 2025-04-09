// Nom et version du cache - Incrémenté pour forcer la mise à jour
const CACHE_NAME = 'loup-garou-v5';

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
  '/img/sampler_clock.svg',
  '/img/sampler_violon.svg',
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
  '/audio/Ambiance_dark-ambient-atmosphere-1-141313.mp3',
  '/audio/Ambiance_medieval-ambient-236809.mp3',
  '/audio/Ambiance_medieval-citytavern-ambient-235876.mp3',
  '/audio/Ambiance_medieval-the-tournament-280277.mp3',
  '/audio/Ambiance_ominous-horror-soundtrack-312558.mp3',
  '/audio/sampler/sampler_loup.ogg',
  '/audio/sampler/sampler_ours.ogg',
  '/audio/sampler/sampler_clocher.ogg',
  '/audio/sampler/sampler_tonnerre.ogg',
  '/audio/sampler/sampler_hunter.ogg',
  '/audio/sampler/sampler_clock.ogg',
  '/audio/sampler/sampler_violon.ogg'
];

// Installation du service worker et mise en cache des ressources
self.addEventListener('install', (event) => {
  console.log('Installation du Service Worker v5');
  
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
  console.log('Activation du Service Worker v5');
  
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

// Stratégie de cache améliorée: Network First pour les assets dynamiques, Cache First pour les statiques
self.addEventListener('fetch', (event) => {
  // Ignore les requêtes qui ne sont pas GET
  if (event.request.method !== 'GET') return;
  
  // Ignore les requêtes vers d'autres domaines
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  
  // Pour les fichiers JS/CSS (qui changent souvent), on utilise Network First
  const isDynamicAsset = /\.(js|css)$/i.test(url.pathname) || url.pathname === '/' || url.pathname === '/index.html';
  
  if (isDynamicAsset) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre en cache la nouvelle version
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // En cas d'échec, utiliser la version en cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Si la page d'index est demandée mais n'est pas dans le cache
              if (url.pathname === '/' || url.pathname === '/index.html') {
                return caches.match('/');
              }
              
              return new Response('Ressource non disponible et hors ligne', {
                status: 503,
                headers: new Headers({ 'Content-Type': 'text/plain' })
              });
            });
        })
    );
  } else {
    // Pour les assets statiques (images, sons), on utilise Cache First
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // En arrière-plan, vérifier s'il y a une mise à jour
            fetch(event.request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse);
                  });
                }
              })
              .catch(() => {});
              
            return cachedResponse;
          }
          
          // Si pas dans le cache, essayer le réseau
          return fetch(event.request)
            .then(networkResponse => {
              if (!networkResponse || networkResponse.status !== 200) {
                return networkResponse;
              }
              
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
              
              return networkResponse;
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
  } else if (event.data && event.data.type === 'CACHE_PURGE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ status: 'Cache purgé avec succès' });
    }).catch(error => {
      event.ports[0].postMessage({ status: 'Erreur lors du nettoyage du cache', error: error.toString() });
    });
  }
});
