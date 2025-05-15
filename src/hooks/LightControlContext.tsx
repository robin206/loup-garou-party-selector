
import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useLightBLE, BLEStatus } from "./useLightBLE";
import { useLightWiFi } from "./useLightWiFi";

export type LightMode = "none" | "ble" | "wifi";
export type LightCommand = "jour" | "nuit" | "vote" | "loup" | "off" | "sampler_loup" | "sampler_ours" | "sampler_clocher" | "sampler_tonnerre" | "sampler_clock" | "sampler_violon" | string;

// Store les URLs pour les requêtes WiFi
function readWiFiCommandUrls(): Record<LightCommand, string> {
  try {
    const saved = localStorage.getItem("werewolf-light-wifi-urls");
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
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
  lightEnabled: boolean;
  setLightEnabled: (enabled: boolean) => void;
  lightMode: LightMode;
  setLightMode: (mode: LightMode) => void;
  bleStatus: BLEStatus;
  bleError: string | null;
  bleConnect: () => Promise<any>;
  bleDisconnect: () => void;
  sendLightCommand: (c: LightCommand) => void;
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
  const [lightEnabled, setLightEnabledState] = useState(() => 
    localStorage.getItem("werewolf-light-enabled") === "true"
  );
  const [lightMode, setLightModeState] = useState<LightMode>(() => 
    (localStorage.getItem("werewolf-light-mode") as LightMode) || "none"
  );
  const [wifiUrls, setWifiUrls] = useState(readWiFiCommandUrls());
  const [bleSamplerCommands, setBLESamplerCommandsState] = useState(readBLESamplerCommands());
  
  const ble = useLightBLE();
  const wifi = useLightWiFi(wifiUrls);

  const setLightEnabled = (enabled: boolean) => {
    setLightEnabledState(enabled);
    localStorage.setItem("werewolf-light-enabled", enabled ? "true" : "false");
  };

  const setLightMode = (mode: LightMode) => {
    setLightModeState(mode);
    localStorage.setItem("werewolf-light-mode", mode);
    // Ne pas déconnecter automatiquement si on change de mode pour permettre la persistance
    // entre les pages
  };

  const setWifiUrl = (command: LightCommand, url: string) => {
    const newUrls = { ...wifiUrls, [command]: url };
    setWifiUrls(newUrls);
    localStorage.setItem("werewolf-light-wifi-urls", JSON.stringify(newUrls));
  };
  
  // Fonction pour mettre à jour une commande BLE pour un échantillon du sampler
  const setBLESamplerCommand = (samplerKey: string, command: string) => {
    const newCommands = { ...bleSamplerCommands, [samplerKey]: command };
    setBLESamplerCommandsState(newCommands);
    localStorage.setItem("werewolf-light-ble-sampler-commands", JSON.stringify(newCommands));
  };

  // On utilise le bon service selon le mode
  const sendLightCommand = async (command: LightCommand) => {
    if (!lightEnabled) return;
    
    console.log(`Tentative d'envoi de commande lumière: ${command} en mode ${lightMode}`);
    
    switch (lightMode) {
      case "ble":
        // Si c'est une commande de sampler et qu'elle a une commande BLE personnalisée
        if (command.startsWith("sampler_") && bleSamplerCommands[command]) {
          return await ble.sendLightCommand(bleSamplerCommands[command]);
        }
        return await ble.sendLightCommand(command);
      case "wifi":
        // On s'assure d'appeler la bonne méthode WiFi
        return await wifi.sendCommand(command);
      default:
        console.log("Mode lumière non reconnu ou désactivé");
        return false;
    }
  };

  const value = useMemo(() => ({
    lightEnabled,
    setLightEnabled,
    lightMode,
    setLightMode,
    bleStatus: ble.status,
    bleError: ble.error,
    bleConnect: ble.connect,
    bleDisconnect: ble.disconnect,
    sendLightCommand,
    isBLESupported: ble.isBLESupported,
    wifiUrls,
    setWifiUrl,
    bleSamplerCommands,
    setBLESamplerCommand,
    bleConfig: ble.bleConfig,
    updateBLEConfig: ble.updateBLEConfig
  }), [lightEnabled, lightMode, ble, wifiUrls, bleSamplerCommands]);

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
