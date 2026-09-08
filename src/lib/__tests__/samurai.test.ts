import { describe, it, expect } from 'vitest';
import { resolveSamuraiStrike, findLivingSamurai } from '../samurai';
import { allCharacters, getCharactersByExpansion, bonusCharacters } from '@/data/characters';
import { CharacterType } from '@/types';

const samurai = allCharacters.find(c => c.id === 'samurai') as CharacterType;
const werewolf = allCharacters.find(c => c.id === 'werewolf') as CharacterType;
const villager = allCharacters.find(c => c.id === 'villager') as CharacterType;

describe('Samouraï - résolution du coup', () => {
  it('tue le Loup-Garou et laisse le Samouraï en vie', () => {
    const res = resolveSamuraiStrike(
      { ...samurai, instanceId: 's1' },
      { ...werewolf, instanceId: 'w1' }
    );
    expect(res.deaths).toEqual(['w1']);
    expect(res.harakiri).toBe(false);
    expect(res.targetWasWerewolf).toBe(true);
  });

  it('tue le villageois et fait mourir le Samouraï (harakiri)', () => {
    const res = resolveSamuraiStrike(
      { ...samurai, instanceId: 's1' },
      { ...villager, instanceId: 'v1' }
    );
    expect(res.deaths).toEqual(['v1', 's1']);
    expect(res.harakiri).toBe(true);
  });

  it('trouve le Samouraï vivant', () => {
    const chars = [{ ...samurai, instanceId: 's1' }, { ...villager, instanceId: 'v1' }];
    expect(findLivingSamurai(chars, ['s1', 'v1'])?.instanceId).toBe('s1');
    expect(findLivingSamurai(chars, ['v1'])).toBeUndefined();
  });
});

describe('Extension Bonus', () => {
  it('contient le Samouraï et le Berger', () => {
    const ids = getCharactersByExpansion('bonus').map(c => c.id);
    expect(ids).toContain('samurai');
    expect(ids).toContain('shepherd');
    expect(bonusCharacters).toHaveLength(2);
  });

  it("n'expose ni Samouraï ni Berger dans les autres extensions", () => {
    for (const exp of ['base', 'new-moon', 'village', 'characters-pack']) {
      const ids = getCharactersByExpansion(exp).map(c => c.id);
      expect(ids).not.toContain('samurai');
      expect(ids).not.toContain('shepherd');
    }
  });

  it('conserve les autres rôles dans leurs extensions', () => {
    expect(allCharacters.find(c => c.id === 'seer')?.expansion).toBe('base');
    expect(allCharacters.find(c => c.id === 'rural-policeman')?.expansion).toBe('characters-pack');
  });
});

describe('Ordre de nuit', () => {
  it('place le Samouraï juste après les Loups-Garous', () => {
    const nightOrder = allCharacters
      .filter(c => c.actionPhase === 'night' && typeof c.actionOrder === 'number')
      .sort((a, b) => (a.actionOrder || 0) - (b.actionOrder || 0));
    const wolfIndex = nightOrder.findIndex(c => c.id === 'werewolf');
    expect(nightOrder[wolfIndex + 1].id).toBe('samurai');
    expect(samurai.actionOrder).toBeGreaterThan(werewolf.actionOrder as number);
  });
});
