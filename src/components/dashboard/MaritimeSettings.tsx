import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Bell,
  Shield,
  Zap,
  Satellite,
  Brain,
  RotateCcw,
  Save,
  Activity
} from "lucide-react";

interface MaritimeSettingsProps {
  className?: string;
  isSimulationActive?: boolean;
  onSimulationChange?: (active: boolean) => void;
}

export function MaritimeSettings({
  className = "",
  isSimulationActive = false,
  onSimulationChange
}: MaritimeSettingsProps) {
  const settingsCategories = [
    {
      name: "Simulación y Pruebas",
      icon: Activity,
      settings: [
        {
          id: "simulation_mode",
          name: "Modo Simulación (Data Seeder)",
          type: "boolean",
          value: isSimulationActive,
          onChange: onSimulationChange
        }
      ]
    },
    {
      name: "Navegación",
      icon: Satellite,
      settings: [
        { id: "autopilot", name: "Autopiloto Automático", type: "boolean", value: true },
        { id: "route_optimization", name: "Optimización de Ruta", type: "boolean", value: true },
        { id: "speed_limit", name: "Velocidad Máxima", type: "range", value: [15], min: 5, max: 25, unit: "nudos" },
        { id: "collision_warning", name: "Alerta de Colisión", type: "range", value: [500], min: 100, max: 1000, unit: "m" }
      ]
    },
    {
      name: "Inteligencia Artificial",
      icon: Brain,
      settings: [
        { id: "ai_predictions", name: "Predicciones de Pesca", type: "boolean", value: true },
        { id: "ai_learning", name: "Aprendizaje Automático", type: "boolean", value: true },
        { id: "ai_confidence", name: "Confianza Mínima IA", type: "range", value: [75], min: 50, max: 100, unit: "%" },
        { id: "ai_frequency", name: "Frecuencia de Análisis", type: "range", value: [5], min: 1, max: 60, unit: "min" }
      ]
    },
    {
      name: "Alertas y Notificaciones",
      icon: Bell,
      settings: [
        { id: "critical_alerts", name: "Alertas Críticas", type: "boolean", value: true },
        { id: "weather_alerts", name: "Alertas Meteorológicas", type: "boolean", value: true },
        { id: "fuel_alerts", name: "Alertas de Combustible", type: "boolean", value: true },
        { id: "alert_volume", name: "Volumen de Alertas", type: "range", value: [80], min: 0, max: 100, unit: "%" }
      ]
    },
    {
      name: "Seguridad",
      icon: Shield,
      settings: [
        { id: "emergency_beacon", name: "Baliza de Emergencia", type: "boolean", value: true },
        { id: "auto_distress", name: "SOS Automático", type: "boolean", value: false },
        { id: "geofencing", name: "Cerca Geográfica", type: "boolean", value: true },
        { id: "backup_systems", name: "Sistemas de Respaldo", type: "boolean", value: true }
      ]
    }
  ];

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Configuración del Sistema</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restablecer
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {settingsCategories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          return (
            <div key={categoryIndex} className="space-y-4">
              <div className="flex items-center space-x-2">
                <CategoryIcon className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">{category.name}</h3>
              </div>

              <div className="space-y-4 pl-6">
                {category.settings.map((setting, settingIndex) => (
                  <div key={setting.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={setting.id} className="text-sm font-medium">
                        {setting.name}
                      </Label>
                      {setting.type === "boolean" && (
                        <Switch
                          id={setting.id}
                          checked={setting.value as boolean}
                          onCheckedChange={setting.onChange ? (checked) => setting.onChange?.(checked) : undefined}
                        />
                      )}
                    </div>

                    {setting.type === "range" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {setting.min} {setting.unit}
                          </span>
                          <span className="font-medium">
                            {(setting.value as number[])[0]} {setting.unit}
                          </span>
                          <span className="text-muted-foreground">
                            {setting.max} {setting.unit}
                          </span>
                        </div>
                        <Slider
                          id={setting.id}
                          min={setting.min}
                          max={setting.max}
                          step={1}
                          value={setting.value as number[]}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {categoryIndex < settingsCategories.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          );
        })}

        {/* System Status */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Estado del Sistema
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Configuración:</span>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700">
                  Óptima
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seguridad:</span>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700">
                  Máxima
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">IA Activa:</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-700">
                  94% Confianza
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alertas:</span>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-700">
                  2 Activas
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}