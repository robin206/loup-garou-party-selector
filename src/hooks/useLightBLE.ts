import { useState, useEffect } from "react";

// Type definitions : on tolère l'absence de types bluetooth en environnement non compatible (TS ignore)
// Utilisation de types any ou fallback.
export type BLEStatus = "idle" | "connecting" | "connected" | "error" | "disconnected";

// Valeurs par défaut pour la configuration BLE
const DEFAULT_SERVICE_NAME = "LG_ESP32"; // Pour compatibilité avec anciennes configs
const DEFAULT_SERVICE_UUID = "d752c5fb-1380-4cd5-b0ef-cac7d72cff20";
const DEFAULT_COMMAND_CHARACTERISTIC = "2d30c082-f39f-4ce6-923f-3484ea480596";
const DEFAULT_LED_COUNT = 50;
const DEFAULT_BRIGHTNESS = 150;

type LightCode = "jour" | "nuit" | "vote" | "loup" | "off";

type BluetoothDeviceCustom = any;
type BluetoothRemoteGATTServerCustom = any;

// Clés pour le stockage de l'état BLE
const BLE_CONFIG_KEY = 'werewolf-ble-config';
const BLE_DEVICE_ID_KEY = 'werewolf-ble-device-id';
const BLE_CONNECTION_STATE_KEY = 'werewolf-ble-connection-state';

// Configuration BLE stockée dans localStorage
const getBLEConfig = () => {
  try {
    const savedConfig = localStorage.getItem(BLE_CONFIG_KEY);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (e) {
    console.error("Erreur lors du chargement de la config BLE:", e);
  }
  
  return {
    serviceName: DEFAULT_SERVICE_NAME,
    serviceUUID: DEFAULT_SERVICE_UUID,
    characteristicUUID: DEFAULT_COMMAND_CHARACTERISTIC,
    ledCount: DEFAULT_LED_COUNT,
    brightness: DEFAULT_BRIGHTNESS
  };
};

// Gestion de la persistance de l'état de connexion
const saveBLEConnectionState = (connected: boolean, deviceId?: string) => {
  try {
    localStorage.setItem(BLE_CONNECTION_STATE_KEY, connected ? "connected" : "disconnected");
    if (deviceId) {
      localStorage.setItem(BLE_DEVICE_ID_KEY, deviceId);
    } else if (!connected) {
      localStorage.removeItem(BLE_DEVICE_ID_KEY);
    }
  } catch (e) {
    console.error("Erreur lors de l'enregistrement de l'état BLE:", e);
  }
};

// Lecture de l'état de connexion persistant
const getBLEConnectionState = (): { wasConnected: boolean; deviceId?: string } => {
  try {
    const state = localStorage.getItem(BLE_CONNECTION_STATE_KEY);
    const deviceId = localStorage.getItem(BLE_DEVICE_ID_KEY);
    return { 
      wasConnected: state === "connected", 
      deviceId: deviceId || undefined 
    };
  } catch (e) {
    console.error("Erreur lors de la lecture de l'état BLE:", e);
    return { wasConnected: false };
  }
};

export function useLightBLE() {
  const [status, setStatus] = useState<BLEStatus>(() => {
    const { wasConnected } = getBLEConnectionState();
    return wasConnected ? "connected" : "idle";
  });
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
    localStorage.setItem(BLE_CONFIG_KEY, JSON.stringify(updatedConfig));
    return updatedConfig;
  };

  // Effet pour essayer de restaurer la connexion au chargement
  useEffect(() => {
    const { wasConnected, deviceId } = getBLEConnectionState();
    
    // Si on était connecté précédemment et qu'on a un ID de périphérique
    if (wasConnected && deviceId && isBLESupported()) {
      console.log("Tentative de restauration de la connexion BLE...");
      
      // On ne peut pas directement restaurer une connexion BLE avec un ID
      // On définit l'état comme "déconnecté" pour que l'utilisateur puisse reconnecter manuellement
      setStatus("disconnected");
    }
  }, []);

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
        // Utiliser des filtres sur le service UUID plutôt que le nom
        filters: [{ services: [bleConfig.serviceUUID] }],
        optionalServices: [] // Pas besoin car déjà inclus dans les filtres
      };

      console.log("Demande de connexion BLE avec options:", bleRequestOptions);

      // Demande le device avec le service UUID configuré
      const device = await (window.navigator as any).bluetooth.requestDevice(bleRequestOptions);
      setDevice(device);
      console.log("Appareil BLE trouvé:", device);

      // Enregistre l'ID du périphérique pour référence future
      if (device && device.id) {
        saveBLEConnectionState(true, device.id);
      }

      // Ajout d'un gestionnaire de déconnexion
      device.addEventListener('gattserverdisconnected', () => {
        console.log("Déconnexion GATT détectée");
        setStatus("disconnected");
        setServer(null);
        saveBLEConnectionState(false);
      });

      // Connexion GATT
      if (device.gatt) {
        const server = await device.gatt.connect();
        setServer(server);
        setStatus("connected");
        saveBLEConnectionState(true, device.id);
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
      saveBLEConnectionState(false);
      return null;
    }
  }

  // Envoie une commande (string, ex : "jour") ou paramètres spéciaux (ledcount:50, brightness:150)
  async function sendLightCommand(code: LightCode | string) {
    setError(null);
    if (!device || !server) {
      console.error("Tentative d'envoi de commande sans connexion BLE");
      setError("Non connecté !");
      setStatus("disconnected");
      saveBLEConnectionState(false);
      return false;
    }

    try {
      console.log(`Tentative d'envoi de la commande BLE: ${code}`);

      // Vérifier si le serveur est toujours connecté
      if (!server.connected) {
        console.log("Serveur GATT déconnecté, tentative de reconnexion...");
        try {
          await device.gatt?.connect();
        } catch (reconnectError) {
          console.error("Échec de reconnexion:", reconnectError);
          setError("Erreur de reconnexion au périphérique");
          setStatus("disconnected");
          saveBLEConnectionState(false);
          return false;
        }
      }
      
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
      
      // Si l'erreur est liée à la connexion, on mise à jour l'état
      if (errorMsg.includes("disconnected") || errorMsg.includes("GATT")) {
        setStatus("disconnected");
        saveBLEConnectionState(false);
      } else {
        setStatus("error");
      }
      
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
    saveBLEConnectionState(false);
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
