import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Brain,
  Map,
  DollarSign,
  Clock,
  Fish
} from "lucide-react";

interface AnalyticsData {
  metric: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface AIInsight {
  id: string;
  type: 'recommendation' | 'prediction' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

interface AnalyticsAndInsightsProps {
  className?: string;
}

export function AnalyticsAndInsights({ className = "" }: AnalyticsAndInsightsProps) {
  const analyticsData: AnalyticsData[] = [
    {
      metric: "Eficiencia de Combustible",
      current: 8.2,
      previous: 7.8,
      target: 9.0,
      unit: "nm/l",
      trend: 'up'
    },
    {
      metric: "Tiempo de Navegación",
      current: 342,
      previous: 378,
      target: 300,
      unit: "min",
      trend: 'down'
    },
    {
      metric: "Capturas por Hora",
      current: 45,
      previous: 38,
      target: 60,
      unit: "peces",
      trend: 'up'
    },
    {
      metric: "Precisión de Rutas",
      current: 94.2,
      previous: 91.8,
      target: 95.0,
      unit: "%",
      trend: 'up'
    }
  ];

  const aiInsights: AIInsight[] = [
    {
      id: "1",
      type: "recommendation",
      title: "Optimizar Ruta hacia Zona Norte",
      description: "La IA sugiere una ruta alternativa que podría reducir el tiempo de viaje en 23 minutos y ahorrar 12% de combustible.",
      impact: "high",
      confidence: 94
    },
    {
      id: "2", 
      type: "prediction",
      title: "Incremento de Sardinas Previsto",
      description: "Los modelos predicen un aumento del 35% en la población de sardinas en la zona este durante las próximas 48 horas.",
      impact: "high",
      confidence: 87
    },
    {
      id: "3",
      type: "optimization",
      title: "Ajuste de Velocidad Recomendado",
      description: "Reducir la velocidad a 11.2 nudos puede mejorar la eficiencia de combustible sin afectar significativamente el ETA.",
      impact: "medium",
      confidence: 91
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Target;
    }
  };

  const getTrendColor = (trend: string, isPositive: boolean) => {
    if (trend === 'stable') return 'text-blue-600';
    return (trend === 'up' && isPositive) || (trend === 'down' && !isPositive) 
      ? 'text-emerald-600' 
      : 'text-red-600';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return Target;
      case 'prediction':
        return Brain;
      case 'optimization':
        return Zap;
      default:
        return Brain;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'low':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Performance Metrics */}
      <Card className="maritime-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Métricas de Rendimiento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.map((data, index) => {
              const TrendIcon = getTrendIcon(data.trend);
              const isPositive = ['Eficiencia de Combustible', 'Capturas por Hora', 'Precisión de Rutas'].includes(data.metric);
              const progress = (data.current / data.target) * 100;
              
              return (
                <div key={index} className="p-4 rounded-lg border bg-gradient-to-br from-card/50 to-card/80">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{data.metric}</h4>
                    <div className={`flex items-center space-x-1 ${getTrendColor(data.trend, isPositive)}`}>
                      <TrendIcon className="h-3 w-3" />
                      <span className="text-xs">
                        {Math.abs(((data.current - data.previous) / data.previous) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold">{data.current}</span>
                      <span className="text-sm text-muted-foreground">{data.unit}</span>
                    </div>
                    
                    <Progress value={Math.min(100, progress)} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Anterior: {data.previous} {data.unit}</span>
                      <span>Objetivo: {data.target} {data.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="maritime-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Análisis e Insights de IA</span>
            </CardTitle>
            <Badge variant="outline" className="bg-ai-gradient text-white border-none">
              IA Activa
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div
                key={insight.id}
                className="p-4 rounded-lg border bg-gradient-to-r from-card/50 to-card/80 hover:from-card/70 hover:to-card/90 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-ai-gradient">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{insight.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {insight.type === 'recommendation' ? 'Recomendación' :
                           insight.type === 'prediction' ? 'Predicción' : 'Optimización'}
                        </Badge>
                        <Badge variant="outline" className={getImpactColor(insight.impact)}>
                          Impacto {insight.impact === 'high' ? 'Alto' : 
                                  insight.impact === 'medium' ? 'Medio' : 'Bajo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-ai-neural">{insight.confidence}%</div>
                    <div className="text-xs text-muted-foreground">Confianza</div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Generado por IA • hace 5 min
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="h-7">
                      Ver Detalles
                    </Button>
                    <Button size="sm" className="h-7">
                      Aplicar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Comparative Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="maritime-panel">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Análisis Temporal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Promedio semanal</span>
                <span className="font-medium">7.9 nm/l</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Promedio mensual</span>
                <span className="font-medium">8.1 nm/l</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Mejor rendimiento</span>
                <span className="font-medium text-emerald-600">9.4 nm/l</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Mejora sugerida</span>
                <span className="font-medium text-blue-600">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="maritime-panel">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Fish className="h-5 w-5 text-primary" />
              <span>Análisis de Pesca</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="text-xl font-bold text-emerald-700">342</div>
                <p className="text-xs text-emerald-600">Capturas Hoy</p>
              </div>
              <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-xl font-bold text-blue-700">€1,247</div>
                <p className="text-xs text-blue-600">Valor Estimado</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Eficiencia vs. objetivo</span>
                <span className="font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}