import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Zap, 
  ZapOff, 
  Wifi, 
  ChevronDown, 
  ChevronUp, 
  PowerOff,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import NumberInput from "@/components/NumberInput";
import { useLightControl, LightCommand } from "@/hooks/LightControlContext";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  const [showSamplerUrls, setShowSamplerUrls] = useState(false);
  const [ledCount, setLedCount] = useState(bleConfig.ledCount || 50);
  const [brightness, setBrightness] = useState(bleConfig.brightness || 150);

  const handleLedCountChange = (value: number) => {
    setLedCount(value);
    updateBLEConfig({ ledCount: value });
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    updateBLEConfig({ brightness: value });
  };

  const sendLedCountCommand = () => {
    sendLightCommand(`ledcount:${ledCount}`);
  };

  const sendBrightnessCommand = () => {
    sendLightCommand(`brightness:${brightness}`);
  };

  // Liste des sons du sampler pour les URLs WiFi
  const samplerSounds = [
    { id: "sampler_loup", name: "Loup" },
    { id: "sampler_ours", name: "Ours" },
    { id: "sampler_clocher", name: "Clocher" },
    { id: "sampler_tonnerre", name: "Tonnerre" },
    { id: "sampler_clock", name: "Horloge" },
    { id: "sampler_violon", name: "Violon" }
  ];

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
                className="inline-flex items-center gap-2 w-fit text-gray-900"
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

              {/* Section déroulante pour la configuration avancée BLE */}
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

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ble-led-count">Nombre de LEDs</Label>
                        <div className="flex gap-2">
                          <NumberInput
                            id="ble-led-count"
                            value={ledCount}
                            onChange={handleLedCountChange}
                            min={1}
                            max={300}
                            step={1}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={sendLedCountCommand}
                            disabled={bleStatus !== "connected"}
                          >
                            Synchroniser nb LEDs
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Nombre de LEDs dans votre bandeau (1-300)</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ble-brightness">Intensité lumineuse</Label>
                        <div className="flex gap-2">
                          <NumberInput
                            id="ble-brightness"
                            value={brightness}
                            onChange={handleBrightnessChange}
                            min={0}
                            max={250}
                            step={1}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={sendBrightnessCommand}
                            disabled={bleStatus !== "connected"}
                          >
                            Synchroniser luminosité
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Intensité de la lumière (0-250)</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-900"
                  disabled={bleStatus !== "connected"}
                  onClick={() => sendLightCommand("jour")}
                >
                  Lumière Jour
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-900"
                  disabled={bleStatus !== "connected"}
                  onClick={() => sendLightCommand("nuit")}
                >
                  Lumière Nuit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-900"
                  disabled={bleStatus !== "connected"}
                  onClick={() => sendLightCommand("vote")}
                >
                  Lumière Vote
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-900"
                  disabled={bleStatus !== "connected"}
                  onClick={() => sendLightCommand("off")}
                >
                  Lumière Off
                </Button>
              </div>
            </div>
          )}

          {lightMode === "wifi" && (
            <div className="space-y-4">
              {/* URLs pour les phases de jeu */}
              <div className="space-y-4">
                {(["jour", "nuit", "vote", "off"] as LightCommand[]).map((command) => (
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
              </div>
              
              {/* Section déroulante pour les URLs des sons du sampler */}
              <div className="mt-8 border rounded-md p-4 bg-gray-50/50">
                <button 
                  className="flex items-center justify-between w-full font-medium text-sm text-gray-700"
                  onClick={() => setShowSamplerUrls(!showSamplerUrls)}
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-gray-600" />
                    Configuration URLs pour les sons du sampler
                  </div>
                  {showSamplerUrls ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                
                {showSamplerUrls && (
                  <div className="mt-4 space-y-4">
                    <p className="text-sm text-gray-500">
                      Configurez des URLs HTTP à appeler lorsque chaque son du sampler est déclenché.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {samplerSounds.map((sound) => (
                        <div key={sound.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <img 
                              src={`/img/${sound.id}.svg`} 
                              alt={sound.name} 
                              className="h-6 w-6" 
                              onError={(e) => {
                                // Fallback if image doesn't exist
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <Label htmlFor={`wifi-${sound.id}`}>URL {sound.name}</Label>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              id={`wifi-${sound.id}`}
                              value={wifiUrls[sound.id]}
                              onChange={(e) => setWifiUrl(sound.id as LightCommand, e.target.value)}
                              placeholder="http://192.168.1.xxx/commande"
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => sendLightCommand(sound.id as LightCommand)}
                              disabled={!wifiUrls[sound.id]}
                              title={`Tester l'URL pour ${sound.name}`}
                            >
                              <Wifi className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-400 mt-2">
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
