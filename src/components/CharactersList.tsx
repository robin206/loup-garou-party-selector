
import React, { useState } from 'react';
import { CharacterType } from '@/types';
import TooltipWrapper from './TooltipWrapper';
import { cn } from '@/lib/utils';
import CharacterDetailsDialog from './CharacterDetailsDialog';

interface CharactersListProps {
  characters: CharacterType[];
  className?: string;
  size?: 'sm' | 'md';
  aliveCharacters?: string[];
  onKillCharacter?: (id: string) => void;
}

const CharactersList: React.FC<CharactersListProps> = ({ 
  characters, 
  className,
  size = 'sm',
  aliveCharacters = [],
  onKillCharacter
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null);
  
  // Group characters by team
  const villageChars = characters.filter(char => char.team === 'village');
  const werewolfChars = characters.filter(char => char.team === 'werewolf');
  const soloChars = characters.filter(char => char.team === 'solo');

  const iconSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const containerClass = size === 'sm' ? 'gap-1' : 'gap-2';
  
  const handleCharacterClick = (character: CharacterType) => {
    if (onKillCharacter) {
      setSelectedCharacter(character);
    }
  };
  
  const handleCloseDialog = () => {
    setSelectedCharacter(null);
  };
  
  const isAlive = (character: CharacterType) => {
    const characterId = character.instanceId || character.id;
    return aliveCharacters.includes(characterId);
  };

  return (
    <div className={cn("glass-card p-2 rounded-xl", className)}>
      <h3 className="text-xs font-semibold mb-2 text-gray-400">Personnages en jeu</h3>
      
      <div className="space-y-2">
        {werewolfChars.length > 0 && (
          <div className="team-container">
            <h4 className="text-[10px] font-medium text-werewolf-blood mb-1">Loups-Garous</h4>
            <div className={cn("flex flex-wrap", containerClass)}>
              {werewolfChars.map((character, index) => (
                <TooltipWrapper 
                  key={character.instanceId || `${character.id}-${index}`} 
                  character={character} 
                  side="top"
                >
                  <div 
                    className={cn(
                      "rounded-full overflow-hidden border bg-zinc-900 cursor-pointer transition-all",
                      isAlive(character) 
                        ? "border-werewolf-blood/30" 
                        : "border-gray-600/30 grayscale opacity-70",
                      iconSize
                    )}
                    onClick={() => handleCharacterClick(character)}
                  >
                    <img 
                      src={character.icon} 
                      alt={character.name} 
                      className="w-full h-full object-contain p-1" 
                    />
                  </div>
                </TooltipWrapper>
              ))}
            </div>
          </div>
        )}
        
        {villageChars.length > 0 && (
          <div className="team-container">
            <h4 className="text-[10px] font-medium text-blue-500 mb-1">Village</h4>
            <div className={cn("flex flex-wrap", containerClass)}>
              {villageChars.map((character, index) => (
                <TooltipWrapper 
                  key={character.instanceId || `${character.id}-${index}`} 
                  character={character} 
                  side="top"
                >
                  <div 
                    className={cn(
                      "rounded-full overflow-hidden border bg-zinc-900 cursor-pointer transition-all",
                      isAlive(character) 
                        ? "border-blue-500/30" 
                        : "border-gray-600/30 grayscale opacity-70",
                      iconSize
                    )}
                    onClick={() => handleCharacterClick(character)}
                  >
                    <img 
                      src={character.icon} 
                      alt={character.name} 
                      className="w-full h-full object-contain p-1" 
                    />
                  </div>
                </TooltipWrapper>
              ))}
            </div>
          </div>
        )}
        
        {soloChars.length > 0 && (
          <div className="team-container">
            <h4 className="text-[10px] font-medium text-amber-500 mb-1">Solitaires</h4>
            <div className={cn("flex flex-wrap", containerClass)}>
              {soloChars.map((character, index) => (
                <TooltipWrapper 
                  key={character.instanceId || `${character.id}-${index}`} 
                  character={character} 
                  side="top"
                >
                  <div 
                    className={cn(
                      "rounded-full overflow-hidden border bg-zinc-900 cursor-pointer transition-all",
                      isAlive(character) 
                        ? "border-amber-500/30" 
                        : "border-gray-600/30 grayscale opacity-70",
                      iconSize
                    )}
                    onClick={() => handleCharacterClick(character)}
                  >
                    <img 
                      src={character.icon} 
                      alt={character.name} 
                      className="w-full h-full object-contain p-1" 
                    />
                  </div>
                </TooltipWrapper>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {selectedCharacter && onKillCharacter && (
        <CharacterDetailsDialog 
          character={selectedCharacter}
          isOpen={!!selectedCharacter}
          onClose={handleCloseDialog}
          onKillCharacter={() => onKillCharacter(selectedCharacter.instanceId || selectedCharacter.id)}
          isAlive={isAlive(selectedCharacter)}
        />
      )}
    </div>
  );
};

export default CharactersList;
