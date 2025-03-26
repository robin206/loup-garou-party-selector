import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CharacterType } from '@/types';

interface TooltipWrapperProps {
  character: CharacterType;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  isAlive?: boolean;
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

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ 
  character, 
  children, 
  side = "right",
  isAlive = true 
}) => {
  const playingTip = getPlayingTip(character);
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className="max-w-sm bg-zinc-950 text-white border-gray-800"
        >
          <div className="p-1 space-y-2">
            <h3 className={`font-bold ${isAlive ? 'text-werewolf-accent' : 'text-gray-400'}`}>
              {character.name}
              {!isAlive && <span className="ml-2 text-xs text-red-400">(Éliminé)</span>}
            </h3>
            <p className="text-sm">{character.description}</p>
            <div className="pt-1 border-t border-gray-700">
              <span className="text-xs font-medium text-amber-400">Conseil: </span>
              <span className="text-xs">{playingTip}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
