/**
 * Couche centrale de déclenchement des lumières.
 *
 * Bluetooth (BLE) et WiFi sont deux transports totalement indépendants :
 * chacun peut être activé ou non, et une même action utilisateur déclenche
 * au plus un envoi par transport actif.
 */

/** Modes d'ambiance lumineuse utilisés par le jeu. */
export type LightPhase = "day" | "vote" | "night" | "off";

/** Commande brute envoyée aux appareils (toujours en minuscules). */
export type LightCommandCode = "jour" | "vote" | "nuit" | "off";

/**
 * Mapping unique mode -> commande, pour empêcher toute inversion
 * entre jour / vote / nuit.
 */
export const PHASE_TO_COMMAND: Record<LightPhase, LightCommandCode> = {
  day: "jour",
  vote: "vote",
  night: "nuit",
  off: "off",
};

export type TransportResult = "skipped" | "success" | "error";

export interface LightDispatchResult {
  ble: TransportResult;
  wifi: TransportResult;
}

export interface LightDispatchOptions {
  bleEnabled: boolean;
  wifiEnabled: boolean;
  /** Envoi BLE — ne doit pas lever, mais une exception est tolérée. */
  sendBle: (command: string) => Promise<boolean | void> | boolean | void;
  /** Envoi WiFi — ne doit pas lever, mais une exception est tolérée. */
  sendWifi: (command: string) => Promise<boolean | void> | boolean | void;
}

async function runTransport(
  enabled: boolean,
  send: (command: string) => Promise<boolean | void> | boolean | void,
  command: string
): Promise<TransportResult> {
  if (!enabled) return "skipped";
  try {
    const result = await send(command);
    return result === false ? "error" : "success";
  } catch (e) {
    console.error(`Erreur transport lumière pour la commande "${command}"`, e);
    return "error";
  }
}

/**
 * Envoie une commande sur tous les transports activés, de façon indépendante :
 * l'échec de l'un n'empêche jamais l'autre.
 */
export async function dispatchLightCommand(
  command: string,
  { bleEnabled, wifiEnabled, sendBle, sendWifi }: LightDispatchOptions
): Promise<LightDispatchResult> {
  const [ble, wifi] = await Promise.all([
    runTransport(bleEnabled, sendBle, command),
    runTransport(wifiEnabled, sendWifi, command),
  ]);
  return { ble, wifi };
}
