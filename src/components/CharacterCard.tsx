import React from 'react';
import { CharacterType } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import TooltipWrapper from './TooltipWrapper';

interface CharacterCardProps {
  character: CharacterType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isAlive?: boolean;
  selectedCount?: number;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
}

const getExpansionColor = (expansion: string): string => {
  switch (expansion) {
    case 'base':
      return 'bg-gray-100 text-gray-700';
    case 'new-moon':
      return 'bg-indigo-100 text-indigo-700';
    case 'characters-pack':
      return 'bg-emerald-100 text-emerald-700';
    case 'village':
      return 'bg-amber-100 text-amber-700';
    case 'bonus':
      return 'bg-pink-100 text-pink-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getExpansionName = (expansion: string): string => {
  switch (expansion) {
    case 'base':
      return 'Base';
    case 'new-moon':
      return 'Nouvelle Lune';
    case 'characters-pack':
      return 'Pack';
    case 'village':
      return 'Village';
    case 'bonus':
      return 'Bonus';
    default:
      return '';
  }
};

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected,
  onSelect,
  isAlive = true,
  selectedCount = 0,
  onIncrease,
  onDecrease
}) => {
  const getTeamColor = (team: string): string => {
    switch (team) {
      case 'werewolf':
        return 'from-werewolf-blood/10 to-werewolf-blood/20';
      case 'village':
        return 'from-blue-500/10 to-blue-500/20';
      case 'solo':
        return 'from-amber-500/10 to-amber-500/20';
      default:
        return 'from-gray-500/10 to-gray-500/20';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger selection if not clicking on the counter buttons
    if (!(e.target instanceof HTMLButtonElement)) {
      onSelect(character.id);
    }
  };

  return <TooltipWrapper character={character} isAlive={isAlive}>
      <div 
        className={cn(
          "character-card glass-card animate-scale-in", 
          isSelected && "selected ring-2 ring-werewolf-accent bg-gray-800", 
          !isAlive && "grayscale opacity-70"
        )} 
        onClick={handleCardClick}
      >
        <div className={cn("character-card-image", getTeamColor(character.team))}>
          {character.icon && character.icon.startsWith('/') ? <img src={character.icon} alt={character.name} className="h-12 w-12 object-contain" /> : <div className="h-12 w-12 flex items-center justify-center bg-gray-200 rounded-full">
              <span className="text-sm">{character.name.charAt(0)}</span>
            </div>}
        </div>
        <h3 className="text-sm font-semibold mb-1">{character.name}</h3>
        
        
        {isSelected && selectedCount > 0 && <div className="flex justify-center items-center space-x-1 mt-2">
            {onDecrease && <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full text-black" 
              onClick={e => {
                e.stopPropagation();
                onDecrease(character.id);
              }}
            >
                <Minus className="h-3 w-3" />
              </Button>}
            <span className="text-sm font-medium bg-werewolf-accent/10 text-werewolf-accent px-2 py-0.5 rounded-full">
              {selectedCount}
            </span>
            {onIncrease && <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full text-black" 
              onClick={e => {
                e.stopPropagation();
                onIncrease(character.id);
              }}
            >
                <Plus className="h-3 w-3" />
              </Button>}
          </div>}
        
        <div className="flex flex-wrap gap-1 mt-2 justify-center">
          {character.recommended && <span className="px-2 py-0.5 bg-werewolf-accent/10 text-werewolf-accent rounded-full text-xs font-medium">
              Recommandé
            </span>}
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getExpansionColor(character.expansion))}>
            {getExpansionName(character.expansion)}
          </span>
        </div>
      </div>
    </TooltipWrapper>;
};

export default CharacterCard;
