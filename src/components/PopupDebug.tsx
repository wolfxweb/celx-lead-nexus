import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePopup } from '@/hooks/usePopup';
import { useLocation } from 'react-router-dom';

const PopupDebug = () => {
  const location = useLocation();
  const currentPage = location.pathname.replace('/', '') || 'home';
  const { popupConfig, showPopup, loading } = usePopup(currentPage);

  if (!popupConfig) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 bg-yellow-50 border-yellow-200 z-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-yellow-800">🔍 Popup Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs">
            <p><strong>Página atual:</strong> {currentPage}</p>
            <p><strong>Status:</strong> 
              <Badge variant="secondary" className="ml-1">
                {loading ? 'Carregando...' : 'Nenhum popup ativo'}
              </Badge>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-green-50 border-green-200 z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-green-800">🎯 Popup Ativo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs space-y-1">
          <p><strong>Página atual:</strong> {currentPage}</p>
          <p><strong>Título:</strong> {popupConfig.title}</p>
          <p><strong>Delay:</strong> {popupConfig.delay}s</p>
          <p><strong>Páginas:</strong> {popupConfig.pages.join(', ')}</p>
          <p><strong>Captura email:</strong> 
            <Badge variant={popupConfig.showEmailField ? "default" : "secondary"} className="ml-1">
              {popupConfig.showEmailField ? 'Sim' : 'Não'}
            </Badge>
          </p>
          <p><strong>PDF:</strong> 
            <Badge variant={popupConfig.pdfUrl ? "default" : "secondary"} className="ml-1">
              {popupConfig.pdfUrl ? 'Disponível' : 'Não'}
            </Badge>
          </p>
          <p><strong>Status:</strong> 
            <Badge variant={showPopup ? "default" : "secondary"} className="ml-1">
              {showPopup ? 'Visível' : 'Aguardando'}
            </Badge>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopupDebug; 