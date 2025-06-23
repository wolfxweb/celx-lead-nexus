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
  const [loading, setLoading] = useState(true);

  // Buscar configuração do pop-up ativo para a página atual
  const fetchPopupConfig = async () => {
    try {
      setLoading(true);
      const tableId = getTableId('POPUP_CONFIGS');
      
      // Buscar todos os pop-ups ativos
      const response = await getBaserowRows(tableId, {
        filter: { is_active: 'true' },
        size: 50
      });

      if (response.results && response.results.length > 0) {
        // Filtrar pop-ups que devem aparecer na página atual
        const validPopups = response.results.filter((popup: any) => {
          if (!popup.pages) return false;
          
          const pages = popup.pages.split(',').map((p: string) => p.trim().toLowerCase());
          const currentPageLower = currentPage.toLowerCase();
          
          // Verificar se a página atual está na lista de páginas do pop-up
          return pages.includes(currentPageLower) || 
                 pages.includes('home') && currentPageLower === '' ||
                 pages.includes('home') && currentPageLower === 'home';
        });

        if (validPopups.length > 0) {
          // Pegar o primeiro pop-up válido (pode ser expandido para seleção aleatória)
          const config = validPopups[0];
          
          setPopupConfig({
            id: config.id.toString(),
            title: config.title || '',
            message: config.message || '',
            showEmailField: config.show_email_field || false,
            emailPlaceholder: config.email_placeholder || '',
            buttonText: config.button_text || 'OK',
            pdfUrl: config.pdf_url || '',
            delay: config.delay || 5,
            pages: config.pages ? config.pages.split(',').map(p => p.trim()) : [],
            isActive: config.is_active || false
          });
        } else {
          setPopupConfig(null);
        }
      } else {
        setPopupConfig(null);
      }
    } catch (error) {
      console.error('Erro ao buscar configuração do pop-up:', error);
      setPopupConfig(null);
    } finally {
      setLoading(false);
    }
  };

  // Salvar email capturado
  const saveEmail = async (email: string) => {
    try {
      const tableId = getTableId('POPUP_EMAILS');
      const emailData = {
        email: email,
        popup_id: parseInt(popupConfig?.id || '0'),
        page: currentPage,
        timestamp: new Date().toISOString()
      };
      
      await createBaserowRow(tableId, emailData);
    } catch (error) {
      console.error('Erro ao salvar email:', error);
      throw error;
    }
  };

  // Mostrar pop-up após delay
  useEffect(() => {
    if (popupConfig && !hasShownPopup && !loading) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        setHasShownPopup(true);
      }, popupConfig.delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [popupConfig, hasShownPopup, loading]);

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
    saveEmail,
    loading
  };
}; 