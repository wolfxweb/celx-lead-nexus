import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter, BookOpen, Users, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

import { getAllCourses, createCourse, updateCourse, deleteCourse, type Course } from '@/services/courseService';

const CourseAdmin: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image: '',
    instructor_id: '',
    is_published: 'true',
  });

  useEffect(() => {
    filterCourses();
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const fetchedCourses = await getAllCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      toast({ title: "Erro ao carregar cursos", variant: "destructive" });
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [toast]);

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        cover_image: formData.cover_image,
        instructor_id: formData.instructor_id,
        is_published: formData.is_published === 'true',
        product_id: editingCourse?.product_id || 0, // Mantém o product_id existente ou 0
      };

      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
        toast({ title: "Curso atualizado!" });
      } else {
        await createCourse(courseData);
        toast({ title: "Curso criado!" });
      }
      
      await fetchCourses();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      toast({ title: "Erro ao salvar curso", variant: "destructive" });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      cover_image: course.cover_image || '',
      instructor_id: course.instructor_id || '',
      is_published: course.is_published ? 'true' : 'false',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: number) => {
    try {
      await deleteCourse(courseId);
      await fetchCourses();
      toast({ title: "Curso excluído!" });
    } catch (error) {
      toast({ title: "Erro ao excluir curso", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      cover_image: '',
      instructor_id: '',
      is_published: 'true',
    });
    setEditingCourse(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
          <p className="text-muted-foreground">Crie e gerencie os cursos da plataforma</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Editar Curso' : 'Adicionar Novo Curso'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Curso</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  rows={4} 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image">URL da Imagem de Capa</Label>
                <Input 
                  id="cover_image" 
                  value={formData.cover_image} 
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} 
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor_id">ID do Instrutor</Label>
                <Input 
                  id="instructor_id" 
                  value={formData.instructor_id} 
                  onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })} 
                  placeholder="ID do instrutor no sistema"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_published" 
                    checked={formData.is_published === 'true'} 
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: String(checked) })} 
                  />
                  <Label htmlFor="is_published">Curso Publicado</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCourse ? 'Atualizar' : 'Criar'} Curso
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Cursos</CardTitle>
              <CardDescription>
                {filteredCourses.length} curso(s) encontrado(s)
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingCourses ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Carregando cursos...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Instrutor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.instructor_id}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.is_published ? "default" : "secondary"}>
                        {course.is_published ? "Publicado" : "Rascunho"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(course.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link to={`/admin/cursos/${course.id}/modulos`}>
                            <Settings className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseAdmin; 