/**
 * Tirage au sort des rôles entre les joueurs de la soirée.
 * Logique pure, testée dans lib/__tests__/randomAssignment.test.ts.
 */

/** Écart entre joueurs et rôles : positif s'il y a trop de joueurs, négatif s'il manque des joueurs. */
export function countGap(playerCount: number, roleCount: number): number {
  return playerCount - roleCount;
}

/** Message d'alerte à afficher, ou null si le nombre de joueurs correspond au nombre de rôles. */
export function describeGap(playerCount: number, roleCount: number): string | null {
  const gap = countGap(playerCount, roleCount);
  if (gap === 0) return null;
  const n = Math.abs(gap);
  const s = n > 1 ? 's' : '';
  return gap > 0
    ? `${n} joueur${s} de trop. Ajoute ${n} rôle${s} dans la sélection ou retire ${n} prénom${s}.`
    : `Il manque ${n} joueur${s}. Ajoute ${n} prénom${s} ou retire ${n} rôle${s} de la sélection.`;
}

/** Mélange équitable (Fisher-Yates). Ne modifie pas le tableau d'origine. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Donne un prénom tiré au sort à chaque rôle de la partie.
 * L'ordre des rôles est conservé, seul playerName change.
 * Lève une erreur si le nombre de prénoms ne correspond pas au nombre de rôles.
 */
export function assignPlayersToRoles<T extends { playerName?: string }>(
  roles: readonly T[],
  players: readonly string[],
  random: () => number = Math.random
): T[] {
  if (players.length !== roles.length) {
    throw new Error(describeGap(players.length, roles.length) ?? 'Nombre de joueurs incorrect');
  }
  const shuffled = shuffle(players, random);
  return roles.map((role, i) => ({ ...role, playerName: shuffled[i] }));
}
