
import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, Skull, Unlink } from 'lucide-react';
import { CharacterLinks } from '@/types';

interface CharacterActionButtonsProps {
  isAlive: boolean;
  canLinkCharacters: boolean;
  isCupid: boolean;
  isWildChild: boolean;
  characterLinks?: CharacterLinks;
  onLinkSelectionOpen: (type: 'cupid' | 'wildChild' | null) => void;
  onLinkCharacter?: (type: 'cupid' | 'wildChild', characterId: string, targetId: string) => void;
  onKillCharacter: () => void;
  characterId: string;
}

const CharacterActionButtons: React.FC<CharacterActionButtonsProps> = ({
  isAlive,
  canLinkCharacters,
  isCupid,
  isWildChild,
  characterLinks,
  onLinkSelectionOpen,
  onLinkCharacter,
  onKillCharacter,
  characterId
}) => {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {canLinkCharacters && (
        <div className="w-full grid grid-cols-2 gap-2">
          {isCupid && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onLinkSelectionOpen('cupid')}
              disabled={characterLinks?.cupidLinks?.length === 2}
            >
              <img 
                src="/img/perso_amoureux.svg" 
                alt="Amoureux" 
                className="mr-2 h-4 w-4 text-pink-500" 
              /> Lier amoureux
            </Button>
          )}
          {isWildChild && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onLinkSelectionOpen('wildChild')}
              disabled={characterLinks?.wildChildModel !== null && characterLinks?.wildChildModel !== undefined}
            >
              <Leaf className="mr-2 h-4 w-4 text-green-500" /> Choisir modèle
            </Button>
          )}
          {((isCupid && characterLinks?.cupidLinks?.length) || 
            (isWildChild && characterLinks?.wildChildModel)) && (
            <Button 
              variant="outline" 
              className="w-full text-red-500"
              onClick={() => {
                if (onLinkCharacter) {
                  if (isCupid && characterLinks?.cupidLinks) {
                    onLinkCharacter('cupid', '', '');
                  }
                  if (isWildChild && characterLinks?.wildChildModel) {
                    onLinkCharacter('wildChild', '', '');
                  }
                }
              }}
            >
              <Unlink className="mr-2 h-4 w-4" /> Retirer lien
            </Button>
          )}
        </div>
      )}
      
      {isAlive ? (
        <Button 
          variant="destructive" 
          onClick={onKillCharacter}
          className="w-full"
        >
          <Skull className="mr-2 h-4 w-4" /> Éliminer ce personnage
        </Button>
      ) : (
        <Button 
          variant="outline" 
          onClick={onKillCharacter}
          className="w-full"
        >
          Ressusciter ce personnage
        </Button>
      )}
    </div>
  );
};

export default CharacterActionButtons;
