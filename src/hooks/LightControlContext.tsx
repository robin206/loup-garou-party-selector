import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useLightBLE, BLEStatus } from "./useLightBLE";
import { useLightWiFi } from "./useLightWiFi";

export type LightMode = "none" | "ble" | "wifi";
export type LightCommand = "jour" | "nuit" | "vote" | "loup" | "off";

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
    off: ""
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

  // On utilise le bon service selon le mode
  const sendLightCommand = async (command: LightCommand) => {
    if (!lightEnabled) return;
    
    console.log(`Tentative d'envoi de commande lumière: ${command} en mode ${lightMode}`);
    
    switch (lightMode) {
      case "ble":
        return await ble.sendLightCommand(command);
      case "wifi":
        return wifi.sendCommand(command);
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
    bleConfig: ble.bleConfig,
    updateBLEConfig: ble.updateBLEConfig
  }), [lightEnabled, lightMode, ble, wifiUrls]);

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
