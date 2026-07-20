/**
 * Réglages persistants de la fonctionnalité projecteur.
 * Stockés en localStorage et synchronisés dans l'app via un CustomEvent.
 */
import { useEffect, useState } from "react";

const KEY_ENABLED = "werewolf-projector-enabled";
const KEY_PLAYERS = "werewolf-projector-players-enabled";
const KEY_DEATH_ANIM = "werewolf-projector-death-anim-enabled";
const EVENT_NAME = "werewolf-projector-settings-changed";

function readBool(key: string, defaultValue: boolean): boolean {
  if (typeof window === "undefined") return defaultValue;
  const v = localStorage.getItem(key);
  if (v === null) return defaultValue;
  return v === "true";
}

export function getProjectorEnabled(): boolean {
  return readBool(KEY_ENABLED, true);
}

export function getProjectorPlayersEnabled(): boolean {
  return readBool(KEY_PLAYERS, true);
}

export function getProjectorDeathAnimationEnabled(): boolean {
  return readBool(KEY_DEATH_ANIM, true);
}

export function setProjectorEnabled(value: boolean) {
  localStorage.setItem(KEY_ENABLED, String(value));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function setProjectorPlayersEnabled(value: boolean) {
  localStorage.setItem(KEY_PLAYERS, String(value));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function setProjectorDeathAnimationEnabled(value: boolean) {
  localStorage.setItem(KEY_DEATH_ANIM, String(value));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useProjectorSettings() {
  const [state, setState] = useState({
    enabled: getProjectorEnabled(),
    playersEnabled: getProjectorPlayersEnabled(),
    deathAnimationEnabled: getProjectorDeathAnimationEnabled(),
  });

  useEffect(() => {
    const update = () =>
      setState({
        enabled: getProjectorEnabled(),
        playersEnabled: getProjectorPlayersEnabled(),
        deathAnimationEnabled: getProjectorDeathAnimationEnabled(),
      });
    window.addEventListener(EVENT_NAME, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT_NAME, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return state;
}
