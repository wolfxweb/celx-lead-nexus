import React, { useState, useEffect } from 'react';
import { getAllCourses, createModule, getCourseModules, createLesson } from '@/services/courseService';
import { getBaserowRows } from '@/lib/baserow';

const TestCourseAPI: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [directTestResult, setDirectTestResult] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await getAllCourses();
      setCourses(coursesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    try {
      setLoading(true);
      const coursesTableId = parseInt(import.meta.env.VITE_BASEROW_COURSES_TABLE_ID || '0');
      const modulesTableId = parseInt(import.meta.env.VITE_BASEROW_COURSE_MODULES_TABLE_ID || '0');
      
      setDirectTestResult(`Testando tabelas...\nCourses Table ID: ${coursesTableId}\nModules Table ID: ${modulesTableId}`);
      
      // Testar acesso direto à tabela de cursos
      try {
        const coursesResponse = await getBaserowRows(coursesTableId);
        setDirectTestResult(prev => prev + `\n✅ Tabela de cursos acessível. Registros: ${coursesResponse.results.length}`);
      } catch (err) {
        setDirectTestResult(prev => prev + `\n❌ Erro ao acessar tabela de cursos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      }
      
      // Testar acesso direto à tabela de módulos
      try {
        const modulesResponse = await getBaserowRows(modulesTableId);
        setDirectTestResult(prev => prev + `\n✅ Tabela de módulos acessível. Registros: ${modulesResponse.results.length}`);
      } catch (err) {
        setDirectTestResult(prev => prev + `\n❌ Erro ao acessar tabela de módulos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      }
      
    } catch (err) {
      setDirectTestResult(`Erro no teste direto: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateModule = async () => {
    if (courses.length === 0) {
      setTestResult('Nenhum curso disponível para testar');
      return;
    }

    try {
      setLoading(true);
      const courseId = courses[0].id;
      
      const newModule = await createModule({
        course_id: courseId,
        title: 'Módulo de Teste',
        description: 'Este é um módulo de teste criado via API',
        order: 1,
      });

      setTestResult(`Módulo criado com sucesso! ID: ${newModule.id}`);
      
      // Recarregar os módulos do curso
      const modules = await getCourseModules(courseId);
      console.log('Módulos do curso:', modules);
      
    } catch (err) {
      setTestResult(`Erro ao criar módulo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetCourseModules = async () => {
    if (courses.length === 0) {
      setTestResult('Nenhum curso disponível para testar');
      return;
    }

    try {
      setLoading(true);
      const courseId = courses[0].id;
      
      console.log('Testando getCourseModules para curso ID:', courseId);
      
      const modules = await getCourseModules(courseId);
      console.log('Módulos retornados:', modules);
      
      setTestResult(`Módulos encontrados: ${modules.length}\n${modules.map(m => `- ${m.title} (ID: ${m.id})`).join('\n')}`);
      
    } catch (err) {
      setTestResult(`Erro ao buscar módulos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  };

  const testDirectModulesAPI = async () => {
    try {
      setLoading(true);
      const modulesTableId = parseInt(import.meta.env.VITE_BASEROW_COURSE_MODULES_TABLE_ID || '0');
      
      console.log('Testando acesso direto à tabela de módulos, ID:', modulesTableId);
      
      const response = await getBaserowRows(modulesTableId);
      console.log('Resposta completa da API de módulos:', response);
      
      setDirectTestResult(`Tabela de módulos acessível.\nTotal de registros: ${response.results.length}\n\nRegistros encontrados:\n${response.results.map((item: any) => `- ID: ${item.id}, Título: ${item.title || 'N/A'}, Course ID: ${item.course_id || 'N/A'}`).join('\n')}`);
      
    } catch (err) {
      setDirectTestResult(`Erro ao acessar tabela de módulos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  };

  const testDirectLessonsAPI = async () => {
    try {
      setLoading(true);
      const lessonsTableId = parseInt(import.meta.env.VITE_BASEROW_COURSE_LESSONS_TABLE_ID || '0');
      
      console.log('Testando acesso direto à tabela de aulas, ID:', lessonsTableId);
      
      const response = await getBaserowRows(lessonsTableId);
      console.log('Resposta completa da API de aulas:', response);
      
      setDirectTestResult(`Tabela de aulas acessível.\nTotal de registros: ${response.results.length}\n\nRegistros encontrados:\n${response.results.map((item: any) => `- ID: ${item.id}, Título: ${item.title || 'N/A'}, Module ID: ${item.module_id || 'N/A'}`).join('\n')}`);
      
    } catch (err) {
      setDirectTestResult(`Erro ao acessar tabela de aulas: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  };

  const testCreateLesson = async () => {
    if (courses.length === 0) {
      setTestResult('Nenhum curso disponível para testar');
      return;
    }

    try {
      setLoading(true);
      const courseId = courses[0].id;
      
      // Primeiro, buscar ou criar um módulo
      let modules = await getCourseModules(courseId);
      let moduleId;
      
      if (modules.length === 0) {
        // Criar um módulo se não existir
        const newModule = await createModule({
          course_id: courseId,
          title: 'Módulo de Teste para Aula',
          description: 'Módulo criado automaticamente para teste de aula',
          order: 1,
        });
        moduleId = newModule.id;
      } else {
        moduleId = modules[0].id;
      }
      
      console.log('Criando aula para módulo ID:', moduleId);
      
      const newLesson = await createLesson({
        module_id: moduleId,
        title: 'Aula de Teste',
        content_type: 'text',
        video_url: '',
        pdf_file: '',
        text_content: 'Esta é uma aula de teste criada via API de teste.',
        quiz_data: '',
        order: 1,
        is_free_preview: false,
      });

      setTestResult(`Aula criada com sucesso! ID: ${newLesson.id}, Módulo: ${moduleId}`);
      
    } catch (err) {
      setTestResult(`Erro ao criar aula: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Teste da API de Cursos</h1>
      
      <div className="mb-6 space-x-4">
        <button
          onClick={loadCourses}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Carregando...' : 'Carregar Cursos'}
        </button>
        
        <button
          onClick={testDirectAPI}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar API Direta'}
        </button>
        
        <button
          onClick={testDirectModulesAPI}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar Módulos Direto'}
        </button>
        
        <button
          onClick={testDirectLessonsAPI}
          disabled={loading}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar Aulas Direto'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {testResult && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          {testResult}
        </div>
      )}

      {directTestResult && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 whitespace-pre-line">
          {directTestResult}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Cursos Disponíveis ({courses.length})</h2>
        {courses.map((course) => (
          <div key={course.id} className="border p-3 rounded mb-2">
            <strong>{course.title}</strong> - ID: {course.id}
          </div>
        ))}
      </div>

      <div className="mb-6 space-x-4">
        <button
          onClick={testCreateModule}
          disabled={loading || courses.length === 0}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar Criação de Módulo'}
        </button>
        
        <button
          onClick={testGetCourseModules}
          disabled={loading || courses.length === 0}
          className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar Listagem de Módulos'}
        </button>
        
        <button
          onClick={testCreateLesson}
          disabled={loading || courses.length === 0}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar Criação de Aula'}
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Informações de Debug:</h3>
        <p>Variáveis de ambiente carregadas:</p>
        <ul className="list-disc list-inside ml-4">
          <li>COURSES_TABLE_ID: {import.meta.env.VITE_BASEROW_COURSES_TABLE_ID}</li>
          <li>MODULES_TABLE_ID: {import.meta.env.VITE_BASEROW_COURSE_MODULES_TABLE_ID}</li>
          <li>LESSONS_TABLE_ID: {import.meta.env.VITE_BASEROW_COURSE_LESSONS_TABLE_ID}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestCourseAPI; 