
import { useState } from "react";

// Type definitions : on tolère l'absence de types bluetooth en environnement non compatible (TS ignore)
// Utilisation de types any ou fallback.
export type BLEStatus = "idle" | "connecting" | "connected" | "error" | "disconnected";

// Valeurs par défaut pour la configuration BLE
const DEFAULT_SERVICE_NAME = "LG_ESP32"; // Pour compatibilité avec anciennes configs
const DEFAULT_SERVICE_UUID = "d752c5fb-1380-4cd5-b0ef-cac7d72cff20";
const DEFAULT_COMMAND_CHARACTERISTIC = "2d30c082-f39f-4ce6-923f-3484ea480596";

type LightCode = "jour" | "nuit" | "vote" | "loup";

type BluetoothDeviceCustom = any;
type BluetoothRemoteGATTServerCustom = any;

// Configuration BLE stockée dans localStorage
const getBLEConfig = () => {
  try {
    const savedConfig = localStorage.getItem('werewolf-ble-config');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (e) {
    console.error("Erreur lors du chargement de la config BLE:", e);
  }
  
  return {
    serviceName: DEFAULT_SERVICE_NAME,
    serviceUUID: DEFAULT_SERVICE_UUID,
    characteristicUUID: DEFAULT_COMMAND_CHARACTERISTIC
  };
};

export function useLightBLE() {
  const [status, setStatus] = useState<BLEStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<BluetoothDeviceCustom | null>(null);
  const [server, setServer] = useState<BluetoothRemoteGATTServerCustom | null>(null);
  const [bleConfig, setBLEConfig] = useState(getBLEConfig());

  // Vérifie si le navigateur supporte l'API Bluetooth
  const isBLESupported = (): boolean => {
    try {
      return typeof window !== 'undefined' && typeof window.navigator === 'object' && "bluetooth" in window.navigator;
    } catch {
      return false;
    }
  };

  // Fonction pour changer la configuration BLE
  const updateBLEConfig = (newConfig: Partial<typeof bleConfig>) => {
    const updatedConfig = { ...bleConfig, ...newConfig };
    setBLEConfig(updatedConfig);
    localStorage.setItem('werewolf-ble-config', JSON.stringify(updatedConfig));
    return updatedConfig;
  };

  // Connexion avec les nouveaux paramètres de configuration
  async function connect() {
    setStatus("connecting");
    setError(null);

    if (!isBLESupported()) {
      setError("Bluetooth non supporté par ce navigateur");
      setStatus("error");
      return null;
    }

    try {
      // Préparation des options de requête Bluetooth selon la configuration
      const bleRequestOptions: any = {
        // Utiliser des filtres sur le service UUID plutôt que le nom, comme dans votre exemple
        filters: [{ services: [bleConfig.serviceUUID] }],
        optionalServices: [] // Pas besoin car déjà inclus dans les filtres
      };

      console.log("Demande de connexion BLE avec options:", bleRequestOptions);

      // Demande le device avec le service UUID configuré
      const device = await (window.navigator as any).bluetooth.requestDevice(bleRequestOptions);
      setDevice(device);
      console.log("Appareil BLE trouvé:", device);

      // Connexion GATT
      if (device.gatt) {
        const server = await device.gatt.connect();
        setServer(server);
        setStatus("connected");
        console.log("Connecté au serveur GATT");
        return server;
      } else {
        throw new Error("GATT non disponible sur cet appareil");
      }
    } catch (e: any) {
      const errorMsg = e.message || String(e);
      console.error("Erreur de connexion BLE:", errorMsg);
      setError(errorMsg);
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
      return false;
    }

    try {
      console.log(`Tentative d'envoi de la commande BLE: ${code}`);
      
      // Récupère le service par UUID (utiliser le service UUID spécifié dans la config)
      const service = await server.getPrimaryService(bleConfig.serviceUUID);
      if (!service) throw new Error("Service non trouvé");
      
      console.log("Service BLE trouvé, recherche de la caractéristique...");
      
      // Caractéristique d'écriture
      const characteristic = await service.getCharacteristic(bleConfig.characteristicUUID);
      if (!characteristic) throw new Error("Caractéristique non trouvée");
      
      console.log("Caractéristique BLE trouvée, envoi de la commande...");
      
      // Encode la commande en UTF-8
      const encodedValue = new TextEncoder().encode(code);
      console.log(`Envoi de la valeur encodée: ${code}`, encodedValue);
      
      await characteristic.writeValue(encodedValue);
      console.log(`Commande BLE "${code}" envoyée avec succès!`);
      return true;
    } catch (e: any) {
      const errorMsg = e.message || String(e);
      console.error("Erreur lors de l'envoi de la commande BLE:", errorMsg);
      setError(errorMsg);
      setStatus("error");
      return false;
    }
  }

  function disconnect() {
    if (device?.gatt) {
      device.gatt.disconnect();
      console.log("Déconnecté du périphérique BLE");
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
    bleConfig,
    updateBLEConfig
  };
}
