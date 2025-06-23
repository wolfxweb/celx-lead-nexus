import {
  getBaserowRows,
  createBaserowRow,
  updateBaserowRow,
  deleteBaserowRow,
  getBaserowFields,
  type BaserowField
} from '@/lib/baserow';
import { ALL_TABLES } from '@/config/baserowTables';

// Acessa os campos através do objeto exportado que já fez o merge
const { COURSE_LESSONS: lessonFields, COURSE_MODULES: moduleFields, ...restFields } = ALL_TABLES;
const COURSES_TABLE_ID = ALL_TABLES.COURSES.id;
const MODULES_TABLE_ID = ALL_TABLES.COURSE_MODULES.id;
const LESSONS_TABLE_ID = ALL_TABLES.COURSE_LESSONS.id;

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
// A API Baserow retorna os dados com os nomes dos campos como chaves
const mapToCourse = (data: any): Course => ({
  id: data.id,
  title: data[ALL_TABLES.COURSES.fields.title] || '',
  description: data[ALL_TABLES.COURSES.fields.description] || '',
  cover_image: data[ALL_TABLES.COURSES.fields.cover_image] || '',
  instructor_id: data[ALL_TABLES.COURSES.fields.instructor_id],
  product_id: data[ALL_TABLES.COURSES.fields.product_id],
  is_published: Boolean(data[ALL_TABLES.COURSES.fields.is_published]),
  created_at: data[ALL_TABLES.COURSES.fields.created_at] || '',
  updated_at: data[ALL_TABLES.COURSES.fields.updated_at] || '',
});

// Mapeia a resposta da API para a interface CourseModule
const mapToModule = (data: any): CourseModule => ({
  id: data.id,
  course_id: data[moduleFields.fields.course_id],
  title: data[moduleFields.fields.title] || '',
  description: data[moduleFields.fields.description] || '',
  order: Number(data[moduleFields.fields.order]) || 1,
  created_at: data[moduleFields.fields.created_at] || '',
  updated_at: data[moduleFields.fields.updated_at] || '',
});

// Mapeia a resposta da API para a interface CourseLesson
const mapToLesson = (data: any): CourseLesson => ({
  id: data.id,
  module_id: data[lessonFields.fields.module_id],
  title: data[lessonFields.fields.title] || '',
  content_type: data[lessonFields.fields.content_type] || 'video',
  video_url: data[lessonFields.fields.video_url] || '',
  pdf_file: data[lessonFields.fields.pdf_file] || '',
  text_content: data[lessonFields.fields.text_content] || '',
  quiz_data: data[lessonFields.fields.quiz_data] || '',
  order: Number(data[lessonFields.fields.order]) || 1,
  is_free_preview: Boolean(data[lessonFields.fields.is_free_preview]),
  created_at: data[lessonFields.fields.created_at] || '',
  updated_at: data[lessonFields.fields.updated_at] || '',
});

// Mapeia a resposta da API para a interface LessonDoubt
const mapToLessonDoubt = (data: any): LessonDoubt => ({
  id: data.id,
  lesson_id: data[lessonFields.fields.lesson_id],
  user_id: data[lessonFields.fields.user_id],
  doubt_text: data[lessonFields.fields.doubt_text] || '',
  answer_text: data[lessonFields.fields.answer_text] || '',
  answered_by_id: data[lessonFields.fields.answered_by_id],
  is_resolved: Boolean(data[lessonFields.fields.is_resolved]),
  created_at: data[lessonFields.fields.created_at] || '',
  answered_at: data[lessonFields.fields.answered_at] || '',
});

/**
 * Busca todos os cursos do Baserow.
 */
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    console.log('🔍 Buscando todos os cursos...');
    console.log('🔍 Usando tabela ID:', COURSES_TABLE_ID);
    console.log('🔍 Campos disponíveis:', ALL_TABLES.COURSES.fields);
    
    const response = await getBaserowRows<any>(COURSES_TABLE_ID);
    console.log('📊 Resposta completa da API de cursos:', response);
    console.log('📊 Total de registros:', response.results.length);
    
    // Log de todos os registros para debug
    response.results.forEach((item: any, index: number) => {
      console.log(`📋 Curso ${index}:`, {
        id: item.id,
        title: item[ALL_TABLES.COURSES.fields.title],
        description: item[ALL_TABLES.COURSES.fields.description],
        cover_image: item[ALL_TABLES.COURSES.fields.cover_image],
        instructor_id: item[ALL_TABLES.COURSES.fields.instructor_id],
        product_id: item[ALL_TABLES.COURSES.fields.product_id],
        is_published: item[ALL_TABLES.COURSES.fields.is_published]
      });
    });
    
    console.log('🔄 Aplicando mapToCourse...');
    const result = response.results.map(mapToCourse);
    console.log('✅ Cursos mapeados:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Erro detalhado ao buscar todos os cursos:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    throw new Error('Não foi possível buscar os cursos.');
  }
};

/**
 * Busca um curso específico por ID.
 */
export const getCourse = async (id: number): Promise<Course> => {
  try {
    const response = await getBaserowRows<any>(COURSES_TABLE_ID);
    const course = response.results.find((item: any) => item.id === id);
    if (!course) {
      throw new Error('Curso não encontrado.');
    }
    return mapToCourse(course);
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    throw new Error('Não foi possível buscar o curso.');
  }
};

/**
 * Busca todos os módulos de um curso.
 */
export const getCourseModules = async (courseId: number): Promise<CourseModule[]> => {
  try {
    console.log('🔍 Buscando módulos para curso ID:', courseId);
    console.log('🔍 Usando tabela ID:', MODULES_TABLE_ID);
    console.log('🔍 Campo course_id:', moduleFields.fields.course_id);
    
    console.log('📡 Fazendo requisição para getBaserowRows...');
    const response = await getBaserowRows<any>(MODULES_TABLE_ID);
    console.log('📊 Resposta completa da API:', response);
    console.log('📊 Total de registros:', response.results.length);
    
    // Log de todos os registros para debug
    response.results.forEach((item: any, index: number) => {
      console.log(`📋 Registro ${index}:`, {
        id: item.id,
        course_id: item[moduleFields.fields.course_id],
        course_id_type: typeof item[moduleFields.fields.course_id],
        title: item[moduleFields.fields.title],
        description: item[moduleFields.fields.description],
        order: item[moduleFields.fields.order]
      });
    });
    
    console.log('🔍 Iniciando filtro...');
    const modules = response.results
      .filter((item: any) => {
        const itemCourseId = item[moduleFields.fields.course_id];
        // Converter para número para garantir comparação correta
        const itemCourseIdNum = parseInt(itemCourseId);
        console.log(`🔍 Comparando: item.course_id (${itemCourseId}, tipo: ${typeof itemCourseId}) === courseId (${courseId}, tipo: ${typeof courseId})`);
        console.log(`🔍 Após conversão: itemCourseIdNum (${itemCourseIdNum}) === courseId (${courseId})`);
        return itemCourseIdNum === courseId;
      })
      .sort((a: any, b: any) => Number(a[moduleFields.fields.order]) - Number(b[moduleFields.fields.order]));
    
    console.log('✅ Módulos filtrados:', modules.length);
    console.log('🔄 Aplicando mapToModule...');
    const result = modules.map(mapToModule);
    console.log('✅ Resultado final:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Erro detalhado ao buscar módulos do curso:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    throw new Error('Não foi possível buscar os módulos.');
  }
};

/**
 * Busca todas as aulas de um módulo.
 */
export const getModuleLessons = async (moduleId: number): Promise<CourseLesson[]> => {
  try {
    console.log('🔍 Buscando aulas para módulo ID:', moduleId);
    console.log('🔍 Usando tabela ID:', LESSONS_TABLE_ID);
    console.log('🔍 Campo module_id:', lessonFields.fields.module_id);
    
    const response = await getBaserowRows<any>(LESSONS_TABLE_ID);
    console.log('📊 Resposta completa da API de aulas:', response);
    console.log('📊 Total de registros:', response.results.length);
    
    // Log de todos os registros para debug
    response.results.forEach((item: any, index: number) => {
      console.log(`📋 Aula ${index}:`, {
        id: item.id,
        module_id: item[lessonFields.fields.module_id],
        module_id_type: typeof item[lessonFields.fields.module_id],
        title: item[lessonFields.fields.title],
        content_type: item[lessonFields.fields.content_type],
        order: item[lessonFields.fields.order]
      });
    });
    
    const lessons = response.results
      .filter((item: any) => {
        const itemModuleId = item[lessonFields.fields.module_id];
        // Converter para número para garantir comparação correta
        const itemModuleIdNum = parseInt(itemModuleId);
        console.log(`🔍 Comparando: item.module_id (${itemModuleId}, tipo: ${typeof itemModuleId}) === moduleId (${moduleId}, tipo: ${typeof moduleId})`);
        console.log(`🔍 Após conversão: itemModuleIdNum (${itemModuleIdNum}) === moduleId (${moduleId})`);
        return itemModuleIdNum === moduleId;
      })
      .sort((a: any, b: any) => Number(a[lessonFields.fields.order]) - Number(b[lessonFields.fields.order]));
    
    console.log('✅ Aulas filtradas:', lessons.length);
    console.log('🔄 Aplicando mapToLesson...');
    const result = lessons.map(mapToLesson);
    console.log('✅ Resultado final:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Erro detalhado ao buscar aulas do módulo:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    throw new Error('Não foi possível buscar as aulas.');
  }
};

/**
 * Cria um novo curso no Baserow.
 */
export const createCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> => {
  try {
    // Mapear os dados para os nomes dos campos do Baserow
    const baserowData = {
      [ALL_TABLES.COURSES.fields.title]: courseData.title,
      [ALL_TABLES.COURSES.fields.description]: courseData.description,
      [ALL_TABLES.COURSES.fields.cover_image]: courseData.cover_image,
      [ALL_TABLES.COURSES.fields.instructor_id]: courseData.instructor_id,
      [ALL_TABLES.COURSES.fields.product_id]: courseData.product_id,
      [ALL_TABLES.COURSES.fields.is_published]: courseData.is_published,
    };
    
    console.log('Enviando dados do curso para Baserow:', baserowData);
    const response = await createBaserowRow<any>(COURSES_TABLE_ID, baserowData);
    console.log('Resposta do Baserow:', response);
    return mapToCourse(response);
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    throw new Error('Não foi possível criar o curso.');
  }
};

/**
 * Cria um novo módulo no Baserow.
 */
export const createModule = async (moduleData: Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>): Promise<CourseModule> => {
  try {
    // Mapear os dados para os nomes dos campos do Baserow
    const baserowData = {
      [moduleFields.fields.course_id]: moduleData.course_id,
      [moduleFields.fields.title]: moduleData.title,
      [moduleFields.fields.description]: moduleData.description,
      [moduleFields.fields.order]: moduleData.order,
    };
    
    console.log('Enviando dados do módulo para Baserow:', baserowData);
    const response = await createBaserowRow<any>(MODULES_TABLE_ID, baserowData);
    console.log('Resposta do Baserow:', response);
    return mapToModule(response);
  } catch (error) {
    console.error('Erro ao criar módulo:', error);
    throw new Error('Não foi possível criar o módulo.');
  }
};

/**
 * Cria uma nova aula no Baserow.
 */
export const createLesson = async (lessonData: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>): Promise<CourseLesson> => {
  try {
    console.log('🔍 Iniciando criação de aula...');
    console.log('🔍 Dados recebidos:', lessonData);
    console.log('🔍 LESSONS_TABLE_ID:', LESSONS_TABLE_ID);
    console.log('🔍 Campos disponíveis:', lessonFields.fields);
    
    // Mapear os dados para os nomes dos campos do Baserow
    // Enviar apenas campos obrigatórios e campos com valor
    const baserowData: Record<string, any> = {
      [lessonFields.fields.module_id]: lessonData.module_id,
      [lessonFields.fields.title]: lessonData.title,
      [lessonFields.fields.content_type]: lessonData.content_type,
      [lessonFields.fields.order]: lessonData.order,
      // Garante que o valor enviado seja um booleano
      [lessonFields.fields.is_free_preview]: Boolean(lessonData.is_free_preview),
    };
    
    // Adicionar campos opcionais apenas se tiverem valor
    if (lessonData.video_url && lessonData.video_url.trim() !== '') {
      baserowData[lessonFields.fields.video_url] = lessonData.video_url;
      console.log('✅ Adicionando video_url:', lessonData.video_url);
    } else {
      console.log('❌ video_url vazio ou não fornecido');
    }
    
    if (lessonData.pdf_file && lessonData.pdf_file.trim() !== '') {
      baserowData[lessonFields.fields.pdf_file] = lessonData.pdf_file;
      console.log('✅ Adicionando pdf_file:', lessonData.pdf_file);
    } else {
      console.log('❌ pdf_file vazio ou não fornecido');
    }
    
    if (lessonData.text_content && lessonData.text_content.trim() !== '') {
      baserowData[lessonFields.fields.text_content] = lessonData.text_content;
      console.log('✅ Adicionando text_content:', lessonData.text_content);
    } else {
      console.log('❌ text_content vazio ou não fornecido');
    }
    
    if (lessonData.quiz_data && lessonData.quiz_data.trim() !== '') {
      baserowData[lessonFields.fields.quiz_data] = lessonData.quiz_data;
      console.log('✅ Adicionando quiz_data:', lessonData.quiz_data);
    } else {
      console.log('❌ quiz_data vazio ou não fornecido');
    }
    
    console.log('📤 Enviando dados da aula para Baserow:', baserowData);
    console.log('📤 JSON stringify:', JSON.stringify(baserowData, null, 2));
    
    const response = await createBaserowRow<any>(LESSONS_TABLE_ID, baserowData);
    console.log('✅ Resposta do Baserow:', response);
    console.log('✅ Resposta JSON:', JSON.stringify(response, null, 2));
    
    const mappedResponse = mapToLesson(response);
    console.log('✅ Aula mapeada:', mappedResponse);
    
    return mappedResponse;
  } catch (error) {
    console.error('❌ Erro detalhado ao criar aula:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    throw new Error('Não foi possível criar a aula.');
  }
};

/**
 * Cria uma nova dúvida para uma aula.
 */
export const createLessonDoubt = async (doubtData: Omit<LessonDoubt, 'id' | 'created_at' | 'answered_at' | 'answer_text' | 'answered_by_id' | 'is_resolved'>): Promise<LessonDoubt> => {
  try {
    const baserowData = {
      [lessonFields.fields.lesson_id]: doubtData.lesson_id,
      [lessonFields.fields.user_id]: doubtData.user_id,
      [lessonFields.fields.doubt_text]: doubtData.doubt_text,
      [lessonFields.fields.is_resolved]: false,
    };
    const response = await createBaserowRow<any>(LESSONS_TABLE_ID, baserowData);
    return mapToLessonDoubt(response);
  } catch (error) {
    console.error('Erro ao criar dúvida:', error);
    throw new Error('Não foi possível criar a dúvida.');
  }
};

/**
 * Atualiza um curso existente no Baserow.
 */
export const updateCourse = async (id: number, courseData: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>): Promise<Course> => {
  try {
    // Mapear os dados para os nomes dos campos do Baserow
    const baserowData: Record<string, any> = {};
    
    if (courseData.title !== undefined) {
      baserowData[ALL_TABLES.COURSES.fields.title] = courseData.title;
    }
    if (courseData.description !== undefined) {
      baserowData[ALL_TABLES.COURSES.fields.description] = courseData.description;
    }
    if (courseData.cover_image !== undefined) {
      baserowData[ALL_TABLES.COURSES.fields.cover_image] = courseData.cover_image;
    }
    if (courseData.instructor_id !== undefined) {
      baserowData[ALL_TABLES.COURSES.fields.instructor_id] = courseData.instructor_id;
    }
    if (courseData.product_id !== undefined) {
      baserowData[ALL_TABLES.COURSES.fields.product_id] = courseData.product_id;
    }
    if (courseData.is_published !== undefined) {
      baserowData[ALL_TABLES.COURSES.fields.is_published] = courseData.is_published;
    }
    
    console.log('Atualizando curso no Baserow:', baserowData);
    const response = await updateBaserowRow<any>(COURSES_TABLE_ID, id, baserowData);
    return mapToCourse(response);
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    throw new Error('Não foi possível atualizar o curso.');
  }
};

/**
 * Atualiza um módulo existente no Baserow.
 */
export const updateModule = async (id: number, moduleData: Partial<Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>>): Promise<CourseModule> => {
  try {
    // Mapear os dados para os nomes dos campos do Baserow
    const baserowData: Record<string, any> = {};
    
    if (moduleData.course_id !== undefined) {
      baserowData[moduleFields.fields.course_id] = moduleData.course_id;
    }
    if (moduleData.title !== undefined) {
      baserowData[moduleFields.fields.title] = moduleData.title;
    }
    if (moduleData.description !== undefined) {
      baserowData[moduleFields.fields.description] = moduleData.description;
    }
    if (moduleData.order !== undefined) {
      baserowData[moduleFields.fields.order] = moduleData.order;
    }
    
    console.log('Atualizando módulo no Baserow:', baserowData);
    const response = await updateBaserowRow<any>(MODULES_TABLE_ID, id, baserowData);
    return mapToModule(response);
  } catch (error) {
    console.error('Erro ao atualizar módulo:', error);
    throw new Error('Não foi possível atualizar o módulo.');
  }
};

/**
 * Atualiza uma aula existente no Baserow.
 */
export const updateLesson = async (id: number, lessonData: Partial<Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>>): Promise<CourseLesson> => {
  try {
    // Mapear os dados para os nomes dos campos do Baserow
    const baserowData: Record<string, any> = {};
    
    // Campos obrigatórios
    if (lessonData.module_id !== undefined) {
      baserowData[lessonFields.fields.module_id] = lessonData.module_id;
    }
    if (lessonData.title !== undefined) {
      baserowData[lessonFields.fields.title] = lessonData.title;
    }
    if (lessonData.content_type !== undefined) {
      baserowData[lessonFields.fields.content_type] = lessonData.content_type;
    }
    if (lessonData.order !== undefined) {
      baserowData[lessonFields.fields.order] = lessonData.order;
    }
    if (lessonData.is_free_preview !== undefined) {
      baserowData[lessonFields.fields.is_free_preview] = lessonData.is_free_preview;
    }
    
    // Campos opcionais - apenas se tiverem valor
    if (lessonData.video_url !== undefined && lessonData.video_url.trim() !== '') {
      baserowData[lessonFields.fields.video_url] = lessonData.video_url;
    }
    if (lessonData.pdf_file !== undefined && lessonData.pdf_file.trim() !== '') {
      baserowData[lessonFields.fields.pdf_file] = lessonData.pdf_file;
    }
    if (lessonData.text_content !== undefined && lessonData.text_content.trim() !== '') {
      baserowData[lessonFields.fields.text_content] = lessonData.text_content;
    }
    if (lessonData.quiz_data !== undefined && lessonData.quiz_data.trim() !== '') {
      baserowData[lessonFields.fields.quiz_data] = lessonData.quiz_data;
    }
    
    console.log('Atualizando aula no Baserow:', baserowData);
    const response = await updateBaserowRow<any>(LESSONS_TABLE_ID, id, baserowData);
    return mapToLesson(response);
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    throw new Error('Não foi possível atualizar a aula.');
  }
};

/**
 * Deleta um curso do Baserow.
 */
export const deleteCourse = async (id: number): Promise<void> => {
  try {
    await deleteBaserowRow(COURSES_TABLE_ID, id);
  } catch (error) {
    console.error('Erro ao deletar curso:', error);
    throw new Error('Não foi possível deletar o curso.');
  }
};

/**
 * Deleta um módulo do Baserow.
 */
export const deleteModule = async (id: number): Promise<void> => {
  try {
    await deleteBaserowRow(MODULES_TABLE_ID, id);
  } catch (error) {
    console.error('Erro ao deletar módulo:', error);
    throw new Error('Não foi possível deletar o módulo.');
  }
};

/**
 * Deleta uma aula do Baserow.
 */
export const deleteLesson = async (id: number): Promise<void> => {
  try {
    await deleteBaserowRow(LESSONS_TABLE_ID, id);
  } catch (error) {
    console.error('Erro ao deletar aula:', error);
    throw new Error('Não foi possível deletar a aula.');
  }
};

/**
 * DEBUG: Busca os campos de uma tabela específica.
 */
export const debugGetTableFields = async (tableId: number): Promise<any[]> => {
  try {
    console.log(`[DEBUG] Buscando campos para a tabela ID: ${tableId}`);
    const fields = await getBaserowFields(tableId);
    console.log(`[DEBUG] Campos encontrados para a tabela ${tableId}:`, fields);
    return fields;
  } catch (error) {
    console.error(`[DEBUG] Erro ao buscar campos para a tabela ${tableId}:`, error);
    throw error;
  }
};