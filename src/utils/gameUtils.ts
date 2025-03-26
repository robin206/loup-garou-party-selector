
import { CharacterType } from '../types';
import { allCharacters } from '../data/characters';

export function getRecommendedCharacters(playerCount: number): CharacterType[] {
  // Base characters that should always be included
  const result: CharacterType[] = [];
  
  // Always add a certain number of werewolves based on player count
  const werewolves = allCharacters.filter(c => c.id === 'werewolf');
  
  let werewolfCount = Math.max(1, Math.floor(playerCount / 6));
  if (playerCount >= 12) werewolfCount = Math.floor(playerCount / 4);
  
  for (let i = 0; i < werewolfCount; i++) {
    result.push(werewolves[0]);
  }
  
  // Always add Seer
  const seer = allCharacters.find(c => c.id === 'seer');
  if (seer) result.push(seer);
  
  // Add Witch for games with 8+ players
  if (playerCount >= 8) {
    const witch = allCharacters.find(c => c.id === 'witch');
    if (witch) result.push(witch);
  }
  
  // Add Hunter for games with 8+ players
  if (playerCount >= 8) {
    const hunter = allCharacters.find(c => c.id === 'hunter');
    if (hunter) result.push(hunter);
  }
  
  // Add Little Girl for games with 9+ players
  if (playerCount >= 9) {
    const littleGirl = allCharacters.find(c => c.id === 'little-girl');
    if (littleGirl) result.push(littleGirl);
  }
  
  // Add Cupid for games with 10+ players
  if (playerCount >= 10) {
    const cupid = allCharacters.find(c => c.id === 'cupid');
    if (cupid) result.push(cupid);
  }
  
  // Fill remaining slots with villagers
  const villager = allCharacters.find(c => c.id === 'villager');
  if (villager) {
    const remainingSlots = playerCount - result.length;
    for (let i = 0; i < remainingSlots; i++) {
      result.push(villager);
    }
  }
  
  return result;
}

export function shuffleCharacters(characters: CharacterType[]): CharacterType[] {
  const shuffled = [...characters];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
