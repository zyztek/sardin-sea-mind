import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  data?: any;
}

interface AIInsightCardProps {
  insight: AIInsight;
  onAction?: (insight: AIInsight) => void;
  className?: string;
}

export function AIInsightCard({
  insight,
  onAction,
  className = ""
}: AIInsightCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return TrendingUp;
      case 'recommendation':
        return CheckCircle;
      case 'alert':
        return AlertTriangle;
      case 'optimization':
        return Brain;
      default:
        return Brain;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'low':
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-600';
    if (confidence >= 70) return 'text-blue-600';
    if (confidence >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const TypeIcon = getTypeIcon(insight.type);

  return (
    <Card className={`maritime-panel hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-ai-gradient">
              <TypeIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                {insight.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                  {insight.priority.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {insight.timestamp}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
              {insight.confidence}%
            </div>
            <div className="text-xs text-muted-foreground">
              confianza
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">
          {insight.description}
        </p>
        
        {insight.data && (
          <div className="bg-muted/50 rounded-lg p-3 mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              Datos Relevantes:
            </div>
            <div className="text-sm">
              {Object.entries(insight.data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}:</span>
                  <span className="font-medium">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-3 w-3 text-ai-neural" />
            <span className="text-xs text-muted-foreground">
              IA {insight.type}
            </span>
          </div>
          
          {onAction && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAction(insight)}
              className="h-7 text-xs"
            >
              Ver Detalles
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}