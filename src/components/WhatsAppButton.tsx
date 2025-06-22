import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CONTACT_CONFIG, getWhatsAppUrl } from '@/config/contact';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phoneNumber,
  message
}) => {
  const handleWhatsAppClick = () => {
    const whatsappUrl = getWhatsAppUrl(message, phoneNumber);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Animações de pulso */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
      <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-30"></div>
      
      {/* Botão principal */}
      <button
        onClick={handleWhatsAppClick}
        className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
        aria-label="Contatar via WhatsApp"
        title="Fale conosco no WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Fale conosco no WhatsApp
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      </button>
      
      {/* Indicador de status online */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
    </div>
  );
};

export default WhatsAppButton; 