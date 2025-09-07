import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PlayCircle,
  CheckCircle,
  XCircle,
  Clock,
  TestTube,
  Zap,
  Shield,
  Database,
  Wifi,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

interface TestSuite {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  progress: number;
  duration?: number;
  lastRun?: string;
  tests: Test[];
}

interface Test {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

interface SystemTestsProps {
  className?: string;
}

export function SystemTests({ className = "" }: SystemTestsProps) {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: "navigation",
      name: "Sistema de Navegación",
      description: "Pruebas de GPS, brújula y piloto automático",
      status: "passed",
      progress: 100,
      duration: 45,
      lastRun: "hace 2 horas",
      tests: [
        { id: "gps", name: "Precisión GPS", status: "passed", duration: 12 },
        { id: "compass", name: "Calibración Brújula", status: "passed", duration: 8 },
        { id: "autopilot", name: "Piloto Automático", status: "passed", duration: 25 }
      ]
    },
    {
      id: "sensors",
      name: "Sensores Marítimos", 
      description: "Verificación de sensores de profundidad, temperatura y viento",
      status: "running",
      progress: 60,
      tests: [
        { id: "depth", name: "Sensor Profundidad", status: "passed", duration: 5 },
        { id: "temp", name: "Temperatura del Agua", status: "running" },
        { id: "wind", name: "Sensor de Viento", status: "idle" }
      ]
    },
    {
      id: "ai-systems",
      name: "Sistemas de IA",
      description: "Pruebas de predicción de pesca y optimización de rutas",
      status: "failed",
      progress: 100,
      duration: 120,
      lastRun: "hace 30 min",
      tests: [
        { id: "fishing-ai", name: "IA Predicción Pesca", status: "passed", duration: 45 },
        { id: "route-opt", name: "Optimización Rutas", status: "failed", duration: 35, error: "Timeout en cálculo de ruta compleja" },
        { id: "pattern-rec", name: "Reconocimiento Patrones", status: "passed", duration: 40 }
      ]
    },
    {
      id: "communications",
      name: "Comunicaciones",
      description: "Conectividad satelital, radio VHF y sistemas de emergencia", 
      status: "passed",
      progress: 100,
      duration: 25,
      lastRun: "hace 1 hora",
      tests: [
        { id: "satellite", name: "Enlace Satelital", status: "passed", duration: 8 },
        { id: "vhf", name: "Radio VHF", status: "passed", duration: 5 },
        { id: "emergency", name: "Sistema Emergencia", status: "passed", duration: 12 }
      ]
    }
  ]);

  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());

  const runTestSuite = async (suiteId: string) => {
    setRunningTests(prev => new Set(prev).add(suiteId));
    
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? { ...suite, status: 'running', progress: 0 }
        : suite
    ));

    // Simulate test execution
    const progressInterval = setInterval(() => {
      setTestSuites(prev => prev.map(suite => {
        if (suite.id === suiteId && suite.status === 'running') {
          const newProgress = Math.min(100, suite.progress + Math.random() * 15);
          return { ...suite, progress: newProgress };
        }
        return suite;
      }));
    }, 500);

    // Complete after 3-5 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setTestSuites(prev => prev.map(suite => 
        suite.id === suiteId 
          ? { 
              ...suite, 
              status: Math.random() > 0.8 ? 'failed' : 'passed',
              progress: 100,
              duration: Math.floor(Math.random() * 60) + 30,
              lastRun: 'hace unos segundos'
            }
          : suite
      ));
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(suiteId);
        return newSet;
      });
    }, 3000 + Math.random() * 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return CheckCircle;
      case 'failed':
        return XCircle;
      case 'running':
        return Clock;
      default:
        return PlayCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-emerald-600';
      case 'failed':
        return 'text-red-600';
      case 'running':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'running':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getSuiteIcon = (suiteId: string) => {
    switch (suiteId) {
      case 'navigation':
        return Wifi;
      case 'sensors':
        return TestTube;
      case 'ai-systems':
        return Zap;
      case 'communications':
        return Shield;
      default:
        return Database;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Test Overview */}
      <Card className="maritime-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="h-5 w-5 text-primary" />
              <span>Suite de Pruebas del Sistema</span>
            </CardTitle>
            <Button 
              onClick={() => testSuites.forEach(suite => runTestSuite(suite.id))}
              disabled={runningTests.size > 0}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Ejecutar Todas las Pruebas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <div className="text-2xl font-bold text-emerald-700">
                {testSuites.filter(s => s.status === 'passed').length}
              </div>
              <p className="text-sm text-emerald-600">Pruebas Pasadas</p>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="text-2xl font-bold text-red-700">
                {testSuites.filter(s => s.status === 'failed').length}
              </div>
              <p className="text-sm text-red-600">Pruebas Fallidas</p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-700">
                {testSuites.filter(s => s.status === 'running').length}
              </div>
              <p className="text-sm text-blue-600">En Ejecución</p>
            </div>
            <div className="text-center p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
              <div className="text-2xl font-bold text-gray-700">
                {testSuites.length}
              </div>
              <p className="text-sm text-gray-600">Total de Suites</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Suites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testSuites.map((suite) => {
          const StatusIcon = getStatusIcon(suite.status);
          const SuiteIcon = getSuiteIcon(suite.id);
          const isRunning = runningTests.has(suite.id);

          return (
            <Card key={suite.id} className="maritime-panel">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-ocean-gradient">
                      <SuiteIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{suite.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{suite.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusBadge(suite.status)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {suite.status === 'passed' ? 'Pasado' :
                     suite.status === 'failed' ? 'Fallido' :
                     suite.status === 'running' ? 'Ejecutando' : 'Pendiente'}
                  </Badge>
                </div>
                
                {(suite.status === 'running' || isRunning) && (
                  <div className="mt-3">
                    <Progress value={suite.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Progreso: {suite.progress.toFixed(0)}%
                    </p>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                {suite.tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${
                        test.status === 'passed' ? 'bg-emerald-500' :
                        test.status === 'failed' ? 'bg-red-500' :
                        test.status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm">{test.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {test.duration && `${test.duration}s`}
                      {test.error && (
                        <div className="flex items-center text-red-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Error
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-xs text-muted-foreground">
                    {suite.lastRun && `Última ejecución: ${suite.lastRun}`}
                    {suite.duration && ` • Duración: ${suite.duration}s`}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => runTestSuite(suite.id)}
                    disabled={isRunning}
                  >
                    <PlayCircle className="h-3 w-3 mr-1" />
                    {isRunning ? 'Ejecutando...' : 'Ejecutar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}