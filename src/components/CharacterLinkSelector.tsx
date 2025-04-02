
import React from 'react';
import { Button } from '@/components/ui/button';
import { CharacterType } from '@/types';

interface CharacterLinkSelectorProps {
  linkType: 'cupid' | 'wildChild';
  gameCharacters: CharacterType[];
  currentCharacterId: string;
  onLinkCharacter: (characterId: string) => void;
}

const CharacterLinkSelector: React.FC<CharacterLinkSelectorProps> = ({
  linkType,
  gameCharacters,
  currentCharacterId,
  onLinkCharacter,
}) => {
  const filteredCharacters = gameCharacters.filter(c => {
    if (linkType === 'wildChild') {
      return (c.instanceId || c.id) !== currentCharacterId;
    }
    return true;
  });

  return (
    <div className="mt-3">
      <h3 className="text-sm font-medium mb-2">
        {linkType === 'cupid' ? 'Choisir les amoureux' : 'Choisir un modèle'}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {filteredCharacters.map(char => (
          <Button 
            key={char.instanceId || char.id}
            size="sm"
            variant="outline"
            className="text-xs justify-start gap-1"
            onClick={() => onLinkCharacter(char.instanceId || char.id)}
          >
            <img 
              src={char.icon} 
              alt={char.name} 
              className="w-4 h-4 object-contain" 
            />
            {char.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CharacterLinkSelector;
