
import React, { useEffect, useState, useRef } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundSamplerProps {
  className?: string;
}

const SoundSampler: React.FC<SoundSamplerProps> = ({ className }) => {
  const { playSampleSound, stopMusic, isAudioReady, playViolinSound } = useAudio();
  const [muted, setMuted] = React.useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const audioPreloadedRef = useRef<boolean>(false);
  
  // Vérifier l'état de la connexion
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setOfflineMode(!navigator.onLine);
    };
    
    // Vérifier l'état initial
    setOfflineMode(!navigator.onLine);
    
    // Ajouter les écouteurs d'événements
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    // Nettoyage
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);
  
  // Précharger les sons au montage du composant
  useEffect(() => {
    const preloadAudioFiles = async () => {
      if (audioPreloadedRef.current) return;
      
      try {
        // Précharger les échantillons sonores
        const audioPaths = [
          '/audio/sampler/sampler_loup.ogg',
          '/audio/sampler/sampler_ours.ogg',
          '/audio/sampler/sampler_clocher.ogg',
          '/audio/sampler/sampler_tonnerre.ogg',
          '/audio/sampler/sampler_hunter.ogg',
          '/audio/sampler/sampler_clock.ogg',    // Added clock sound
          '/audio/sampler/sampler_violon_1.ogg'  // Added violin sound
        ];
        
        // Créer les éléments audio mais sans les ajouter au DOM
        const audioPromises = audioPaths.map(path => {
          return new Promise<void>((resolve, reject) => {
            const audio = new Audio();
            audio.preload = 'auto';
            
            audio.oncanplaythrough = () => {
              resolve();
            };
            
            audio.onerror = (error) => {
              console.error(`Impossible de précharger ${path}:`, error);
              // Résoudre quand même pour ne pas bloquer les autres
              resolve();
            };
            
            // Essayer de charger le son depuis le cache d'abord
            if ('caches' in window) {
              caches.match(path)
                .then(response => {
                  if (response) {
                    return response.blob();
                  }
                  return fetch(path).then(res => res.blob());
                })
                .then(blob => {
                  audio.src = URL.createObjectURL(blob);
                })
                .catch(err => {
                  console.warn(`Fallback pour ${path}:`, err);
                  audio.src = path;
                });
            } else {
              audio.src = path;
            }
          });
        });
        
        await Promise.all(audioPromises);
        audioPreloadedRef.current = true;
        console.log('Tous les échantillons audio ont été préchargés');
      } catch (error) {
        console.error('Erreur lors du préchargement des échantillons audio:', error);
      }
    };
    
    preloadAudioFiles();
  }, []);
  
  // Précharger les images SVG lors du montage du composant
  useEffect(() => {
    const imagePaths = [
      '/img/sampler_loup.svg',
      '/img/sampler_ours.svg', 
      '/img/sampler_clocher.svg',
      '/img/sampler_tonnerre.svg',
      '/img/sampler_clock.svg',
      '/img/sampler_violon.svg'
    ];
    
    const preloadImages = async () => {
      const promises = imagePaths.map(path => {
        return new Promise((resolve, reject) => {
          // Vérifier d'abord si l'image est dans le cache
          if ('caches' in window) {
            caches.match(path)
              .then(response => {
                if (response) {
                  return response.blob();
                }
                return fetch(path).then(res => res.blob());
              })
              .then(blob => {
                const img = new Image();
                img.onload = () => resolve(path);
                img.onerror = () => {
                  console.error(`Impossible de charger ${path}`);
                  reject(`Impossible de charger ${path}`);
                };
                img.src = URL.createObjectURL(blob);
              })
              .catch(error => {
                console.error(`Fallback pour ${path}:`, error);
                // Essayer avec le chemin direct comme fallback
                const img = new Image();
                img.onload = () => resolve(path);
                img.onerror = () => reject(`Impossible de charger ${path}`);
                img.src = path;
              });
          } else {
            // Fallback si l'API Cache n'est pas disponible
            const img = new Image();
            img.onload = () => resolve(path);
            img.onerror = () => reject(`Impossible de charger ${path}`);
            img.src = path;
          }
        });
      });
      
      try {
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Erreur lors du préchargement des images:', error);
        // En cas d'erreur, on considère quand même que les images sont chargées pour éviter de bloquer l'interface
        setImagesLoaded(true);
      }
    };
    
    preloadImages();
  }, []);

  const handlePlaySound = (soundName: string) => {
    if (!muted) {
      playSampleSound(soundName);
    }
  };
  
  const handlePlayViolinSound = () => {
    if (!muted) {
      playViolinSound();
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <div className={`${className} w-full bg-black border-t border-werewolf-accent/30 p-4 flex items-center justify-center gap-4 backdrop-blur-lg bg-opacity-70`}>
      <div className="text-white text-sm font-medium mr-2 flex items-center">
        {offlineMode && (
          <span className="ml-2 text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">
            Mode hors ligne
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-6 gap-4">
        <button
          onClick={() => handlePlaySound('sampler_loup.ogg')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
          disabled={!isAudioReady}
        >
          <img src="/img/sampler_loup.svg" alt="Loup" className="h-10 w-10 mb-1" />
          <span className="text-xs text-gray-300">Loup</span>
        </button>

        <button
          onClick={() => handlePlaySound('sampler_ours.ogg')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
          disabled={!isAudioReady}
        >
          <img src="/img/sampler_ours.svg" alt="Ours" className="h-10 w-10 mb-1" />
          <span className="text-xs text-gray-300">Ours</span>
        </button>

        <button
          onClick={() => handlePlaySound('sampler_clocher.ogg')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
          disabled={!isAudioReady}
        >
          <img src="/img/sampler_clocher.svg" alt="Clocher" className="h-10 w-10 mb-1" />
          <span className="text-xs text-gray-300">Clocher</span>
        </button>

        <button
          onClick={() => handlePlaySound('sampler_tonnerre.ogg')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
          disabled={!isAudioReady}
        >
          <img src="/img/sampler_tonnerre.svg" alt="Tonnerre" className="h-10 w-10 mb-1" />
          <span className="text-xs text-gray-300">Tonnerre</span>
        </button>
        
        <button
          onClick={() => handlePlaySound('sampler_clock.ogg')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
          disabled={!isAudioReady}
        >
          <img src="/img/sampler_clock.svg" alt="Horloge" className="h-10 w-10 mb-1" />
          <span className="text-xs text-gray-300">Horloge</span>
        </button>
        
        <button
          onClick={handlePlayViolinSound}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
          disabled={!isAudioReady}
        >
          <img src="/img/sampler_violon.svg" alt="Violon" className="h-10 w-10 mb-1" />
          <span className="text-xs text-gray-300">Violon</span>
        </button>
      </div>
    </div>
  );
};

export default SoundSampler;
