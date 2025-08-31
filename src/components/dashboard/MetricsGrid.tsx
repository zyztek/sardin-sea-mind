import { StatusCard } from "./StatusCard";
import { 
  Gauge, 
  Thermometer, 
  Wind, 
  Compass, 
  Battery, 
  Fuel,
  Anchor,
  NavigationIcon
} from "lucide-react";

interface MetricsGridProps {
  className?: string;
}

export function MetricsGrid({ className = "" }: MetricsGridProps) {
  const metrics = [
    {
      title: "Velocidad",
      value: "12.4",
      unit: "nudos",
      status: "normal" as const,
      icon: Gauge,
      trend: { value: 2.3, label: "vs promedio" }
    },
    {
      title: "Temperatura del Mar",
      value: "18.2",
      unit: "°C",
      status: "optimal" as const,
      icon: Thermometer,
      trend: { value: -1.1, label: "última hora" }
    },
    {
      title: "Viento",
      value: "15",
      unit: "km/h",
      status: "normal" as const,
      icon: Wind,
      trend: { value: 0.5, label: "incremento" }
    },
    {
      title: "Rumbo",
      value: "045",
      unit: "°",
      status: "optimal" as const,
      icon: Compass
    },
    {
      title: "Batería",
      value: "87",
      unit: "%",
      status: "normal" as const,
      icon: Battery,
      trend: { value: -2.1, label: "descarga normal" }
    },
    {
      title: "Combustible",
      value: "68",
      unit: "%",
      status: "warning" as const,
      icon: Fuel,
      trend: { value: -5.2, label: "consumo elevado" }
    },
    {
      title: "Profundidad",
      value: "45.2",
      unit: "m",
      status: "normal" as const,
      icon: Anchor
    },
    {
      title: "Distancia al Destino",
      value: "142",
      unit: "millas",
      status: "normal" as const,
      icon: NavigationIcon,
      trend: { value: -8.7, label: "progreso" }
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {metrics.map((metric, index) => (
        <StatusCard
          key={index}
          title={metric.title}
          value={metric.value}
          unit={metric.unit}
          status={metric.status}
          icon={metric.icon}
          trend={metric.trend}
        />
      ))}
    </div>
  );
}