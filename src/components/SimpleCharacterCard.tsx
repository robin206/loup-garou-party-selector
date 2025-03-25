
import React from 'react';
import { CharacterType } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SimpleCharacterCardProps {
  character: CharacterType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  selectedCount: number;
}

const SimpleCharacterCard: React.FC<SimpleCharacterCardProps> = ({ 
  character, 
  isSelected, 
  onSelect,
  selectedCount 
}) => {
  return (
    <div 
      className={cn(
        "simple-character-card p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer transition-all",
        "hover:shadow-md hover:-translate-y-1 flex flex-col items-center gap-2",
        isSelected && "ring-2 ring-werewolf-accent bg-werewolf-accent/5"
      )}
      onClick={() => onSelect(character.id)}
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
      
      {isSelected && selectedCount > 0 && (
        <Badge variant="secondary" className="absolute -top-2 -right-2 bg-werewolf-accent text-white">
          {selectedCount}
        </Badge>
      )}
    </div>
  );
};

export default SimpleCharacterCard;
