/**
 * Helper de communication avec la page /projector.html
 * via BroadcastChannel "loupgarou-projector".
 */

import { useEffect, useState } from "react";

export type ProjectorMode = "DAY" | "NIGHT";

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

function sendMode(mode: ProjectorMode) {
  const ch = getChannel();
  if (!ch) return;
  try {
    ch.postMessage({ type: "CHANGE_PROJECTOR_MODE", mode });
  } catch (e) {
    console.warn("Envoi projecteur échoué:", e);
  }
}

// ----- Role card overlay state (shared) -----
let currentRoleId: string | null = null;
const listeners = new Set<(roleId: string | null) => void>();

function setCurrentRole(roleId: string | null) {
  currentRoleId = roleId;
  listeners.forEach((l) => l(currentRoleId));
}

function showRoleCard(roleId: string, roleName: string, roleIcon: string) {
  const ch = getChannel();
  if (ch) {
    try {
      ch.postMessage({
        type: "SHOW_ROLE_CARD",
        roleId,
        roleName,
        roleIcon,
      });
    } catch (e) {
      console.warn("Envoi projecteur échoué:", e);
    }
  }
  setCurrentRole(roleId);
}

function hideRoleCard() {
  const ch = getChannel();
  if (ch) {
    try {
      ch.postMessage({ type: "HIDE_ROLE_CARD" });
    } catch (e) {
      console.warn("Envoi projecteur échoué:", e);
    }
  }
  setCurrentRole(null);
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
  /** @deprecated conservé pour compatibilité, sans effet côté projecteur */
  vote: () => {},
  /** @deprecated conservé pour compatibilité, sans effet côté projecteur */
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
};

export default projector;
