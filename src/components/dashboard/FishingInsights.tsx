import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Fish,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin
} from "lucide-react";

interface FishingData {
  species: string;
  quantity: number;
  trend: number;
  price: number;
  location: string;
  probability: number;
}

interface FishingInsightsProps {
  className?: string;
}

export function FishingInsights({ className = "" }: FishingInsightsProps) {
  const fishingData: FishingData[] = [
    {
      species: "Sardina Común",
      quantity: 1247,
      trend: 23,
      price: 2.50,
      location: "Zona Norte",
      probability: 94
    },
    {
      species: "Anchoa",
      quantity: 892,
      trend: -8,
      price: 3.20,
      location: "Zona Este",
      probability: 78
    },
    {
      species: "Caballa",
      quantity: 634,
      trend: 15,
      price: 4.10,
      location: "Zona Sur",
      probability: 85
    }
  ];

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: number) => {
    return trend > 0 ? 'text-emerald-600' : 'text-red-600';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 90) return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
    if (probability >= 75) return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
    if (probability >= 60) return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    return 'bg-red-500/10 text-red-700 border-red-500/20';
  };

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Fish className="h-5 w-5 text-primary" />
            <span>Análisis de Pesca IA</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-ai-gradient text-white border-none">
              Predicción Activa
            </Badge>
            <Button size="sm" variant="outline">
              Ver Mapa
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {fishingData.map((data, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border bg-gradient-to-r from-card/50 to-card/80 hover:from-card/70 hover:to-card/90 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-ocean-gradient">
                  <Fish className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{data.species}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{data.location}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={getProbabilityColor(data.probability)}>
                {data.probability}% prob.
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Fish className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Cantidad</span>
                </div>
                <div className="font-bold text-foreground">{data.quantity.toLocaleString()}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Precio</span>
                </div>
                <div className="font-bold text-foreground">€{data.price}/kg</div>
              </div>
              
               <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {(() => {
                    const TrendIcon = getTrendIcon(data.trend);
                    return <TrendIcon className="h-3 w-3 text-muted-foreground" />;
                  })()}
                  <span className="text-xs text-muted-foreground">Tendencia</span>
                </div>
                <div className={`font-bold ${getTrendColor(data.trend)}`}>
                  {data.trend > 0 ? '+' : ''}{data.trend}%
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Análisis actualizado hace 5 min
                </span>
                <Button size="sm" variant="ghost" className="h-6 text-xs">
                  Ver Detalles
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Summary */}
        <div className="pt-4 border-t bg-gradient-to-r from-ai-gradient/10 to-ocean-gradient/10 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-ai-neural" />
            <span className="font-medium text-sm">Resumen del Día</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total estimado:</span>
              <div className="font-bold">2,773 individuos</div>
            </div>
            <div>
              <span className="text-muted-foreground">Valor estimado:</span>
              <div className="font-bold">€8,245</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}