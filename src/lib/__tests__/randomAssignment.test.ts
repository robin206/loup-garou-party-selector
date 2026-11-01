import { describe, it, expect } from 'vitest';
import { countGap, describeGap, shuffle, assignPlayersToRoles } from '../randomAssignment';

/** Générateur pseudo-aléatoire reproductible */
type Role = { id: string; playerName?: string };

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe('randomAssignment', () => {
  it('calcule l\'écart et le message d\'alerte', () => {
    expect(countGap(8, 8)).toBe(0);
    expect(describeGap(8, 8)).toBeNull();
    expect(describeGap(10, 8)).toContain('2 joueurs de trop');
    expect(describeGap(7, 8)).toContain('Il manque 1 joueur.');
  });

  it('le mélange garde tous les éléments sans modifier l\'original', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const result = shuffle(items, seeded(1));
    expect([...result].sort()).toEqual(items);
    expect(items).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('donne un prénom différent à chaque rôle et garde l\'ordre des rôles', () => {
    const roles: Role[] = [{ id: 'loup-1' }, { id: 'loup-2' }, { id: 'voyante' }, { id: 'villageois', playerName: 'Ancien' }];
    const players = ['Léa', 'Tom', 'Zoé', 'Max'];
    const result = assignPlayersToRoles(roles, players, seeded(42));
    expect(result.map(r => r.id)).toEqual(roles.map(r => r.id));
    expect(result.map(r => r.playerName).sort()).toEqual([...players].sort());
  });

  it('chaque joueur peut tomber sur chaque rôle', () => {
    const seen = new Set<string>();
    const random = seeded(7);
    for (let i = 0; i < 200; i++) {
      const [first] = assignPlayersToRoles<Role>([{ id: 'loup' }, { id: 'voyante' }, { id: 'sorciere' }], ['A', 'B', 'C'], random);
      seen.add(first.playerName!);
    }
    expect(seen).toEqual(new Set(['A', 'B', 'C']));
  });

  it('refuse un tirage si le nombre de joueurs est faux', () => {
    expect(() => assignPlayersToRoles<Role>([{ id: 'loup' }], ['A', 'B'])).toThrow('1 joueur de trop');
  });
});
