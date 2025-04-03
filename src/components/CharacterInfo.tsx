
import React from 'react';
import { CharacterType } from '@/types';
import { getPlayingTip } from '@/utils/characterTips';

interface CharacterInfoProps {
  character: CharacterType;
}

const CharacterInfo: React.FC<CharacterInfoProps> = ({ character }) => {
  const playingTip = getPlayingTip(character);
  
  return (
    <>
      <div>
        <h3 className="text-sm font-medium">Description:</h3>
        <p className="text-sm">{character.description}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-amber-500">Conseil de jeu:</h3>
        <p className="text-sm">{playingTip}</p>
      </div>
    </>
  );
};

export default CharacterInfo;
