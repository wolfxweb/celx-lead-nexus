import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste Simples - Baserow</h1>
      <p className="text-gray-600">
        Se você está vendo esta página, a rota está funcionando!
      </p>
      <div className="mt-4 p-4 bg-blue-100 rounded">
        <h2 className="font-semibold">Variáveis de Ambiente:</h2>
        <p>BASE_URL: {import.meta.env.VITE_BASEROW_BASE_URL || 'Não configurado'}</p>
        <p>API_URL: {import.meta.env.VITE_BASEROW_API_URL || 'Não configurado'}</p>
        <p>DATABASE_ID: {import.meta.env.VITE_BASEROW_DATABASE_ID || 'Não configurado'}</p>
        <p>TOKEN: {import.meta.env.VITE_BASEROW_TOKEN ? 'Configurado' : 'Não configurado'}</p>
      </div>
    </div>
  );
};

export default SimpleTest; 