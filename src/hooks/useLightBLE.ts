
import { useState } from "react";

export type BLEStatus = "idle" | "connecting" | "connected" | "error" | "disconnected";

const SERVICE_NAME = "LoupGarouLight";
const COMMAND_CHARACTERISTIC = "0000ffe1-0000-1000-8000-00805f9b34fb"; // Peut varier selon l'ESP32, à adapter si besoin

type LightCode = "JOUR" | "NUIT" | "VOTE" | "LOUP";

export function useLightBLE() {
  const [status, setStatus] = useState<BLEStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null);

  // Connexion et maintient l'objet device/server en mémoire si besoin de renvoyer d'autres commandes
  async function connect() {
    setStatus("connecting");
    setError(null);
    try {
      // Demande le device avec le service custom qui porte le nom « LoupGarouLight »
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: SERVICE_NAME }],
        optionalServices: [SERVICE_NAME] // Cela doit correspondre à l’UUID du service
      });
      setDevice(device);

      // Connexion GATT
      const server = await device.gatt?.connect();
      setServer(server || null);
      setStatus("connected");
      return server;
    } catch (e: any) {
      setError(e.message || String(e));
      setStatus("error");
      return null;
    }
  }

  // Envoie une commande (string, ex : "JOUR")
  async function sendLightCommand(code: LightCode) {
    setError(null);
    if (!device || !server) {
      setError("Non connecté !");
      setStatus("disconnected");
      return;
    }
    try {
      // Récupère le service (par UUID, peut nécessiter le service UUID réel si le nom ne fonctionne pas)
      const service =
        await server.getPrimaryService(SERVICE_NAME).catch(() =>
          // fallback, si `SERVICE_NAME` ne marche pas (UUID typique pour custom peut être "0000ffe0-0000-1000-8000-00805f9b34fb")
          server.getPrimaryService("0000ffe0-0000-1000-8000-00805f9b34fb")
        );
      if (!service) throw new Error("Service non trouvé");
      // Caractéristique d'écriture
      const characteristic = await service.getCharacteristic(COMMAND_CHARACTERISTIC);
      if (!characteristic) throw new Error("Caractéristique non trouvée");
      // Encode la commande en UTF-8
      await characteristic.writeValue(new TextEncoder().encode(code));
      return true;
    } catch (e: any) {
      setError(e.message || String(e));
      setStatus("error");
      return false;
    }
  }

  function disconnect() {
    device?.gatt?.disconnect();
    setDevice(null);
    setServer(null);
    setStatus("disconnected");
  }

  return {
    status,
    error,
    connect,
    sendLightCommand,
    disconnect,
  };
}
