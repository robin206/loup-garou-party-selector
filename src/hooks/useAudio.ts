
import { useCallback, useEffect } from 'react';
import audioService from '../services/audioService';

export function useAudio() {
  // Au premier chargement, préchargons les fichiers audio
  useEffect(() => {
    audioService.preloadAudioFiles();
  }, []);

  const playDayMusic = useCallback(() => {
    const dayMusic = localStorage.getItem('werewolf-day-music') || audioService.getDefaultDayMusic();
    audioService.playAudio(dayMusic, true);
  }, []);
  
  const playNightMusic = useCallback(() => {
    const nightMusic = localStorage.getItem('werewolf-night-music') || audioService.getDefaultNightMusic();
    audioService.playAudio(nightMusic, true);
  }, []);
  
  const playVoteMusic = useCallback(() => {
    const voteMusic = localStorage.getItem('werewolf-vote-music') || audioService.getDefaultVoteMusic();
    audioService.playAudio(voteMusic, true);
  }, []);
  
  const stopMusic = useCallback(() => {
    audioService.stopAudio();
  }, []);
  
  const getAvailableAudios = useCallback(() => {
    return audioService.getAvailableAudioFiles();
  }, []);
  
  const getAmbianceAudios = useCallback(() => {
    return audioService.getAmbianceAudioFiles();
  }, []);
  
  const playSampleSound = useCallback((soundName: string) => {
    audioService.playSampleSound(soundName);
  }, []);
  
  return {
    playDayMusic,
    playNightMusic,
    playVoteMusic,
    stopMusic,
    getAvailableAudios,
    getAmbianceAudios,
    playSampleSound
  };
}
