
import React from 'react';
import { CharacterType } from '@/types';
import { getPlayingTip } from '@/utils/characterTips';
import { Heart, Leaf } from 'lucide-react';

interface CharacterInfoProps {
  character: CharacterType;
  linkedCharacters?: {
    cupidPartner?: CharacterType | null;
    wildChildModel?: CharacterType | null;
  };
}

const CharacterInfo: React.FC<CharacterInfoProps> = ({ 
  character, 
  linkedCharacters
}) => {
  const playingTip = getPlayingTip(character);
  
  return (
    <>
      <div>
        <h3 className="text-sm font-medium">Description:</h3>
        <p className="text-sm">{character.description}</p>
      </div>
      
      {/* Show linked characters information if available */}
      {linkedCharacters?.cupidPartner && (
        <div className="mt-2 p-2 bg-pink-50 dark:bg-pink-900/20 rounded-md border border-pink-200 dark:border-pink-800">
          <h3 className="text-sm font-medium text-pink-600 dark:text-pink-400 flex items-center gap-1">
            <Heart className="h-4 w-4 fill-pink-200" /> Amoureux avec:
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-pink-300">
              <img src={linkedCharacters.cupidPartner.icon} alt={linkedCharacters.cupidPartner.name} className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-pink-600 dark:text-pink-400">
              {linkedCharacters.cupidPartner.name} 
              {linkedCharacters.cupidPartner.playerName && ` (${linkedCharacters.cupidPartner.playerName})`}
            </p>
          </div>
        </div>
      )}
      
      {linkedCharacters?.wildChildModel && (
        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
            <Leaf className="h-4 w-4 fill-green-200" /> Modèle:
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-green-300">
              <img src={linkedCharacters.wildChildModel.icon} alt={linkedCharacters.wildChildModel.name} className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">
              {linkedCharacters.wildChildModel.name}
              {linkedCharacters.wildChildModel.playerName && ` (${linkedCharacters.wildChildModel.playerName})`}
            </p>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-medium text-amber-500">Conseil de jeu:</h3>
        <p className="text-sm">{playingTip}</p>
      </div>
    </>
  );
};

export default CharacterInfo;
