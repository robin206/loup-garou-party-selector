
export type CharacterType = {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  team: 'village' | 'werewolf' | 'solo';
  minPlayers?: number;
  recommended?: boolean;
};

export type GameState = {
  players: number;
  characters: CharacterType[];
  selectedCharacters: string[];
};
