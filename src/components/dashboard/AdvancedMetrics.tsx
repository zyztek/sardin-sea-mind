import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Waves,
  Thermometer,
  Wind,
  Fuel,
  BarChart3,
  PieChart
} from "lucide-react";

interface AdvancedMetricsProps {
  className?: string;
}

export function AdvancedMetrics({ className = "" }: AdvancedMetricsProps) {
  const metrics = [
    {
      category: "Eficiencia Energética",
      items: [
        { name: "Consumo Motor", value: 87, trend: -5.2, unit: "%" },
        { name: "Eficiencia Combustible", value: 92, trend: 2.1, unit: "%" },
        { name: "Energía Solar", value: 34, trend: 12.3, unit: "kW" },
        { name: "Batería Auxiliar", value: 78, trend: -1.2, unit: "%" }
      ]
    },
    {
      category: "Rendimiento de Pesca",
      items: [
        { name: "Captura/Hora", value: 156, trend: 18.7, unit: "kg" },
        { name: "Selectividad", value: 94, trend: 3.2, unit: "%" },
        { name: "Zonas Óptimas", value: 8, trend: 25.0, unit: "detectadas" },
        { name: "Predicción IA", value: 91, trend: 7.4, unit: "%" }
      ]
    },
    {
      category: "Condiciones Operativas",
      items: [
        { name: "Estado del Mar", value: 2.1, trend: -0.3, unit: "m" },
        { name: "Corrientes", value: 1.8, trend: 0.5, unit: "kt" },
        { name: "Visibilidad", value: 12, trend: -2.0, unit: "mn" },
        { name: "Temperatura Agua", value: 18.2, trend: 0.7, unit: "°C" }
      ]
    }
  ];

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: number) => {
    return trend > 0 ? 'text-emerald-600' : 'text-red-600';
  };

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Métricas Avanzadas</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <PieChart className="h-4 w-4 mr-2" />
              Gráficos
            </Button>
            <Button size="sm" variant="outline">
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {metrics.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary" />
              <span>{category.category}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.items.map((item, itemIndex) => {
                const TrendIcon = getTrendIcon(item.trend);
                return (
                  <div
                    key={itemIndex}
                    className="p-3 rounded-lg bg-gradient-to-r from-card/30 to-card/60 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <TrendIcon className={`h-3 w-3 ${getTrendColor(item.trend)}`} />
                        <span className={`text-xs font-medium ${getTrendColor(item.trend)}`}>
                          {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline space-x-1">
                      <span className="text-lg font-bold text-foreground">
                        {item.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.unit}
                      </span>
                    </div>
                    
                    {item.unit === "%" && (
                      <Progress value={item.value} className="h-1 mt-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* AI Performance Summary */}
        <div className="bg-ai-gradient/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="h-4 w-4 text-ai-neural" />
            <span className="font-medium text-sm">Resumen de Rendimiento IA</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-ai-neural">94%</div>
              <div className="text-xs text-muted-foreground">Precisión</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-600">+18%</div>
              <div className="text-xs text-muted-foreground">Eficiencia</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">847</div>
              <div className="text-xs text-muted-foreground">Predicciones</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}