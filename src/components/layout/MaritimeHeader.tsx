import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  WifiOff, 
  Brain, 
  Shield, 
  Settings, 
  Bell,
  User,
  Moon,
  Sun
} from "lucide-react";
import { useState } from "react";

interface MaritimeHeaderProps {
  systemStatus: 'operational' | 'maintenance' | 'offline';
  aiStatus: 'active' | 'learning' | 'offline';
  communicationStatus: 'connected' | 'weak' | 'offline';
}

export function MaritimeHeader({ 
  systemStatus, 
  aiStatus, 
  communicationStatus 
}: MaritimeHeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getStatusColor = (status: string, type: 'system' | 'ai' | 'comm') => {
    const colors = {
      system: {
        operational: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        maintenance: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        offline: 'bg-red-500/10 text-red-700 border-red-500/20'
      },
      ai: {
        active: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
        learning: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
        offline: 'bg-gray-500/10 text-gray-700 border-gray-500/20'
      },
      comm: {
        connected: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        weak: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        offline: 'bg-red-500/10 text-red-700 border-red-500/20'
      }
    };
    return colors[type][status as keyof typeof colors[typeof type]];
  };

  return (
    <header className="maritime-panel border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-ai-gradient flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-maritime-primary">
                  SARDIN-AI
                </h1>
                <p className="text-xs text-muted-foreground">
                  Sistema Autónomo v2.1.4
                </p>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <Badge variant="outline" className={getStatusColor(systemStatus, 'system')}>
                Sistema {systemStatus.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-ai-neural" />
              <Badge variant="outline" className={getStatusColor(aiStatus, 'ai')}>
                IA {aiStatus.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {communicationStatus === 'connected' ? (
                <Wifi className="h-4 w-4 text-emerald-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <Badge variant="outline" className={getStatusColor(communicationStatus, 'comm')}>
                {communicationStatus.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="relative">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            </Button>
            
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Button size="sm" variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button size="sm" variant="outline">
              <User className="h-4 w-4 mr-2" />
              Capitán
            </Button>
          </div>
        </div>

        {/* Mobile Status Bar */}
        <div className="md:hidden mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className={getStatusColor(systemStatus, 'system')}>
              {systemStatus}
            </Badge>
            <Badge variant="outline" className={getStatusColor(aiStatus, 'ai')}>
              IA {aiStatus}
            </Badge>
          </div>
          <Badge variant="outline" className={getStatusColor(communicationStatus, 'comm')}>
            {communicationStatus === 'connected' ? '📶' : '📵'} {communicationStatus}
          </Badge>
        </div>
      </div>
    </header>
  );
}