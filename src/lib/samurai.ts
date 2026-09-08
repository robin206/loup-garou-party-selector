import { CharacterType } from '@/types';

export const SAMURAI_ID = 'samurai';

export type SamuraiStrikeResult = {
  /** Identifiants (instanceId ou id) des personnages qui meurent suite au coup du Samouraï */
  deaths: string[];
  /** true si la cible était un Loup-Garou : le Samouraï garde son honneur */
  targetWasWerewolf: boolean;
  /** true si le Samouraï se fait harakiri */
  harakiri: boolean;
  /** Message à afficher au maître du jeu */
  message: string;
};

const charKey = (c: CharacterType) => c.instanceId || c.id;

/**
 * Résout le coup de sabre du Samouraï.
 * - La cible meurt toujours.
 * - Si la cible n'est pas un Loup-Garou, le Samouraï meurt également (harakiri).
 */
export function resolveSamuraiStrike(
  samurai: CharacterType,
  target: CharacterType
): SamuraiStrikeResult {
  const targetWasWerewolf = target.team === 'werewolf';
  const targetKey = charKey(target);
  const samuraiKey = charKey(samurai);
  const deaths = targetWasWerewolf ? [targetKey] : [targetKey, samuraiKey];

  const targetLabel = target.playerName ? `${target.name} (${target.playerName})` : target.name;

  return {
    deaths,
    targetWasWerewolf,
    harakiri: !targetWasWerewolf,
    message: targetWasWerewolf
      ? `Le Samouraï a décapité ${targetLabel}, un Loup-Garou : il conserve son honneur et reste en vie.`
      : `Le Samouraï a décapité ${targetLabel}, qui n'était pas un Loup-Garou : déshonoré, il se fait harakiri et meurt aussi.`
  };
}

/** Retourne le Samouraï vivant en jeu, s'il y en a un. */
export function findLivingSamurai(
  characters: CharacterType[],
  aliveIds: string[]
): CharacterType | undefined {
  return characters.find(
    c => c.id === SAMURAI_ID && aliveIds.includes(charKey(c))
  );
}
