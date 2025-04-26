
import React from 'react';
import AudioLightButton from './AudioLightButton';
import { useAudio } from '@/hooks/useAudio';

export const AudioPhaseControls = () => {
  const { playDayMusic, playNightMusic, playVoteMusic, stopMusic } = useAudio();

  const handlePlayDay = () => {
    playDayMusic();
  };

  const handlePlayNight = () => {
    playNightMusic();
  };

  const handlePlayVote = () => {
    playVoteMusic();
  };

  return (
    <div className="mb-4 flex gap-2">
      <AudioLightButton 
        label="Jour" 
        type="day" 
        playMusic={handlePlayDay} 
        stopMusic={stopMusic} 
      />
      <AudioLightButton 
        label="Vote" 
        type="vote" 
        playMusic={handlePlayVote} 
        stopMusic={stopMusic} 
      />
      <AudioLightButton 
        label="Nuit" 
        type="night" 
        playMusic={handlePlayNight} 
        stopMusic={stopMusic} 
      />
    </div>
  );
};
