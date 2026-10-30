
import React from 'react';
import AudioLightButton from './AudioLightButton';
import { useAudio } from '@/hooks/useAudio';
import { projector } from '@/lib/projector';

/**
 * Les trois grands boutons de phase (Jour / Vote / Nuit) affichés dans la carte de jeu.
 * Volume, extinction des lumières, Bluetooth et projecteur sont dans la barre de régie
 * flottante (GameControlBar).
 */
export const AudioPhaseControls = () => {
  const { playDayMusic, playNightMusic, playVoteMusic, stopMusic } = useAudio();

  const handlePlayDay = () => {
    playDayMusic();
    projector.day();
  };

  const handlePlayNight = () => {
    playNightMusic();
    projector.night();
  };

  const handlePlayVote = () => {
    playVoteMusic();
    // Le vote ne modifie pas l'état du projecteur (reste sur JOUR ou NUIT en cours)
  };

  return (
    <div className="mb-4 flex gap-3">
      <AudioLightButton label="Jour" type="day" playMusic={handlePlayDay} stopMusic={stopMusic} />
      <AudioLightButton label="Vote" type="vote" playMusic={handlePlayVote} stopMusic={stopMusic} />
      <AudioLightButton label="Nuit" type="night" playMusic={handlePlayNight} stopMusic={stopMusic} />
    </div>
  );
};
