import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import type { LightPhase } from "@/lib/lightDispatch";

/** Ambiances pilotables par les boutons (musique + lumière). */
export type AmbiancePhase = Exclude<LightPhase, "off">;

interface AmbianceContextValue {
  /** Ambiance actuellement en cours, ou null si tout est coupé. */
  activeAmbiance: AmbiancePhase | null;
  setActiveAmbiance: (phase: AmbiancePhase | null) => void;
}

const AmbianceContext = createContext<AmbianceContextValue | undefined>(undefined);

/**
 * Source de vérité unique pour les boutons Jour / Vote / Nuit :
 * une seule ambiance peut être active à la fois.
 */
export function AmbianceProvider({ children }: { children: ReactNode }) {
  const [activeAmbiance, setActiveAmbiance] = useState<AmbiancePhase | null>(null);
  const value = useMemo(() => ({ activeAmbiance, setActiveAmbiance }), [activeAmbiance]);
  return <AmbianceContext.Provider value={value}>{children}</AmbianceContext.Provider>;
}

export function useAmbiance() {
  const ctx = useContext(AmbianceContext);
  if (!ctx) throw new Error("useAmbiance must be used within <AmbianceProvider>");
  return ctx;
}
