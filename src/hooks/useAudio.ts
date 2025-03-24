
import { useCallback } from 'react';
import audioService from '../services/audioService';

export function useAudio() {
  const playDayMusic = useCallback(() => {
    const dayMusic = localStorage.getItem('werewolf-day-music') || 'jour.mp3';
    audioService.playAudio(dayMusic, true);
  }, []);
  
  const playNightMusic = useCallback(() => {
    const nightMusic = localStorage.getItem('werewolf-night-music') || 'nuit.mp3';
    audioService.playAudio(nightMusic, true);
  }, []);
  
  const playVoteMusic = useCallback(() => {
    const voteMusic = localStorage.getItem('werewolf-vote-music') || 'vote.mp3';
    audioService.playAudio(voteMusic, true);
  }, []);
  
  const stopMusic = useCallback(() => {
    audioService.stopAudio();
  }, []);
  
  return {
    playDayMusic,
    playNightMusic,
    playVoteMusic,
    stopMusic
  };
}
