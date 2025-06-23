import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, HelpCircle, FileText, Video, MessageSquare, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createLessonDoubt } from '@/services/courseService';
// Mock - Supondo que você tenha um jeito de pegar o usuário logado
const MOCK_USER_ID = 1; 

// --- Tipos de Dados ---
interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'text' | 'pdf' | 'quiz';
  completed: boolean;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  modules: Module[];
}

type LessonContentData = { type: 'video'; url: string } | { type: 'text'; content: string } | { type: 'pdf'; url: string } | { type: 'quiz'; questions: { q: string; a: string }[] };

// --- Mock Data ---
const courseData: Course = {
  id: 1,
  title: 'Curso de Automação com IA',
  modules: [
    { id: 1, title: 'Módulo 1: Introdução à Automação', lessons: [
      { id: 1, title: 'O que é Automação?', type: 'video', completed: true },
      { id: 2, title: 'Configurando seu Ambiente', type: 'text', completed: true },
    ]},
    { id: 2, title: 'Módulo 2: Ferramentas Essenciais', lessons: [
      { id: 3, title: 'Usando a Ferramenta X', type: 'pdf', completed: false },
      { id: 4, title: 'Quiz do Módulo 2', type: 'quiz', completed: false },
    ]},
  ]
};

const lessonContent: { [key: number]: LessonContentData } = {
  1: { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  2: { type: 'text', content: 'Este é o conteúdo em texto da aula sobre configuração de ambiente...' },
  3: { type: 'pdf', url: '/path/to/aula3.pdf' },
  4: { type: 'quiz', questions: [{ q: 'Qual a resposta?', a: 'Esta' }] },
};

// --- Componente ---
const CursoDetalhes = () => {
  const [activeLesson, setActiveLesson] = useState<LessonContentData>(lessonContent[1]);
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [doubtText, setDoubtText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 mr-2" />;
      case 'pdf': return <FileText className="h-4 w-4 mr-2" />;
      case 'text': return <MessageSquare className="h-4 w-4 mr-2" />;
      case 'quiz': return <HelpCircle className="h-4 w-4 mr-2" />;
      default: return null;
    }
  };

  const handleLessonClick = (lessonId: number) => {
    if (lessonContent[lessonId]) {
      setActiveLesson(lessonContent[lessonId]);
      setActiveLessonId(lessonId);
    }
  };

  const handleDoubtSubmit = async () => {
    if (doubtText.trim() === '') {
      toast({ title: "Por favor, escreva sua dúvida.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createLessonDoubt({
        lesson_id: activeLessonId,
        user_id: MOCK_USER_ID, // Substituir pelo ID do usuário real
        doubt_text: doubtText,
      });

      toast({ title: "Dúvida enviada com sucesso!" });
      setDoubtText('');
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao enviar dúvida.", description: "Tente novamente mais tarde.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar com Módulos e Aulas */}
      <aside className="w-1/3 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <Link to="/meus-cursos" className="text-sm font-medium text-primary hover:underline">← Voltar para Meus Cursos</Link>
          <h2 className="text-xl font-bold mt-2">{courseData.title}</h2>
        </div>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          {courseData.modules.map(module => (
            <AccordionItem value={`item-${module.id}`} key={module.id}>
              <AccordionTrigger className="px-4 font-semibold">{module.title}</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  {module.lessons.map(lesson => (
                    <li key={lesson.id}>
                      <Button variant="ghost" className="w-full justify-start items-center px-4" onClick={() => handleLessonClick(lesson.id)}>
                        {getIcon(lesson.type)}
                        <span className="flex-grow text-left">{lesson.title}</span>
                        {lesson.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </Button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>

      {/* Conteúdo Principal da Aula */}
      <main className="w-2/3 p-8 overflow-y-auto">
        {activeLesson.type === 'video' && (
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src={activeLesson.url}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen>
            </iframe>
          </div>
        )}
        {activeLesson.type === 'text' && (
          <div className="prose max-w-none">
            <p>{activeLesson.content}</p>
          </div>
        )}
        {/* Adicionar renderização para PDF e Quiz aqui */}

        {/* Área de Dúvidas */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Dúvidas da Aula</h3>
          <Card>
            <CardHeader><CardTitle>Faça sua pergunta</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Digite sua dúvida aqui..."
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                disabled={isSubmitting}
              />
              <Button className="mt-4" onClick={handleDoubtSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Enviando...' : 'Enviar Dúvida'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CursoDetalhes; 