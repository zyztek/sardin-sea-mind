import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ship, Waves, Brain, Satellite, Radio } from "lucide-react";

interface MaritimeHeaderProps {
  systemStatus?: 'operational' | 'warning' | 'critical';
  aiStatus?: 'active' | 'learning' | 'offline';
  communicationStatus?: 'connected' | 'limited' | 'offline';
}

export function MaritimeHeader({ 
  systemStatus = 'operational',
  aiStatus = 'active',
  communicationStatus = 'connected'
}: MaritimeHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'active':
      case 'connected':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
      case 'warning':
      case 'learning':
      case 'limited':
        return 'bg-amber-500/20 text-amber-700 border-amber-500/30';
      case 'critical':
      case 'offline':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Ship className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-ai-gradient rounded-full ai-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">SARDIN-AI</h1>
            <p className="text-xs text-muted-foreground">Sistema Autónomo de Navegación Marítima</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Waves className="h-4 w-4 text-primary" />
            <Badge variant="outline" className={getStatusColor(systemStatus)}>
              Sistema: {systemStatus.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-ai-neural" />
            <Badge variant="outline" className={getStatusColor(aiStatus)}>
              IA: {aiStatus.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            {communicationStatus === 'connected' ? (
              <Satellite className="h-4 w-4 text-emerald-500" />
            ) : (
              <Radio className="h-4 w-4 text-amber-500" />
            )}
            <Badge variant="outline" className={getStatusColor(communicationStatus)}>
              Comms: {communicationStatus.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Panel de Control
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Iniciar Misión
          </Button>
        </div>
      </div>
    </header>
  );
}