import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Filter, BookOpen, Play, FileText, Video, File } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBaserowFields } from '@/lib/baserow';
import { ALL_TABLES } from '@/config/baserowTables';

import { 
  getCourse, 
  getCourseModules, 
  getModuleLessons,
  createModule, 
  updateModule, 
  deleteModule,
  createLesson, 
  updateLesson, 
  deleteLesson,
  type Course, 
  type CourseModule, 
  type CourseLesson 
} from '@/services/courseService';

const CourseModulesAdmin: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  const { toast } = useToast();

  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: '',
    order: '1',
  });

  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    content_type: 'video' as 'video' | 'pdf' | 'text' | 'quiz',
    video_url: '',
    pdf_file: '',
    text_content: '',
    quiz_data: '',
    order: '1',
    is_free_preview: 'false',
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setIsLoading(true);
      const courseData = await getCourse(parseInt(courseId!));
      setCourse(courseData);
      
      const modulesData = await getCourseModules(parseInt(courseId!));
      setModules(modulesData);
      
      if (modulesData.length > 0) {
        setSelectedModuleId(modulesData[0].id);
        const lessonsData = await getModuleLessons(modulesData[0].id);
        setLessons(lessonsData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do curso:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do curso.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const moduleData = {
        course_id: parseInt(courseId!),
        title: moduleFormData.title,
        description: moduleFormData.description,
        order: parseInt(moduleFormData.order),
      };

      if (editingModule) {
        await updateModule(editingModule.id, moduleData);
        toast({ title: "Módulo atualizado!" });
      } else {
        await createModule(moduleData);
        toast({ title: "Módulo criado!" });
      }
      
      await fetchCourseData();
      resetModuleForm();
      setIsModuleDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
      toast({ title: "Erro ao salvar módulo", variant: "destructive" });
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedModuleId) {
      toast({ title: "Selecione um módulo primeiro", variant: "destructive" });
      return;
    }

    try {
      // Criar objeto base com campos obrigatórios
      const lessonData: any = {
        module_id: selectedModuleId,
        title: lessonFormData.title,
        content_type: lessonFormData.content_type,
        order: parseInt(lessonFormData.order),
        is_free_preview: lessonFormData.is_free_preview,
      };

      // Adicionar campos opcionais apenas se tiverem valor
      if (lessonFormData.video_url.trim() !== '') {
        lessonData.video_url = lessonFormData.video_url;
      }
      if (lessonFormData.pdf_file.trim() !== '') {
        lessonData.pdf_file = lessonFormData.pdf_file;
      }
      if (lessonFormData.text_content.trim() !== '') {
        lessonData.text_content = lessonFormData.text_content;
      }
      if (lessonFormData.quiz_data.trim() !== '') {
        lessonData.quiz_data = lessonFormData.quiz_data;
      }

      console.log('📤 Dados da aula a serem enviados:', lessonData);

      if (editingLesson) {
        await updateLesson(editingLesson.id, lessonData);
        toast({ title: "Aula atualizada!" });
      } else {
        await createLesson(lessonData);
        toast({ title: "Aula criada!" });
      }
      
      await fetchCourseData();
      resetLessonForm();
      setIsLessonDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
      toast({ title: "Erro ao salvar aula", variant: "destructive" });
    }
  };

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module);
    setModuleFormData({
      title: module.title,
      description: module.description,
      order: String(module.order),
    });
    setIsModuleDialogOpen(true);
  };

  const handleEditLesson = (lesson: CourseLesson) => {
    setEditingLesson(lesson);
    setLessonFormData({
      title: lesson.title,
      content_type: lesson.content_type,
      video_url: lesson.video_url,
      pdf_file: lesson.pdf_file,
      text_content: lesson.text_content,
      quiz_data: lesson.quiz_data,
      order: String(lesson.order),
      is_free_preview: lesson.is_free_preview ? 'true' : 'false',
    });
    setIsLessonDialogOpen(true);
  };

  const handleDeleteModule = async (moduleId: number) => {
    try {
      await deleteModule(moduleId);
      await fetchCourseData();
      toast({ title: "Módulo excluído!" });
    } catch (error) {
      toast({ title: "Erro ao excluir módulo", variant: "destructive" });
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      await deleteLesson(lessonId);
      await fetchCourseData();
      toast({ title: "Aula excluída!" });
    } catch (error) {
      toast({ title: "Erro ao excluir aula", variant: "destructive" });
    }
  };

  const resetModuleForm = () => {
    setModuleFormData({
      title: '',
      description: '',
      order: '1',
    });
    setEditingModule(null);
  };

  const resetLessonForm = () => {
    setLessonFormData({
      title: '',
      content_type: 'video',
      video_url: '',
      pdf_file: '',
      text_content: '',
      quiz_data: '',
      order: '1',
      is_free_preview: 'false',
    });
    setEditingLesson(null);
  };

  const handleModuleSelect = async (moduleId: number) => {
    setSelectedModuleId(moduleId);
    try {
      const lessonsData = await getModuleLessons(moduleId);
      setLessons(lessonsData);
    } catch (error) {
      console.error('Erro ao buscar aulas do módulo:', error);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'pdf': return <File className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'quiz': return <Search className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Carregando dados do curso...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Curso não encontrado</div>
          <Button asChild className="mt-4">
            <Link to="/admin/cursos">Voltar aos Cursos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/admin/cursos" className="text-muted-foreground hover:text-foreground">
              ← Voltar aos Cursos
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Módulos ({modules.length})
          </TabsTrigger>
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Aulas ({lessons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Módulos do Curso</CardTitle>
                  <CardDescription>
                    Gerencie os módulos que compõem este curso
                  </CardDescription>
                </div>
                <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetModuleForm}>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Módulo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingModule ? 'Editar Módulo' : 'Adicionar Novo Módulo'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleModuleSubmit} className="grid gap-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="module-title">Título do Módulo</Label>
                        <Input 
                          id="module-title" 
                          value={moduleFormData.title} 
                          onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="module-description">Descrição</Label>
                        <Textarea 
                          id="module-description" 
                          value={moduleFormData.description} 
                          onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })} 
                          rows={3} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="module-order">Ordem</Label>
                        <Input 
                          id="module-order" 
                          type="number" 
                          value={moduleFormData.order} 
                          onChange={(e) => setModuleFormData({ ...moduleFormData, order: e.target.value })} 
                          min="1"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingModule ? 'Atualizar' : 'Criar'} Módulo
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {modules.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Nenhum módulo criado ainda</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell>
                          <Badge variant="outline">{Number(module.order)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{module.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {module.description}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditModule(module)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteModule(module.id)}
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
        </TabsContent>

        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Aulas</CardTitle>
                  <CardDescription>
                    Gerencie as aulas dos módulos
                  </CardDescription>
                </div>
                {modules.length > 0 && (
                  <div className="flex gap-2">
                    <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Aula
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                          <DialogTitle>{editingLesson ? 'Editar Aula' : 'Adicionar Nova Aula'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleLessonSubmit} className="grid gap-6 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="lesson-module">Módulo</Label>
                            <Select
                              value={selectedModuleId?.toString() || ''}
                              onValueChange={(value) => setSelectedModuleId(parseInt(value))}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um módulo" />
                              </SelectTrigger>
                              <SelectContent>
                                {modules.map(module => (
                                  <SelectItem key={module.id} value={String(module.id)}>
                                    {module.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lesson-title">Título da Aula</Label>
                            <Input 
                              id="lesson-title" 
                              value={lessonFormData.title} 
                              onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })} 
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lesson-content-type">Tipo de Conteúdo</Label>
                            <Select
                              value={lessonFormData.content_type}
                              onValueChange={(value: 'video' | 'pdf' | 'text' | 'quiz') => 
                                setLessonFormData({ ...lessonFormData, content_type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video">Vídeo</SelectItem>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="text">Texto</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {lessonFormData.content_type === 'video' && (
                            <div className="space-y-2">
                              <Label htmlFor="lesson-video">URL do Vídeo</Label>
                              <Input 
                                id="lesson-video" 
                                value={lessonFormData.video_url} 
                                onChange={(e) => setLessonFormData({ ...lessonFormData, video_url: e.target.value })} 
                                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                              />
                            </div>
                          )}
                          {lessonFormData.content_type === 'pdf' && (
                            <div className="space-y-2">
                              <Label htmlFor="lesson-pdf">URL do PDF</Label>
                              <Input 
                                id="lesson-pdf" 
                                value={lessonFormData.pdf_file} 
                                onChange={(e) => setLessonFormData({ ...lessonFormData, pdf_file: e.target.value })} 
                                placeholder="https://exemplo.com/arquivo.pdf"
                              />
                            </div>
                          )}
                          {lessonFormData.content_type === 'text' && (
                            <div className="space-y-2">
                              <Label htmlFor="lesson-text">Conteúdo em Texto</Label>
                              <Textarea 
                                id="lesson-text" 
                                value={lessonFormData.text_content} 
                                onChange={(e) => setLessonFormData({ ...lessonFormData, text_content: e.target.value })} 
                                rows={6} 
                              />
                            </div>
                          )}
                          {lessonFormData.content_type === 'quiz' && (
                            <div className="space-y-2">
                              <Label htmlFor="lesson-quiz">Dados do Quiz (JSON)</Label>
                              <Textarea 
                                id="lesson-quiz" 
                                value={lessonFormData.quiz_data} 
                                onChange={(e) => setLessonFormData({ ...lessonFormData, quiz_data: e.target.value })} 
                                rows={6} 
                                placeholder='{"questions": [{"question": "Pergunta 1", "options": ["A", "B", "C"], "correct": 0}]}'
                              />
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="lesson-order">Ordem</Label>
                              <Input 
                                id="lesson-order" 
                                type="number" 
                                value={lessonFormData.order} 
                                onChange={(e) => setLessonFormData({ ...lessonFormData, order: e.target.value })} 
                                min="1"
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                              <Switch 
                                id="lesson-free" 
                                checked={lessonFormData.is_free_preview === 'true'} 
                                onCheckedChange={(checked) => setLessonFormData({ ...lessonFormData, is_free_preview: String(checked) })} 
                              />
                              <Label htmlFor="lesson-free">Aula Gratuita (Preview)</Label>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsLessonDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button type="submit">
                              {editingLesson ? 'Atualizar' : 'Criar'} Aula
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {modules.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Crie módulos primeiro para adicionar aulas</div>
                </div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Nenhuma aula criada ainda</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Aula</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessons.map((lesson) => {
                      const module = modules.find(m => m.id === lesson.module_id);
                      return (
                        <TableRow key={lesson.id}>
                          <TableCell>
                            <Badge variant="outline">{Number(lesson.order)}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{lesson.title}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {module?.title || 'Módulo não encontrado'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getContentTypeIcon(lesson.content_type)}
                              <span className="capitalize">{lesson.content_type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={lesson.is_free_preview ? "default" : "secondary"}>
                              {lesson.is_free_preview ? "Gratuita" : "Paga"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditLesson(lesson)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteLesson(lesson.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseModulesAdmin;