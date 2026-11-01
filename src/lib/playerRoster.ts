/**
 * Liste des joueurs de la soirée (prénoms), conservée d'une partie à l'autre.
 * Logique pure, sans React, testée dans lib/__tests__/playerRoster.test.ts.
 */

export const PLAYER_ROSTER_KEY = 'werewolf-player-roster';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

/** Retire les espaces en trop autour et à l'intérieur du prénom. */
export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

const sameName = (a: string, b: string) => a.toLocaleLowerCase('fr') === b.toLocaleLowerCase('fr');

/**
 * Ajoute un ou plusieurs prénoms (séparés par des virgules, points-virgules ou retours à la ligne).
 * Les prénoms vides et les doublons (sans tenir compte des majuscules) sont ignorés.
 */
export function addPlayers(roster: string[], input: string): string[] {
  const result = [...roster];
  input
    .split(/[,;\n]/)
    .map(normalizeName)
    .filter(name => name.length > 0)
    .forEach(name => {
      if (!result.some(existing => sameName(existing, name))) result.push(name);
    });
  return result;
}

export function removePlayer(roster: string[], name: string): string[] {
  return roster.filter(existing => existing !== name);
}

/**
 * Renomme un joueur à la même place dans la liste.
 * Un nouveau prénom vide ou déjà pris par un autre joueur laisse la liste inchangée.
 */
export function renamePlayer(roster: string[], oldName: string, newName: string): string[] {
  const name = normalizeName(newName);
  if (!name) return roster;
  if (roster.some(existing => existing !== oldName && sameName(existing, name))) return roster;
  return roster.map(existing => (existing === oldName ? name : existing));
}

export function loadRoster(storage: StorageLike = localStorage): string[] {
  try {
    const raw = storage.getItem(PLAYER_ROSTER_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? addPlayers([], parsed.filter(n => typeof n === 'string').join('\n')) : [];
  } catch {
    return [];
  }
}

export function saveRoster(roster: string[], storage: StorageLike = localStorage): void {
  try {
    storage.setItem(PLAYER_ROSTER_KEY, JSON.stringify(roster));
  } catch (e) {
    console.error('Erreur lors de l\'enregistrement de la liste des joueurs', e);
  }
}
