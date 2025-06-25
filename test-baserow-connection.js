const BASEROW_CONFIG = {
  API_URL: 'https://master-baserow.219u5p.easypanel.host/api',
  TOKEN: 'jrHE9jWKMz9i79Bh7ZszvQo81LThqOSx'
};

const TABLE_ID = 644; // WhatsApp Settings

async function testBaserowConnection() {
  console.log('=== Testando conexão com Baserow ===');
  
  // 1. Testar endpoint básico (sem filtro)
  console.log('\n1. Testando busca sem filtro...');
  try {
    const response1 = await fetch(`${BASEROW_CONFIG.API_URL}/database/rows/table/${TABLE_ID}/?user_field_names=true`, {
      headers: {
        'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Status sem filtro:', response1.status);
    
    if (response1.ok) {
      const result1 = await response1.json();
      console.log('Resultado sem filtro:', result1);
    } else {
      const error1 = await response1.text();
      console.error('Erro sem filtro:', error1);
    }
  } catch (error) {
    console.error('Erro na requisição sem filtro:', error);
  }
  
  // 2. Testar com filtro de user_id
  console.log('\n2. Testando busca com filtro user_id=12...');
  try {
    const response2 = await fetch(`${BASEROW_CONFIG.API_URL}/database/rows/table/${TABLE_ID}/?user_field_names=true&filter__field_user_id__equal=12`, {
      headers: {
        'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Status com filtro:', response2.status);
    
    if (response2.ok) {
      const result2 = await response2.json();
      console.log('Resultado com filtro:', result2);
    } else {
      const error2 = await response2.text();
      console.error('Erro com filtro:', error2);
    }
  } catch (error) {
    console.error('Erro na requisição com filtro:', error);
  }
  
  // 3. Testar com filtro de user_id como string
  console.log('\n3. Testando busca com filtro user_id="12"...');
  try {
    const response3 = await fetch(`${BASEROW_CONFIG.API_URL}/database/rows/table/${TABLE_ID}/?user_field_names=true&filter__field_user_id__equal="12"`, {
      headers: {
        'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Status com filtro string:', response3.status);
    
    if (response3.ok) {
      const result3 = await response3.json();
      console.log('Resultado com filtro string:', result3);
    } else {
      const error3 = await response3.text();
      console.error('Erro com filtro string:', error3);
    }
  } catch (error) {
    console.error('Erro na requisição com filtro string:', error);
  }
}

// Executar o teste
testBaserowConnection(); 