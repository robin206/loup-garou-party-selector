
import React, { useState } from 'react';
import { CharacterType, CharacterLinks } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Skull } from 'lucide-react';
import { toast } from 'sonner';
import CharacterPortrait from './CharacterPortrait';
import PlayerNameInput from './PlayerNameInput';
import CharacterInfo from './CharacterInfo';
import CharacterLinkSelector from './CharacterLinkSelector';
import CharacterActionButtons from './CharacterActionButtons';

interface CharacterDetailsDialogProps {
  character: CharacterType;
  isOpen: boolean;
  onClose: () => void;
  onKillCharacter: (id: string) => void;
  isAlive: boolean;
  gameCharacters?: CharacterType[];
  characterLinks?: CharacterLinks;
  onLinkCharacter?: (type: 'cupid' | 'wildChild', characterId: string, targetId: string) => void;
  playerName?: string;
  onPlayerNameChange?: (characterId: string, name: string) => void;
  showPlayerNames?: boolean;
}

const CharacterDetailsDialog: React.FC<CharacterDetailsDialogProps> = ({ 
  character, 
  isOpen, 
  onClose, 
  onKillCharacter,
  isAlive,
  gameCharacters = [],
  characterLinks,
  onLinkCharacter,
  playerName = '',
  onPlayerNameChange,
  showPlayerNames = false
}) => {
  const [linkSelectionOpen, setLinkSelectionOpen] = useState<'cupid' | 'wildChild' | null>(null);
  
  const isWildChild = character.id === 'wild-child';
  const isCupid = character.id === 'cupid';
  
  const canLinkCharacters = isAlive && (isWildChild || isCupid);
  
  const handleLinkCharacter = (targetId: string) => {
    if (!linkSelectionOpen || !onLinkCharacter) return;
    
    onLinkCharacter(linkSelectionOpen, character.instanceId || character.id, targetId);
    setLinkSelectionOpen(null);
    toast.success(`Personnage lié avec succès !`);
  };

  const handlePlayerNameChange = (name: string) => {
    if (onPlayerNameChange) {
      onPlayerNameChange(character.instanceId || character.id, name);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {character.name}
            {!isAlive && (
              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <Skull className="h-3 w-3" /> Éliminé
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            <CharacterPortrait character={character} isAlive={isAlive} />

            <div className="mt-5 space-y-4">
              {showPlayerNames && onPlayerNameChange && (
                <PlayerNameInput 
                  playerName={playerName || ''} 
                  onPlayerNameChange={handlePlayerNameChange}
                />
              )}

              <CharacterInfo character={character} />
              
              {linkSelectionOpen && (
                <CharacterLinkSelector 
                  linkType={linkSelectionOpen}
                  gameCharacters={gameCharacters}
                  currentCharacterId={character.instanceId || character.id}
                  onLinkCharacter={handleLinkCharacter}
                />
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4 flex flex-col gap-2">
          <CharacterActionButtons 
            isAlive={isAlive}
            canLinkCharacters={canLinkCharacters}
            isCupid={isCupid}
            isWildChild={isWildChild}
            characterLinks={characterLinks}
            onLinkSelectionOpen={setLinkSelectionOpen}
            onLinkCharacter={onLinkCharacter}
            onKillCharacter={() => onKillCharacter(character.instanceId || character.id)}
            characterId={character.instanceId || character.id}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterDetailsDialog;
