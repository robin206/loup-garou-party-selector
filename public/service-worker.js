
// Nom du cache
const CACHE_NAME = 'loup-garou-v1';

// Liste des ressources à mettre en cache
const RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  
  // JavaScript et CSS principaux
  '/src/main.tsx',
  
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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(RESOURCES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du service worker et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
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
  self.clients.claim();
});

// Stratégie de cache "Cache First" avec fallback sur le réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si la ressource est dans le cache, on la retourne
        if (response) {
          return response;
        }

        // Sinon, on fait la requête réseau
        return fetch(event.request)
          .then((response) => {
            // Si la réponse n'est pas valide, on retourne la réponse telle quelle
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // On clone la réponse car elle ne peut être utilisée qu'une fois
            const responseToCache = response.clone();

            // On met en cache la nouvelle ressource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // En cas d'erreur réseau, si c'est une image, on retourne une image par défaut
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
              return caches.match('/placeholder.svg');
            }
            
            return new Response('Erreur de connexion - Mode hors ligne');
          });
      })
  );
});
