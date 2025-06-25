// Teste para verificar o user_id
const BASEROW_CONFIG = {
  API_URL: 'https://master-baserow.219u5p.easypanel.host/api',
  TOKEN: 'jrHE9jWKMz9i79Bh7ZszvQo81LThqOSx',
};

// Simular o localStorage do navegador
const mockLocalStorage = {
  celx_user: JSON.stringify({
    id: 1,
    username: 'admin',
    email: 'admin@example.com'
  })
};

// Função para obter o user_id (simulando o código do sistema)
const getCurrentUserId = () => {
  const userStr = mockLocalStorage.celx_user;
  if (!userStr) {
    throw new Error('Usuário não autenticado');
  }
  const user = JSON.parse(userStr);
  return Number(user.id);
};

async function testUserId() {
  console.log('🔍 Testando user_id do sistema...\n');
  
  try {
    const userId = getCurrentUserId();
    console.log('1️⃣ User ID do sistema:', userId);
    
    // Teste 2: Buscar configurações do usuário específico
    console.log('\n2️⃣ Buscando configurações do usuário', userId, '...');
    const response = await fetch(`${BASEROW_CONFIG.API_URL}/database/rows/table/644/?user_field_names=true&filter__field_user_id__equal=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
      }
    });
    
    console.log('Status da busca:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Configurações encontradas:', data);
      
      if (data.results && data.results.length > 0) {
        console.log('✅ Configurações encontradas para o usuário', userId);
        console.log('Dados:', data.results[0]);
      } else {
        console.log('❌ Nenhuma configuração encontrada para o usuário', userId);
      }
    } else {
      const errorText = await response.text();
      console.log('Erro na busca:', errorText);
    }
    
    // Teste 3: Listar todos os usuários na tabela
    console.log('\n3️⃣ Listando todos os registros na tabela...');
    const allResponse = await fetch(`${BASEROW_CONFIG.API_URL}/database/rows/table/644/?user_field_names=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
      }
    });
    
    if (allResponse.ok) {
      const allData = await allResponse.json();
      console.log('Todos os registros:', allData.results);
      
      console.log('\n📊 Resumo dos user_ids na tabela:');
      allData.results.forEach((record, index) => {
        console.log(`Registro ${index + 1}: user_id = ${record.user_id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Executar o teste
testUserId(); 