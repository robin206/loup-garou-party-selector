
import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useLightBLE, BLEStatus } from "./useLightBLE";
import { useLightWiFi } from "./useLightWiFi";
import { dispatchLightCommand, LightPhase, PHASE_TO_COMMAND } from "@/lib/lightDispatch";

export type { LightPhase } from "@/lib/lightDispatch";
export type LightCommand = "jour" | "nuit" | "vote" | "loup" | "off" | "sampler_loup" | "sampler_ours" | "sampler_clocher" | "sampler_tonnerre" | "sampler_clock" | "sampler_violon" | string;

const KEY_BLE_ENABLED = "werewolf-light-ble-enabled";
const KEY_WIFI_ENABLED = "werewolf-light-wifi-enabled";
// Anciennes clés (modèle exclusif) conservées pour la migration
const LEGACY_KEY_ENABLED = "werewolf-light-enabled";
const LEGACY_KEY_MODE = "werewolf-light-mode";

/**
 * Lit les deux drapeaux indépendants, en migrant l'ancienne configuration
 * exclusive ("none" | "ble" | "wifi") si nécessaire.
 */
function readLightTransportSettings(): { bleEnabled: boolean; wifiEnabled: boolean } {
  const rawBle = localStorage.getItem(KEY_BLE_ENABLED);
  const rawWifi = localStorage.getItem(KEY_WIFI_ENABLED);

  if (rawBle !== null || rawWifi !== null) {
    return { bleEnabled: rawBle === "true", wifiEnabled: rawWifi === "true" };
  }

  // Migration depuis l'ancien modèle
  const legacyEnabled = localStorage.getItem(LEGACY_KEY_ENABLED) === "true";
  const legacyMode = localStorage.getItem(LEGACY_KEY_MODE);
  const migrated = {
    bleEnabled: legacyEnabled && legacyMode === "ble",
    wifiEnabled: legacyEnabled && legacyMode === "wifi",
  };
  try {
    localStorage.setItem(KEY_BLE_ENABLED, migrated.bleEnabled ? "true" : "false");
    localStorage.setItem(KEY_WIFI_ENABLED, migrated.wifiEnabled ? "true" : "false");
  } catch {}
  return migrated;
}

// Store les URLs pour les requêtes WiFi
function readWiFiCommandUrls(): Record<LightCommand, string> {
  const defaults: Record<LightCommand, string> = {
    jour: "",
    nuit: "",
    vote: "",
    loup: "",
    off: "",
    sampler_loup: "",
    sampler_ours: "",
    sampler_clocher: "",
    sampler_tonnerre: "",
    sampler_clock: "",
    sampler_violon: ""
  };
  try {
    const saved = localStorage.getItem("werewolf-light-wifi-urls");
    if (saved) return { ...defaults, ...JSON.parse(saved) };
  } catch {}
  return defaults;
}

// Stocke les commandes BLE personnalisées pour les sons du sampler
function readBLESamplerCommands(): Record<string, string> {
  try {
    const saved = localStorage.getItem("werewolf-light-ble-sampler-commands");
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    sampler_loup: "loup",
    sampler_ours: "ours",
    sampler_clocher: "clocher",
    sampler_tonnerre: "tonnerre",
    sampler_clock: "horloge",
    sampler_violon: "violon"
  };
}

interface LightControlContextValue {
  /** Vrai si au moins un transport est activé (dérivé). */
  lightEnabled: boolean;
  bleEnabled: boolean;
  setBleEnabled: (enabled: boolean) => void;
  wifiEnabled: boolean;
  setWifiEnabled: (enabled: boolean) => void;
  bleStatus: BLEStatus;
  bleError: string | null;
  bleConnect: () => Promise<unknown>;
  bleDisconnect: () => void;
  /** Envoie une commande brute sur tous les transports activés. */
  sendLightCommand: (c: LightCommand) => Promise<unknown>;
  /** Envoie l'ambiance correspondant à un mode de jeu (day / vote / night / off). */
  sendLightPhase: (phase: LightPhase) => Promise<unknown>;
  /** Envoi BLE uniquement (boutons de test des paramètres). */
  sendBleCommandOnly: (command: string) => Promise<boolean>;
  /** Envoi WiFi sur une URL explicite (boutons de test des paramètres). */
  sendWifiUrlOnly: (url: string, label: string) => Promise<boolean>;
  isBLESupported: boolean;
  wifiUrls: Record<LightCommand, string>;
  setWifiUrl: (command: LightCommand, url: string) => void;
  bleSamplerCommands: Record<string, string>;
  setBLESamplerCommand: (samplerKey: string, command: string) => void;
  bleConfig: {
    serviceName: string;
    serviceUUID: string;
    characteristicUUID: string;
    ledCount: number;
    brightness: number;
  };
  updateBLEConfig: (config: Partial<{
    serviceName: string;
    serviceUUID: string;
    characteristicUUID: string;
    ledCount: number;
    brightness: number;
  }>) => void;
}

const LightControlContext = createContext<LightControlContextValue | undefined>(undefined);

export function LightControlProvider({ children }: { children: ReactNode }) {
  const [transports, setTransports] = useState(readLightTransportSettings);
  const [wifiUrls, setWifiUrls] = useState(readWiFiCommandUrls());
  const [bleSamplerCommands, setBLESamplerCommandsState] = useState(readBLESamplerCommands());

  const ble = useLightBLE();
  const wifi = useLightWiFi(wifiUrls);

  const { bleEnabled, wifiEnabled } = transports;

  const setBleEnabled = (enabled: boolean) => {
    setTransports((prev) => ({ ...prev, bleEnabled: enabled }));
    localStorage.setItem(KEY_BLE_ENABLED, enabled ? "true" : "false");
  };

  const setWifiEnabled = (enabled: boolean) => {
    setTransports((prev) => ({ ...prev, wifiEnabled: enabled }));
    localStorage.setItem(KEY_WIFI_ENABLED, enabled ? "true" : "false");
  };

  const setWifiUrl = (command: LightCommand, url: string) => {
    setWifiUrls((prev) => {
      const newUrls = { ...prev, [command]: url };
      localStorage.setItem("werewolf-light-wifi-urls", JSON.stringify(newUrls));
      return newUrls;
    });
  };

  // Fonction pour mettre à jour une commande BLE pour un échantillon du sampler
  const setBLESamplerCommand = (samplerKey: string, command: string) => {
    setBLESamplerCommandsState((prev) => {
      const newCommands = { ...prev, [samplerKey]: command };
      localStorage.setItem("werewolf-light-ble-sampler-commands", JSON.stringify(newCommands));
      return newCommands;
    });
  };

  // Envoi sur les deux transports, indépendamment l'un de l'autre
  const sendLightCommand = async (command: LightCommand) => {
    if (!bleEnabled && !wifiEnabled) return { ble: "skipped", wifi: "skipped" } as const;

    return dispatchLightCommand(command, {
      bleEnabled,
      wifiEnabled,
      sendBle: (c) => {
        // Les sons du sampler peuvent avoir une commande BLE personnalisée
        const bleCode = c.startsWith("sampler_") && bleSamplerCommands[c] ? bleSamplerCommands[c] : c;
        return ble.sendLightCommand(bleCode);
      },
      sendWifi: (c) => wifi.sendCommand(c),
    });
  };

  const sendLightPhase = (phase: LightPhase) => sendLightCommand(PHASE_TO_COMMAND[phase]);

  const sendBleCommandOnly = (command: string) => ble.sendLightCommand(command);
  const sendWifiUrlOnly = (url: string, label: string) => wifi.sendUrl(url, label);

  const value = useMemo(() => ({
    lightEnabled: bleEnabled || wifiEnabled,
    bleEnabled,
    setBleEnabled,
    wifiEnabled,
    setWifiEnabled,
    bleStatus: ble.status,
    bleError: ble.error,
    bleConnect: ble.connect,
    bleDisconnect: ble.disconnect,
    sendLightCommand,
    sendLightPhase,
    sendBleCommandOnly,
    sendWifiUrlOnly,
    isBLESupported: ble.isBLESupported,
    wifiUrls,
    setWifiUrl,
    bleSamplerCommands,
    setBLESamplerCommand,
    bleConfig: ble.bleConfig,
    updateBLEConfig: ble.updateBLEConfig
  }), [bleEnabled, wifiEnabled, ble, wifiUrls, bleSamplerCommands]);

  return (
    <LightControlContext.Provider value={value}>
      {children}
    </LightControlContext.Provider>
  );
}

export function useLightControl() {
  const ctx = useContext(LightControlContext);
  if (!ctx) throw new Error('useLightControl must be used within <LightControlProvider>');
  return ctx;
}
