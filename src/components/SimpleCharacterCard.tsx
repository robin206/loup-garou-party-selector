
import React from 'react';
import { CharacterType } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import TooltipWrapper from './TooltipWrapper';

interface SimpleCharacterCardProps {
  character: CharacterType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  selectedCount: number;
  isAlive?: boolean;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
}

const SimpleCharacterCard: React.FC<SimpleCharacterCardProps> = ({ 
  character, 
  isSelected, 
  onSelect,
  selectedCount,
  isAlive = true,
  onIncrease,
  onDecrease
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger selection if not clicking on the counter buttons
    if (!(e.target instanceof HTMLButtonElement)) {
      onSelect(character.id);
    }
  };

  return (
    <TooltipWrapper character={character} isAlive={isAlive}>
      <div 
        className={cn(
          "simple-character-card p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer transition-all",
          "hover:shadow-md hover:-translate-y-1 flex flex-col items-center gap-2",
          isSelected && "ring-2 ring-werewolf-accent bg-werewolf-accent/5",
          !isAlive && "grayscale opacity-70"
        )}
        onClick={handleCardClick}
      >
        <div className="character-icon w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
          {character.icon && character.icon.startsWith('/') ? (
            <img 
              src={character.icon} 
              alt={character.name} 
              className="h-10 w-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full">
              <span className="text-sm font-medium">{character.name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-center">{character.name}</h3>
        
        {isSelected && (
          <div className="mt-1 flex items-center justify-center gap-1">
            {onDecrease && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrease(character.id);
                }}
              >
                <Minus className="h-3 w-3" />
              </Button>
            )}
            <Badge variant="secondary" className="bg-werewolf-accent text-white h-6 min-w-6 flex items-center justify-center">
              {selectedCount}
            </Badge>
            {onIncrease && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrease(character.id);
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </TooltipWrapper>
  );
};

export default SimpleCharacterCard;
