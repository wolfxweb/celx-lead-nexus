import { getBaserowRows, createBaserowRow, updateBaserowRow, deleteBaserowRow } from '@/lib/baserow';
import { getTableId, ALL_TABLES, createFieldFilter } from '@/config/baserowTables';

// Acessa os campos através do objeto exportado que já fez o merge
const fields = ALL_TABLES.COURSES.fields;
const COURSES_TABLE_ID = getTableId('COURSES');
const MODULES_TABLE_ID = getTableId('COURSE_MODULES');
const LESSONS_TABLE_ID = getTableId('COURSE_LESSONS');

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

// Mapeia a resposta da API para a interface Course
// A API Baserow retorna os dados com os nomes dos campos como chaves
const mapToCourse = (data: any): Course => {
  console.log('🔄 mapToCourse - dados recebidos:', data);
  console.log('🔄 mapToCourse - campos disponíveis:', fields);
  
  const result = {
    id: data.id,
    title: data[fields.title],
    description: data[fields.description],
    cover_image: data[fields.cover_image],
    instructor_id: data[fields.instructor_id],
    product_id: data[fields.product_id],
    is_published: data[fields.is_published],
    created_at: data[fields.created_at],
    updated_at: data[fields.updated_at],
  };
  
  console.log('🔄 mapToCourse - resultado:', result);
  return result;
};

// Mapeia a resposta da API para a interface CourseModule
const mapToModule = (data: any): CourseModule => ({
  id: data.id,
  course_id: data[ALL_TABLES.COURSE_MODULES.fields.course_id],
  title: data[ALL_TABLES.COURSE_MODULES.fields.title],
  description: data[ALL_TABLES.COURSE_MODULES.fields.description],
  order: Number(data[ALL_TABLES.COURSE_MODULES.fields.order]),
  created_at: data[ALL_TABLES.COURSE_MODULES.fields.created_at],
  updated_at: data[ALL_TABLES.COURSE_MODULES.fields.updated_at],
});

// Mapeia a resposta da API para a interface CourseLesson
const mapToLesson = (data: any): CourseLesson => ({
  id: data.id,
  module_id: data[ALL_TABLES.COURSE_LESSONS.fields.module_id],
  title: data[ALL_TABLES.COURSE_LESSONS.fields.title],
  content_type: data[ALL_TABLES.COURSE_LESSONS.fields.content_type],
  video_url: data[ALL_TABLES.COURSE_LESSONS.fields.video_url],
  pdf_file: data[ALL_TABLES.COURSE_LESSONS.fields.pdf_file],
  text_content: data[ALL_TABLES.COURSE_LESSONS.fields.text_content],
  quiz_data: data[ALL_TABLES.COURSE_LESSONS.fields.quiz_data],
  order: Number(data[ALL_TABLES.COURSE_LESSONS.fields.order]),
  is_free_preview: data[ALL_TABLES.COURSE_LESSONS.fields.is_free_preview],
  created_at: data[ALL_TABLES.COURSE_LESSONS.fields.created_at],
  updated_at: data[ALL_TABLES.COURSE_LESSONS.fields.updated_at],
});

/**
 * Busca todos os cursos do Baserow.
 */
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    console.log('🔍 Buscando todos os cursos...');
    console.log('🔍 Usando tabela ID:', COURSES_TABLE_ID);
    console.log('🔍 Campos disponíveis:', fields);
    
    const response = await getBaserowRows<any>(COURSES_TABLE_ID);
    console.log('📊 Resposta completa da API de cursos:', response);
    console.log('📊 Total de registros:', response.results.length);
    
    // Log de todos os registros para debug
    response.results.forEach((item: any, index: number) => {
      console.log(`📋 Curso ${index}:`, {
        id: item.id,
        title: item[fields.title],
        description: item[fields.description],
        cover_image: item[fields.cover_image],
        instructor_id: item[fields.instructor_id],
        product_id: item[fields.product_id],
        is_published: item[fields.is_published]
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
    console.log('🔍 Campo course_id:', ALL_TABLES.COURSE_MODULES.fields.course_id);
    
    console.log('📡 Fazendo requisição para getBaserowRows...');
    const response = await getBaserowRows<any>(MODULES_TABLE_ID);
    console.log('📊 Resposta completa da API:', response);
    console.log('📊 Total de registros:', response.results.length);
    
    // Log de todos os registros para debug
    response.results.forEach((item: any, index: number) => {
      console.log(`📋 Registro ${index}:`, {
        id: item.id,
        course_id: item[ALL_TABLES.COURSE_MODULES.fields.course_id],
        course_id_type: typeof item[ALL_TABLES.COURSE_MODULES.fields.course_id],
        title: item[ALL_TABLES.COURSE_MODULES.fields.title],
        description: item[ALL_TABLES.COURSE_MODULES.fields.description],
        order: item[ALL_TABLES.COURSE_MODULES.fields.order]
      });
    });
    
    console.log('🔍 Iniciando filtro...');
    const modules = response.results
      .filter((item: any) => {
        const itemCourseId = item[ALL_TABLES.COURSE_MODULES.fields.course_id];
        // Converter para número para garantir comparação correta
        const itemCourseIdNum = parseInt(itemCourseId);
        console.log(`🔍 Comparando: item.course_id (${itemCourseId}, tipo: ${typeof itemCourseId}) === courseId (${courseId}, tipo: ${typeof courseId})`);
        console.log(`🔍 Após conversão: itemCourseIdNum (${itemCourseIdNum}) === courseId (${courseId})`);
        return itemCourseIdNum === courseId;
      })
      .sort((a: any, b: any) => Number(a[ALL_TABLES.COURSE_MODULES.fields.order]) - Number(b[ALL_TABLES.COURSE_MODULES.fields.order]));
    
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
    const response = await getBaserowRows<any>(LESSONS_TABLE_ID);
    const lessons = response.results
      .filter((item: any) => item[ALL_TABLES.COURSE_LESSONS.fields.module_id] === moduleId)
      .sort((a: any, b: any) => Number(a[ALL_TABLES.COURSE_LESSONS.fields.order]) - Number(b[ALL_TABLES.COURSE_LESSONS.fields.order]));
    return lessons.map(mapToLesson);
  } catch (error) {
    console.error('Erro ao buscar aulas do módulo:', error);
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
      [fields.title]: courseData.title,
      [fields.description]: courseData.description,
      [fields.cover_image]: courseData.cover_image,
      [fields.instructor_id]: courseData.instructor_id,
      [fields.product_id]: courseData.product_id,
      [fields.is_published]: courseData.is_published,
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
      [ALL_TABLES.COURSE_MODULES.fields.course_id]: moduleData.course_id,
      [ALL_TABLES.COURSE_MODULES.fields.title]: moduleData.title,
      [ALL_TABLES.COURSE_MODULES.fields.description]: moduleData.description,
      [ALL_TABLES.COURSE_MODULES.fields.order]: moduleData.order,
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
    // Mapear os dados para os nomes dos campos do Baserow
    const baserowData = {
      [ALL_TABLES.COURSE_LESSONS.fields.module_id]: lessonData.module_id,
      [ALL_TABLES.COURSE_LESSONS.fields.title]: lessonData.title,
      [ALL_TABLES.COURSE_LESSONS.fields.content_type]: lessonData.content_type,
      [ALL_TABLES.COURSE_LESSONS.fields.video_url]: lessonData.video_url,
      [ALL_TABLES.COURSE_LESSONS.fields.pdf_file]: lessonData.pdf_file,
      [ALL_TABLES.COURSE_LESSONS.fields.text_content]: lessonData.text_content,
      [ALL_TABLES.COURSE_LESSONS.fields.quiz_data]: lessonData.quiz_data,
      [ALL_TABLES.COURSE_LESSONS.fields.order]: lessonData.order,
      [ALL_TABLES.COURSE_LESSONS.fields.is_free_preview]: lessonData.is_free_preview,
    };
    
    console.log('Enviando dados da aula para Baserow:', baserowData);
    const response = await createBaserowRow<any>(LESSONS_TABLE_ID, baserowData);
    console.log('Resposta do Baserow:', response);
    return mapToLesson(response);
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    throw new Error('Não foi possível criar a aula.');
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
      baserowData[fields.title] = courseData.title;
    }
    if (courseData.description !== undefined) {
      baserowData[fields.description] = courseData.description;
    }
    if (courseData.cover_image !== undefined) {
      baserowData[fields.cover_image] = courseData.cover_image;
    }
    if (courseData.instructor_id !== undefined) {
      baserowData[fields.instructor_id] = courseData.instructor_id;
    }
    if (courseData.product_id !== undefined) {
      baserowData[fields.product_id] = courseData.product_id;
    }
    if (courseData.is_published !== undefined) {
      baserowData[fields.is_published] = courseData.is_published;
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
      baserowData[ALL_TABLES.COURSE_MODULES.fields.course_id] = moduleData.course_id;
    }
    if (moduleData.title !== undefined) {
      baserowData[ALL_TABLES.COURSE_MODULES.fields.title] = moduleData.title;
    }
    if (moduleData.description !== undefined) {
      baserowData[ALL_TABLES.COURSE_MODULES.fields.description] = moduleData.description;
    }
    if (moduleData.order !== undefined) {
      baserowData[ALL_TABLES.COURSE_MODULES.fields.order] = moduleData.order;
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
    
    if (lessonData.module_id !== undefined) {
      baserowData[ALL_TABLES.COURSE_LESSONS.fields.module_id] = lessonData.module_id;
    }
    if (lessonData.title !== undefined) {
      baserowData[ALL_TABLES.COURSE_LESSONS.fields.title] = lessonData.title;
    }
    if (lessonData.content_type !== undefined) {
      baserowData[ALL_TABLES.COURSE_LESSONS.fields.content_type] = lessonData.content_type;
    }
    if (lessonData.video_url !== undefined) {
      baserowData[ALL_TABLES.COURSE_LESSONS.fields.video_url] = lessonData.video_url;
    }
    if (lessonData.pdf_file !== undefined) {
      baserowData[ALL_TABLES.COURSE_LESSONS.fields.pdf_file] = lessonData.pdf_file;
    }
    if (lessonData.text_content !== undefined) {
      baserowData[ALL_TABLES.COURSE_LESSONS.fields.text_content] = lessonData.text_content;
    }
    if (lessonData.quiz_data !== undefined) {
      baserowData[ALL_TABLES.COURSE_LESSONS.fields.quiz_data] = lessonData.quiz_data;
    }
    if (lessonData.order !== undefined) {
      baserowData[ALL_TABLES.COURSE_LESSONS.fields.order] = lessonData.order;
    }
    if (lessonData.is_free_preview !== undefined) {
      baserowData[ALL_TABLES.COURSE_LESSONS.fields.is_free_preview] = lessonData.is_free_preview;
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