import { CharacterType } from '@/types';
import { getCharacterById } from '@/data/characters';

/** Rôles hors camp loup qui se réveillent quand même avec la meute */
const WAKES_WITH_PACK = ['white-wolf'];

/** Rôles dont l'action n'a lieu que la première nuit */
const FIRST_NIGHT_ONLY = ['cupid', 'wild-child', 'thief'];

const isAliveChar = (char: CharacterType, aliveChars: string[]) =>
  aliveChars.includes(char.instanceId || char.id);

/**
 * Vrai s'il reste au moins un joueur vivant qui se réveille avec les loups :
 * loup simple, autre rôle du camp loup, Enfant sauvage transformé, Loup blanc.
 */
export const isWolfPackAlive = (chars: CharacterType[], aliveChars: string[]) =>
  chars.some(char =>
    isAliveChar(char, aliveChars) &&
    (char.team === 'werewolf' || WAKES_WITH_PACK.includes(char.id))
  );

/**
 * Actions à mener dans la phase, une par rôle, triées par ordre de passage.
 * L'étape « Loups-Garous » reste affichée tant qu'un membre de la meute est vivant,
 * même si tous les loups simples sont morts (ex. Enfant sauvage passé chez les loups).
 */
export const getOrderedCharacterActions = (
  chars: CharacterType[],
  phase: 'night' | 'day',
  isFirstNight: boolean = false,
  aliveChars: string[] = []
): CharacterType[] => {
  const uniqueCharIds = new Set<string>();
  const uniqueChars: CharacterType[] = [];
  chars.forEach(char => {
    if (uniqueCharIds.has(char.id)) return;
    if (!isAliveChar(char, aliveChars)) return;
    if (char.actionPhase !== phase) return;
    if (!isFirstNight && FIRST_NIGHT_ONLY.includes(char.id)) return;
    uniqueCharIds.add(char.id);
    uniqueChars.push(char);
  });

  if (phase === 'night' && !uniqueCharIds.has('werewolf') && isWolfPackAlive(chars, aliveChars)) {
    const template = chars.find(c => c.id === 'werewolf') ?? getCharacterById('werewolf');
    if (template) {
      uniqueChars.push({
        ...template,
        actionPhase: 'night',
        actionOrder: template.actionOrder ?? 10,
        actionDescription:
          template.actionDescription ||
          'Demandez aux Loups-Garous de se réveiller et de choisir une victime.'
      });
    }
  }

  return uniqueChars.sort((a, b) => (a.actionOrder || 999) - (b.actionOrder || 999));
};
