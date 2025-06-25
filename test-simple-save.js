// Script de teste simples para verificar a gravação
const BASEROW_CONFIG = {
  API_URL: 'https://master-baserow.219u5p.easypanel.host/api',
  TOKEN: 'jrHE9jWKMz9i79Bh7ZszvQo81LThqOSx'
};

const TABLE_ID = 644; // WhatsApp Settings

async function testSimpleSave() {
  console.log('=== Teste Simples de Gravação ===');
  
  const testData = {
    user_id: 1, // ID do usuário
    evolution_api_url: 'https://automacao-evolution-api.219u5p.easypanel.host',
    evolution_api_key: 'test-key-123'
  };
  
  console.log('Dados a serem enviados:', testData);
  
  try {
    const response = await fetch(`${BASEROW_CONFIG.API_URL}/database/rows/table/${TABLE_ID}/?user_field_names=true`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('Sucesso:', result);
    
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

// Executar o teste
testSimpleSave(); 