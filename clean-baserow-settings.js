const BASEROW_CONFIG = {
  API_URL: 'https://master-baserow.219u5p.easypanel.host/api',
  TOKEN: 'jrHE9jWKMz9i79Bh7ZszvQo81LThqOSx'
};

const TABLE_ID = 644; // WhatsApp Settings

async function cleanBaserowSettings() {
  console.log('=== Limpando configurações antigas do Baserow ===');
  
  try {
    // 1. Buscar todas as configurações
    console.log('1. Buscando todas as configurações...');
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
    console.log(`Total de configurações encontradas: ${result.results ? result.results.length : 0}`);
    
    if (!result.results || result.results.length === 0) {
      console.log('Nenhuma configuração para limpar');
      return;
    }
    
    // 2. Mostrar configurações encontradas
    console.log('\n2. Configurações encontradas:');
    result.results.forEach((config, index) => {
      console.log(`  ${index + 1}. ID: ${config.id}, user_id: ${config.user_id}, URL: ${config.evolution_api_url || 'não definida'}`);
    });
    
    // 3. Perguntar se quer limpar
    console.log('\n3. Para limpar todas as configurações, execute:');
    console.log('   node clean-baserow-settings.js --clean');
    console.log('\n   Para limpar apenas configurações de um usuário específico:');
    console.log('   node clean-baserow-settings.js --clean-user=USER_ID');
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

async function deleteAllSettings() {
  console.log('=== DELETANDO TODAS AS CONFIGURAÇÕES ===');
  
  try {
    // 1. Buscar todas as configurações
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
    
    if (!result.results || result.results.length === 0) {
      console.log('Nenhuma configuração para deletar');
      return;
    }
    
    // 2. Deletar cada configuração
    console.log(`Deletando ${result.results.length} configurações...`);
    
    for (const config of result.results) {
      console.log(`Deletando configuração ID: ${config.id} (user_id: ${config.user_id})`);
      
      const deleteResponse = await fetch(`${BASEROW_CONFIG.API_URL}/database/rows/table/${TABLE_ID}/${config.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (deleteResponse.ok) {
        console.log(`✅ Configuração ${config.id} deletada com sucesso`);
      } else {
        console.error(`❌ Erro ao deletar configuração ${config.id}:`, deleteResponse.status, deleteResponse.statusText);
      }
    }
    
    console.log('\n✅ Limpeza concluída!');
    
  } catch (error) {
    console.error('Erro durante a limpeza:', error);
  }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.includes('--clean')) {
  deleteAllSettings();
} else if (args.includes('--clean-user')) {
  const userArg = args.find(arg => arg.startsWith('--clean-user='));
  if (userArg) {
    const userId = userArg.split('=')[1];
    console.log(`Função para limpar usuário ${userId} será implementada se necessário`);
  }
} else {
  cleanBaserowSettings();
} 