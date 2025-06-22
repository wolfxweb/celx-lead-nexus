import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  X,
  Download,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { getBaserowRows, createBaserowRow, updateBaserowRow, deleteBaserowRow } from '@/lib/baserow';
import { getTableId } from '@/config/baserowTables';

interface PopupConfig {
  id: string;
  title: string;
  message: string;
  showEmailField: boolean;
  emailPlaceholder?: string;
  buttonText: string;
  pdfUrl?: string;
  delay: number;
  pages: string;
  isActive: boolean;
}

const PopupAdmin = () => {
  const [popups, setPopups] = useState<PopupConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPopup, setEditingPopup] = useState<PopupConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [popupToDelete, setPopupToDelete] = useState<PopupConfig | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    showEmailField: false,
    emailPlaceholder: '',
    buttonText: '',
    pdfUrl: '',
    delay: 5,
    pages: '',
    isActive: true
  });

  const fetchPopups = async () => {
    try {
      setLoading(true);
      const tableId = getTableId('POPUP_CONFIGS');
      const response = await getBaserowRows(tableId, { size: 200 });
      const mappedPopups = (response.results || []).map((popup: any) => ({
        id: popup.id.toString(),
        title: popup.title || '',
        message: popup.message || '',
        showEmailField: popup.show_email_field === 'true' || popup.show_email_field === true,
        emailPlaceholder: popup.email_placeholder || '',
        buttonText: popup.button_text || '',
        pdfUrl: popup.pdf_url || '',
        delay: parseInt(popup.delay) || 5,
        pages: popup.pages || '',
        isActive: popup.is_active === 'true' || popup.is_active === true
      }));
      setPopups(mappedPopups);
    } catch (error) {
      console.error('Erro ao buscar pop-ups:', error);
      toast.error('Erro ao carregar pop-ups');
      setPopups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const tableId = getTableId('POPUP_CONFIGS');
      
      const data = {
        title: formData.title,
        message: formData.message,
        show_email_field: formData.showEmailField ? "true" : "false",
        email_placeholder: formData.emailPlaceholder || "",
        button_text: formData.buttonText,
        pdf_url: formData.pdfUrl || "",
        delay: formData.delay.toString(),
        pages: formData.pages,
        is_active: formData.isActive ? "true" : "false"
      };

      if (editingPopup) {
        await updateBaserowRow(tableId, parseInt(editingPopup.id), data);
        toast.success('Pop-up atualizado com sucesso!');
      } else {
        await createBaserowRow(tableId, data);
        toast.success('Pop-up criado com sucesso!');
      }

      setEditingPopup(null);
      setIsCreating(false);
      resetForm();
      
      // Atualizar a lista imediatamente
      await fetchPopups();
    } catch (error) {
      console.error('Erro ao salvar pop-up:', error);
      toast.error('Erro ao salvar pop-up');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este pop-up?')) return;

    try {
      setLoading(true);
      const tableId = getTableId('POPUP_CONFIGS');
      await deleteBaserowRow(tableId, parseInt(id));
      toast.success('Pop-up excluído com sucesso!');
      
      // Atualizar a lista imediatamente
      await fetchPopups();
    } catch (error) {
      console.error('Erro ao excluir pop-up:', error);
      toast.error('Erro ao excluir pop-up');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (popup: PopupConfig) => {
    setPopupToDelete(popup);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!popupToDelete) return;

    try {
      setLoading(true);
      const tableId = getTableId('POPUP_CONFIGS');
      await deleteBaserowRow(tableId, parseInt(popupToDelete.id));
      toast.success('Pop-up excluído com sucesso!');
      // Atualizar a lista localmente
      setPopups((prev) => prev.filter(p => p.id !== popupToDelete.id));
    } catch (error) {
      console.error('Erro ao excluir pop-up:', error);
      toast.error('Erro ao excluir pop-up');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setPopupToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPopupToDelete(null);
  };

  const handleEdit = (popup: PopupConfig) => {
    setEditingPopup(popup);
    setFormData({
      title: popup.title,
      message: popup.message,
      showEmailField: popup.showEmailField,
      emailPlaceholder: popup.emailPlaceholder || '',
      buttonText: popup.buttonText,
      pdfUrl: popup.pdfUrl || '',
      delay: popup.delay,
      pages: popup.pages,
      isActive: popup.isActive
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      showEmailField: false,
      emailPlaceholder: '',
      buttonText: '',
      pdfUrl: '',
      delay: 5,
      pages: '',
      isActive: true
    });
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingPopup(null);
    resetForm();
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingPopup(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando pop-ups...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Pop-ups</h1>
        <Button 
          onClick={handleCreate} 
          className="bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Pop-up
        </Button>
      </div>

      {/* Formulário */}
      {(isCreating || editingPopup) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingPopup ? 'Editar Pop-up' : 'Criar Novo Pop-up'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Texto do Botão</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delay">Delay (segundos)</Label>
                  <Input
                    id="delay"
                    type="number"
                    min="1"
                    value={formData.delay}
                    onChange={(e) => setFormData({ ...formData, delay: parseInt(e.target.value) })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pages">Páginas (separadas por vírgula)</Label>
                  <Input
                    id="pages"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    placeholder="home,sobre,produtos"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pdfUrl">URL do PDF (opcional)</Label>
                  <Input
                    id="pdfUrl"
                    type="url"
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    placeholder="https://exemplo.com/arquivo.pdf"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showEmailField"
                    checked={formData.showEmailField}
                    onCheckedChange={(checked) => setFormData({ ...formData, showEmailField: checked })}
                  />
                  <Label htmlFor="showEmailField">Mostrar campo de email</Label>
                </div>

                {formData.showEmailField && (
                  <div className="space-y-2">
                    <Label htmlFor="emailPlaceholder">Placeholder do campo email</Label>
                    <Input
                      id="emailPlaceholder"
                      value={formData.emailPlaceholder}
                      onChange={(e) => setFormData({ ...formData, emailPlaceholder: e.target.value })}
                      placeholder="Digite seu melhor email"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Pop-up ativo</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingPopup ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Pop-ups */}
      <div className="grid gap-4">
        {loading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              Atualizando lista...
            </div>
          </div>
        )}
        
        {popups.map((popup) => (
          <Card key={popup.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {popup.title}
                    {popup.isActive ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Eye className="h-3 w-3 mr-1" />
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inativo
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Delay: {popup.delay}s | Páginas: {popup.pages}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(popup)}
                    disabled={loading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => confirmDelete(popup)}
                    className="text-red-600 hover:text-red-700"
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">{popup.message}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  Botão: {popup.buttonText}
                </Badge>
                {popup.showEmailField && (
                  <Badge variant="outline" className="text-blue-600">
                    <Mail className="h-3 w-3 mr-1" />
                    Captura Email
                  </Badge>
                )}
                {popup.pdfUrl && (
                  <Badge variant="outline" className="text-purple-600">
                    <Download className="h-3 w-3 mr-1" />
                    PDF Disponível
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {popups.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          Nenhum pop-up configurado ainda.
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && popupToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Confirmar Exclusão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Tem certeza que deseja excluir o pop-up <strong>"{popupToDelete.title}"</strong>?
              </p>
              <p className="text-sm text-gray-500">
                Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={cancelDelete}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={executeDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Excluindo...' : 'Excluir'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PopupAdmin; 