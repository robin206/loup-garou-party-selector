import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import audioService from "@/services/audioService";
import { useAmbiance } from "@/hooks/AmbianceContext";

/**
 * Pages depuis lesquelles l'ambiance de la partie doit continuer à jouer.
 * Sur toutes les autres (accueil, préparation, distribution...), la musique est coupée.
 */
const KEEP_AUDIO_PATHS = ["/game", "/config", "/rules", "/music-admin"];

const AudioRouteGuard = () => {
  const { pathname } = useLocation();
  const { setActiveAmbiance } = useAmbiance();

  useEffect(() => {
    if (!KEEP_AUDIO_PATHS.includes(pathname)) {
      audioService.stopAudio();
      setActiveAmbiance(null);
    }
  }, [pathname, setActiveAmbiance]);

  return null;
};

export default AudioRouteGuard;
