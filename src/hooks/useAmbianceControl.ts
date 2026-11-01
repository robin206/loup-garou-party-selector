import { useCallback } from "react";
import { toast } from "sonner";
import { useAudio } from "@/hooks/useAudio";
import { useLightControl } from "@/hooks/LightControlContext";
import { useAmbiance, AmbiancePhase } from "@/hooks/AmbianceContext";
import { projector } from "@/lib/projector";

/**
 * Point d'entrée unique pour changer d'ambiance : musique, projecteur et lumière.
 * Utilisé par les boutons Jour / Vote / Nuit et par les boutons de changement de phase
 * (« Première nuit », « Jour suivant », « Nuit »...), pour que les deux se comportent pareil.
 */
export function useAmbianceControl() {
  const { playDayMusic, playNightMusic, playVoteMusic, stopMusic } = useAudio();
  const { lightEnabled, sendLightPhase } = useLightControl();
  const { activeAmbiance, setActiveAmbiance } = useAmbiance();

  /** Lance l'ambiance (musique en fondu enchaîné, projecteur, lumière). Sans effet si elle est déjà active. */
  const startAmbiance = useCallback(
    async (phase: AmbiancePhase) => {
      if (activeAmbiance === phase) return;
      setActiveAmbiance(phase);

      if (phase === "day") {
        playDayMusic();
        projector.day();
      } else if (phase === "night") {
        playNightMusic();
        projector.night();
      } else {
        playVoteMusic();
        // Le vote ne modifie pas le projecteur (reste sur JOUR ou NUIT)
      }

      if (lightEnabled) {
        try {
          const result = (await sendLightPhase(phase)) as { ble?: string; wifi?: string } | undefined;
          if (result?.ble === "error" || result?.wifi === "error") {
            toast.error("La commande lumière n'a pas pu être envoyée");
          }
        } catch (err) {
          console.error("Erreur lors de l'envoi de la commande lumière:", err);
          toast.error("La commande lumière n'a pas pu être envoyée");
        }
      }
    },
    [activeAmbiance, lightEnabled, playDayMusic, playNightMusic, playVoteMusic, sendLightPhase, setActiveAmbiance]
  );

  /** Coupe musique et lumière. */
  const stopAmbiance = useCallback(async () => {
    stopMusic();
    setActiveAmbiance(null);
    if (lightEnabled) {
      try {
        await sendLightPhase("off");
      } catch (err) {
        console.error("Erreur lors de l'extinction de la lumière:", err);
      }
    }
  }, [lightEnabled, sendLightPhase, setActiveAmbiance, stopMusic]);

  return { activeAmbiance, startAmbiance, stopAmbiance };
}
