
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
      // Encode l'URL pour gérer les caractères spéciaux
      const encodedUrl = encodeURI(url);
      console.log(`Envoi de commande à l'URL encodée: ${encodedUrl}`);

      // Add mode: 'no-cors' to prevent CORS issues
      // Also add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(encodedUrl, { 
        mode: 'no-cors',
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      // Since no-cors mode returns an opaque response (status 0), 
      // we can't check response.ok, but we can assume it worked
      // if we reach here without throwing an error
      toast.success(`Commande ${command} envoyée`);
      return true;
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande:", error);
      let errorMessage = "Erreur réseau";
      
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        errorMessage = "Impossible de contacter l'appareil WiFi. Vérifiez l'URL et que l'appareil est allumé et connecté au même réseau.";
      } else if (error instanceof DOMException && error.name === "AbortError") {
        errorMessage = "La requête a expiré après 5 secondes.";
      } else {
        errorMessage = `Erreur: ${error}`;
      }
      
      toast.error(errorMessage);
      return false;
    }
  };

  return { sendCommand };
}
