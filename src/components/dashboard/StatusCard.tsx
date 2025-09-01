import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string;
  unit?: string;
  status: 'normal' | 'warning' | 'critical' | 'optimal';
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatusCard({
  title,
  value,
  unit,
  status,
  icon: Icon,
  trend,
  className = ""
}: StatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-emerald-600';
      case 'normal':
        return 'text-blue-600';
      case 'warning':
        return 'text-amber-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'normal':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-emerald-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className={`maritime-panel relative overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon className={`h-4 w-4 ${getStatusColor(status)}`} />
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
          <Badge variant="outline" className={`text-xs ${getStatusBadgeColor(status)}`}>
            {status.toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
          
          {trend && (
            <div className="flex items-center space-x-1">
              {trend.value !== 0 && (
                <>
                  {trend.value > 0 ? (
                    <TrendingUp className={`h-3 w-3 ${getTrendColor(trend.value)}`} />
                  ) : (
                    <TrendingDown className={`h-3 w-3 ${getTrendColor(trend.value)}`} />
                  )}
                  <span className={`text-xs ${getTrendColor(trend.value)}`}>
                    {Math.abs(trend.value)}%
                  </span>
                </>
              )}
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        
        {/* Status indicator line */}
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <div className={`h-full ${getStatusColor(status).replace('text-', 'bg-').replace('-600', '-500')}`} />
        </div>
      </CardContent>
    </Card>
  );
}