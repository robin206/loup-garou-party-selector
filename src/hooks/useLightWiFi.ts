
import { toast } from "sonner";
import { LightCommand } from "./LightControlContext";

/** Effectue l'appel HTTP vers une URL de lumière donnée. */
export async function callLightUrl(url: string, label: string): Promise<boolean> {
  if (!url || !url.trim()) {
    toast.error(`URL non configurée pour la commande ${label}`);
    return false;
  }

  try {
    // Encode l'URL pour gérer les caractères spéciaux
    const encodedUrl = encodeURI(url.trim());

    // mode: 'no-cors' pour éviter les problèmes CORS + timeout de sécurité
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch(encodedUrl, {
      mode: "no-cors",
      signal: controller.signal,
      method: "GET",
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    // En mode no-cors la réponse est opaque : pas d'erreur = succès présumé
    toast.success(`Commande ${label} envoyée`);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la commande lumière");
    let errorMessage = "Erreur réseau";

    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      errorMessage =
        "Impossible de contacter l'appareil WiFi. Vérifiez l'URL et que l'appareil est allumé et connecté au même réseau.";
    } else if (error instanceof DOMException && error.name === "AbortError") {
      errorMessage = "La requête a expiré après 5 secondes.";
    }

    toast.error(errorMessage);
    return false;
  }
}

export function useLightWiFi(urls: Record<LightCommand, string>) {
  /** Envoie la commande en résolvant l'URL au moment de l'appel. */
  const sendCommand = async (command: LightCommand): Promise<boolean> =>
    callLightUrl(urls[command] ?? "", command);

  /** Envoie directement une URL fournie par l'appelant (boutons de test). */
  const sendUrl = async (url: string, label: string): Promise<boolean> =>
    callLightUrl(url, label);

  return { sendCommand, sendUrl };
}
