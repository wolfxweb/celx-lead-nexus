const BASEROW_CONFIG = {
  API_URL: 'https://master-baserow.219u5p.easypanel.host/api',
  TOKEN: 'jrHE9jWKMz9i79Bh7ZszvQo81LThqOSx'
};

const TABLE_ID = 644; // WhatsApp Settings

async function checkUserAndBaserow() {
  console.log('=== Verificando ID do usuário e dados do Baserow ===');
  
  // 1. Verificar localStorage (simulando o que o frontend faz)
  console.log('\n1. Verificando localStorage:');
  const userStr = localStorage.getItem('celx_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('Usuário do localStorage:', user);
      console.log('ID do usuário logado:', user.id);
      console.log('Tipo do ID:', typeof user.id);
    } catch (error) {
      console.error('Erro ao fazer parse do usuário:', error);
      return;
    }
  } else {
    console.log('Nenhum usuário encontrado no localStorage');
    return;
  }
  
  // 2. Buscar todas as configurações no Baserow
  console.log('\n2. Buscando todas as configurações no Baserow:');
  try {
    const response = await fetch(`${BASEROW_CONFIG.API_URL}/database/rows/table/${TABLE_ID}/?user_field_names=true`, {
      headers: {
        'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('Erro ao buscar configurações:', response.status, response.statusText);
      return;
    }
    
    const result = await response.json();
    console.log('Todas as configurações encontradas:', result.results);
    
    if (result.results && result.results.length > 0) {
      console.log('\n3. Detalhes de cada configuração:');
      result.results.forEach((config, index) => {
        console.log(`\nConfiguração ${index + 1}:`);
        console.log('  ID da linha:', config.id);
        console.log('  user_id:', config.user_id);
        console.log('  Tipo do user_id:', typeof config.user_id);
        console.log('  evolution_api_url:', config.evolution_api_url);
        console.log('  evolution_api_key:', config.evolution_api_key ? '***' : 'não definida');
      });
    } else {
      console.log('Nenhuma configuração encontrada no Baserow');
    }
    
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
  }
}

// Executar a verificação
checkUserAndBaserow(); 