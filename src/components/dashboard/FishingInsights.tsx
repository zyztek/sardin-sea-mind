```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Fish,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  MapPin,
  Brain
} from "lucide-react";
import { AIInsight } from "@/types/maritime";

interface FishingInsightsProps {
  className?: string;
  insights?: AIInsight[];
}

export function FishingInsights({ className = "", insights = [] }: FishingInsightsProps) {
  // Filter for relevant insights (e.g., predictions or fishing related)
  // For now, we'll display all insights as "Fishing/Maritime Predictions"
  const relevantInsights = insights.slice(0, 3); 

  const getPriorityColor = (priority: string = 'medium') => {
    switch (priority) {
      case 'high': return 'text-emerald-600';
      case 'critical': return 'text-red-600';
      case 'low': return 'text-blue-600';
      default: return 'text-amber-600';
    }
  };

  const getConfidenceColor = (confidence: number = 0) => {
    if (confidence >= 90) return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
    if (confidence >= 75) return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
    if (confidence >= 60) return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    return 'bg-red-500/10 text-red-700 border-red-500/20';
  };

  return (
    <Card className={`maritime - panel ${ className } `}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Fish className="h-5 w-5 text-primary" />
            <span>Análisis de Pesca IA</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-ai-gradient text-white border-none">
              IA Activa
            </Badge>
            <Button size="sm" variant="outline">
              Ver Mapa
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {relevantInsights.length > 0 ? (
          relevantInsights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-lg border bg-gradient-to-r from-card/50 to-card/80 hover:from-card/70 hover:to-card/90 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-ocean-gradient">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{insight.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Zona Actual</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={getConfidenceColor(insight.confidence)}>
                  {Math.round(insight.confidence || 0)}% conf.
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground mb-3">
                {insight.description}
              </div>
              
              <div className="flex items-center justify-between text-xs">
                 <div className="flex items-center space-x-1">
                    <span className="text-muted-foreground">Prioridad:</span>
                    <span className={`font - medium capitalize ${ getPriorityColor(insight.priority) } `}>
                      {insight.priority}
                    </span>
                 </div>
                 <div className="text-muted-foreground">
                   {new Date(insight.created_at).toLocaleTimeString()}
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Fish className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Esperando datos de pesca...</p>
          </div>
        )}
        
        {/* Summary Footer */}
        {relevantInsights.length > 0 && (
          <div className="pt-4 border-t bg-gradient-to-r from-ai-gradient/10 to-ocean-gradient/10 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-ai-neural" />
              <span className="font-medium text-sm">Resumen IA</span>
            </div>
            <p className="text-xs text-muted-foreground">
              El sistema ha detectado {relevantInsights.length} oportunidades potenciales en la zona.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```