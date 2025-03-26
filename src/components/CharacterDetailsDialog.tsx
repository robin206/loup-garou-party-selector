
import React from 'react';
import { CharacterType } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skull } from 'lucide-react';

interface CharacterDetailsDialogProps {
  character: CharacterType;
  isOpen: boolean;
  onClose: () => void;
  onKillCharacter: (id: string) => void;
  isAlive: boolean;
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
  isAlive
}) => {
  const playingTip = getPlayingTip(character);
  
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
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isAlive ? 'border-werewolf-accent' : 'border-gray-400'}`}>
                <img 
                  src={character.icon} 
                  alt={character.name} 
                  className={`w-full h-full object-contain p-2 ${!isAlive ? 'grayscale opacity-70' : ''}`}
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <h3 className="text-sm font-medium">Description:</h3>
                <p className="text-sm">{character.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-amber-500">Conseil de jeu:</h3>
                <p className="text-sm">{playingTip}</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          {isAlive ? (
            <Button 
              variant="destructive" 
              onClick={() => onKillCharacter(character.id)}
              className="w-full"
            >
              <Skull className="mr-2 h-4 w-4" /> Éliminer ce personnage
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => onKillCharacter(character.id)}
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
