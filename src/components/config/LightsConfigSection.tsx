
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Settings, Zap, ZapOff, Wifi, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLightControl, LightCommand } from "@/hooks/LightControlContext";

const LightsConfigSection: React.FC = () => {
  const {
    lightEnabled,
    setLightEnabled,
    lightMode,
    setLightMode,
    bleStatus,
    bleError,
    bleConnect,
    bleDisconnect,
    sendLightCommand,
    isBLESupported,
    wifiUrls,
    setWifiUrl,
    bleConfig,
    updateBLEConfig
  } = useLightControl();

  const [showAdvancedBLE, setShowAdvancedBLE] = useState(false);

  return (
    <section className="glass-card p-8 rounded-xl space-y-8 animate-scale-in mt-10">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="text-yellow-400 h-7 w-7" />
        <h2 className="text-2xl font-semibold">Configuration Lumières</h2>
      </div>

      <div className="flex items-center gap-4">
        <Switch
          checked={lightEnabled}
          onCheckedChange={setLightEnabled}
          id="light-enabled"
        />
        <Label htmlFor="light-enabled">
          Activer la gestion des lumières pendant le jeu
        </Label>
      </div>

      {lightEnabled && (
        <div className="space-y-6">
          <RadioGroup
            value={lightMode}
            onValueChange={(value) => setLightMode(value as "none" | "ble" | "wifi")}
            className="grid gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">Pas de gestion de la lumière</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ble" id="ble" />
              <Label htmlFor="ble">Bluetooth (BLE - ESP32)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wifi" id="wifi" />
              <Label htmlFor="wifi">WiFi (requêtes HTTP)</Label>
            </div>
          </RadioGroup>

          {lightMode === "ble" && (
            <div className="space-y-4">
              <Button
                variant={bleStatus === "connected" ? "secondary" : "outline"}
                size="sm"
                className="inline-flex items-center gap-2 w-fit"
                disabled={bleStatus === "connecting"}
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
                  : isBLESupported
                  ? "Tester la connexion BLE (ESP32)"
                  : "BLE non supporté"}
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
                  <span className="ml-3 text-red-400">Erreur : {bleError}</span>
                )}
              </div>

              {/* Nouvelle section déroulante pour la configuration avancée BLE */}
              <div className="mt-4 border rounded-md p-4 bg-gray-50/50">
                <button 
                  className="flex items-center justify-between w-full font-medium text-sm text-gray-700"
                  onClick={() => setShowAdvancedBLE(!showAdvancedBLE)}
                >
                  Configuration avancée BLE
                  {showAdvancedBLE ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                
                {showAdvancedBLE && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ble-service-uuid">Service UUID</Label>
                      <Input
                        id="ble-service-uuid"
                        value={bleConfig.serviceUUID}
                        onChange={(e) => updateBLEConfig({ serviceUUID: e.target.value })}
                        placeholder="d752c5fb-1380-4cd5-b0ef-cac7d72cff20"
                        className="font-mono text-xs"
                      />
                      <p className="text-xs text-gray-500">UUID du service BLE (configuré dans l'ESP32)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ble-characteristic-uuid">Characteristic UUID</Label>
                      <Input
                        id="ble-characteristic-uuid"
                        value={bleConfig.characteristicUUID}
                        onChange={(e) => updateBLEConfig({ characteristicUUID: e.target.value })}
                        placeholder="2d30c082-f39f-4ce6-923f-3484ea480596"
                        className="font-mono text-xs"
                      />
                      <p className="text-xs text-gray-500">UUID de la caractéristique d'écriture</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-2 flex-wrap">
                {/* Fix for the type mismatch: Use lowercase commands as per the LightCommand type */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={bleStatus !== "connected"}
                  onClick={() => sendLightCommand("jour")}
                >
                  Lumière Jour
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={bleStatus !== "connected"}
                  onClick={() => sendLightCommand("nuit")}
                >
                  Lumière Nuit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={bleStatus !== "connected"}
                  onClick={() => sendLightCommand("vote")}
                >
                  Lumière Vote
                </Button>
              </div>
            </div>
          )}

          {lightMode === "wifi" && (
            <div className="space-y-4">
              {(["jour", "nuit", "vote"] as LightCommand[]).map((command) => (
                <div key={command} className="grid gap-2">
                  <Label htmlFor={`wifi-${command}`}>URL Lumière {command}</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`wifi-${command}`}
                      value={wifiUrls[command]}
                      onChange={(e) => setWifiUrl(command, e.target.value)}
                      placeholder="http://192.168.1.xxx/commande"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => sendLightCommand(command)}
                      disabled={!wifiUrls[command]}
                    >
                      <Wifi className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <p className="text-sm text-gray-400">
                Saisissez les URLs à appeler pour chaque scénario de lumière
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default LightsConfigSection;
