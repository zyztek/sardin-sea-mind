import { useState, useEffect, useCallback } from 'react';

export interface MaritimeMetrics {
  speed: number;
  heading: number;
  position: { lat: number; lng: number };
  depth: number;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  fuel: number;
  battery: number;
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  data?: Record<string, any>;
}

export function useMaritimeData() {
  const [metrics, setMetrics] = useState<MaritimeMetrics>({
    speed: 12.4,
    heading: 45,
    position: { lat: 42.3601, lng: -71.0589 },
    depth: 45.2,
    temperature: 18.2,
    windSpeed: 15,
    windDirection: 225,
    fuel: 68,
    battery: 87
  });

  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'prediction',
      title: 'Zona de Pesca Óptima Detectada',
      description: 'IA ha identificado una zona con alta densidad de sardinas a 12nm al noreste.',
      confidence: 94,
      priority: 'high',
      timestamp: '2 min ago',
      data: {
        'Distancia': '12.3 nm',
        'Densidad': 'Alta',
        'Temperatura': '18.5°C'
      }
    }
  ]);

  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isConnected) return;

      setMetrics(prev => ({
        ...prev,
        speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 0.5),
        heading: (prev.heading + (Math.random() - 0.5) * 2) % 360,
        depth: Math.max(0, prev.depth + (Math.random() - 0.5) * 0.3),
        temperature: prev.temperature + (Math.random() - 0.5) * 0.1,
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 1),
        windDirection: (prev.windDirection + (Math.random() - 0.5) * 5) % 360,
        fuel: Math.max(0, Math.min(100, prev.fuel - 0.01)),
        battery: Math.max(0, Math.min(100, prev.battery - 0.005))
      }));

      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const addInsight = useCallback((insight: Omit<AIInsight, 'id' | 'timestamp'>) => {
    const newInsight: AIInsight = {
      ...insight,
      id: Date.now().toString(),
      timestamp: 'ahora'
    };
    setInsights(prev => [newInsight, ...prev].slice(0, 10));
  }, []);

  const removeInsight = useCallback((id: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== id));
  }, []);

  return {
    metrics,
    insights,
    isConnected,
    lastUpdate,
    addInsight,
    removeInsight,
    setIsConnected
  };
}