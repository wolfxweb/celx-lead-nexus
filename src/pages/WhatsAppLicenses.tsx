import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  DollarSign,
  Clock,
  Smartphone,
  MessageSquare,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getWhatsAppLicenses, createWhatsAppLicense, updateWhatsAppLicense, deleteWhatsAppLicense, type WhatsAppLicense } from '@/services/whatsappService';

const WhatsAppLicenses: React.FC = () => {
  const [licenses, setLicenses] = useState<WhatsAppLicense[]>([]);
  const [filteredLicenses, setFilteredLicenses] = useState<WhatsAppLicense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<WhatsAppLicense | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    original_price: '',
    license_type: '',
    instance_limit: '',
    message_limit: '',
    duration_days: '',
    features: '',
    is_active: true,
    is_featured: false
  });

  useEffect(() => {
    loadLicenses();
  }, []);

  useEffect(() => {
    filterLicenses();
  }, [licenses, searchTerm, filterType]);

  const loadLicenses = async () => {
    try {
      setIsLoading(true);
      const data = await getWhatsAppLicenses();
      setLicenses(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar licenças",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterLicenses = () => {
    let filtered = licenses;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(license =>
        license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(license => license.license_type === filterType);
    }

    setFilteredLicenses(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const licenseData = {
        ...formData,
        price: parseFloat(formData.price).toString(),
        original_price: formData.original_price ? parseFloat(formData.original_price).toString() : '',
        instance_limit: parseInt(formData.instance_limit).toString(),
        message_limit: parseInt(formData.message_limit).toString(),
        duration_days: parseInt(formData.duration_days).toString(),
        sales_count: '0',
        rating: '0.0'
      };

      if (editingLicense) {
        await updateWhatsAppLicense(editingLicense.id, licenseData);
        toast({
          title: "Sucesso",
          description: "Licença atualizada com sucesso",
        });
      } else {
        await createWhatsAppLicense(licenseData);
        toast({
          title: "Sucesso",
          description: "Licença criada com sucesso",
        });
      }

      setIsDialogOpen(false);
      setEditingLicense(null);
      resetForm();
      loadLicenses();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar licença",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (license: WhatsAppLicense) => {
    setEditingLicense(license);
    setFormData({
      name: license.name,
      description: license.description,
      short_description: license.short_description,
      price: license.price,
      original_price: license.original_price || '',
      license_type: license.license_type,
      instance_limit: license.instance_limit,
      message_limit: license.message_limit,
      duration_days: license.duration_days,
      features: license.features,
      is_active: license.is_active,
      is_featured: license.is_featured
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (licenseId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta licença?')) {
      try {
        await deleteWhatsAppLicense(licenseId);
        toast({
          title: "Sucesso",
          description: "Licença excluída com sucesso",
        });
        loadLicenses();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir licença",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      price: '',
      original_price: '',
      license_type: '',
      instance_limit: '',
      message_limit: '',
      duration_days: '',
      features: '',
      is_active: true,
      is_featured: false
    });
  };

  const getLicenseTypeColor = (type: string) => {
    switch (type) {
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-green-100 text-green-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLicenseTypeLabel = (type: string) => {
    switch (type) {
      case 'trial': return 'Trial';
      case 'basic': return 'Básico';
      case 'professional': return 'Profissional';
      case 'enterprise': return 'Enterprise';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Licenças WhatsApp</h1>
          <p className="text-gray-600">Gerencie os planos e licenças do WhatsApp</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingLicense(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Licença
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLicense ? 'Editar Licença' : 'Nova Licença'}
              </DialogTitle>
              <DialogDescription>
                Configure os detalhes da licença do WhatsApp
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Licença</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="license_type">Tipo de Licença</Label>
                  <Select value={formData.license_type} onValueChange={(value) => setFormData({...formData, license_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="professional">Profissional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="short_description">Descrição Curta</Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                  placeholder="Descrição breve para exibição"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição Completa</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="original_price">Preço Original (R$)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                    placeholder="Para promoções"
                  />
                </div>
                <div>
                  <Label htmlFor="duration_days">Duração (dias)</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({...formData, duration_days: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instance_limit">Limite de Instâncias</Label>
                  <Input
                    id="instance_limit"
                    type="number"
                    value={formData.instance_limit}
                    onChange={(e) => setFormData({...formData, instance_limit: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message_limit">Limite de Mensagens</Label>
                  <Input
                    id="message_limit"
                    type="number"
                    value={formData.message_limit}
                    onChange={(e) => setFormData({...formData, message_limit: e.target.value})}
                    placeholder="Para trial"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="features">Recursos (separados por vírgula)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  placeholder="instances, messages, webhooks, reports"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                  />
                  <Label htmlFor="is_featured">Destaque</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingLicense ? 'Atualizar' : 'Criar'} Licença
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar licenças..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="professional">Profissional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Licenças */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando licenças...</p>
          </div>
        ) : filteredLicenses.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma licença encontrada</h3>
            <p className="text-gray-600">Crie sua primeira licença para começar</p>
          </div>
        ) : (
          filteredLicenses.map((license) => (
            <Card key={license.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{license.name}</CardTitle>
                      {license.is_featured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>
                    <Badge className={getLicenseTypeColor(license.license_type)}>
                      {getLicenseTypeLabel(license.license_type)}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(license)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(license.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{license.short_description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">R$ {parseFloat(license.price).toFixed(2)}</span>
                    {license.original_price && parseFloat(license.original_price) > parseFloat(license.price) && (
                      <span className="text-sm text-gray-500 line-through">
                        R$ {parseFloat(license.original_price).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{license.duration_days} dias</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span>{license.instance_limit} instâncias</span>
                  </div>
                  {license.message_limit && (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                      <span>{license.message_limit} mensagens</span>
                    </div>
                  )}
                </div>

                {license.features && (
                  <div className="flex flex-wrap gap-1">
                    {license.features.split(',').map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature.trim()}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    {license.is_active ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      {license.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{license.sales_count} vendas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WhatsAppLicenses; 