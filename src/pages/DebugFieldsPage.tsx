import React, { useEffect, useState } from 'react';
import { getBaserowFields } from '@/lib/baserow';
import { ALL_TABLES } from '@/config/baserowTables';
import { BaserowField } from '@/lib/baserow';

const DebugFieldsPage: React.FC = () => {
  const [fields, setFields] = useState<BaserowField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleFetchFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const lessonsTableId = ALL_TABLES.COURSE_LESSONS.id;
      if (!lessonsTableId) {
        throw new Error('ID da tabela de aulas (COURSE_LESSONS) não encontrado ou é zero. Verifique o .env');
      }
      const result = await getBaserowFields(lessonsTableId);
      setFields(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchFields();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', backgroundColor: '#1E1E1E', color: '#D4D4D4', minHeight: '100vh' }}>
      <h1 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem' }}>Página de Debug de Campos do Baserow</h1>
      {loading && <p>Carregando campos...</p>}
      {error && (
        <div>
          <h2 style={{ color: 'red' }}>Ocorreu um Erro</h2>
          <pre style={{ color: 'red', backgroundColor: '#332222', padding: '1rem', borderRadius: '5px' }}>
            {error}
          </pre>
        </div>
      )}
      {fields.length > 0 && (
        <div>
          <h2>Campos encontrados para a tabela `course_lessons` (ID: {ALL_TABLES.COURSE_LESSONS.id}):</h2>
          <pre style={{ backgroundColor: '#252526', padding: '1rem', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(fields, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugFieldsPage; 