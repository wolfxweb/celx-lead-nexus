import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BarChart3, Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  getWhatsAppReports,
  getWhatsAppInstances,
  WhatsAppInstance 
} from '@/services/whatsappService';

const WhatsAppReports: React.FC = () => {
  const [reports, setReports] = useState<any>(null);
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstance, setSelectedInstance] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsData, instancesData] = await Promise.all([
        getWhatsAppReports(),
        getWhatsAppInstances()
      ]);
      setReports(reportsData);
      setInstances(instancesData);
    } catch (error) {
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const reportData = await getWhatsAppReports(
        selectedInstance === 'all' ? undefined : selectedInstance, 
        startDate, 
        endDate
      );
      setReports(reportData);
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!reports) return;

    const csvContent = [
      ['Métrica', 'Valor'],
      ['Total de Mensagens', reports.total_messages],
      ['Mensagens Enviadas', reports.sent_messages],
      ['Mensagens Entregues', reports.delivered_messages],
      ['Mensagens Lidas', reports.read_messages],
      ['Mensagens Falharam', reports.failed_messages],
      ...Object.entries(reports.messages_by_type).map(([type, count]) => [type, count])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whatsapp-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Relatório exportado com sucesso!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando relatórios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios WhatsApp</h1>
        <p className="text-gray-600">Analise o desempenho das suas mensagens do WhatsApp</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Gerar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="instance-filter">Instância</Label>
              <Select value={selectedInstance} onValueChange={setSelectedInstance}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as instâncias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as instâncias</SelectItem>
                  {instances.map((instance) => (
                    <SelectItem key={instance.id} value={instance.id}>
                      {instance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start-date">Data Início</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">Data Fim</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={generateReport} className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Gerar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Principais */}
      {reports && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{reports.total_messages}</div>
                    <div className="text-sm text-gray-600">Total de Mensagens</div>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{reports.sent_messages}</div>
                    <div className="text-sm text-gray-600">Enviadas</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{reports.delivered_messages}</div>
                    <div className="text-sm text-gray-600">Entregues</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{reports.failed_messages}</div>
                    <div className="text-sm text-gray-600">Falharam</div>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Taxa de Sucesso */}
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Sucesso</CardTitle>
              <CardDescription>
                Percentual de mensagens entregues com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Taxa de Entrega</span>
                    <span>
                      {reports.total_messages > 0 
                        ? Math.round((reports.delivered_messages / reports.total_messages) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${reports.total_messages > 0 
                          ? (reports.delivered_messages / reports.total_messages) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Taxa de Leitura</span>
                    <span>
                      {reports.total_messages > 0 
                        ? Math.round((reports.read_messages / reports.total_messages) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ 
                        width: `${reports.total_messages > 0 
                          ? (reports.read_messages / reports.total_messages) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensagens por Tipo */}
          <Card>
            <CardHeader>
              <CardTitle>Mensagens por Tipo</CardTitle>
              <CardDescription>
                Distribuição de mensagens por tipo de conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(reports.messages_by_type).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium capitalize">{type}</div>
                      <div className="text-sm text-gray-600">{String(count)} mensagens</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{String(count)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-end">
            <Button onClick={exportReport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </>
      )}

      {!reports && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório gerado</h3>
            <p className="text-gray-600 text-center mb-4">
              Configure os filtros e gere um relatório para ver as estatísticas.
            </p>
            <Button onClick={generateReport}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Gerar Primeiro Relatório
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhatsAppReports; 