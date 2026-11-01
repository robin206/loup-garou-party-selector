import React, { useState } from 'react';
import { CharacterType, CharacterLinks } from '@/types';
import TooltipWrapper from './TooltipWrapper';
import { cn } from '@/lib/utils';
import CharacterDetailsDialog from './CharacterDetailsDialog';
import { Users, Heart, Leaf, Eye, EyeOff, Projector } from 'lucide-react';
import { toast } from 'sonner';
import projector, { useProjectedRoleId } from '@/lib/projector';
import { useProjectorSettings } from '@/lib/projectorSettings';
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
  const projectedRoleId = useProjectedRoleId();
  const { enabled: projectorEnabled } = useProjectorSettings();

  const handleToggleProject = (e: React.MouseEvent, character: CharacterType) => {
    e.stopPropagation();
    projector.toggleRoleCard(character.id, character.name, character.icon);
  };

  const renderProjectorButton = (character: CharacterType) => {
    if (!projectorEnabled) return null;
    const active = projectedRoleId === character.id;
    return (
      <button
        type="button"
        onClick={(e) => handleToggleProject(e, character)}
        title={active ? "Masquer la carte du projecteur" : "Afficher sur le projecteur"}
        className={cn(
          "absolute -top-1 -right-1 z-10 h-6 w-6 rounded-full flex items-center justify-center border transition-all",
          active
            ? "bg-werewolf-accent text-white border-werewolf-accent shadow-[0_0_10px_2px_rgba(234,179,8,0.7)] ring-2 ring-werewolf-accent/60"
            : "bg-black/70 text-white border-white/30 hover:bg-black/90 opacity-80 hover:opacity-100"
        )}
      >
        <Projector className="h-3 w-3" />
      </button>
    );
  };

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
  // Une section par camp : libellé, couleurs et compteur vivants / total
  const teams = [
    { key: 'werewolf', label: 'Loups-Garous', chars: werewolfChars, alive: aliveWerewolfCount, text: 'text-werewolf-accent', ring: 'border-werewolf-accent/50', bg: 'from-werewolf-accent/10 to-werewolf-accent/25' },
    { key: 'village', label: 'Village', chars: villageChars, alive: aliveVillageCount, text: 'text-sky-400', ring: 'border-sky-500/50', bg: 'from-sky-500/10 to-sky-500/25' },
    { key: 'solo', label: 'Solitaires', chars: soloChars, alive: aliveSoloCount, text: 'text-amber-400', ring: 'border-amber-500/50', bg: 'from-amber-500/10 to-amber-500/25' }
  ];

  return <div className={cn("glass-card p-4 rounded-2xl", className)}>
      <div className="flex justify-between items-center mb-4 gap-2">
        <h3 className="text-sm font-semibold text-white whitespace-nowrap">Personnages en jeu</h3>
        <div className="flex items-center gap-2">
          {onTogglePlayerNames && <button type="button" className="h-8 px-3 rounded-full flex items-center gap-1.5 whitespace-nowrap text-xs text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors" onClick={onTogglePlayerNames} title={showPlayerNames ? "Masquer les prénoms" : "Afficher les prénoms"}>
              {showPlayerNames ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showPlayerNames ? "Masquer" : "Prénoms"}
            </button>}
          <div className="h-8 flex items-center whitespace-nowrap text-xs bg-white/5 border border-white/10 px-3 rounded-full">
            <Users className="h-3.5 w-3.5 mr-1.5 text-werewolf-accent" />
            <span className="font-bold text-white tabular-nums">{totalAliveCount}</span>
            <span className="text-gray-400 ml-1">en vie</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {teams.filter(team => team.chars.length > 0).map(team => <div key={team.key}>
            <div className="flex items-baseline justify-between mb-2 border-b border-white/5 pb-1">
              <h4 className={cn("text-xs font-semibold uppercase tracking-wider", team.text)}>{team.label}</h4>
              <span className="text-xs text-gray-400 tabular-nums"><span className="text-white font-semibold">{team.alive}</span> / {team.chars.length}</span>
            </div>
            <div className={cn("flex flex-wrap", containerClass)}>
              {team.chars.map((character, index) => <TooltipWrapper key={character.instanceId || `${character.id}-${index}`} character={character} side="top">
                  <div className={cn("rounded-full border-2 bg-gradient-to-br cursor-pointer transition-all relative mb-1 overflow-visible hover:-translate-y-0.5", isAlive(character) ? cn(team.ring, team.bg) : "border-white/10 from-white/5 to-white/5 grayscale opacity-40", iconSize, getCharacterBorderClass(character))} onClick={() => handleCharacterClick(character)}>
                    <img src={character.icon} alt={character.name} className={cn("w-full h-full object-contain p-1", character.id === 'wild-child' && character.team === 'werewolf' && "animate-pulse-subtle")} />
                    {isLinkedByCupid(character) && isAlive(character) && <div className="absolute inset-0 flex items-center justify-center">
                        <Heart className="w-12 h-12 text-pink-500 fill-pink-500 opacity-50" />
                      </div>}
                    {renderPlayerName(character)}
                    {renderProjectorButton(character)}
                  </div>
                </TooltipWrapper>)}
            </div>
          </div>)}
      </div>
      
      {selectedCharacter && onKillCharacter && <CharacterDetailsDialog character={selectedCharacter} isOpen={!!selectedCharacter} onClose={handleCloseDialog} onKillCharacter={wrappedOnKillCharacter} isAlive={isAlive(selectedCharacter)} gameCharacters={characters} characterLinks={characterLinks} onLinkCharacter={onLinkCharacter} playerName={selectedCharacter.playerName} />}
    </div>;
};
export default CharactersList;