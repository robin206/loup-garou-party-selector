/**
 * Helper de communication avec la page /projector.html
 * via BroadcastChannel "loupgarou-projector".
 *
 * Seuls les modes DAY et NIGHT sont pris en compte par le projecteur.
 */

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

function send(mode: ProjectorMode) {
  const ch = getChannel();
  if (!ch) return;
  try {
    ch.postMessage({ type: "CHANGE_PROJECTOR_MODE", mode });
  } catch (e) {
    console.warn("Envoi projecteur échoué:", e);
  }
}

export const projector = {
  day: () => send("DAY"),
  night: () => send("NIGHT"),
  /** @deprecated conservé pour compatibilité, sans effet côté projecteur */
  vote: () => { /* ignoré */ },
  /** @deprecated conservé pour compatibilité, sans effet côté projecteur */
  end: () => { /* ignoré */ },
  setMode: (mode: ProjectorMode) => send(mode),
};

export default projector;
