import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status?: 'normal' | 'warning' | 'critical' | 'optimal';
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
  status = 'normal',
  icon: Icon,
  trend,
  className = ""
}: StatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'normal':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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
    <Card className={`maritime-panel hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
            {unit && (
              <div className="text-sm text-muted-foreground">
                {unit}
              </div>
            )}
          </div>
          <Badge variant="outline" className={getStatusBadgeColor(status)}>
            {status.toUpperCase()}
          </Badge>
        </div>
        
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <span className={getTrendColor(trend.value)}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}