import React, { useState } from 'react';
import { CharacterType, CharacterLinks } from '@/types';
import TooltipWrapper from './TooltipWrapper';
import { cn } from '@/lib/utils';
import CharacterDetailsDialog from './CharacterDetailsDialog';
import { Users, Heart, Leaf, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
interface CharactersListProps {
  characters: CharacterType[];
  className?: string;
  size?: 'sm' | 'md';
  aliveCharacters: string[];
  onKillCharacter: (id: string) => void;
  characterLinks?: CharacterLinks;
  onLinkCharacter?: (type: 'cupid' | 'wildChild', characterId: string, targetId: string) => void;
  onPlayerNameChange?: (characterId: string, name: string) => void;
  showPlayerNames?: boolean;
  onTogglePlayerNames?: () => void;
}
const CharactersList: React.FC<CharactersListProps> = ({
  characters,
  className,
  size = 'sm',
  aliveCharacters = [],
  onKillCharacter,
  characterLinks,
  onLinkCharacter,
  onPlayerNameChange,
  showPlayerNames = false,
  onTogglePlayerNames
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null);

  // Group characters by team
  const villageChars = characters.filter(char => char.team === 'village');
  const werewolfChars = characters.filter(char => char.team === 'werewolf');
  const soloChars = characters.filter(char => char.team === 'solo');

  // Calculate alive character counts
  const aliveVillageCount = villageChars.filter(char => aliveCharacters.includes(char.instanceId || char.id)).length;
  const aliveWerewolfCount = werewolfChars.filter(char => aliveCharacters.includes(char.instanceId || char.id)).length;
  const aliveSoloCount = soloChars.filter(char => aliveCharacters.includes(char.instanceId || char.id)).length;
  const totalAliveCount = aliveVillageCount + aliveWerewolfCount + aliveSoloCount;

  // Increased size for character icons
  const iconSize = size === 'sm' ? 'w-16 h-16' : 'w-16 h-16';
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

  // Check if character is linked by Cupid or is a Wild Child model
  const isLinkedByCupid = (character: CharacterType) => {
    if (!characterLinks?.cupidLinks || !Array.isArray(characterLinks.cupidLinks)) return false;
    return characterLinks.cupidLinks.includes(character.instanceId || character.id);
  };
  const isWildChildModel = (character: CharacterType) => {
    if (!characterLinks?.wildChildModel) return false;
    return characterLinks.wildChildModel === (character.instanceId || character.id);
  };

  // Event handler for when a linked character dies
  const handleLinkedCharacterDeath = (character: CharacterType) => {
    // Only trigger if the character was alive and is now being killed
    if (isAlive(character)) {
      if (isLinkedByCupid(character) && characterLinks?.cupidLinks) {
        // Find the other lover
        const otherLoverId = characterLinks.cupidLinks.find(id => id !== (character.instanceId || character.id));
        if (otherLoverId) {
          const otherLover = characters.find(c => (c.instanceId || c.id) === otherLoverId);
          if (otherLover) {
            toast.warning(`⚠️ N'oubliez pas: ${otherLover.name} (amoureux) doit mourir de chagrin !`, {
              duration: 5000
            });
          }
        }
      }
      if (isWildChildModel(character)) {
        const wildChild = characters.find(c => c.id === 'wild-child');
        if (wildChild) {
          toast.warning(`⚠️ N'oubliez pas: ${wildChild.name} devient loup-garou car son modèle est mort !`, {
            duration: 5000
          });

          // Move Wild Child to werewolf team
          if (wildChild && onLinkCharacter) {
            const wildChildId = wildChild.instanceId || wildChild.id;
            // Signal that the Wild Child's model was killed
            onLinkCharacter('wildChild', wildChildId, 'convert-to-werewolf');
          }
        }
      }

      // Check if hunter was killed
      if (character.id === 'hunter') {
        toast.warning(`⚠️ Attention: Le Chasseur est mort ! Il doit immédiatement désigner quelqu'un à éliminer avec lui !`, {
          duration: 5000
        });
      }
    }
  };
  const wrappedOnKillCharacter = (characterId: string) => {
    const character = characters.find(c => (c.instanceId || c.id) === characterId);
    if (character) {
      handleLinkedCharacterDeath(character);
    }
    onKillCharacter(characterId);
  };

  // Helper to get the border color for linked characters
  const getCharacterBorderClass = (character: CharacterType) => {
    if (isWildChildModel(character) || character.id === 'wild-child' && characterLinks?.wildChildModel) {
      return "ring-4 ring-green-500";
    }
    return "";
  };

  // Render player name under character icon if showPlayerNames is true
  const renderPlayerName = (character: CharacterType) => {
    if (!showPlayerNames) return null;
    return <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="text-xs font-medium bg-black/60 text-white px-1 py-0.5 rounded truncate max-w-[54px] inline-block">
          {character.playerName || ""}
        </span>
      </div>;
  };
  return <div className={cn("glass-card p-2 rounded-xl", className)}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-gray-100">Personnages en jeu</h3>
        <div className="flex items-center gap-2">
          {onTogglePlayerNames && <Button size="sm" variant="ghost" className="h-7 px-2 flex items-center gap-1 bg-zinc-900/60 hover:bg-zinc-800" onClick={onTogglePlayerNames} title={showPlayerNames ? "Masquer les prénoms" : "Afficher les prénoms"}>
              {showPlayerNames ? <EyeOff className="h-3 w-3 text-gray-300" /> : <Eye className="h-3 w-3 text-gray-300" />}
              <span className="text-xs text-gray-300">
                {showPlayerNames ? "Masquer" : "Prénoms"}
              </span>
            </Button>}
          <div className="flex items-center text-xs bg-zinc-900/60 px-2 py-1 rounded-full">
            <Users className="h-3 w-3 mr-1 text-werewolf-accent" />
            <span className="font-medium">{totalAliveCount}</span>
            <span className="text-gray-400 mx-1">joueurs vivants</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mb-3 text-xs">
        <div className="flex flex-col items-center bg-blue-950/20 px-3 py-1 rounded-lg w-1/3 mx-0.5">
          <span className="text-blue-500 font-medium">{aliveVillageCount}/{villageChars.length}</span>
          <h4 className="text-[10px] font-medium text-blue-500 mb-1">Village</h4>
        </div>
        <div className="flex flex-col items-center bg-red-950/20 px-3 py-1 rounded-lg w-1/3 mx-0.5">
          <span className="text-werewolf-blood font-medium">{aliveWerewolfCount}/{werewolfChars.length}</span>
          <h4 className="text-[10px] font-medium text-werewolf-blood mb-1">Loups-Garous</h4>
        </div>
        <div className="flex flex-col items-center bg-amber-950/20 px-3 py-1 rounded-lg w-1/3 mx-0.5">
          <span className="text-amber-500 font-medium">{aliveSoloCount}/{soloChars.length}</span>
          <h4 className="text-[10px] font-medium text-amber-500 mb-1">Solitaires</h4>
        </div>
      </div>
        
      {werewolfChars.length > 0 && <div className="team-container">
          <h4 className="text-[10px] font-medium text-werewolf-blood mb-1">Loups-Garous</h4>
          <div className={cn("flex flex-wrap", containerClass)}>
            {werewolfChars.map((character, index) => <TooltipWrapper key={character.instanceId || `${character.id}-${index}`} character={character} side="top">
                <div className={cn("rounded-full overflow-hidden border bg-zinc-900 cursor-pointer transition-all relative mb-6", isAlive(character) ? "border-werewolf-blood/30" : "border-gray-600/30 grayscale opacity-70", iconSize, getCharacterBorderClass(character))} onClick={() => handleCharacterClick(character)}>
                  <img src={character.icon} alt={character.name} className={cn("w-full h-full object-contain p-1", character.id === 'wild-child' && character.team === 'werewolf' && "animate-pulse-subtle")} />
                  {isLinkedByCupid(character) && isAlive(character) && <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-pink-500 fill-pink-500 opacity-50" />
                    </div>}
                  {renderPlayerName(character)}
                </div>
              </TooltipWrapper>)}
          </div>
        </div>}
      
      {villageChars.length > 0 && <div className="team-container">
          <h4 className="text-[10px] font-medium text-blue-500 mb-1">Village</h4>
          <div className={cn("flex flex-wrap", containerClass)}>
            {villageChars.map((character, index) => <TooltipWrapper key={character.instanceId || `${character.id}-${index}`} character={character} side="top">
                <div className={cn("rounded-full overflow-hidden border bg-zinc-900 cursor-pointer transition-all relative mb-6", isAlive(character) ? "border-blue-500/30" : "border-gray-600/30 grayscale opacity-70", iconSize, getCharacterBorderClass(character))} onClick={() => handleCharacterClick(character)}>
                  <img src={character.icon} alt={character.name} className="w-full h-full object-contain p-1" />
                  {isLinkedByCupid(character) && isAlive(character) && <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-pink-500 fill-pink-500 opacity-50" />
                    </div>}
                  {renderPlayerName(character)}
                </div>
              </TooltipWrapper>)}
          </div>
        </div>}
      
      {soloChars.length > 0 && <div className="team-container">
          <h4 className="text-[10px] font-medium text-amber-500 mb-1">Solitaires</h4>
          <div className={cn("flex flex-wrap", containerClass)}>
            {soloChars.map((character, index) => <TooltipWrapper key={character.instanceId || `${character.id}-${index}`} character={character} side="top">
                <div className={cn("rounded-full overflow-hidden border bg-zinc-900 cursor-pointer transition-all relative mb-6", isAlive(character) ? "border-amber-500/30" : "border-gray-600/30 grayscale opacity-70", iconSize, getCharacterBorderClass(character))} onClick={() => handleCharacterClick(character)}>
                  <img src={character.icon} alt={character.name} className="w-full h-full object-contain p-1" />
                  {isLinkedByCupid(character) && isAlive(character) && <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-pink-500 fill-pink-500 opacity-50" />
                    </div>}
                  {renderPlayerName(character)}
                </div>
              </TooltipWrapper>)}
          </div>
        </div>}
      
      {selectedCharacter && onKillCharacter && <CharacterDetailsDialog character={selectedCharacter} isOpen={!!selectedCharacter} onClose={handleCloseDialog} onKillCharacter={wrappedOnKillCharacter} isAlive={isAlive(selectedCharacter)} gameCharacters={characters} characterLinks={characterLinks} onLinkCharacter={onLinkCharacter} playerName={selectedCharacter.playerName} />}
    </div>;
};
export default CharactersList;