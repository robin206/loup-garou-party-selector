
import { useState } from "react";

// Type definitions : on tolère l’absence de types bluetooth en environnement non compatible (TS ignore)
// Utilisation de types any ou fallback.
export type BLEStatus = "idle" | "connecting" | "connected" | "error" | "disconnected";

const SERVICE_NAME = "LG_ESP32"; //ancien paramètre du BLE
const SERVICE_UUID = "d752c5fb-1380-4cd5-b0ef-cac7d72cff20";
const COMMAND_CHARACTERISTIC = "2d30c082-f39f-4ce6-923f-3484ea480596"; // Peut varier selon l'ESP32, à adapter si besoin

type LightCode = "JOUR" | "NUIT" | "VOTE" | "LOUP";

type BluetoothDeviceCustom = any;
type BluetoothRemoteGATTServerCustom = any;

export function useLightBLE() {
  const [status, setStatus] = useState<BLEStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<BluetoothDeviceCustom | null>(null);
  const [server, setServer] = useState<BluetoothRemoteGATTServerCustom | null>(null);

  // Vérifie si le navigateur supporte l'API Bluetooth
  const isBLESupported = (): boolean => {
    try {
      return typeof window !== 'undefined' && typeof window.navigator === 'object' && "bluetooth" in window.navigator;
    } catch {
      return false;
    }
  };

  // Connexion et maintient l'objet device/server en mémoire si besoin de renvoyer d'autres commandes
  async function connect() {
    setStatus("connecting");
    setError(null);

    if (!isBLESupported()) {
      setError("Bluetooth non supporté par ce navigateur");
      setStatus("error");
      return null;
    }

    try {
      // Demande le device avec le service id configuré »
      const device = await (window.navigator as any).bluetooth.requestDevice({
        filters: [{ name: SERVICE_NAME }],
        optionalServices: [SERVICE_UUID] // Cela doit correspondre à l'UUID du service
      });
      setDevice(device);

      // Connexion GATT
      if (device.gatt) {
        const server = await device.gatt.connect();
        setServer(server);
        setStatus("connected");
        return server;
      } else {
        throw new Error("GATT non disponible sur cet appareil");
      }
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
        await server.getPrimaryService(SERVICE_UUID).catch(() =>
          // fallback, si `SERVICE_UUID` ne marche pas (UUID typique pour custom peut être "2d30c082-f39f-4ce6-923f-3484ea480596")
          server.getPrimaryService("2d30c082-f39f-4ce6-923f-3484ea480596")
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
    if (device?.gatt) {
      device.gatt.disconnect();
    }
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
    isBLESupported: isBLESupported(),
  };
}
