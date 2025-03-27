export type CharacterType = {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  team: 'village' | 'werewolf' | 'solo';
  minPlayers?: number;
  recommended?: boolean;
  expansion: 'base' | 'new-moon' | 'characters-pack' | 'village' | 'bonus';
  actionPhase?: 'night' | 'day';
  actionOrder?: number;
  actionDescription?: string;
  instanceId?: string; // Added for multiple instances of the same character
};

export type GameState = {
  players: number;
  characters: CharacterType[];
  selectedCharacters: string[];
  currentPhase?: GamePhase;
  aliveCharacters?: string[];
  mayor?: string;
  dayCount?: number;
};

export type ExpansionType = {
  id: string;
  name: string;
  description: string;
};

export type GamePhase = 
  | 'setup'
  | 'firstDay'
  | 'firstNight'
  | 'day'
  | 'night'
  | 'gameEnd';

export type GameAction = {
  id: string;
  character: string;
  description: string;
  phase: GamePhase;
  order: number;
};
