
import React from 'react';
import { CharacterType } from '@/types';

interface CharacterPortraitProps {
  character: CharacterType;
  isAlive: boolean;
}

const CharacterPortrait: React.FC<CharacterPortraitProps> = ({ character, isAlive }) => {
  return (
    <div className="mt-3 flex flex-col items-center">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-werewolf-accent">
        <img 
          src={character.icon} 
          alt={character.name} 
          className={`w-full h-full object-contain p-2 ${!isAlive ? 'grayscale opacity-70' : ''}`}
        />
      </div>
    </div>
  );
};

export default CharacterPortrait;
