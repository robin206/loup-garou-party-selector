
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
};

export type GameState = {
  players: number;
  characters: CharacterType[];
  selectedCharacters: string[];
};

export type ExpansionType = {
  id: string;
  name: string;
  description: string;
};
