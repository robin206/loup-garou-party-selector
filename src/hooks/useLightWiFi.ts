
import { toast } from "sonner";
import { LightCommand } from "./LightControlContext";

export function useLightWiFi(urls: Record<LightCommand, string>) {
  const sendCommand = async (command: LightCommand) => {
    const url = urls[command];
    if (!url) {
      toast.error(`URL non configurée pour la commande ${command}`);
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      toast.success(`Commande ${command} envoyée avec succès`);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande:", error);
      toast.error(`Erreur lors de l'envoi de la commande: ${error}`);
    }
  };

  return { sendCommand };
}
