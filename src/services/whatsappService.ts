import { baserowRequest } from '@/lib/baserow';
import { BASEROW_TABLES } from '@/config/baserowTables';

export interface WhatsAppInstance {
  id: string;
  name: string;
  phone: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  qr_code?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface WhatsAppMessage {
  id: string;
  instance_id: string;
  to: string;
  message: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  user_id: number;
}

export interface WhatsAppWebhook {
  id: string;
  instance_id: string;
  url: string;
  events: string;
  is_active: boolean;
  created_at: string;
  user_id: number;
}

export interface WhatsAppSettings {
  id: string;
  user_id: number;
  evolution_api_url: string;
  evolution_api_key: string;
  default_instance_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppLicense {
  id: string;
  name: string;
  description: string;
  short_description: string;
  price: string;
  original_price?: string;
  license_type: string;
  instance_limit: string;
  message_limit: string;
  duration_days: string;
  features: string;
  is_active: boolean;
  is_featured: boolean;
  sales_count: string;
  rating: string;
  created_at: string;
  updated_at: string;
}

// Função auxiliar para obter o usuário logado
const getCurrentUserId = (): number => {
  const userStr = localStorage.getItem('celx_user');
  
  if (!userStr) {
    throw new Error('Usuário não autenticado');
  }
  
  try {
    const user = JSON.parse(userStr);
    return Number(user.id);
  } catch (error) {
    throw new Error('Erro ao obter dados do usuário');
  }
};

// Função auxiliar para obter configurações da Evolution API
const getEvolutionAPIConfig = async (): Promise<{ url: string; key: string }> => {
  const settings = await getWhatsAppSettings();
  if (!settings?.evolution_api_url || !settings?.evolution_api_key) {
    throw new Error('Evolution API não configurada. Configure a API em Configurações primeiro.');
  }
  return {
    url: settings.evolution_api_url,
    key: settings.evolution_api_key
  };
};

// Instâncias
export const getWhatsAppInstances = async (): Promise<WhatsAppInstance[]> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  const response = await baserowRequest<{ results: WhatsAppInstance[] }>(
    `/database/rows/table/${tableId}/?user_field_names=true&filter__field_user_id__equal=${userId}`
  );
  return response.results || [];
};

// Função para admin buscar todas as instâncias
export const getAllWhatsAppInstances = async (): Promise<WhatsAppInstance[]> => {
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  const response = await baserowRequest<{ results: WhatsAppInstance[] }>(
    `/database/rows/table/${tableId}/?user_field_names=true`
  );
  return response.results || [];
};

export const createWhatsAppInstance = async (data: {
  name: string;
  phone: string;
}): Promise<WhatsAppInstance> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  
  try {
    // Primeiro, tentar criar na Evolution API se configurada
    let evolutionInstanceId: string | null = null;
    
    try {
      const { url, key } = await getEvolutionAPIConfig();
      
      console.log('Criando instância na Evolution API...', { name: data.name });
      const evolutionResponse = await fetch(`${url}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key
        },
        body: JSON.stringify({
          instanceName: data.name,
          number: data.phone,
          token: `${data.name}_${Date.now()}`,
          webhook: null,
          webhookByEvents: false,
          events: false,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        })
      });
      
      if (evolutionResponse.ok) {
        const evolutionData = await evolutionResponse.json();
        evolutionInstanceId = evolutionData.instance?.instanceName || data.name;
        console.log('Instância criada na Evolution API:', evolutionInstanceId);
      } else {
        const errorText = await evolutionResponse.text();
        console.warn('Erro ao criar na Evolution API:', evolutionResponse.status, errorText);
        
        // Verificar se é erro de nome já em uso
        if (evolutionResponse.status === 403 && errorText.includes('already in use')) {
          throw new Error(`O nome "${data.name}" já está em uso. Escolha outro nome.`);
        }
        
        // Verificar se é erro de integração inválida
        if (evolutionResponse.status === 400 && errorText.includes('Invalid integration')) {
          throw new Error('Configuração da API inválida. Verifique a URL e chave da API em Configurações.');
        }
        
        // Verificar se é erro de autenticação
        if (evolutionResponse.status === 401) {
          throw new Error('Chave da API inválida. Verifique as configurações.');
        }
        
        // Para outros erros, continua criando no Baserow
        console.warn('Continuando criação apenas no Baserow devido a erro na Evolution API');
      }
    } catch (evolutionError) {
      if (evolutionError instanceof Error && evolutionError.message.includes('já está em uso')) {
        // Re-throw o erro de nome em uso
        throw evolutionError;
      }
      console.warn('Evolution API não configurada ou erro ao conectar:', evolutionError);
      // Continua criando no Baserow mesmo se a Evolution API falhar
    }
    
    // Criar no Baserow
    console.log('Criando instância no Baserow...');
    const response = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/?user_field_names=true`, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        user_id: userId,
        status: 'disconnected'
      })
    });
    
    console.log('Instância criada com sucesso no Baserow:', response.id);
    return response;
    
  } catch (error) {
    console.error('Erro ao criar instância:', error);
    
    // Se for erro de nome já em uso, re-throw diretamente
    if (error instanceof Error && error.message.includes('já está em uso')) {
      throw error;
    }
    
    throw new Error(`Erro ao criar instância: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

export const deleteWhatsAppInstance = async (instanceId: string): Promise<void> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  
  console.log('Tentando deletar instância:', { instanceId, userId, tableId, instanceIdType: typeof instanceId });
  
  try {
    // Primeiro verifica se a instância pertence ao usuário
    console.log('Verificando propriedade da instância...');
    let instance: WhatsAppInstance;
    let instanceExists = true;
    
    try {
      instance = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`);
      console.log('Instância encontrada:', instance);
    } catch (fetchError) {
      console.error('Erro ao buscar instância:', fetchError);
      
      // Verificar se é erro de linha inexistente
      if (fetchError instanceof Error && fetchError.message.includes('ERROR_ROW_DOES_NOT_EXIST')) {
        console.log('Instância não encontrada no Baserow, mas continuando com exclusão da Evolution API');
        instanceExists = false;
      } else {
        throw new Error('Erro ao verificar instância');
      }
    }
    
    // Se a instância existe no Baserow, verificar se pertence ao usuário
    if (instanceExists && String(instance.user_id) !== String(userId)) {
      console.error('Acesso negado: instância não pertence ao usuário', { 
        instanceUserId: instance.user_id, 
        currentUserId: userId,
        instanceUserIdType: typeof instance.user_id,
        currentUserIdType: typeof userId
      });
      throw new Error('Acesso negado: instância não pertence ao usuário');
    }
    
    console.log('Instância pertence ao usuário ou não existe no Baserow, procedendo com a exclusão...');
    
    // Sempre tentar deletar da Evolution API se configurada
    let evolutionDeleted = false;
    let evolutionNotFound = false;
    
    if (instanceExists) {
      // Tentar deletar por nome primeiro (mais confiável)
      console.log('Tentando deletar da Evolution API por nome...');
      evolutionDeleted = await deleteFromEvolutionAPIByName(instance.name);
      
      // Se não conseguiu por nome, tentar por ID
      if (!evolutionDeleted) {
        console.log('Tentando deletar da Evolution API por ID...');
        evolutionDeleted = await deleteFromEvolutionAPIById(instanceId);
      }
      
      // Se ainda não conseguiu, verificar se foi porque não encontrou
      if (!evolutionDeleted) {
        // Tentar uma última vez por ID para confirmar se não existe
        const finalCheck = await deleteFromEvolutionAPIById(instanceId);
        if (!finalCheck) {
          console.log('Instância não encontrada na Evolution API (já foi deletada ou não existe)');
          evolutionNotFound = true;
        }
      }
    } else {
      // Se a instância não existe no Baserow, tentar deletar por ID mesmo assim
      console.log('Instância não existe no Baserow, tentando deletar da Evolution API por ID...');
      evolutionDeleted = await deleteFromEvolutionAPIById(instanceId);
      
      if (!evolutionDeleted) {
        console.log('Instância não encontrada na Evolution API');
        evolutionNotFound = true;
      }
    }
    
    // Deletar do Baserow apenas se a instância existir
    let baserowDeleted = false;
    if (instanceExists) {
      console.log('Deletando do Baserow...');
      const deleteUrl = `/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`;
      console.log('URL de delete:', deleteUrl);
      
      try {
        await baserowRequest(deleteUrl, {
          method: 'DELETE'
        });
        
        console.log('Instância deletada com sucesso do Baserow');
        baserowDeleted = true;
      } catch (baserowError) {
        console.error('Erro ao deletar do Baserow:', baserowError);
        
        // Se for erro 500 com detail vazio, pode ser que a linha já não existe
        if (baserowError instanceof Error && baserowError.message.includes('{"detail":""}')) {
          console.log('Linha pode não existir no Baserow (erro 500 com detail vazio)');
          // Considerar como sucesso se a Evolution API foi deletada ou não encontrada
          if (evolutionDeleted || evolutionNotFound) {
            console.log('✅ Instância removida da Evolution API, considerando operação bem-sucedida');
            baserowDeleted = true; // Marcar como deletada para não falhar a operação
          }
        } else {
          // Re-throw outros erros do Baserow
          throw baserowError;
        }
      }
    } else {
      console.log('Instância não existia no Baserow');
    }
    
    // Retornar sucesso se pelo menos uma das operações foi bem-sucedida ou se a instância não existia em nenhum lugar
    if (evolutionDeleted || baserowDeleted || evolutionNotFound) {
      console.log('✅ Operação de exclusão concluída com sucesso');
      console.log('📊 Resumo:', {
        evolutionDeleted,
        baserowDeleted,
        evolutionNotFound,
        instanceExists
      });
      
      if (evolutionDeleted && baserowDeleted) {
        console.log('✅ Instância removida de ambos os sistemas');
      } else if (evolutionDeleted && !instanceExists) {
        console.log('✅ Instância removida apenas da Evolution API (não existia no Baserow)');
      } else if (baserowDeleted && evolutionNotFound) {
        console.log('✅ Instância removida apenas do Baserow (não existia na Evolution API)');
      } else if (evolutionNotFound && !instanceExists) {
        console.log('✅ Instância não existia em nenhum sistema (já estava limpa)');
      }
    } else {
      throw new Error('Falha ao deletar instância de ambos os sistemas');
    }
  } catch (error) {
    console.error('Erro ao deletar instância:', error);
    
    // Se for erro de acesso negado, re-throw
    if (error instanceof Error && error.message.includes('Acesso negado')) {
      throw error;
    }
    
    // Se for erro de instância não encontrada
    if (error instanceof Error && error.message.includes('Instância não encontrada')) {
      throw error;
    }
    
    // Se for erro de linha inexistente no Baserow
    if (error instanceof Error && error.message.includes('ERROR_ROW_DOES_NOT_EXIST')) {
      throw new Error('Instância não encontrada no banco de dados');
    }
    
    // Se for erro de não encontrado (404)
    if (error instanceof Error && error.message.includes('404')) {
      throw new Error('Instância não encontrada');
    }
    
    // Outros erros
    throw new Error(`Erro ao deletar instância: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Função para admin deletar qualquer instância
export const deleteWhatsAppInstanceAsAdmin = async (instanceId: string): Promise<void> => {
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  
  console.log('Admin tentando deletar instância:', { instanceId, tableId, instanceIdType: typeof instanceId });
  
  try {
    // Verificar se a instância existe
    console.log('Verificando se a instância existe...');
    let instance: WhatsAppInstance;
    let instanceExists = true;
    
    try {
      instance = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`);
      console.log('Instância encontrada:', instance);
    } catch (fetchError) {
      console.error('Erro ao buscar instância:', fetchError);
      
      // Verificar se é erro de linha inexistente
      if (fetchError instanceof Error && fetchError.message.includes('ERROR_ROW_DOES_NOT_EXIST')) {
        console.log('Instância não encontrada no Baserow, mas continuando com exclusão da Evolution API');
        instanceExists = false;
      } else {
        throw new Error('Erro ao verificar instância');
      }
    }
    
    // Sempre tentar deletar da Evolution API se configurada
    let evolutionDeleted = false;
    let evolutionNotFound = false;
    try {
      const { url, key } = await getEvolutionAPIConfig();
      
      // Deletar da Evolution API primeiro
      console.log('Deletando da Evolution API...');
      const evolutionResponse = await fetch(`${url}/instance/delete/${instanceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key
        }
      });
      
      if (evolutionResponse.ok) {
        console.log('Instância deletada da Evolution API com sucesso');
        evolutionDeleted = true;
      } else {
        const errorText = await evolutionResponse.text();
        console.warn('Erro ao deletar da Evolution API:', evolutionResponse.status, errorText);
        
        // Se for 404, a instância não existe na Evolution API, mas não é um erro crítico
        if (evolutionResponse.status === 404) {
          console.log('Instância não encontrada na Evolution API (já foi deletada ou não existe)');
          evolutionNotFound = true;
        } else {
          console.warn('Erro na Evolution API, mas continuando com operação no Baserow');
        }
        // Não falha se a Evolution API der erro, continua deletando do Baserow
      }
    } catch (evolutionError) {
      console.warn('Evolution API não configurada ou erro ao conectar:', evolutionError);
      // Não falha se a Evolution API der erro, continua deletando do Baserow
    }
    
    // Deletar do Baserow apenas se a instância existir
    let baserowDeleted = false;
    if (instanceExists) {
      console.log('Deletando do Baserow...');
      const deleteUrl = `/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`;
      console.log('URL de delete:', deleteUrl);
      
      try {
        await baserowRequest(deleteUrl, {
          method: 'DELETE'
        });
        
        console.log('Instância deletada com sucesso do Baserow');
        baserowDeleted = true;
      } catch (baserowError) {
        console.error('Erro ao deletar do Baserow:', baserowError);
        
        // Se for erro 500 com detail vazio, pode ser que a linha já não existe
        if (baserowError instanceof Error && baserowError.message.includes('{"detail":""}')) {
          console.log('Linha pode não existir no Baserow (erro 500 com detail vazio)');
          // Considerar como sucesso se a Evolution API foi deletada ou não encontrada
          if (evolutionDeleted || evolutionNotFound) {
            console.log('✅ Instância removida da Evolution API, considerando operação bem-sucedida');
            baserowDeleted = true; // Marcar como deletada para não falhar a operação
          }
        } else {
          // Re-throw outros erros do Baserow
          throw baserowError;
        }
      }
    } else {
      console.log('Instância não existia no Baserow, apenas Evolution API foi limpa');
    }
    
    // Retornar sucesso se pelo menos uma das operações foi bem-sucedida ou se a instância não existia em nenhum lugar
    if (evolutionDeleted || baserowDeleted || evolutionNotFound) {
      console.log('✅ Operação de exclusão concluída com sucesso');
      console.log('📊 Resumo:', {
        evolutionDeleted,
        baserowDeleted,
        evolutionNotFound,
        instanceExists
      });
      
      if (evolutionDeleted && baserowDeleted) {
        console.log('✅ Instância removida de ambos os sistemas');
      } else if (evolutionDeleted && !instanceExists) {
        console.log('✅ Instância removida apenas da Evolution API (não existia no Baserow)');
      } else if (baserowDeleted && evolutionNotFound) {
        console.log('✅ Instância removida apenas do Baserow (não existia na Evolution API)');
      } else if (evolutionNotFound && !instanceExists) {
        console.log('✅ Instância não existia em nenhum sistema (já estava limpa)');
      }
    } else {
      throw new Error('Falha ao deletar instância de ambos os sistemas');
    }
  } catch (error) {
    console.error('Erro ao deletar instância como admin:', error);
    
    // Se for erro de não encontrado
    if (error instanceof Error && error.message.includes('404')) {
      throw new Error('Instância não encontrada');
    }
    
    // Se for erro de linha inexistente no Baserow
    if (error instanceof Error && error.message.includes('ERROR_ROW_DOES_NOT_EXIST')) {
      throw new Error('Instância não encontrada no banco de dados');
    }
    
    // Outros erros
    throw new Error(`Erro ao deletar instância: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

export const connectWhatsAppInstance = async (instanceId: string): Promise<{ qr_code?: string; status: string }> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  
  // Primeiro verifica se a instância pertence ao usuário
  const instance = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`);
  if (String(instance.user_id) !== String(userId)) {
    throw new Error('Acesso negado: instância não pertence ao usuário');
  }
  
  // Buscar configurações da Evolution API do usuário
  const { url, key } = await getEvolutionAPIConfig();
  
  try {
    const response = await fetch(`${url}/instance/connect/${instanceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na Evolution API:', response.status, errorText);
      throw new Error(`Falha ao conectar instância: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao conectar com a Evolution API:', error);
    throw new Error(`Erro ao conectar com a Evolution API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Mensagens
export const getWhatsAppMessages = async (instanceId?: string): Promise<WhatsAppMessage[]> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_MESSAGES.id;
  let url = `/database/rows/table/${tableId}/?user_field_names=true&filter__field_user_id__equal=${userId}`;
  
  if (instanceId) {
    // Verifica se a instância pertence ao usuário
    const instances = await getWhatsAppInstances();
    const userInstance = instances.find(i => i.id === instanceId);
    if (!userInstance) {
      throw new Error('Acesso negado: instância não pertence ao usuário');
    }
    url += `&filter__field_instance_id__equal=${instanceId}`;
  }
  
  const response = await baserowRequest<{ results: WhatsAppMessage[] }>(url);
  return response.results || [];
};

export const sendWhatsAppMessage = async (data: {
  instance_id: string;
  to: string;
  message: string;
  type?: string;
}): Promise<WhatsAppMessage> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_MESSAGES.id;
  
  // Verifica se a instância pertence ao usuário
  const instances = await getWhatsAppInstances();
  const userInstance = instances.find(i => i.id === data.instance_id);
  if (!userInstance) {
    throw new Error('Acesso negado: instância não pertence ao usuário');
  }
  
  const response = await baserowRequest<WhatsAppMessage>(`/database/rows/table/${tableId}/?user_field_names=true`, {
    method: 'POST',
    body: JSON.stringify({
      instance_id: data.instance_id,
      to: data.to,
      message: data.message,
      type: data.type || 'text',
      status: 'pending',
      user_id: userId
    })
  });
  return response;
};

export const scheduleWhatsAppMessage = async (data: {
  instance_id: string;
  to: string;
  message: string;
  scheduled_at: string;
  type?: string;
}): Promise<WhatsAppMessage> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_MESSAGES.id;
  
  // Verifica se a instância pertence ao usuário
  const instances = await getWhatsAppInstances();
  const userInstance = instances.find(i => i.id === data.instance_id);
  if (!userInstance) {
    throw new Error('Acesso negado: instância não pertence ao usuário');
  }
  
  const response = await baserowRequest<WhatsAppMessage>(`/database/rows/table/${tableId}/?user_field_names=true`, {
    method: 'POST',
    body: JSON.stringify({
      instance_id: data.instance_id,
      to: data.to,
      message: data.message,
      type: data.type || 'text',
      status: 'pending',
      scheduled_at: data.scheduled_at,
      user_id: userId
    })
  });
  return response;
};

// Webhooks
export const getWhatsAppWebhooks = async (instanceId?: string): Promise<WhatsAppWebhook[]> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_WEBHOOKS.id;
  let url = `/database/rows/table/${tableId}/?user_field_names=true&filter__field_user_id__equal=${userId}`;
  
  if (instanceId) {
    // Verifica se a instância pertence ao usuário
    const instances = await getWhatsAppInstances();
    const userInstance = instances.find(i => i.id === instanceId);
    if (!userInstance) {
      throw new Error('Acesso negado: instância não pertence ao usuário');
    }
    url += `&filter__field_instance_id__equal=${instanceId}`;
  }
  
  const response = await baserowRequest<{ results: WhatsAppWebhook[] }>(url);
  return response.results || [];
};

export const createWhatsAppWebhook = async (data: {
  instance_id: string;
  url: string;
  events: string[];
}): Promise<WhatsAppWebhook> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_WEBHOOKS.id;
  
  // Verifica se a instância pertence ao usuário
  const instances = await getWhatsAppInstances();
  const userInstance = instances.find(i => i.id === data.instance_id);
  if (!userInstance) {
    throw new Error('Acesso negado: instância não pertence ao usuário');
  }
  
  const response = await baserowRequest<WhatsAppWebhook>(`/database/rows/table/${tableId}/?user_field_names=true`, {
    method: 'POST',
    body: JSON.stringify({
      instance_id: data.instance_id,
      url: data.url,
      events: JSON.stringify(data.events),
      is_active: true,
      user_id: userId
    })
  });
  return response;
};

export const deleteWhatsAppWebhook = async (webhookId: string): Promise<void> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_WEBHOOKS.id;
  
  // Primeiro verifica se o webhook pertence ao usuário
  const webhook = await baserowRequest<WhatsAppWebhook>(`/database/rows/table/${tableId}/${webhookId}/?user_field_names=true`);
  if (webhook.user_id !== userId) {
    throw new Error('Acesso negado: webhook não pertence ao usuário');
  }
  
  await baserowRequest(`/database/rows/table/${tableId}/${webhookId}/`, {
    method: 'DELETE'
  });
};

// Configurações
export const getWhatsAppSettings = async (): Promise<WhatsAppSettings | null> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_SETTINGS.id;
  const response = await baserowRequest<{ results: WhatsAppSettings[] }>(`/database/rows/table/${tableId}/?user_field_names=true&filter__field_user_id__equal=${userId}`);
  return response.results?.[0] || null;
};

export const createWhatsAppSettings = async (data: {
  evolution_api_url: string;
  evolution_api_key: string;
}): Promise<WhatsAppSettings> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_SETTINGS.id;
  
  const requestData = {
    user_id: userId,
    evolution_api_url: data.evolution_api_url,
    evolution_api_key: data.evolution_api_key
  };
  
  const response = await baserowRequest<WhatsAppSettings>(`/database/rows/table/${tableId}/?user_field_names=true`, {
    method: 'POST',
    body: JSON.stringify(requestData)
  });
  
  return response;
};

export const updateWhatsAppSettings = async (settingsId: string, data: {
  evolution_api_url?: string;
  evolution_api_key?: string;
  default_instance_id?: string;
}): Promise<WhatsAppSettings> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_SETTINGS.id;
  
  // Primeiro verifica se as configurações pertencem ao usuário
  const settings = await baserowRequest<WhatsAppSettings>(`/database/rows/table/${tableId}/${settingsId}/?user_field_names=true`);
  
  if (settings.user_id !== userId) {
    throw new Error('Acesso negado: configurações não pertencem ao usuário');
  }
  
  // Se default_instance_id foi fornecido, verifica se a instância pertence ao usuário
  if (data.default_instance_id) {
    const instances = await getWhatsAppInstances();
    const userInstance = instances.find(i => i.id === data.default_instance_id);
    if (!userInstance) {
      throw new Error('Acesso negado: instância não pertence ao usuário');
    }
  }
  
  const response = await baserowRequest<WhatsAppSettings>(`/database/rows/table/${tableId}/${settingsId}/?user_field_names=true`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
  
  return response;
};

// Relatórios
export const getWhatsAppReports = async (instanceId?: string, startDate?: string, endDate?: string) => {
  // Implementar lógica de relatórios baseada nas mensagens
  const messages = await getWhatsAppMessages(instanceId);
  
  const reports = {
    total_messages: messages.length,
    sent_messages: messages.filter(m => m.status === 'sent').length,
    delivered_messages: messages.filter(m => m.status === 'delivered').length,
    read_messages: messages.filter(m => m.status === 'read').length,
    failed_messages: messages.filter(m => m.status === 'failed').length,
    messages_by_type: messages.reduce((acc, msg) => {
      acc[msg.type] = (acc[msg.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
  
  return reports;
};

export const getWhatsAppLicenses = async (): Promise<WhatsAppLicense[]> => {
  const tableId = BASEROW_TABLES.WHATSAPP_LICENSES.id;
  const response = await baserowRequest<{ results: WhatsAppLicense[] }>(
    `/database/rows/table/${tableId}/?user_field_names=true&filter__field_is_active__equal=true`
  );
  return response.results || [];
};

export const createWhatsAppLicense = async (licenseData: Partial<WhatsAppLicense>): Promise<WhatsAppLicense> => {
  const tableId = BASEROW_TABLES.WHATSAPP_LICENSES.id;
  const response = await baserowRequest<WhatsAppLicense>(
    `/database/rows/table/${tableId}/?user_field_names=true`,
    {
      method: 'POST',
      body: JSON.stringify(licenseData)
    }
  );
  return response;
};

export const updateWhatsAppLicense = async (licenseId: string, licenseData: Partial<WhatsAppLicense>): Promise<WhatsAppLicense> => {
  const tableId = BASEROW_TABLES.WHATSAPP_LICENSES.id;
  const response = await baserowRequest<WhatsAppLicense>(
    `/database/rows/table/${tableId}/${licenseId}/?user_field_names=true`,
    {
      method: 'PATCH',
      body: JSON.stringify(licenseData)
    }
  );
  return response;
};

export const deleteWhatsAppLicense = async (licenseId: string): Promise<void> => {
  const tableId = BASEROW_TABLES.WHATSAPP_LICENSES.id;
  await baserowRequest(
    `/database/rows/table/${tableId}/${licenseId}/`,
    {
      method: 'DELETE'
    }
  );
};

export const updateWhatsAppInstanceStatus = async (instanceId: string, status: string): Promise<WhatsAppInstance> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  
  // Primeiro verifica se a instância pertence ao usuário
  const instance = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`);
  if (instance.user_id !== userId) {
    throw new Error('Acesso negado: instância não pertence ao usuário');
  }
  
  const response = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: status,
      updated_at: new Date().toISOString()
    })
  });
  return response;
};

export const updateWhatsAppInstance = async (instanceId: string, data: {
  name?: string;
  phone?: string;
  status?: string;
}): Promise<WhatsAppInstance> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  
  // Primeiro verifica se a instância pertence ao usuário
  const instance = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`);
  if (instance.user_id !== userId) {
    throw new Error('Acesso negado: instância não pertence ao usuário');
  }
  
  const response = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...data,
      updated_at: new Date().toISOString()
    })
  });
  return response;
};

// Função para deletar instância da Evolution API por nome
const deleteFromEvolutionAPIByName = async (instanceName: string): Promise<boolean> => {
  try {
    const { url, key } = await getEvolutionAPIConfig();
    
    console.log('Tentando deletar da Evolution API por nome:', instanceName);
    const evolutionResponse = await fetch(`${url}/instance/delete/${instanceName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key
      }
    });
    
    if (evolutionResponse.ok) {
      console.log('Instância deletada da Evolution API por nome com sucesso');
      return true;
    } else {
      const errorText = await evolutionResponse.text();
      console.warn('Erro ao deletar da Evolution API por nome:', evolutionResponse.status, errorText);
      
      // Se for 404, a instância não existe na Evolution API
      if (evolutionResponse.status === 404) {
        console.log('Instância não encontrada na Evolution API por nome (já foi deletada ou não existe)');
        return false; // Não é erro, apenas não encontrada
      }
      
      return false; // Outros erros
    }
  } catch (evolutionError) {
    console.warn('Erro ao conectar com Evolution API por nome:', evolutionError);
    return false;
  }
};

// Função para deletar instância da Evolution API por ID
const deleteFromEvolutionAPIById = async (instanceId: string): Promise<boolean> => {
  try {
    const { url, key } = await getEvolutionAPIConfig();
    
    console.log('Tentando deletar da Evolution API por ID:', instanceId);
    const evolutionResponse = await fetch(`${url}/instance/delete/${instanceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key
      }
    });
    
    if (evolutionResponse.ok) {
      console.log('Instância deletada da Evolution API por ID com sucesso');
      return true;
    } else {
      const errorText = await evolutionResponse.text();
      console.warn('Erro ao deletar da Evolution API por ID:', evolutionResponse.status, errorText);
      
      // Se for 404, a instância não existe na Evolution API
      if (evolutionResponse.status === 404) {
        console.log('Instância não encontrada na Evolution API por ID (já foi deletada ou não existe)');
        return false; // Não é erro, apenas não encontrada
      }
      
      return false; // Outros erros
    }
  } catch (evolutionError) {
    console.warn('Erro ao conectar com Evolution API por ID:', evolutionError);
    return false;
  }
}; 