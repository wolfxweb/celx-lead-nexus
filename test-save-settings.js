const BASEROW_CONFIG = {
  API_URL: 'https://api.baserow.io',
  TOKEN: 'YOUR_BASEROW_TOKEN_HERE' // Substitua pelo seu token
};

const BASEROW_TABLES = {
  WHATSAPP_SETTINGS: { id: 644 }
};

async function testSaveSettings() {
  const userId = 1; // ID do usuário logado
  const tableId = BASEROW_TABLES.WHATSAPP_SETTINGS.id;
  
  const testData = {
    user_id: userId,
    evolution_api_url: 'https://automacao-evolution-api.219u5p.easypanel.host',
    evolution_api_key: 'test-api-key-123'
  };
  
  console.log('Testando gravação de configurações...');
  console.log('Dados a serem enviados:', testData);
  
  try {
    const response = await fetch(`${BASEROW_CONFIG.API_URL}/database/rows/table/${tableId}/?user_field_names=true`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Status da resposta:', response.status);
    console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('Resposta de sucesso:', result);
    
    // Verificar se os dados foram salvos corretamente
    console.log('\nVerificando se os dados foram salvos...');
    const verifyResponse = await fetch(`${BASEROW_CONFIG.API_URL}/database/rows/table/${tableId}/?user_field_names=true&filter__field_user_id__equal=${userId}`, {
      headers: {
        'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (verifyResponse.ok) {
      const verifyResult = await verifyResponse.json();
      console.log('Dados salvos encontrados:', verifyResult);
    } else {
      console.error('Erro ao verificar dados salvos:', await verifyResponse.text());
    }
    
  } catch (error) {
    console.error('Erro ao testar gravação:', error);
  }
}

// Executar o teste
testSaveSettings(); 