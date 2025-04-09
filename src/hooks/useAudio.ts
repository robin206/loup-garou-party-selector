import { useCallback, useEffect, useState, useRef } from 'react';
import audioService from '../services/audioService';

export function useAudio() {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    const preloadAudio = async () => {
      if (audioInitializedRef.current) return;
      
      try {
        if (!localStorage.getItem('werewolf-day-music')) {
          localStorage.setItem('werewolf-day-music', 'Ambiance_medieval-citytavern-ambient-235876.mp3');
        }
        
        if (!localStorage.getItem('werewolf-night-music')) {
          localStorage.setItem('werewolf-night-music', 'Ambiance_ominous-horror-soundtrack-312558.mp3');
        }
        
        if (!localStorage.getItem('werewolf-vote-music')) {
          localStorage.setItem('werewolf-vote-music', 'Ambiance_dark-ambient-atmosphere-1-141313.mp3');
        }
        
        if ('caches' in window) {
          try {
            const cacheName = 'loup-garou-v2';
            await caches.delete(cacheName);
            console.log('Cache nettoyé avec succès');
          } catch (cacheError) {
            console.warn('Impossible de nettoyer le cache:', cacheError);
          }
        }
        
        await audioService.preloadAudioFiles();
        setIsAudioReady(true);
        audioInitializedRef.current = true;
        console.log('Préchargement audio terminé');
      } catch (error) {
        console.error('Erreur lors du préchargement audio:', error);
        setIsAudioReady(true);
        audioInitializedRef.current = true;
      }
    };
    
    preloadAudio();
    
    return () => {
      audioService.stopAudio();
    };
  }, []);

  const playDayMusic = useCallback(() => {
    try {
      const dayMusic = localStorage.getItem('werewolf-day-music') || 'ambiance_cobblevillage.webm';
      audioService.playAudio(dayMusic, true);
    } catch (error) {
      console.error('Erreur lors de la lecture de la musique de jour:', error);
    }
  }, []);
  
  const playNightMusic = useCallback(() => {
    try {
      const nightMusic = localStorage.getItem('werewolf-night-music') || 'ambiance_defautnuit.webm';
      audioService.playAudio(nightMusic, true);
    } catch (error) {
      console.error('Erreur lors de la lecture de la musique de nuit:', error);
    }
  }, []);
  
  const playVoteMusic = useCallback(() => {
    try {
      const voteMusic = localStorage.getItem('werewolf-vote-music') || 'ambiance_clear-haken.webm';
      audioService.playAudio(voteMusic, true);
    } catch (error) {
      console.error('Erreur lors de la lecture de la musique de vote:', error);
    }
  }, []);
  
  const stopMusic = useCallback(() => {
    try {
      audioService.stopAudio();
    } catch (error) {
      console.error('Erreur lors de l\'arrêt de la musique:', error);
    }
  }, []);
  
  const getAvailableAudios = useCallback(() => {
    return audioService.getAvailableAudioFiles();
  }, []);
  
  const getAmbianceAudios = useCallback(() => {
    return audioService.getAmbianceAudioFiles();
  }, []);
  
  const playSampleSound = useCallback((soundName: string) => {
    try {
      audioService.playSampleSound(soundName);
    } catch (error) {
      console.error('Erreur lors de la lecture du son:', error);
    }
  }, []);
  
  const playViolinSound = useCallback(() => {
    try {
      audioService.playSampleSound('sampler_violon.ogg');
    } catch (error) {
      console.error('Erreur lors de la lecture du son de violon:', error);
    }
  }, []);
  
  const playHunterWarning = useCallback(() => {
    try {
      audioService.playSampleSound('sampler_hunter.ogg');
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'alerte du Chasseur:', error);
    }
  }, []);
  
  const addCustomAudio = useCallback(async (fileName: string, audioBlob: Blob) => {
    try {
      await audioService.addCustomAudio(fileName, audioBlob);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'audio personnalisé:', error);
      return false;
    }
  }, []);

  return {
    isAudioReady,
    playDayMusic,
    playNightMusic,
    playVoteMusic,
    stopMusic,
    getAvailableAudios,
    getAmbianceAudios,
    playSampleSound,
    playHunterWarning,
    playViolinSound,
    addCustomAudio
  };
}
