import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface PopupConfig {
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

interface PopupModalProps {
  config: PopupConfig;
  currentPage: string;
  onClose: () => void;
  onEmailSubmit: (email: string) => Promise<void>;
}

const PopupModal: React.FC<PopupModalProps> = ({ 
  config, 
  currentPage, 
  onClose, 
  onEmailSubmit 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPdfButton, setShowPdfButton] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    setIsSubmitting(true);
    try {
      await onEmailSubmit(email);
      setIsSubmitted(true);
      setShowPdfButton(true);
      toast.success('Email cadastrado com sucesso!');
    } catch (error) {
      toast.error('Erro ao cadastrar email. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = () => {
    if (config.pdfUrl) {
      window.open(config.pdfUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative animate-in zoom-in-95 duration-200">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-bold">{config.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">{config.message}</p>
          
          {config.showEmailField && !isSubmitted && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={config.emailPlaceholder || "Seu melhor email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : config.buttonText}
              </Button>
            </form>
          )}
          
          {isSubmitted && config.showEmailField && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center text-green-600">
                <Mail className="h-6 w-6 mr-2" />
                <span className="font-medium">Email cadastrado com sucesso!</span>
              </div>
              
              {showPdfButton && config.pdfUrl && (
                <Button 
                  onClick={handleDownloadPdf}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </Button>
              )}
            </div>
          )}
          
          {!config.showEmailField && (
            <Button 
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {config.buttonText}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PopupModal; 