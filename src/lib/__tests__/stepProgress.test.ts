import { describe, it, expect } from 'vitest';
import { toggleStep, getCurrentStepIndex, countRemainingSteps } from '../stepProgress';

describe('stepProgress', () => {
  const steps = ['a', 'b', 'c'];

  it('coche puis décoche une étape', () => {
    const once = toggleStep([], 'b');
    expect(once).toEqual(['b']);
    expect(toggleStep(once, 'b')).toEqual([]);
  });

  it("l'étape en cours est la première non cochée", () => {
    expect(getCurrentStepIndex(steps, [])).toBe(0);
    expect(getCurrentStepIndex(steps, ['a'])).toBe(1);
    expect(getCurrentStepIndex(steps, ['b'])).toBe(0);
    expect(getCurrentStepIndex(steps, ['a', 'b', 'c'])).toBe(-1);
  });

  it('compte les étapes restantes en ignorant les identifiants inconnus', () => {
    expect(countRemainingSteps(steps, [])).toBe(3);
    expect(countRemainingSteps(steps, ['a', 'zzz'])).toBe(2);
    expect(countRemainingSteps([], ['a'])).toBe(0);
  });
});
