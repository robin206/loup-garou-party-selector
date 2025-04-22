
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Zap, ZapOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LightsConfigSectionProps {
  lightEnabled: boolean;
  handleToggleLight: (checked: boolean) => void;
  bleStatus: string;
  bleError: string | null;
  bleConnect: () => Promise<any>;
  bleDisconnect: () => void;
  sendLightCommand: (c: "JOUR" | "NUIT" | "VOTE" | "LOUP") => void;
}

const LightsConfigSection: React.FC<LightsConfigSectionProps> = ({
  lightEnabled,
  handleToggleLight,
  bleStatus,
  bleError,
  bleConnect,
  bleDisconnect,
  sendLightCommand,
}) => (
  <section className="glass-card p-8 rounded-xl space-y-8 animate-scale-in mt-10">
    <div className="flex items-center gap-3 mb-4">
      <Zap className="text-yellow-400 h-7 w-7" />
      <h2 className="text-2xl font-semibold">Configuration Lumières</h2>
    </div>
    <div className="flex items-center gap-4">
      <Switch
        checked={lightEnabled}
        onCheckedChange={handleToggleLight}
        id="light-enabled"
      />
      <Label htmlFor="light-enabled">
        Activer la gestion des lumières pendant le jeu
      </Label>
    </div>
    <div className="flex flex-col gap-2">
      <Button
        variant={bleStatus === "connected" ? "secondary" : "outline"}
        size="sm"
        className="inline-flex items-center gap-2 w-fit"
        disabled={!lightEnabled || bleStatus === "connecting"}
        onClick={bleStatus === "connected" ? bleDisconnect : bleConnect}
      >
        {bleStatus === "connected" ? (
          <Zap className="text-green-500" />
        ) : (
          <ZapOff className="text-gray-500" />
        )}
        {bleStatus === "connected"
          ? "Déconnecter la lumière"
          : bleStatus === "connecting"
          ? "Connexion en cours…"
          : "Tester la connexion BLE (ESP32)"}
      </Button>
      <div className="text-sm text-gray-400">
        <span>
          État BLE :{" "}
          <span
            className={
              bleStatus === "connected"
                ? "text-green-400"
                : bleStatus === "error"
                ? "text-red-400"
                : "text-gray-400"
            }
          >
            {bleStatus === "idle"
              ? "Non connecté"
              : bleStatus === "connected"
              ? "Connecté"
              : bleStatus === "connecting"
              ? "Connexion…"
              : bleStatus === "error"
              ? "Erreur"
              : "Déconnecté"}
          </span>
        </span>
        {bleError && (
          <span className="ml-3 text-red-400">Erreur : {bleError}</span>
        )}
      </div>
    </div>
    <div className="flex gap-2 mt-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        disabled={!lightEnabled || bleStatus !== "connected"}
        onClick={() => sendLightCommand("JOUR")}
      >
        Lumière Jour
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!lightEnabled || bleStatus !== "connected"}
        onClick={() => sendLightCommand("NUIT")}
      >
        Lumière Nuit
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!lightEnabled || bleStatus !== "connected"}
        onClick={() => sendLightCommand("VOTE")}
      >
        Lumière Vote
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!lightEnabled || bleStatus !== "connected"}
        onClick={() => sendLightCommand("LOUP")}
      >
        Lumière Loup
      </Button>
    </div>
    <p className="text-xs text-gray-400 mt-2">
      Testez la connexion Bluetooth BLE à l’ESP32 “LoupGarouLight” et déclenchez chaque ambiance lumineuse.<br />
      N.B. : La gestion des lumières nécessite Chrome sur Android ou un navigateur compatible BLE.
    </p>
  </section>
);

export default LightsConfigSection;
