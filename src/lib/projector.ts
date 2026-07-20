/**
 * Helper de communication avec la page /projector.html
 * via BroadcastChannel "loupgarou-projector".
 */

import { useEffect, useState } from "react";
import {
  getProjectorEnabled,
  getProjectorPlayersEnabled,
  getProjectorDeathAnimationEnabled,
} from "./projectorSettings";

export type ProjectorMode = "DAY" | "NIGHT";

export type ProjectorPlayer = {
  id: string;
  name: string;
  icon: string;
  playerName?: string;
  team: "village" | "werewolf" | "solo";
  alive: boolean;
};

const CHANNEL_NAME = "loupgarou-projector";

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }
  if (!channel) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch (e) {
      console.warn("BroadcastChannel non disponible:", e);
      return null;
    }
  }
  return channel;
}

function post(message: any) {
  if (!getProjectorEnabled()) return;
  const ch = getChannel();
  if (!ch) return;
  try {
    ch.postMessage(message);
  } catch (e) {
    console.warn("Envoi projecteur échoué:", e);
  }
}

function sendMode(mode: ProjectorMode) {
  post({ type: "CHANGE_PROJECTOR_MODE", mode });
}

// ----- Role card overlay state (shared) -----
let currentRoleId: string | null = null;
const listeners = new Set<(roleId: string | null) => void>();

function setCurrentRole(roleId: string | null) {
  currentRoleId = roleId;
  listeners.forEach((l) => l(currentRoleId));
}

function showRoleCard(roleId: string, roleName: string, roleIcon: string) {
  post({ type: "SHOW_ROLE_CARD", roleId, roleName, roleIcon });
  setCurrentRole(roleId);
}

function hideRoleCard() {
  post({ type: "HIDE_ROLE_CARD" });
  setCurrentRole(null);
}

function updatePlayers(players: ProjectorPlayer[]) {
  if (!getProjectorPlayersEnabled()) {
    post({ type: "HIDE_PROJECTOR_PLAYERS" });
    return;
  }
  post({
    type: "UPDATE_PROJECTOR_PLAYERS",
    players,
    deathAnimationEnabled: getProjectorDeathAnimationEnabled(),
  });
}

function hidePlayers() {
  post({ type: "HIDE_PROJECTOR_PLAYERS" });
}

export function useProjectedRoleId(): string | null {
  const [id, setId] = useState<string | null>(currentRoleId);
  useEffect(() => {
    const l = (v: string | null) => setId(v);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return id;
}

export const projector = {
  day: () => sendMode("DAY"),
  night: () => sendMode("NIGHT"),
  /** @deprecated */
  vote: () => {},
  /** @deprecated */
  end: () => {},
  setMode: (mode: ProjectorMode) => sendMode(mode),
  showRoleCard,
  hideRoleCard,
  toggleRoleCard: (roleId: string, roleName: string, roleIcon: string) => {
    if (currentRoleId === roleId) {
      hideRoleCard();
    } else {
      showRoleCard(roleId, roleName, roleIcon);
    }
  },
  getProjectedRoleId: () => currentRoleId,
  updatePlayers,
  hidePlayers,
};

export default projector;
