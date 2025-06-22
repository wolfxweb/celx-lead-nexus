// Configurações de contato da empresa
export const CONTACT_CONFIG = {
  // WhatsApp
  whatsapp: {
    phoneNumber: '554888114708', // Formato internacional sem +
    defaultMessage: 'Olá! Gostaria de saber mais sobre os serviços da CELX.',
    businessHours: 'Segunda a Sexta, 8h às 18h',
  },
  
  // Email
  email: {
    support: 'suporte@celx.com.br',
    sales: 'vendas@celx.com.br',
    info: 'contato@celx.com.br',
  },
  
  // Telefone
  phone: {
    main: '+55 (48) 99999-9999',
    support: '+55 (48) 99999-8888',
  },
  
  // Endereço
  address: {
    street: 'Rua das Tecnologias, 123',
    city: 'São José',
    state: 'SC',
    zipCode: '88100-000',
    country: 'Brasil',
  },
  
  // Redes Sociais
  social: {
    linkedin: 'https://www.linkedin.com/in/carlos-eduardo-lobo-4343b019a/',
    github: 'https://github.com/wolfxweb',
    instagram: 'https://instagram.com/celx',
    facebook: 'https://facebook.com/celx',
  },
  
  // Horário de funcionamento
  businessHours: {
    monday: '8h às 18h',
    tuesday: '8h às 18h',
    wednesday: '8h às 18h',
    thursday: '8h às 18h',
    friday: '8h às 18h',
    saturday: '9h às 12h',
    sunday: 'Fechado',
  },
};

// Função para gerar URL do WhatsApp
export const getWhatsAppUrl = (message?: string, phoneNumber?: string) => {
  const msg = message || CONTACT_CONFIG.whatsapp.defaultMessage;
  const phone = phoneNumber || CONTACT_CONFIG.whatsapp.phoneNumber;
  const encodedMessage = encodeURIComponent(msg);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

// Função para gerar URL de email
export const getEmailUrl = (email: string, subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);
  
  const queryString = params.toString();
  return `mailto:${email}${queryString ? `?${queryString}` : ''}`;
}; 