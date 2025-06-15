
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database, Users, Bell, Shield, Download, Info } from 'lucide-react';
import { toast } from 'sonner';

const NirPanel: React.FC = () => {
  const [settings, setSettings] = useState({
    autoBackup: true,
    notifications: true,
    realTimeUpdates: true,
    securityAlerts: true,
    hospitalName: 'Hospital Municipal de Paracatu – Núcleo Interno de Regulação de Leitos (NIR-HMP)',
    adminEmail: 'admin@hospital.com',
    maxStayAlert: 15,
    dischargeTimeLimit: 5,
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handleExportData = () => {
    toast.success('Exportação de dados iniciada!');
  };

  const handleBackup = () => {
    toast.success('Backup realizado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">NIR - Configurações</h1>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Informações sobre o Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Sobre o Sistema de Gestão de Leitos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Descrição:</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Este módulo permite configurar as informações gerais do Sistema de Gestão de Leitos do Hospital Municipal de Paracatu. 
                  Aqui, o administrador pode definir o nome institucional do hospital, o e-mail de contato responsável pela administração 
                  do sistema, além de ajustar preferências essenciais para o funcionamento seguro, eficiente e contínuo da plataforma.
                </p>
                <p className="text-sm text-blue-700 leading-relaxed mt-2">
                  O sistema oferece um monitoramento interno de toda a jornada do paciente, desde a sua entrada (internação) até a 
                  saída (alta hospitalar), proporcionando maior controle, rastreabilidade e apoio à tomada de decisões operacionais.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Principais Funcionalidades:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="text-sm text-green-700">
                    <p className="font-medium">• Monitoramento dos Tempos de Alta</p>
                    <p className="ml-2 text-xs">Acompanhamento detalhado por departamento e município</p>
                  </div>
                  <div className="text-sm text-green-700">
                    <p className="font-medium">• Análise de Internações Prolongadas</p>
                    <p className="ml-2 text-xs">Relatórios de pacientes com internações > 15 dias</p>
                  </div>
                  <div className="text-sm text-green-700">
                    <p className="font-medium">• Controle de Reinternações</p>
                    <p className="ml-2 text-xs">Monitoramento de retornos em < 30 dias</p>
                  </div>
                  <div className="text-sm text-green-700">
                    <p className="font-medium">• Dashboards e Análises</p>
                    <p className="ml-2 text-xs">Indicadores de desempenho e tendências</p>
                  </div>
                  <div className="text-sm text-green-700 md:col-span-2">
                    <p className="font-medium">• Intervenções em Pacientes em TFD</p>
                    <p className="ml-2 text-xs">Gerenciamento de casos de Tratamento Fora de Domicílio</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span><strong>Criador:</strong> Marcelo Souza – Coordenador do Núcleo Interno de Regulação de Leitos (NIR-HMP)</span>
                  <span><strong>Ano:</strong> 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="hospitalName">Nome Institucional do Hospital</Label>
                  <Input
                    id="hospitalName"
                    value={settings.hospitalName}
                    onChange={(e) => setSettings(prev => ({ ...prev, hospitalName: e.target.value }))}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Nome completo da instituição para identificação oficial</p>
                </div>
                <div>
                  <Label htmlFor="adminEmail">Email do Administrador</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Contato responsável pela administração do sistema</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Preferências do Sistema</h4>
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label htmlFor="realTimeUpdates" className="font-medium">Atualizações em Tempo Real</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Permite que as informações sobre os leitos, pacientes e movimentações sejam atualizadas 
                      automaticamente, garantindo maior precisão no controle da ocupação e disponibilidade.
                    </p>
                  </div>
                  <Switch
                    id="realTimeUpdates"
                    checked={settings.realTimeUpdates}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, realTimeUpdates: checked }))}
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label htmlFor="notifications" className="font-medium">Notificações</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Habilita o recebimento de alertas e mensagens do sistema sobre eventos importantes, como novas 
                      solicitações de leito, altas médicas, transferências ou intercorrências críticas.
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label htmlFor="autoBackup" className="font-medium">Backup Automático</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Garante a segurança dos dados com a realização de backups diários de forma automática, 
                      evitando perdas de informação em caso de falhas ou incidentes.
                    </p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBackup: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxStayAlert">Alerta de Permanência (dias)</Label>
                  <Input
                    id="maxStayAlert"
                    type="number"
                    value={settings.maxStayAlert}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxStayAlert: parseInt(e.target.value) }))}
                  />
                  <p className="text-sm text-gray-600">Alertar quando paciente permanecer mais que X dias</p>
                </div>
                
                <div>
                  <Label htmlFor="dischargeTimeLimit">Limite de Tempo para Alta (horas)</Label>
                  <Input
                    id="dischargeTimeLimit"
                    type="number"
                    value={settings.dischargeTimeLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, dischargeTimeLimit: parseInt(e.target.value) }))}
                  />
                  <p className="text-sm text-gray-600">Solicitar justificativa após X horas</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="securityAlerts">Alertas de Segurança</Label>
                  <p className="text-sm text-gray-600">Notificar sobre tentativas de acesso não autorizado</p>
                </div>
                <Switch
                  id="securityAlerts"
                  checked={settings.securityAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, securityAlerts: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gerenciamento de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Usuários Ativos</h4>
                <Button variant="outline">Adicionar Usuário</Button>
              </div>
              
              <div className="border rounded-lg">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Administrador</p>
                      <p className="text-sm text-gray-600">admin@hospital.com</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="destructive" size="sm">Remover</Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Enfermeiro</p>
                      <p className="text-sm text-gray-600">enfermeiro@hospital.com</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="destructive" size="sm">Remover</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup e Restauração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleBackup} className="h-20 flex-col">
                  <Database className="h-6 w-6 mb-2" />
                  Realizar Backup Agora
                </Button>
                
                <Button onClick={handleExportData} variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Exportar Dados
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Histórico de Backups</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Backup Automático</p>
                      <p className="text-sm text-gray-600">09/06/2025 - 03:00</p>
                    </div>
                    <Button variant="outline" size="sm">Restaurar</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Backup Manual</p>
                      <p className="text-sm text-gray-600">08/06/2025 - 14:30</p>
                    </div>
                    <Button variant="outline" size="sm">Restaurar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                
                <div>
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input id="newPassword" type="password" />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                
                <Button>Alterar Senha</Button>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Logs de Acesso</h4>
                <div className="border rounded-lg max-h-40 overflow-y-auto">
                  <div className="p-3 border-b text-sm">
                    <p>09/06/2025 14:23 - Login realizado (admin@hospital.com)</p>
                  </div>
                  <div className="p-3 border-b text-sm">
                    <p>09/06/2025 13:45 - Logout realizado (enfermeiro@hospital.com)</p>
                  </div>
                  <div className="p-3 text-sm">
                    <p>09/06/2025 13:15 - Login realizado (enfermeiro@hospital.com)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NirPanel;
