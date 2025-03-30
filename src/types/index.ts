
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
  playerName?: string; // Added for associating player names with characters
};

export type GameState = {
  players: number;
  characters: CharacterType[];
  selectedCharacters: string[];
  currentPhase?: GamePhase;
  aliveCharacters?: string[];
  mayor?: string;
  dayCount?: number;
  characterLinks?: CharacterLinks; // Added for linked characters
  showPlayerNames?: boolean; // To control visibility of player names
};

export type CharacterLinks = {
  cupidLinks: string[]; // Changed to string[] for simpler management
  wildChildModel: string | null; // Character ID that the Wild Child has chosen as a model
  linkedCharactersVisible?: boolean; // Whether to show linked characters in the UI
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

export type GameNotification = {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'error' | 'success';
  icon?: React.ReactNode;
  duration?: number; // Time in milliseconds before the notification is automatically removed
  timestamp: number; // To sort notifications by time
};
