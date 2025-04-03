
import React from 'react';

export type GamePhase = 'setup' | 'firstDay' | 'firstNight' | 'day' | 'night' | 'gameEnd';

export interface CharacterLinks {
  cupidLinks?: string[];
  wildChildModel?: string | null;
  linkedCharactersVisible?: boolean;
}

export interface GameNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  duration?: number;
  icon?: React.ReactNode;
}

export interface CharacterType {
  id: string;
  instanceId?: string;
  name: string;
  nameEn?: string;  // Added nameEn as an optional property
  icon: string;
  description: string;
  team: 'village' | 'werewolf' | 'solo';
  expansion?: string;
  recommended?: boolean;
  playerName?: string;
  actionPhase?: 'day' | 'night';
  actionOrder?: number;
  actionDescription?: string;
  className?: string;
  minPlayers?: number;  // This was missing but is being used in the characters.ts file
}

export interface GameState {
  players: number;
  characters: CharacterType[];
  selectedCharacters: string[];
  currentPhase?: GamePhase;
  dayCount?: number;
  aliveCharacters?: string[];
  characterLinks?: CharacterLinks;
  showPlayerNames?: boolean;
  gameCharacters?: CharacterType[];
}

export interface ExpansionType {
  id: string;
  name: string;
  description: string;
}
