
import React from 'react';
import { CharacterType } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';
import TooltipWrapper from './TooltipWrapper';

interface CharacterCardProps {
  character: CharacterType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  selectedCount: number;
  isAlive?: boolean;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
  canSelectMultiple?: (id: string) => boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected,
  onSelect,
  selectedCount,
  isAlive = true,
  onIncrease,
  onDecrease,
  canSelectMultiple = () => true
}) => {
  const showCounterControls = isSelected && canSelectMultiple(character.id) && onIncrease && onDecrease;
  
  return (
    <TooltipWrapper character={character} isAlive={isAlive}>
      <div
        className={cn(
          "character-card relative rounded-lg border shadow-sm transition-all overflow-hidden h-full flex flex-col",
          isSelected 
            ? "border-werewolf-accent ring-1 ring-werewolf-accent bg-werewolf-accent/5" 
            : "border-gray-200 dark:border-gray-700 hover:border-werewolf-accent/50",
          !isAlive && "grayscale opacity-70"
        )}
      >
        <div 
          className="p-3 cursor-pointer flex-1 flex flex-col"
          onClick={() => onSelect(character.id)}
        >
          <div className="mb-2 flex justify-center">
            {character.icon && character.icon.startsWith('/') ? (
              <img 
                src={character.icon} 
                alt={character.name} 
                className="h-20 w-20 object-contain"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full">
                <span className="text-xl font-medium">{character.name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-center mb-1">{character.name}</h3>
          
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">
            {character.team === 'village' ? 'Village' : 
             character.team === 'werewolf' ? 'Loup-Garou' : 'Solitaire'}
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">
            {character.description}
          </p>
        </div>
        
        {isSelected && (
          <div className="bg-gray-100 dark:bg-gray-800 p-2 flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Sélectionné{selectedCount > 1 ? ` (${selectedCount})` : ''}
            </div>
            
            {showCounterControls ? (
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => onDecrease && onDecrease(character.id)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Badge variant="secondary" className="bg-werewolf-accent text-white">
                  {selectedCount}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => onIncrease && onIncrease(character.id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Badge variant="secondary" className={selectedCount > 1 ? "bg-werewolf-accent text-white" : ""}>
                {selectedCount}
              </Badge>
            )}
          </div>
        )}
      </div>
    </TooltipWrapper>
  );
};

export default CharacterCard;
