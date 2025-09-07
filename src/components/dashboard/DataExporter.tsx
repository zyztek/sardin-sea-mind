import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download,
  FileSpreadsheet,
  FileText,
  Database,
  Calendar,
  Filter,
  Settings,
  Check,
  X
} from "lucide-react";
import { useState } from "react";

interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  dateRange: '24h' | '7d' | '30d' | '90d' | 'custom';
  dataTypes: string[];
  includeCharts: boolean;
  compressed: boolean;
}

interface DataExporterProps {
  className?: string;
}

export function DataExporter({ className = "" }: DataExporterProps) {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'excel',
    dateRange: '7d',
    dataTypes: ['navigation', 'fishing', 'system'],
    includeCharts: true,
    compressed: false
  });

  const [isExporting, setIsExporting] = useState(false);

  const dataTypes = [
    { id: 'navigation', label: 'Datos de Navegación', size: '2.1 MB' },
    { id: 'fishing', label: 'Análisis de Pesca', size: '1.8 MB' },
    { id: 'system', label: 'Métricas del Sistema', size: '0.9 MB' },
    { id: 'weather', label: 'Datos Meteorológicos', size: '0.5 MB' },
    { id: 'alerts', label: 'Historial de Alertas', size: '0.3 MB' },
    { id: 'routes', label: 'Rutas Guardadas', size: '1.2 MB' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsExporting(false);
    
    // In a real application, this would trigger the actual download
    console.log('Exporting data:', exportConfig);
  };

  const toggleDataType = (dataTypeId: string) => {
    setExportConfig(prev => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(dataTypeId)
        ? prev.dataTypes.filter(id => id !== dataTypeId)
        : [...prev.dataTypes, dataTypeId]
    }));
  };

  const getEstimatedSize = () => {
    const selectedTypes = dataTypes.filter(type => exportConfig.dataTypes.includes(type.id));
    const totalMB = selectedTypes.reduce((total, type) => {
      const size = parseFloat(type.size.replace(' MB', ''));
      return total + size;
    }, 0);
    
    if (exportConfig.compressed) return `${(totalMB * 0.3).toFixed(1)} MB`;
    return `${totalMB.toFixed(1)} MB`;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'excel':
        return FileSpreadsheet;
      case 'pdf':
        return FileText;
      case 'json':
        return Database;
      default:
        return FileSpreadsheet;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Export Configuration */}
      <Card className="maritime-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-primary" />
            <span>Configurar Exportación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Formato de Exportación</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['csv', 'excel', 'pdf', 'json'] as const).map((format) => {
                const Icon = getFormatIcon(format);
                return (
                  <Button
                    key={format}
                    variant={exportConfig.format === format ? "default" : "outline"}
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                    onClick={() => setExportConfig(prev => ({ ...prev, format }))}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{format.toUpperCase()}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <h4 className="font-medium">Rango de Fechas</h4>
            <Select 
              value={exportConfig.dateRange} 
              onValueChange={(value: any) => setExportConfig(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24 horas</SelectItem>
                <SelectItem value="7d">Última semana</SelectItem>
                <SelectItem value="30d">Último mes</SelectItem>
                <SelectItem value="90d">Últimos 3 meses</SelectItem>
                <SelectItem value="custom">Rango personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Types Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Tipos de Datos</h4>
            <div className="space-y-2">
              {dataTypes.map((dataType) => (
                <div key={dataType.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={exportConfig.dataTypes.includes(dataType.id)}
                      onCheckedChange={() => toggleDataType(dataType.id)}
                    />
                    <div>
                      <span className="font-medium">{dataType.label}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {dataType.size}
                      </Badge>
                    </div>
                  </div>
                  {exportConfig.dataTypes.includes(dataType.id) ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <X className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <h4 className="font-medium">Opciones Adicionales</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">Incluir Gráficos</span>
                  <p className="text-sm text-muted-foreground">Añadir visualizaciones y gráficos al reporte</p>
                </div>
                <Checkbox
                  checked={exportConfig.includeCharts}
                  onCheckedChange={(checked) => setExportConfig(prev => ({ ...prev, includeCharts: !!checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">Compresión</span>
                  <p className="text-sm text-muted-foreground">Reducir el tamaño del archivo</p>
                </div>
                <Checkbox
                  checked={exportConfig.compressed}
                  onCheckedChange={(checked) => setExportConfig(prev => ({ ...prev, compressed: !!checked }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Summary & Action */}
      <Card className="maritime-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Resumen de Exportación</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{exportConfig.dataTypes.length}</div>
                <p className="text-sm text-muted-foreground">Tipos de Datos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{getEstimatedSize()}</div>
                <p className="text-sm text-muted-foreground">Tamaño Estimado</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground uppercase">{exportConfig.format}</div>
                <p className="text-sm text-muted-foreground">Formato</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Configuración Actual:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {exportConfig.dateRange === '24h' ? '24 horas' :
                   exportConfig.dateRange === '7d' ? '7 días' :
                   exportConfig.dateRange === '30d' ? '30 días' : '90 días'}
                </Badge>
                <Badge variant="outline">
                  <Filter className="h-3 w-3 mr-1" />
                  {exportConfig.dataTypes.length} tipos de datos
                </Badge>
                {exportConfig.includeCharts && (
                  <Badge variant="outline">Con gráficos</Badge>
                )}
                {exportConfig.compressed && (
                  <Badge variant="outline">Comprimido</Badge>
                )}
              </div>
            </div>

            <Button 
              onClick={handleExport}
              disabled={isExporting || exportConfig.dataTypes.length === 0}
              className="w-full"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Iniciar Exportación'}
            </Button>

            {exportConfig.dataTypes.length === 0 && (
              <p className="text-sm text-amber-600 text-center">
                Selecciona al menos un tipo de datos para exportar
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}