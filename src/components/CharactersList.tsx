
import React, { useState } from 'react';
import { CharacterType } from '@/types';
import TooltipWrapper from './TooltipWrapper';
import { cn } from '@/lib/utils';
import CharacterDetailsDialog from './CharacterDetailsDialog';
import { Users } from 'lucide-react';

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

  // Calculate alive character counts
  const aliveVillageCount = villageChars.filter(char => 
    aliveCharacters.includes(char.instanceId || char.id)
  ).length;
  
  const aliveWerewolfCount = werewolfChars.filter(char => 
    aliveCharacters.includes(char.instanceId || char.id)
  ).length;
  
  const aliveSoloCount = soloChars.filter(char => 
    aliveCharacters.includes(char.instanceId || char.id)
  ).length;
  
  const totalAliveCount = aliveVillageCount + aliveWerewolfCount + aliveSoloCount;

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
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-gray-400">Personnages en jeu</h3>
        <div className="flex items-center text-xs bg-zinc-900/60 px-2 py-1 rounded-full">
          <Users className="h-3 w-3 mr-1 text-werewolf-accent" />
          <span className="font-medium">{totalAliveCount}</span>
          <span className="text-gray-400 mx-1">joueurs vivants</span>
        </div>
      </div>
      
      <div className="flex justify-between mb-3 text-xs">
        <div className="flex flex-col items-center bg-blue-950/20 px-3 py-1 rounded-lg w-1/3 mx-0.5">
          <span className="text-blue-500 font-medium">Village</span>
          <span className="text-white">{aliveVillageCount}/{villageChars.length}</span>
        </div>
        <div className="flex flex-col items-center bg-red-950/20 px-3 py-1 rounded-lg w-1/3 mx-0.5">
          <span className="text-werewolf-blood font-medium">Loups</span>
          <span className="text-white">{aliveWerewolfCount}/{werewolfChars.length}</span>
        </div>
        {soloChars.length > 0 && (
          <div className="flex flex-col items-center bg-amber-950/20 px-3 py-1 rounded-lg w-1/3 mx-0.5">
            <span className="text-amber-500 font-medium">Solo</span>
            <span className="text-white">{aliveSoloCount}/{soloChars.length}</span>
          </div>
        )}
      </div>
      
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
