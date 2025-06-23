import {
  getBaserowRows,
  createBaserowRow,
  updateBaserowRow,
  deleteBaserowRow,
  getBaserowFields,
} from '@/lib/baserow';
import { ALL_TABLES } from '@/config/baserowTables';

// Acessa os campos e IDs diretamente do objeto importado
const COURSES_TABLE_ID = ALL_TABLES.COURSES.id;
const MODULES_TABLE_ID = ALL_TABLES.COURSE_MODULES.id;
const LESSONS_TABLE_ID = ALL_TABLES.COURSE_LESSONS.id;
const DOUBTS_TABLE_ID = ALL_TABLES.LESSON_DOUBTS.id;

// Definindo a interface para um curso, baseado nos campos da tabela
export interface Course {
  id: number;
  title: string;
  description: string;
  cover_image: string; // Supondo que seja uma URL ou um nome de arquivo
  instructor_id: string; // ou number, dependendo da sua referência
  product_id: number; // Link para a tabela de produtos
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Interface para módulos do curso
export interface CourseModule {
  id: number;
  course_id: number;
  title: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Interface para aulas do curso
export interface CourseLesson {
  id: number;
  module_id: number;
  title: string;
  content_type: 'video' | 'pdf' | 'text' | 'quiz';
  video_url: string;
  pdf_file: string;
  text_content: string;
  quiz_data: string;
  order: number;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
}

// Interface para dúvidas de aula
export interface LessonDoubt {
  id: number;
  lesson_id: number;
  user_id: number;
  doubt_text: string;
  answer_text?: string;
  answered_by_id?: number;
  is_resolved: boolean;
  created_at: string;
  answered_at?: string;
}

// Mapeia a resposta da API para a interface Course
const mapToCourse = (data: any): Course => ({
  id: data.id,
  title: data[ALL_TABLES.COURSES.fields.title] || '',
  description: data[ALL_TABLES.COURSES.fields.description] || '',
  cover_image: data[ALL_TABLES.COURSES.fields.cover_image] || '',
  instructor_id: data[ALL_TABLES.COURSES.fields.instructor_id],
  product_id: data[ALL_TABLES.COURSES.fields.product_id],
  is_published: Boolean(data[ALL_TABLES.COURSES.fields.is_published]),
  created_at: data.created_at || '',
  updated_at: data.updated_at || '',
});

// Mapeia a resposta da API para a interface CourseModule
const mapToModule = (data: any): CourseModule => ({
  id: data.id,
  course_id: data[ALL_TABLES.COURSE_MODULES.fields.course_id],
  title: data[ALL_TABLES.COURSE_MODULES.fields.title] || '',
  description: data[ALL_TABLES.COURSE_MODULES.fields.description] || '',
  order: Number(data[ALL_TABLES.COURSE_MODULES.fields.order]) || 1,
  created_at: data.created_at || '',
  updated_at: data.updated_at || '',
});

// Mapeia a resposta da API para a interface CourseLesson
const mapToLesson = (data: any): CourseLesson => ({
  id: data.id,
  module_id: data[ALL_TABLES.COURSE_LESSONS.fields.module_id],
  title: data[ALL_TABLES.COURSE_LESSONS.fields.title] || '',
  content_type: data[ALL_TABLES.COURSE_LESSONS.fields.content_type] || 'video',
  video_url: data[ALL_TABLES.COURSE_LESSONS.fields.video_url] || '',
  pdf_file: data[ALL_TABLES.COURSE_LESSONS.fields.pdf_file] || '',
  text_content: data[ALL_TABLES.COURSE_LESSONS.fields.text_content] || '',
  quiz_data: data[ALL_TABLES.COURSE_LESSONS.fields.quiz_data] || '',
  order: Number(data[ALL_TABLES.COURSE_LESSONS.fields.order]) || 1,
  is_free_preview: Boolean(data[ALL_TABLES.COURSE_LESSONS.fields.is_free_preview]),
  created_at: data.created_at || '',
  updated_at: data.updated_at || '',
});

// Mapeia a resposta da API para a interface LessonDoubt
const mapToLessonDoubt = (data: any): LessonDoubt => ({
  id: data.id,
  lesson_id: data[ALL_TABLES.LESSON_DOUBTS.fields.lesson_id],
  user_id: data[ALL_TABLES.LESSON_DOUBTS.fields.user_id],
  doubt_text: data[ALL_TABLES.LESSON_DOUBTS.fields.doubt_text] || '',
  answer_text: data[ALL_TABLES.LESSON_DOUBTS.fields.answer_text] || '',
  answered_by_id: data[ALL_TABLES.LESSON_DOUBTS.fields.answered_by_id],
  is_resolved: Boolean(data[ALL_TABLES.LESSON_DOUBTS.fields.is_resolved]),
  created_at: data.created_at || '',
  answered_at: data.answered_at || '',
});

/**
 * Busca todos os cursos do Baserow.
 */
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const response = await getBaserowRows<any>(COURSES_TABLE_ID);
    return response.results.map(mapToCourse);
  } catch (error) {
    console.error('Erro ao buscar todos os cursos:', error);
    throw new Error('Não foi possível buscar os cursos.');
  }
};

/**
 * Busca um curso específico por ID.
 */
export const getCourse = async (id: number): Promise<Course> => {
  try {
    const response = await getBaserowRows<any>(COURSES_TABLE_ID, { filter: { id: id } });
    if (response.results.length === 0) {
      throw new Error('Curso não encontrado.');
    }
    return mapToCourse(response.results[0]);
  } catch (error) {
    console.error(`Erro ao buscar curso com ID ${id}:`, error);
    throw new Error('Não foi possível buscar o curso.');
  }
};

/**
 * Busca todos os módulos de um curso.
 */
export const getCourseModules = async (courseId: number): Promise<CourseModule[]> => {
  try {
    const response = await getBaserowRows<any>(MODULES_TABLE_ID, {
      filter: { [ALL_TABLES.COURSE_MODULES.fields.course_id]: courseId }
    });
    
    return response.results.map(mapToModule);
  } catch (error) {
    console.error(`Erro ao buscar módulos para o curso ID ${courseId}:`, error);
    throw new Error('Não foi possível buscar os módulos.');
  }
};

/**
 * Busca todas as aulas de um módulo.
 */
export const getModuleLessons = async (moduleId: number): Promise<CourseLesson[]> => {
  try {
    const response = await getBaserowRows<any>(LESSONS_TABLE_ID, {
      filter: { [ALL_TABLES.COURSE_LESSONS.fields.module_id]: moduleId }
    });
    
    return response.results.map(mapToLesson);
  } catch (error) {
    console.error(`Erro ao buscar aulas para o módulo ID ${moduleId}:`, error);
    throw new Error('Não foi possível buscar as aulas.');
  }
};

const buildPayload = (data: Record<string, any>, fieldMapping: Record<string, string>) => {
  const payload: Record<string, any> = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key) && fieldMapping[key]) {
      const value = data[key];
      const baserowField = fieldMapping[key];

      if (key === 'is_free_preview' || key === 'is_published' || key === 'is_resolved') {
        payload[baserowField] = Boolean(value);
      } else if (value !== undefined && value !== null && value !== '') {
        payload[baserowField] = value;
      }
    }
  }
   if (fieldMapping['is_free_preview'] && payload[fieldMapping['is_free_preview']] === undefined) {
    payload[fieldMapping['is_free_preview']] = false;
  }
  return payload;
}

/**
 * Cria um novo curso.
 */
export const createCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> => {
  try {
    const payload = buildPayload(courseData, ALL_TABLES.COURSES.fields);
    const newCourse = await createBaserowRow<any>(COURSES_TABLE_ID, payload);
    return mapToCourse(newCourse);
  } catch (error: any) {
    console.error('Erro ao criar curso:', error);
    if (error.response) console.error('Detalhes:', error.response.data);
    throw new Error('Não foi possível criar o curso.');
  }
};

/**
 * Cria um novo módulo para um curso.
 */
export const createModule = async (moduleData: Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>): Promise<CourseModule> => {
  try {
    const payload = buildPayload(moduleData, ALL_TABLES.COURSE_MODULES.fields);
    const newModule = await createBaserowRow<any>(MODULES_TABLE_ID, payload);
    return mapToModule(newModule);
  } catch (error: any) {
    console.error('Erro ao criar módulo:', error);
    if (error.response) console.error('Detalhes:', error.response.data);
    throw new Error('Não foi possível criar o módulo.');
  }
};

/**
 * Cria uma nova aula para um módulo.
 */
export const createLesson = async (lessonData: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>): Promise<CourseLesson> => {
  try {
    const payload = buildPayload(lessonData, ALL_TABLES.COURSE_LESSONS.fields);
    console.log('Enviando payload para criar aula:', payload);
    const newLesson = await createBaserowRow<any>(LESSONS_TABLE_ID, payload);
    return mapToLesson(newLesson);
  } catch (error: any) {
    console.error('Erro ao criar aula:', error);
    if (error.response) console.error('Detalhes do erro:', error.response.data);
    throw new Error('Não foi possível criar a aula.');
  }
};

/**
 * Cria uma nova dúvida para uma aula.
 */
export const createLessonDoubt = async (doubtData: Omit<LessonDoubt, 'id' | 'created_at' | 'answered_at' | 'answer_text' | 'answered_by_id'>): Promise<LessonDoubt> => {
  try {
    const payload = buildPayload(doubtData, ALL_TABLES.LESSON_DOUBTS.fields);
    const newDoubt = await createBaserowRow<any>(DOUBTS_TABLE_ID, payload);
    return mapToLessonDoubt(newDoubt);
  } catch (error: any) {
    console.error('Erro ao criar dúvida:', error);
    if (error.response) console.error('Detalhes:', error.response.data);
    throw new Error('Não foi possível criar a dúvida.');
  }
};

/**
 * Atualiza os dados de um curso existente.
 */
export const updateCourse = async (id: number, courseData: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>): Promise<Course> => {
  try {
    const payload = buildPayload(courseData, ALL_TABLES.COURSES.fields);
    const updatedCourse = await updateBaserowRow<any>(COURSES_TABLE_ID, id, payload);
    return mapToCourse(updatedCourse);
  } catch (error: any) {
    console.error(`Erro ao atualizar curso ${id}:`, error);
    if (error.response) console.error('Detalhes:', error.response.data);
    throw new Error('Não foi possível atualizar o curso.');
  }
};

/**
 * Atualiza os dados de um módulo existente.
 */
export const updateModule = async (id: number, moduleData: Partial<Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>>): Promise<CourseModule> => {
  try {
    const payload = buildPayload(moduleData, ALL_TABLES.COURSE_MODULES.fields);
    const updatedModule = await updateBaserowRow<any>(MODULES_TABLE_ID, id, payload);
    return mapToModule(updatedModule);
  } catch (error: any) {
    console.error(`Erro ao atualizar módulo ${id}:`, error);
    if (error.response) console.error('Detalhes:', error.response.data);
    throw new Error('Não foi possível atualizar o módulo.');
  }
};

/**
 * Atualiza os dados de uma aula existente.
 */
export const updateLesson = async (id: number, lessonData: Partial<Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>>): Promise<CourseLesson> => {
  try {
    const payload = buildPayload(lessonData, ALL_TABLES.COURSE_LESSONS.fields);
    console.log(`Enviando payload para atualizar aula ${id}:`, payload);
    const updatedLesson = await updateBaserowRow<any>(LESSONS_TABLE_ID, id, payload);
    return mapToLesson(updatedLesson);
  } catch (error: any) {
    console.error(`Erro ao atualizar aula ${id}:`, error);
    if (error.response) console.error('Detalhes:', error.response.data);
    throw new Error('Não foi possível atualizar a aula.');
  }
};

/**
 * Exclui um curso.
 */
export const deleteCourse = async (id: number): Promise<void> => {
  try {
    await deleteBaserowRow(COURSES_TABLE_ID, id);
  } catch (error) {
    console.error(`Erro ao excluir curso ${id}:`, error);
    throw new Error('Não foi possível excluir o curso.');
  }
};

/**
 * Exclui um módulo.
 */
export const deleteModule = async (id: number): Promise<void> => {
  try {
    await deleteBaserowRow(MODULES_TABLE_ID, id);
  } catch (error) {
    console.error(`Erro ao excluir módulo ${id}:`, error);
    throw new Error('Não foi possível excluir o módulo.');
  }
};

/**
 * Exclui uma aula.
 */
export const deleteLesson = async (id: number): Promise<void> => {
  try {
    await deleteBaserowRow(LESSONS_TABLE_ID, id);
  } catch (error) {
    console.error(`Erro ao excluir aula ${id}:`, error);
    throw new Error('Não foi possível excluir a aula.');
  }
};

/**
 * Busca os campos de uma tabela para depuração.
 */
export const debugGetTableFields = async (tableId: number): Promise<any[]> => {
  try {
    console.log(`Buscando campos para a tabela ID: ${tableId}`);
    const fields = await getBaserowFields(tableId);
    console.log(`Campos encontrados para a tabela ${tableId}:`, fields);
    return fields;
  } catch (error) {
    console.error(`Erro ao buscar campos para a tabela ${tableId}:`, error);
    throw error;
  }
};

/**
 * Função de teste para debug dos módulos
 */
export const debugModules = async (): Promise<void> => {
  try {
    console.log('🧪 Iniciando teste de debug dos módulos...');
    console.log('🧪 MODULES_TABLE_ID:', MODULES_TABLE_ID);
    
    // Teste 1: Buscar todos os módulos
    console.log('🧪 Teste 1: Buscando todos os módulos...');
    const allModules = await getBaserowRows<any>(MODULES_TABLE_ID);
    console.log('🧪 Todos os módulos:', allModules);
    
    // Teste 2: Buscar campos da tabela
    console.log('🧪 Teste 2: Buscando campos da tabela...');
    const fields = await getBaserowFields(MODULES_TABLE_ID);
    console.log('🧪 Campos da tabela:', fields);
    
    // Teste 3: Tentar buscar com filtro específico
    console.log('🧪 Teste 3: Buscando com filtro...');
    const filteredModules = await getBaserowRows<any>(MODULES_TABLE_ID, {
      filter: { course_id: 1 }
    });
    console.log('🧪 Módulos filtrados por course_id=1:', filteredModules);
    
  } catch (error) {
    console.error('🧪 Erro no teste de debug:', error);
  }
};