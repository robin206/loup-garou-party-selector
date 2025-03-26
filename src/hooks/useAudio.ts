
import { useCallback } from 'react';
import audioService from '../services/audioService';

export function useAudio() {
  const playDayMusic = useCallback(() => {
    const dayMusic = localStorage.getItem('werewolf-day-music') || 'jour.webm';
    audioService.playAudio(dayMusic, true);
  }, []);
  
  const playNightMusic = useCallback(() => {
    const nightMusic = localStorage.getItem('werewolf-night-music') || 'nuit.webm';
    audioService.playAudio(nightMusic, true);
  }, []);
  
  const playVoteMusic = useCallback(() => {
    const voteMusic = localStorage.getItem('werewolf-vote-music') || 'vote.webm';
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
