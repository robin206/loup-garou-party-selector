import { describe, it, expect } from 'vitest';
import { getOrderedCharacterActions, isWolfPackAlive } from '../nightActions';
import { CharacterType } from '@/types';

const mk = (id: string, team: CharacterType['team'], instanceId?: string, order = 50): CharacterType => ({
  id, name: id, nameEn: id, icon: '', description: '', team, expansion: 'base',
  actionPhase: 'night', actionOrder: order, instanceId
});

const wolf1 = mk('werewolf', 'werewolf', 'werewolf-1', 10);
const wolf2 = mk('werewolf', 'werewolf', 'werewolf-2', 10);
const seer = mk('seer', 'village', undefined, 20);
const wild = mk('wild-child', 'village', undefined, 3);
const wildConverted = { ...wild, team: 'werewolf' as const };

const ids = (chars: CharacterType[]) => chars.map(c => c.id);

describe('nightActions', () => {
  it('affiche les loups quand un loup simple est vivant', () => {
    const r = getOrderedCharacterActions([wolf1, wolf2, seer], 'night', false, ['werewolf-2', 'seer']);
    expect(ids(r)).toEqual(['werewolf', 'seer']);
  });

  it("retire les loups si tous sont morts et que l'Enfant sauvage n'a pas basculé", () => {
    const r = getOrderedCharacterActions([wolf1, wolf2, seer, wild], 'night', false, ['seer', 'wild-child']);
    expect(ids(r)).toEqual(['seer']);
    expect(isWolfPackAlive([wolf1, wolf2, seer, wild], ['seer', 'wild-child'])).toBe(false);
  });

  it("garde l'étape des loups quand l'Enfant sauvage transformé est le dernier loup", () => {
    const r = getOrderedCharacterActions([wolf1, wolf2, seer, wildConverted], 'night', false, ['seer', 'wild-child']);
    expect(ids(r)).toEqual(['werewolf', 'seer']);
  });

  it("n'affiche pas l'étape Enfant sauvage après la première nuit", () => {
    const r = getOrderedCharacterActions([wolf1, wildConverted], 'night', false, ['wild-child']);
    expect(ids(r)).toEqual(['werewolf']);
  });
});
