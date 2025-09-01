import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Shield,
  Radio,
  Zap,
  Phone,
  MapPin,
  Clock,
  Battery,
  Anchor
} from "lucide-react";

interface EmergencyPanelProps {
  className?: string;
}

export function EmergencyPanel({ className = "" }: EmergencyPanelProps) {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(0);

  const emergencyContacts = [
    { name: "Capitanía de Puerto", phone: "+34 xxx xxx xxx", type: "primary" },
    { name: "Emergencias Marítimas", phone: "112", type: "emergency" },
    { name: "Base de Operaciones", phone: "+34 xxx xxx xxx", type: "base" },
    { name: "Servicio Técnico", phone: "+34 xxx xxx xxx", type: "technical" }
  ];

  const emergencyEquipment = [
    { name: "Baliza EPIRB", status: "active", battery: 95 },
    { name: "Radio VHF", status: "active", battery: 87 },
    { name: "GPS de Emergencia", status: "active", battery: 92 },
    { name: "Bengalas", status: "ready", quantity: 6 },
    { name: "Chaleco Salvavidas", status: "ready", quantity: 8 },
    { name: "Bote Salvavidas", status: "ready", quantity: 1 }
  ];

  const handleSOSActivation = () => {
    if (!emergencyActive) {
      setSosCountdown(10);
      const countdown = setInterval(() => {
        setSosCountdown(prev => {
          if (prev <= 1) {
            setEmergencyActive(true);
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const cancelSOS = () => {
    setSosCountdown(0);
    setEmergencyActive(false);
  };

  return (
    <Card className={`maritime-panel ${emergencyActive ? 'border-red-500 bg-red-50/50' : ''} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shield className={`h-5 w-5 ${emergencyActive ? 'text-red-500' : 'text-primary'}`} />
            <span>Panel de Emergencia</span>
            {emergencyActive && (
              <Badge variant="destructive" className="ml-2 animate-pulse">
                EMERGENCIA ACTIVA
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700">
              Sistemas OK
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* SOS Button */}
        <div className="text-center">
          {sosCountdown > 0 ? (
            <div className="space-y-3">
              <div className="text-2xl font-bold text-red-600">
                SOS en {sosCountdown}s
              </div>
              <Progress value={(10 - sosCountdown) * 10} className="h-2" />
              <Button 
                onClick={cancelSOS}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                CANCELAR
              </Button>
            </div>
          ) : emergencyActive ? (
            <div className="space-y-3">
              <div className="text-lg font-bold text-red-600 animate-pulse">
                🚨 SEÑAL SOS ACTIVADA 🚨
              </div>
              <p className="text-sm text-red-600">
                Posición transmitida a servicios de emergencia
              </p>
              <Button 
                onClick={cancelSOS}
                variant="destructive"
              >
                Desactivar SOS
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleSOSActivation}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white h-16 w-32 text-lg font-bold"
            >
              SOS
            </Button>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Contactos de Emergencia</span>
          </h3>
          
          <div className="grid gap-2">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg border bg-card/50"
              >
                <div>
                  <div className="font-medium text-sm text-foreground">{contact.name}</div>
                  <div className="text-xs text-muted-foreground">{contact.phone}</div>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3 mr-1" />
                  Llamar
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Equipment */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Equipos de Emergencia</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {emergencyEquipment.map((equipment, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border bg-gradient-to-r from-card/30 to-card/60"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-foreground">
                    {equipment.name}
                  </span>
                  <Badge variant="outline" className={
                    equipment.status === 'active' ? 'bg-emerald-500/10 text-emerald-700' :
                    equipment.status === 'ready' ? 'bg-blue-500/10 text-blue-700' :
                    'bg-red-500/10 text-red-700'
                  }>
                    {equipment.status.toUpperCase()}
                  </Badge>
                </div>
                
                {equipment.battery && (
                  <div className="flex items-center space-x-2 text-xs">
                    <Battery className="h-3 w-3" />
                    <span>{equipment.battery}%</span>
                    <Progress value={equipment.battery} className="h-1 flex-1" />
                  </div>
                )}
                
                {equipment.quantity && (
                  <div className="text-xs text-muted-foreground">
                    Cantidad: {equipment.quantity}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Position */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm text-blue-800">Posición Actual</span>
          </div>
          <div className="text-sm text-blue-700">
            <div>Lat: 42.3601° N, Lng: 71.0589° W</div>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="h-3 w-3" />
              <span>Última actualización: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Emergency Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Anchor className="h-3 w-3" />
            <span>Echar Ancla</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Radio className="h-3 w-3" />
            <span>Canal 16</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Zap className="h-3 w-3" />
            <span>Cortar Motor</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <AlertTriangle className="h-3 w-3" />
            <span>Bengala</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}