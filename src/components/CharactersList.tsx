
import React from 'react';
import { CharacterType } from '@/types';
import TooltipWrapper from './TooltipWrapper';
import { cn } from '@/lib/utils';

interface CharactersListProps {
  characters: CharacterType[];
  className?: string;
  size?: 'sm' | 'md';
}

const CharactersList: React.FC<CharactersListProps> = ({ 
  characters, 
  className,
  size = 'sm'
}) => {
  // Group characters by team
  const villageChars = characters.filter(char => char.team === 'village');
  const werewolfChars = characters.filter(char => char.team === 'werewolf');
  const soloChars = characters.filter(char => char.team === 'solo');

  const iconSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const containerClass = size === 'sm' ? 'gap-1' : 'gap-2';

  return (
    <div className={cn("glass-card p-2 rounded-xl", className)}>
      <h3 className="text-xs font-semibold mb-2 text-gray-400">Personnages en jeu</h3>
      
      <div className="space-y-2">
        {werewolfChars.length > 0 && (
          <div className="team-container">
            <h4 className="text-[10px] font-medium text-werewolf-blood mb-1">Loups-Garous</h4>
            <div className={cn("flex flex-wrap", containerClass)}>
              {werewolfChars.map(character => (
                <TooltipWrapper key={character.id} character={character} side="top">
                  <div className={cn("rounded-full overflow-hidden border border-werewolf-blood/30 bg-zinc-900", iconSize)}>
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
              {villageChars.map(character => (
                <TooltipWrapper key={character.id} character={character} side="top">
                  <div className={cn("rounded-full overflow-hidden border border-blue-500/30 bg-zinc-900", iconSize)}>
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
              {soloChars.map(character => (
                <TooltipWrapper key={character.id} character={character} side="top">
                  <div className={cn("rounded-full overflow-hidden border border-amber-500/30 bg-zinc-900", iconSize)}>
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
    </div>
  );
};

export default CharactersList;
