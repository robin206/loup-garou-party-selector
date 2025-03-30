
import { useCallback, useEffect, useState } from 'react';
import audioService from '../services/audioService';

export function useAudio() {
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Au premier chargement, préchargeons les fichiers audio
  useEffect(() => {
    const preloadAudio = async () => {
      try {
        await audioService.preloadAudioFiles();
        setIsAudioReady(true);
        console.log('Préchargement audio terminé');
      } catch (error) {
        console.error('Erreur lors du préchargement audio:', error);
        // Même en cas d'erreur, considérons que l'audio est prêt pour ne pas bloquer l'application
        setIsAudioReady(true);
      }
    };
    
    preloadAudio();
    
    // Nettoyage en cas de démontage du composant
    return () => {
      audioService.stopAudio();
    };
  }, []);

  const playDayMusic = useCallback(() => {
    try {
      const dayMusic = localStorage.getItem('werewolf-day-music') || audioService.getDefaultDayMusic();
      audioService.playAudio(dayMusic, true);
    } catch (error) {
      console.error('Erreur lors de la lecture de la musique de jour:', error);
    }
  }, []);
  
  const playNightMusic = useCallback(() => {
    try {
      const nightMusic = localStorage.getItem('werewolf-night-music') || audioService.getDefaultNightMusic();
      audioService.playAudio(nightMusic, true);
    } catch (error) {
      console.error('Erreur lors de la lecture de la musique de nuit:', error);
    }
  }, []);
  
  const playVoteMusic = useCallback(() => {
    try {
      const voteMusic = localStorage.getItem('werewolf-vote-music') || audioService.getDefaultVoteMusic();
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
  
  return {
    isAudioReady,
    playDayMusic,
    playNightMusic,
    playVoteMusic,
    stopMusic,
    getAvailableAudios,
    getAmbianceAudios,
    playSampleSound
  };
}
