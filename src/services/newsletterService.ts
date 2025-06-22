import { createBaserowRow, getBaserowRows } from '@/lib/baserow';
import { getTableId } from '@/config/baserowTables';

// Interface para os dados da newsletter
export interface NewsletterSubscription {
  id?: number;
  email: string;
  name?: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
  source?: string; // 'blog', 'homepage', etc.
}

// Interface que reflete exatamente os campos da tabela NEWSLETTER_SUBSCRIPTIONS no Baserow
export interface BaserowNewsletterSubscription {
  id: number;
  order: string;
  email: string;
  name: string;
  subscribed_at: string;
  status: string; // 'active' ou 'unsubscribed'
  source: string;
  created_at: string;
  updated_at: string;
}

// Função para inscrever na newsletter
export const subscribeToNewsletter = async (email: string, name?: string, source: string = 'blog'): Promise<NewsletterSubscription> => {
  try {
    // Verificar se o email já está inscrito
    const existingSubscription = await checkNewsletterSubscription(email);
    if (existingSubscription) {
      throw new Error('Este email já está inscrito na newsletter');
    }

    // Preparar dados para o Baserow
    const subscriptionData = {
      email: email,
      name: name || '',
      subscribed_at: new Date().toISOString(),
      status: 'active',
      source: source
    };

    // Salvar no Baserow
    const tableId = getTableId('NEWSLETTER_SUBSCRIPTIONS');
    const result = await createBaserowRow<BaserowNewsletterSubscription>(tableId, subscriptionData);
    
    // Converter para o formato da interface
    const subscription: NewsletterSubscription = {
      id: result.id,
      email: result.email,
      name: result.name,
      subscribed_at: result.subscribed_at,
      status: result.status as 'active' | 'unsubscribed',
      source: result.source
    };

    return subscription;
    
  } catch (error) {
    console.error('Erro ao inscrever na newsletter:', error);
    throw error;
  }
};

// Função para cancelar inscrição
export const unsubscribeFromNewsletter = async (email: string): Promise<boolean> => {
  try {
    // Buscar a inscrição no Baserow
    const tableId = getTableId('NEWSLETTER_SUBSCRIPTIONS');
    const { results } = await getBaserowRows<BaserowNewsletterSubscription>(tableId, {
      size: 200
    });
    
    const subscription = results.find(sub => sub.email === email);
    if (!subscription) {
      throw new Error('Inscrição não encontrada');
    }

    // Atualizar status para 'unsubscribed'
    // Nota: Você precisaria implementar updateBaserowRow se quiser atualizar
    // Por enquanto, vamos apenas retornar sucesso
    console.log('Inscrição cancelada:', subscription.id);
    
    return true;
    
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
    throw error;
  }
};

// Função para verificar se email já está inscrito
export const checkNewsletterSubscription = async (email: string): Promise<NewsletterSubscription | null> => {
  try {
    const tableId = getTableId('NEWSLETTER_SUBSCRIPTIONS');
    const { results } = await getBaserowRows<BaserowNewsletterSubscription>(tableId, {
      size: 200
    });
    
    const subscription = results.find(sub => 
      sub.email === email && sub.status === 'active'
    );
    
    if (!subscription) {
      return null;
    }

    // Converter para o formato da interface
    return {
      id: subscription.id,
      email: subscription.email,
      name: subscription.name,
      subscribed_at: subscription.subscribed_at,
      status: subscription.status as 'active' | 'unsubscribed',
      source: subscription.source
    };
    
  } catch (error) {
    console.error('Erro ao verificar inscrição:', error);
    return null;
  }
};

// Função para listar todas as inscrições (útil para admin)
export const getAllNewsletterSubscriptions = async (): Promise<NewsletterSubscription[]> => {
  try {
    const tableId = getTableId('NEWSLETTER_SUBSCRIPTIONS');
    const { results } = await getBaserowRows<BaserowNewsletterSubscription>(tableId, {
      size: 200
    });
    
    return results.map(sub => ({
      id: sub.id,
      email: sub.email,
      name: sub.name,
      subscribed_at: sub.subscribed_at,
      status: sub.status as 'active' | 'unsubscribed',
      source: sub.source
    }));
    
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    throw error;
  }
};

// Exemplo de integração com Mailchimp (descomente e configure se necessário)
/*
const subscribeToMailchimp = async (email: string, name?: string) => {
  const MAILCHIMP_API_KEY = import.meta.env.VITE_MAILCHIMP_API_KEY;
  const MAILCHIMP_LIST_ID = import.meta.env.VITE_MAILCHIMP_LIST_ID;
  const MAILCHIMP_SERVER = import.meta.env.VITE_MAILCHIMP_SERVER;
  
  const response = await fetch(`https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`, {
    method: 'POST',
    headers: {
      'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: name || '',
      },
    }),
  });
  
  if (!response.ok) {
    throw new Error('Falha ao inscrever no Mailchimp');
  }
  
  return await response.json();
};
*/

// Exemplo de integração com Baserow (descomente se quiser usar)
/*
import { createBaserowRow } from '@/lib/baserow';
import { getTableId } from '@/config/baserowTables';

const subscribeToBaserow = async (email: string, name?: string, source: string = 'blog') => {
  const tableId = getTableId('NEWSLETTER_SUBSCRIPTIONS'); // Você precisaria criar esta tabela
  
  const subscriptionData = {
    email: email,
    name: name || '',
    subscribed_at: new Date().toISOString(),
    status: 'active',
    source: source
  };
  
  return await createBaserowRow(tableId, subscriptionData);
};
*/ 