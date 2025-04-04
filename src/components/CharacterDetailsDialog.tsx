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
import { Button } from '@/components/ui/button';
import { 
  Skull, 
  Leaf, 
  Unlink,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

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
}

const getPlayingTip = (character: CharacterType): string => {
  switch (character.id) {
    case 'werewolf':
      return "Coordonnez-vous avec les autres loups et évitez d'être trop agressif pendant les débats.";
    case 'villager':
      return "Observez bien les comportements, participez activement aux discussions pour démasquer les loups.";
    case 'seer':
      return "Vérifiez en priorité les joueurs trop calmes ou trop accusateurs. Ne révélez pas votre identité trop tôt.";
    case 'witch':
      return "Utilisez vos potions avec parcimonie. Sauvez quelqu'un stratégiquement et éliminez un joueur suspect.";
    case 'hunter':
      return "Si vous êtes éliminé, choisissez judicieusement votre cible pour aider votre équipe.";
    case 'little-girl':
      return "Soyez subtil dans vos indices pour ne pas vous faire repérer par les loups-garous.";
    case 'cupid':
      return "Créez un couple stratégique qui pourrait aider le village, mais attention aux loups-garous.";
    case 'devoted-servant':
      return "N'utilisez votre pouvoir que si la personne éliminée a un rôle important pour le village.";
    case 'white-wolf':
      return "Jouez comme un loup normal jusqu'à ce que le moment soit propice pour éliminer un autre loup.";
    case 'pied-piper':
      return "Enchantez stratégiquement pour créer des groupes qui pourront se défendre entre eux.";
    default:
      return "Adaptez votre stratégie selon les autres joueurs en jeu.";
  }
};

const CharacterDetailsDialog: React.FC<CharacterDetailsDialogProps> = ({ 
  character, 
  isOpen, 
  onClose, 
  onKillCharacter,
  isAlive,
  gameCharacters = [],
  characterLinks,
  onLinkCharacter,
  playerName = ''
}) => {
  const playingTip = getPlayingTip(character);
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
            <div className="mt-3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-werewolf-accent">
                <img 
                  src={character.icon} 
                  alt={character.name} 
                  className={`w-full h-full object-contain p-2 ${!isAlive ? 'grayscale opacity-70' : ''}`}
                />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {playerName && (
                <div className="text-center">
                  <span className="text-sm font-medium">Joueur: </span>
                  <span className="text-sm font-bold">{playerName}</span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium">Description:</h3>
                <p className="text-sm">{character.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-amber-500">Conseil de jeu:</h3>
                <p className="text-sm">{playingTip}</p>
              </div>
              
              {linkSelectionOpen && (
                <div className="mt-3">
                  <h3 className="text-sm font-medium mb-2">
                    {linkSelectionOpen === 'cupid' ? 'Choisir les amoureux' : 'Choisir un modèle'}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {gameCharacters
                      .filter(c => {
                        if (linkSelectionOpen === 'wildChild') {
                          return (c.instanceId || c.id) !== (character.instanceId || c.id);
                        }
                        return true;
                      })
                      .map(char => (
                        <Button 
                          key={char.instanceId || char.id}
                          size="sm"
                          variant="outline"
                          className="text-xs justify-start gap-1"
                          onClick={() => handleLinkCharacter(char.instanceId || char.id)}
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
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4 flex flex-col gap-2">
          {canLinkCharacters && (
            <div className="w-full grid grid-cols-2 gap-2">
              {isCupid && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLinkSelectionOpen('cupid')}
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
                  onClick={() => setLinkSelectionOpen('wildChild')}
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
              onClick={() => onKillCharacter(character.instanceId || character.id)}
              className="w-full"
            >
              <Skull className="mr-2 h-4 w-4" /> Éliminer ce personnage
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => onKillCharacter(character.instanceId || character.id)}
              className="w-full"
            >
              Ressusciter ce personnage
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterDetailsDialog;
