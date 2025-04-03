
import React from 'react';
import { CharacterType } from '@/types';
import { Heart, Leaf } from 'lucide-react';

interface CharacterPortraitProps {
  character: CharacterType;
  isAlive: boolean;
  isLinkedByCupid?: boolean;
  isWildChildModel?: boolean;
}

const CharacterPortrait: React.FC<CharacterPortraitProps> = ({ 
  character, 
  isAlive,
  isLinkedByCupid = false,
  isWildChildModel = false
}) => {
  return (
    <div className="mt-3 flex flex-col items-center">
      <div className={`relative w-32 h-32 rounded-full overflow-hidden border-4 ${
        isWildChildModel 
          ? 'border-green-500' 
          : isLinkedByCupid 
            ? 'border-pink-500' 
            : 'border-werewolf-accent'
      }`}>
        <img 
          src={character.icon} 
          alt={character.name} 
          className={`w-full h-full object-contain p-2 ${!isAlive ? 'grayscale opacity-70' : ''}`}
        />
        
        {/* Visual indicators for linked characters */}
        {isLinkedByCupid && isAlive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-16 h-16 text-pink-500 fill-pink-500/30" />
          </div>
        )}
        
        {isWildChildModel && isAlive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-16 h-16 text-green-500 fill-green-500/30" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterPortrait;
