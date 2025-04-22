
import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useLightBLE, BLEStatus } from "./useLightBLE";

// Permet de propager l'état du toggle (activé/désactivé) entre config et jeu via le localStorage
function readLightEnabledFromStorage(): boolean {
  try {
    return localStorage.getItem("werewolf-light-enabled") === "true";
  } catch {
    return false;
  }
}

interface LightControlContextValue {
  lightEnabled: boolean;
  setLightEnabled: (enabled: boolean) => void;
  bleStatus: BLEStatus;
  bleError: string | null;
  bleConnect: () => Promise<any>;
  bleDisconnect: () => void;
  sendLightCommand: (c: "JOUR" | "NUIT" | "VOTE" | "LOUP") => void;
  isBLESupported: boolean;
}

const LightControlContext = createContext<LightControlContextValue | undefined>(undefined);

export function LightControlProvider({ children }: { children: ReactNode }) {
  // Le toggle principal vient du localStorage ; par défaut false
  const [lightEnabled, setLightEnabledState] = useState(readLightEnabledFromStorage());
  const ble = useLightBLE();

  const setLightEnabled = (enabled: boolean) => {
    setLightEnabledState(enabled);
    localStorage.setItem("werewolf-light-enabled", enabled ? "true" : "false");
  };

  // Lorsqu'on désactive, déconnecter BLE !
  React.useEffect(() => {
    if (!lightEnabled && ble.status === "connected") {
      ble.disconnect();
    }
  }, [lightEnabled, ble]);

  const value = useMemo(() => ({
    lightEnabled,
    setLightEnabled,
    bleStatus: ble.status,
    bleError: ble.error,
    bleConnect: ble.connect,
    bleDisconnect: ble.disconnect,
    sendLightCommand: ble.sendLightCommand,
    isBLESupported: ble.isBLESupported,
  }), [lightEnabled, ble]);

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
