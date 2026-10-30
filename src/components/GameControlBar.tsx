import React from "react";
import { Bluetooth, BluetoothConnected, BluetoothOff, MonitorPlay, LightbulbOff } from "lucide-react";
import { cn } from "@/lib/utils";
import VolumeControl from "./VolumeControl";
import { useAudio } from "@/hooks/useAudio";
import { useLightControl } from "@/hooks/LightControlContext";
import { useAmbiance } from "@/hooks/AmbianceContext";
import { useProjectorSettings } from "@/lib/projectorSettings";

const barButton =
  "flex h-9 items-center justify-center gap-1.5 rounded-full px-2.5 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50";

/**
 * Barre de régie flottante (en bas à droite, au-dessus du sampler) :
 * volume, extinction des lumières, connexion Bluetooth et ouverture du projecteur.
 * Remplace l'ancien bouton flottant ProjectorButton.
 */
const GameControlBar: React.FC = () => {
  const { stopMusic } = useAudio();
  const { lightEnabled, bleEnabled, bleStatus, bleConnect, bleDisconnect, sendLightPhase } = useLightControl();
  const { setActiveAmbiance } = useAmbiance();
  const { enabled: projectorEnabled } = useProjectorSettings();

  // Coupe la musique, éteint les lumières et désélectionne l'ambiance
  const handleLightOff = () => {
    stopMusic();
    setActiveAmbiance(null);
    if (lightEnabled) {
      sendLightPhase("off");
    }
  };

  const handleBLEConnection = () => {
    if (bleStatus === "connected") {
      bleDisconnect();
    } else {
      bleConnect();
    }
  };

  const openProjector = () => {
    window.open("/projector.html", "loupgarou-projector");
  };

  const bleIcon =
    bleStatus === "connected" ? (
      <BluetoothConnected className="h-5 w-5 text-green-400" />
    ) : bleStatus === "connecting" ? (
      <Bluetooth className="h-5 w-5 animate-pulse text-sky-300" />
    ) : (
      <BluetoothOff className="h-5 w-5 text-zinc-400" />
    );

  return (
    <div
      role="toolbar"
      aria-label="Régie"
      className="fixed bottom-24 right-4 z-[100] flex items-center gap-1 rounded-full border border-white/20 bg-black/80 px-1.5 py-1 shadow-lg backdrop-blur-sm"
    >
      <VolumeControl triggerClassName={barButton} />

      {lightEnabled && (
        <button type="button" className={barButton} onClick={handleLightOff} title="Couper musique et lumières" aria-label="Couper musique et lumières">
          <LightbulbOff className="h-5 w-5" />
        </button>
      )}

      {bleEnabled && (
        <button
          type="button"
          className={barButton}
          disabled={bleStatus === "connecting"}
          onClick={handleBLEConnection}
          title={bleStatus === "connected" ? "Déconnecter le Bluetooth (ESP32)" : "Connecter le Bluetooth (ESP32)"}
          aria-label={bleStatus === "connected" ? "Déconnecter le Bluetooth" : "Connecter le Bluetooth"}
        >
          {bleIcon}
        </button>
      )}

      {projectorEnabled && (
        <>
          <span className="mx-0.5 h-5 w-px bg-white/25" aria-hidden="true" />
          <button type="button" className={cn(barButton, "text-xs")} onClick={openProjector} title="Ouvrir la page projecteur">
            <MonitorPlay className="h-4 w-4" />
            Projecteur
          </button>
        </>
      )}
    </div>
  );
};

export default GameControlBar;
