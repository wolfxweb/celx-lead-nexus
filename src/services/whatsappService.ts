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
  const user = JSON.parse(userStr);
  return Number(user.id);
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

export const createWhatsAppInstance = async (data: {
  name: string;
  phone: string;
}): Promise<WhatsAppInstance> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  const response = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/?user_field_names=true`, {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      phone: data.phone,
      user_id: userId,
      status: 'disconnected'
    })
  });
  return response;
};

export const deleteWhatsAppInstance = async (instanceId: string): Promise<void> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  
  // Primeiro verifica se a instância pertence ao usuário
  const instance = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`);
  if (instance.user_id !== userId) {
    throw new Error('Acesso negado: instância não pertence ao usuário');
  }
  
  await baserowRequest(`/database/rows/table/${tableId}/${instanceId}/`, {
    method: 'DELETE'
  });
};

export const connectWhatsAppInstance = async (instanceId: string): Promise<{ qr_code?: string; status: string }> => {
  const userId = getCurrentUserId();
  const tableId = BASEROW_TABLES.WHATSAPP_INSTANCES.id;
  
  // Primeiro verifica se a instância pertence ao usuário
  const instance = await baserowRequest<WhatsAppInstance>(`/database/rows/table/${tableId}/${instanceId}/?user_field_names=true`);
  if (instance.user_id !== userId) {
    throw new Error('Acesso negado: instância não pertence ao usuário');
  }
  
  // Aqui você faria a chamada para a Evolution API
  const evolutionApiUrl = 'https://automacao-evolution-api.219u5p.easypanel.host';
  
  try {
    const response = await fetch(`${evolutionApiUrl}/instance/connect/${instanceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'your-api-key' // Será obtido das configurações do usuário
      }
    });
    
    if (!response.ok) {
      throw new Error('Falha ao conectar instância');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Erro ao conectar com a Evolution API');
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
  const response = await baserowRequest<WhatsAppSettings>(`/database/rows/table/${tableId}/?user_field_names=true`, {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      evolution_api_url: data.evolution_api_url,
      evolution_api_key: data.evolution_api_key
    })
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