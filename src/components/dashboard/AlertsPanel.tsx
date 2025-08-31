import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye
} from "lucide-react";

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface AlertsPanelProps {
  className?: string;
}

export function AlertsPanel({ className = "" }: AlertsPanelProps) {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "warning",
      title: "Consumo de Combustible Elevado",
      message: "El consumo actual supera el promedio en un 15%. Verificar condiciones del motor.",
      timestamp: "hace 12 min",
      acknowledged: false
    },
    {
      id: "2",
      type: "info",
      title: "Zona de Pesca Óptima Detectada",
      message: "IA detectó alta probabilidad de sardinas a 2.3 millas al noroeste.",
      timestamp: "hace 25 min",
      acknowledged: false
    },
    {
      id: "3",
      type: "success",
      title: "Ruta Optimizada",
      message: "Nueva ruta calculada reduce tiempo de viaje en 18 minutos.",
      timestamp: "hace 1 hora",
      acknowledged: true
    },
    {
      id: "4",
      type: "warning",
      title: "Condiciones Meteorológicas",
      message: "Vientos de 25-30 km/h previstos en las próximas 3 horas.",
      timestamp: "hace 2 horas",
      acknowledged: true
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      default:
        return Info;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'success':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>Alertas del Sistema</span>
            {unacknowledgedCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unacknowledgedCount}
              </Badge>
            )}
          </CardTitle>
          <Button size="sm" variant="outline">
            Ver Todas
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {alerts.slice(0, 4).map((alert) => {
          const Icon = getAlertIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                alert.acknowledged ? 'opacity-60' : 'hover:shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${getAlertColor(alert.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">
                      {alert.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                      {!alert.acknowledged && (
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Revisar
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}