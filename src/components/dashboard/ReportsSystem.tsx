import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Mail,
  Clock,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  status: 'generating' | 'ready' | 'error';
  progress: number;
  size: string;
  createdAt: string;
  format: 'pdf' | 'excel' | 'csv';
}

interface ReportsSystemProps {
  className?: string;
}

export function ReportsSystem({ className = "" }: ReportsSystemProps) {
  const [reports] = useState<Report[]>([
    {
      id: "1",
      title: "Análisis de Pesca - Semana 2",
      type: "weekly",
      status: "ready",
      progress: 100,
      size: "2.4 MB",
      createdAt: "hace 30 min",
      format: "pdf"
    },
    {
      id: "2", 
      title: "Consumo de Combustible - Enero",
      type: "monthly",
      status: "ready",
      progress: 100,
      size: "1.8 MB",
      createdAt: "hace 2 horas",
      format: "excel"
    },
    {
      id: "3",
      title: "Rutas Optimizadas - Hoy",
      type: "daily",
      status: "generating",
      progress: 75,
      size: "-",
      createdAt: "generando...",
      format: "csv"
    },
    {
      id: "4",
      title: "Rendimiento del Sistema",
      type: "weekly",
      status: "ready", 
      progress: 100,
      size: "3.1 MB",
      createdAt: "hace 1 día",
      format: "pdf"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'generating':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return FileText;
      case 'excel':
        return FileSpreadsheet;
      case 'csv':
        return BarChart3;
      default:
        return FileText;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Report Generation */}
      <Card className="maritime-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Generador de Reportes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Reporte Diario</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>Análisis Semanal</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <PieChart className="h-6 w-6" />
              <span>Resumen Mensual</span>
            </Button>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-medium mb-2">Configuración Rápida</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Incluir Datos de Pesca</Badge>
              <Badge variant="outline">Análisis de Consumo</Badge>
              <Badge variant="outline">Rutas y Navegación</Badge>
              <Badge variant="outline">Alertas del Sistema</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Reports */}
      <Card className="maritime-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Reportes Disponibles</span>
            </CardTitle>
            <Button size="sm" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Enviar por Email
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.map((report) => {
            const FormatIcon = getFormatIcon(report.format);
            return (
              <div
                key={report.id}
                className="p-4 rounded-lg border bg-gradient-to-r from-card/50 to-card/80 hover:from-card/70 hover:to-card/90 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-ocean-gradient">
                      <FormatIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{report.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{report.createdAt}</span>
                        <span className="text-xs text-muted-foreground">• {report.size}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(report.status)}>
                    {report.status === 'ready' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {report.status === 'ready' ? 'Listo' : 
                     report.status === 'generating' ? 'Generando' : 'Error'}
                  </Badge>
                </div>

                {report.status === 'generating' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Generando reporte...</span>
                      <span>{report.progress}%</span>
                    </div>
                    <Progress value={report.progress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {report.type === 'daily' ? 'Diario' :
                       report.type === 'weekly' ? 'Semanal' :
                       report.type === 'monthly' ? 'Mensual' : 'Personalizado'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {report.format.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {report.status === 'ready' && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="h-7">
                        Ver
                      </Button>
                      <Button size="sm" className="h-7">
                        <Download className="h-3 w-3 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="maritime-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-primary" />
            <span>Exportación de Datos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Datos en Tiempo Real</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Métricas Actuales (Excel)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Posición GPS (CSV)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Estado del Sistema (PDF)
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Datos Históricos</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Rutas Completas (Excel)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Datos de Pesca (CSV)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Análisis Completo (PDF)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}