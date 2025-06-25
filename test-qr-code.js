// Script para testar a resposta da Evolution API
const testQRCode = async () => {
  const url = 'http://localhost:8080'; // Ajuste para sua URL
  const key = 'sua-chave-api'; // Ajuste para sua chave
  
  try {
    console.log('Testando endpoint GET /instance/connect/carlos...');
    
    const response = await fetch(`${url}/instance/connect/carlos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key
      }
    });
    
    console.log('Status da resposta:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Resposta completa:', JSON.stringify(data, null, 2));
    
    // Verificar diferentes possíveis campos para QR code
    console.log('\nVerificando campos de QR code:');
    console.log('data.qrcode:', data.qrcode);
    console.log('data.qr_code:', data.qr_code);
    console.log('data.qrCode:', data.qrCode);
    console.log('data.qr:', data.qr);
    console.log('data.code:', data.code);
    
    // Verificar diferentes possíveis campos para status
    console.log('\nVerificando campos de status:');
    console.log('data.status:', data.status);
    console.log('data.connectionStatus:', data.connectionStatus);
    console.log('data.state:', data.state);
    console.log('data.connection_state:', data.connection_state);
    
    // Verificar estrutura geral
    console.log('\nEstrutura da resposta:');
    console.log('Chaves disponíveis:', Object.keys(data));
    
  } catch (error) {
    console.error('Erro no teste:', error);
  }
};

// Executar o teste
testQRCode(); 