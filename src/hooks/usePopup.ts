import { useState, useEffect } from 'react';
import { getBaserowRows, createBaserowRow } from '@/lib/baserow';
import { getTableId } from '@/config/baserowTables';

export interface PopupConfig {
  id: string;
  title: string;
  message: string;
  showEmailField: boolean;
  emailPlaceholder?: string;
  buttonText: string;
  pdfUrl?: string;
  delay: number; // em segundos
  pages: string[]; // páginas onde deve aparecer
  isActive: boolean;
}

export const usePopup = (currentPage: string) => {
  const [popupConfig, setPopupConfig] = useState<PopupConfig | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  // Buscar configuração do pop-up ativo para a página atual
  const fetchPopupConfig = async () => {
    try {
      const tableId = getTableId('POPUP_CONFIGS');
      const response = await getBaserowRows(tableId, {
        filter: `is_active=true`,
        size: 1
      });

      if (response.results && response.results.length > 0) {
        const config = response.results[0];
        setPopupConfig({
          id: config.id.toString(),
          title: config.title,
          message: config.message,
          showEmailField: config.show_email_field,
          emailPlaceholder: config.email_placeholder,
          buttonText: config.button_text,
          pdfUrl: config.pdf_url,
          delay: config.delay || 5,
          pages: config.pages ? config.pages.split(',').map(p => p.trim()) : [],
          isActive: config.is_active
        });
      }
    } catch (error) {
      console.error('Erro ao buscar configuração do pop-up:', error);
    }
  };

  // Salvar email capturado
  const saveEmail = async (email: string) => {
    try {
      const tableId = getTableId('POPUP_EMAILS');
      await createBaserowRow(tableId, {
        email: email,
        popup_id: popupConfig?.id,
        page: currentPage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao salvar email:', error);
      throw error;
    }
  };

  // Mostrar pop-up após delay
  useEffect(() => {
    if (popupConfig && !hasShownPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        setHasShownPopup(true);
      }, popupConfig.delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [popupConfig, hasShownPopup]);

  // Buscar configuração quando a página muda
  useEffect(() => {
    fetchPopupConfig();
    setHasShownPopup(false);
    setShowPopup(false);
  }, [currentPage]);

  const closePopup = () => {
    setShowPopup(false);
  };

  return {
    popupConfig,
    showPopup,
    closePopup,
    saveEmail
  };
}; 