import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Shield, 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Trash2, 
  Plus,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserRole } from '@/types/auth';
import SEOHead from '@/components/SEOHead';

// Mock users data - in a real app this would come from an API
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@celx.com',
    role: 'admin' as UserRole,
    avatar: '👨‍💼',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-12-19T10:30:00'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@celx.com',
    role: 'user' as UserRole,
    avatar: '👩‍💻',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-12-18T15:45:00'),
    status: 'active'
  },
  {
    id: '3',
    name: 'João Silva',
    email: 'joao@empresa.com',
    role: 'user' as UserRole,
    avatar: '👨‍💼',
    createdAt: new Date('2024-02-10'),
    lastLogin: new Date('2024-12-17T09:20:00'),
    status: 'active'
  },
  {
    id: '4',
    name: 'Maria Santos',
    email: 'maria@startup.com',
    role: 'user' as UserRole,
    avatar: '👩‍💻',
    createdAt: new Date('2024-03-05'),
    lastLogin: new Date('2024-12-16T14:15:00'),
    status: 'inactive'
  }
];

const UserAdmin = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lidar com objetos de role do Baserow
    let userRole: string;
    if (typeof user.role === 'object' && user.role !== null) {
      userRole = (user.role as any).value || (user.role as any).id || 'user';
    } else {
      userRole = user.role as string;
    }
    
    const matchesRole = filterRole === 'all' || userRole === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    admins: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length
  };

  const handleUpdateUser = (userId: string, updates: any) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    
    toast({
      title: "Usuário atualizado!",
      description: "As informações do usuário foram atualizadas com sucesso.",
    });
    
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'admin') {
      toast({
        title: "Erro!",
        description: "Não é possível excluir um usuário administrador.",
        variant: "destructive"
      });
      return;
    }

    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "Usuário excluído!",
      description: "O usuário foi removido do sistema.",
    });
  };

  const handleStatusToggle = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'admin') {
      toast({
        title: "Erro!",
        description: "Não é possível desativar um usuário administrador.",
        variant: "destructive"
      });
      return;
    }

    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    
    toast({
      title: "Status atualizado!",
      description: `Usuário ${user?.status === 'active' ? 'desativado' : 'ativado'} com sucesso.`,
    });
  };

  const getRoleBadgeColor = (role: UserRole) => {
    // Lidar com objetos que podem vir do Baserow (campos de seleção)
    let roleValue: string;
    if (typeof role === 'object' && role !== null) {
      roleValue = (role as any).value || (role as any).id || 'user';
    } else {
      roleValue = role as string;
    }

    switch (roleValue) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <SEOHead 
        title="Administração de Usuários"
        description="Gerencie usuários do sistema CELX - controle de acesso e permissões"
        keywords="admin users, gestão de usuários, CELX, administração"
      />
      
      {/* Header */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Administração de Usuários
          </h1>
          <p className="text-gray-600 text-lg">
            Gerencie usuários, permissões e controle de acesso
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Ativos</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                </div>
                <User className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Admins</p>
                  <p className="text-3xl font-bold">{stats.admins}</p>
                </div>
                <Shield className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Usuários</p>
                  <p className="text-3xl font-bold">{stats.regularUsers}</p>
                </div>
                <User className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 text-sm">Inativos</p>
                  <p className="text-3xl font-bold">{stats.inactive}</p>
                </div>
                <User className="h-8 w-8 text-gray-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as funções</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Usuários ({filteredUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {user.avatar || user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {(() => {
                          let roleValue: string;
                          if (typeof user.role === 'object' && user.role !== null) {
                            roleValue = (user.role as any).value || (user.role as any).id || 'user';
                          } else {
                            roleValue = user.role as string;
                          }
                          return roleValue === 'admin' ? 'Admin' : 'Usuário';
                        })()}
                      </Badge>
                      <Badge className={getStatusBadgeColor(user.status)}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Criado em {user.createdAt.toLocaleDateString('pt-BR')}
                      </div>
                      {user.lastLogin && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Último login: {user.lastLogin.toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Dialog open={isEditDialogOpen && editingUser?.id === user.id} onOpenChange={(open) => {
                    if (!open) {
                      setIsEditDialogOpen(false);
                      setEditingUser(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                        <DialogDescription>
                          Atualize as informações do usuário
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            value={editingUser?.name || ''}
                            onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            value={editingUser?.email || ''}
                            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Função</Label>
                          <Select 
                            value={editingUser?.role || 'user'} 
                            onValueChange={(value) => setEditingUser({...editingUser, role: value as UserRole})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Usuário</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select 
                            value={editingUser?.status || 'active'} 
                            onValueChange={(value) => setEditingUser({...editingUser, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="inactive">Inativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditDialogOpen(false);
                              setEditingUser(null);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => handleUpdateUser(editingUser.id, editingUser)}
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusToggle(user.id)}
                        disabled={(() => {
                          if (typeof user.role === 'object' && user.role !== null) {
                            const roleValue = (user.role as any).value || (user.role as any).id || 'user';
                            return roleValue === 'admin';
                          }
                          return user.role === 'admin';
                        })()}
                      >
                        {user.status === 'active' ? 'Desativar' : 'Ativar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={(() => {
                          if (typeof user.role === 'object' && user.role !== null) {
                            const roleValue = (user.role as any).value || (user.role as any).id || 'user';
                            return roleValue === 'admin';
                          }
                          return user.role === 'admin';
                        })()}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAdmin; 