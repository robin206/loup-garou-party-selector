
import { CharacterType } from '@/types';

export const getPlayingTip = (character: CharacterType): string => {
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
