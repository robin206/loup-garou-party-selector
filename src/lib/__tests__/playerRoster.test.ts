import { describe, it, expect } from 'vitest';
import { addPlayers, removePlayer, renamePlayer, loadRoster, saveRoster, PLAYER_ROSTER_KEY } from '../playerRoster';

const memoryStorage = () => {
  const data: Record<string, string> = {};
  return { getItem: (k: string) => data[k] ?? null, setItem: (k: string, v: string) => { data[k] = v; } };
};

describe('playerRoster', () => {
  it('ajoute plusieurs prénoms séparés par des virgules ou des retours à la ligne', () => {
    expect(addPlayers([], ' Léa, Tom ;Zoé\n  Jean   Paul ')).toEqual(['Léa', 'Tom', 'Zoé', 'Jean Paul']);
  });

  it('ignore les prénoms vides et les doublons sans tenir compte des majuscules', () => {
    expect(addPlayers(['Léa'], 'léa, , Tom, TOM')).toEqual(['Léa', 'Tom']);
  });

  it('retire un joueur', () => {
    expect(removePlayer(['Léa', 'Tom'], 'Léa')).toEqual(['Tom']);
  });

  it('renomme à la même place, sauf prénom vide ou déjà pris', () => {
    expect(renamePlayer(['Léa', 'Tom'], 'Léa', ' Lea ')).toEqual(['Lea', 'Tom']);
    expect(renamePlayer(['Léa', 'Tom'], 'Léa', '  ')).toEqual(['Léa', 'Tom']);
    expect(renamePlayer(['Léa', 'Tom'], 'Léa', 'tom')).toEqual(['Léa', 'Tom']);
    expect(renamePlayer(['Léa', 'Tom'], 'Léa', 'LÉA')).toEqual(['LÉA', 'Tom']);
  });

  it('enregistre puis relit la liste, et résiste à une valeur corrompue', () => {
    const storage = memoryStorage();
    expect(loadRoster(storage)).toEqual([]);
    saveRoster(['Léa', 'Tom'], storage);
    expect(loadRoster(storage)).toEqual(['Léa', 'Tom']);
    storage.setItem(PLAYER_ROSTER_KEY, '{pas du json');
    expect(loadRoster(storage)).toEqual([]);
  });
});
