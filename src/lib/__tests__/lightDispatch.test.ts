import { describe, it, expect, vi, beforeEach } from "vitest";
import { dispatchLightCommand, PHASE_TO_COMMAND, LightPhase } from "@/lib/lightDispatch";
import { callLightUrl } from "@/hooks/useLightWiFi";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const PHASES: LightPhase[] = ["day", "vote", "night"];

const URLS: Record<string, string> = {
  jour: "http://192.168.1.10/jour",
  vote: "http://192.168.1.10/vote",
  nuit: "http://192.168.1.10/nuit",
  off: "http://192.168.1.10/off",
};

function makeHarness(overrides: Partial<{ bleFails: boolean; wifiFails: boolean }> = {}) {
  const sendBle = vi.fn(async () => (overrides.bleFails ? false : true));
  const sendWifi = vi.fn(async (command: string) => {
    if (overrides.wifiFails) throw new Error("network down");
    return URLS[command] !== undefined;
  });
  return { sendBle, sendWifi };
}

describe("mapping mode -> commande", () => {
  it("mappe jour / vote / nuit sans inversion", () => {
    expect(PHASE_TO_COMMAND.day).toBe("jour");
    expect(PHASE_TO_COMMAND.vote).toBe("vote");
    expect(PHASE_TO_COMMAND.night).toBe("nuit");
  });
});

describe("matrice Bluetooth / WiFi", () => {
  it("n'envoie rien quand les deux sont désactivés", async () => {
    for (const phase of PHASES) {
      const { sendBle, sendWifi } = makeHarness();
      await dispatchLightCommand(PHASE_TO_COMMAND[phase], {
        bleEnabled: false,
        wifiEnabled: false,
        sendBle,
        sendWifi,
      });
      expect(sendBle).not.toHaveBeenCalled();
      expect(sendWifi).not.toHaveBeenCalled();
    }
  });

  it("n'envoie que le Bluetooth quand seul le BLE est activé", async () => {
    for (const phase of PHASES) {
      const { sendBle, sendWifi } = makeHarness();
      await dispatchLightCommand(PHASE_TO_COMMAND[phase], {
        bleEnabled: true,
        wifiEnabled: false,
        sendBle,
        sendWifi,
      });
      expect(sendBle).toHaveBeenCalledTimes(1);
      expect(sendBle).toHaveBeenCalledWith(PHASE_TO_COMMAND[phase]);
      expect(sendWifi).not.toHaveBeenCalled();
    }
  });

  it("n'envoie que la bonne URL WiFi quand seul le WiFi est activé", async () => {
    for (const phase of PHASES) {
      const { sendBle, sendWifi } = makeHarness();
      await dispatchLightCommand(PHASE_TO_COMMAND[phase], {
        bleEnabled: false,
        wifiEnabled: true,
        sendBle,
        sendWifi,
      });
      expect(sendBle).not.toHaveBeenCalled();
      expect(sendWifi).toHaveBeenCalledTimes(1);
      expect(sendWifi).toHaveBeenCalledWith(PHASE_TO_COMMAND[phase]);
    }
  });

  it("envoie les deux, une seule fois chacun, quand les deux sont activés", async () => {
    for (const phase of PHASES) {
      const { sendBle, sendWifi } = makeHarness();
      await dispatchLightCommand(PHASE_TO_COMMAND[phase], {
        bleEnabled: true,
        wifiEnabled: true,
        sendBle,
        sendWifi,
      });
      expect(sendBle).toHaveBeenCalledTimes(1);
      expect(sendWifi).toHaveBeenCalledTimes(1);
      expect(sendBle).toHaveBeenCalledWith(PHASE_TO_COMMAND[phase]);
      expect(sendWifi).toHaveBeenCalledWith(PHASE_TO_COMMAND[phase]);
    }
  });
});

describe("indépendance des transports", () => {
  it("une erreur Bluetooth n'empêche pas l'appel WiFi", async () => {
    const { sendBle, sendWifi } = makeHarness({ bleFails: true });
    const result = await dispatchLightCommand("nuit", {
      bleEnabled: true,
      wifiEnabled: true,
      sendBle,
      sendWifi,
    });
    expect(sendWifi).toHaveBeenCalledWith("nuit");
    expect(result.ble).toBe("error");
    expect(result.wifi).toBe("success");
  });

  it("une erreur WiFi n'empêche pas la commande Bluetooth", async () => {
    const { sendBle, sendWifi } = makeHarness({ wifiFails: true });
    const result = await dispatchLightCommand("jour", {
      bleEnabled: true,
      wifiEnabled: true,
      sendBle,
      sendWifi,
    });
    expect(sendBle).toHaveBeenCalledWith("jour");
    expect(result.ble).toBe("success");
    expect(result.wifi).toBe("error");
  });
});

describe("boutons de test WiFi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 200 })));
  });

  it("chaque bouton appelle exactement l'URL de son propre champ", async () => {
    const fields = [
      { label: "Lumière jour", url: "http://192.168.1.10/jour" },
      { label: "Lumière vote", url: "http://192.168.1.10/vote" },
      { label: "Lumière nuit", url: "http://192.168.1.10/nuit" },
    ];

    for (const field of fields) {
      await callLightUrl(field.url, field.label);
    }

    const called = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.map((c) => c[0]);
    expect(called).toEqual([
      "http://192.168.1.10/jour",
      "http://192.168.1.10/vote",
      "http://192.168.1.10/nuit",
    ]);
    expect(new Set(called).size).toBe(3);
  });

  it("n'appelle rien si l'URL est absente", async () => {
    const ok = await callLightUrl("", "Lumière vote");
    expect(ok).toBe(false);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});
