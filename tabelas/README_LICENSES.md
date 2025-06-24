# Sistema de Licenças WhatsApp - Tabelas CSV

Este documento explica como configurar as tabelas de licenças do WhatsApp no Baserow usando os arquivos CSV fornecidos.

## 📋 Tabelas Necessárias

### 1. WhatsApp Licenses (`whatsapp_licenses`)

**Descrição**: Armazena os diferentes planos e licenças disponíveis para venda.

**Campos**:
- `id` (Number, Primary Key, Auto-increment)
- `name` (Text, Required) - Nome da licença
- `description` (Long Text) - Descrição completa
- `short_description` (Text) - Descrição curta
- `price` (Number, Required) - Preço atual
- `original_price` (Number) - Preço original (para promoções)
- `license_type` (Single Select, Required) - Tipo de licença
  - Opções: `trial`, `basic`, `professional`, `enterprise`
- `instance_limit` (Number, Required) - Limite de instâncias
- `message_limit` (Number) - Limite de mensagens (para trial)
- `duration_days` (Number, Required) - Duração em dias
- `features` (Long Text) - Lista de recursos (JSON array como string)
- `is_active` (Boolean, Required) - Licença ativa
- `is_featured` (Boolean) - Licença em destaque
- `sales_count` (Number) - Contador de vendas
- `rating` (Number) - Avaliação média
- `created_at` (Date, Required) - Data de criação
- `updated_at` (Date, Required) - Data de atualização

### 2. WhatsApp License Purchases (`whatsapp_license_purchases`)

**Descrição**: Armazena as compras de licenças dos usuários.

**Campos**:
- `id` (Number, Primary Key, Auto-increment)
- `user_id` (Number, Required) - ID do usuário
- `license_id` (Number, Required) - ID da licença comprada
- `purchase_date` (Date, Required) - Data da compra
- `expiry_date` (Date, Required) - Data de expiração
- `status` (Single Select, Required) - Status da licença
  - Opções: `active`, `expired`, `cancelled`
- `instances_created` (Number) - Número de instâncias criadas
- `messages_sent` (Number) - Número de mensagens enviadas
- `payment_status` (Single Select, Required) - Status do pagamento
  - Opções: `pending`, `completed`, `failed`, `refunded`
- `created_at` (Date, Required) - Data de criação
- `updated_at` (Date, Required) - Data de atualização

## 🚀 Como Configurar

### Passo 1: Criar as Tabelas no Baserow

1. Acesse o Baserow
2. Crie uma nova tabela chamada `whatsapp_licenses`
3. Crie uma nova tabela chamada `whatsapp_license_purchases`
4. Configure os campos conforme especificado acima

### Passo 2: Importar os Dados

1. **Para whatsapp_licenses**:
   - Use o arquivo `whatsapp_licenses.csv`
   - Importe como CSV no Baserow
   - Verifique se os tipos de dados estão corretos

2. **Para whatsapp_license_purchases**:
   - Use o arquivo `whatsapp_license_purchases.csv`
   - Importe como CSV no Baserow
   - Verifique se os tipos de dados estão corretos

### Passo 3: Configurar Relacionamentos

1. **Relacionamento License Purchases → Licenses**:
   - Campo: `license_id` em `whatsapp_license_purchases`
   - Referência: `id` em `whatsapp_licenses`

2. **Relacionamento License Purchases → Users**:
   - Campo: `user_id` em `whatsapp_license_purchases`
   - Referência: `id` em `users` (tabela de usuários existente)

## 🎯 Dados de Exemplo

### Licenças Disponíveis

1. **Trial Gratuito**
   - Preço: Grátis
   - Duração: 7 dias
   - Instâncias: 1
   - Mensagens: 100

2. **Básico**
   - Preço: R$ 49,90/mês
   - Duração: 30 dias
   - Instâncias: 3
   - Mensagens: 1.000

3. **Profissional**
   - Preço: R$ 99,90/mês
   - Duração: 30 dias
   - Instâncias: 10
   - Mensagens: 5.000

4. **Enterprise**
   - Preço: R$ 199,90/mês
   - Duração: 30 dias
   - Instâncias: 50
   - Mensagens: 50.000

### Compras de Exemplo

- Usuário 1: Licença Básica (ativa)
- Usuário 2: Licença Profissional (ativa)
- Usuário 3: Trial Gratuito (expirado)
- Usuário 4: Licença Enterprise (ativa)
- Usuário 5: Licença Básica (pagamento pendente)

## 🔧 Recursos por Licença

### Trial
- `instances` - Instâncias básicas
- `messages` - Mensagens simples

### Básico
- `instances` - Múltiplas instâncias
- `messages` - Mensagens ilimitadas
- `webhooks` - Webhooks básicos
- `scheduling` - Agendamento de mensagens

### Profissional
- Todos os recursos do Básico
- `reports` - Relatórios detalhados
- `media` - Mídia completa
- `bulk` - Envio em massa
- `api` - API completa

### Enterprise
- Todos os recursos do Profissional
- `support` - Suporte prioritário
- `whitelabel` - White label

## ⚠️ Importante

1. **IDs de Usuários**: Certifique-se de que os `user_id` no arquivo de compras correspondem a usuários reais na sua tabela de usuários.

2. **Datas**: As datas estão no formato ISO 8601. O Baserow deve reconhecer automaticamente.

3. **Campos Booleanos**: Os valores `true`/`false` devem ser configurados como campos Boolean no Baserow.

4. **Campos Select**: Configure os campos `license_type`, `status` e `payment_status` como Single Select com as opções especificadas.

5. **Features**: O campo `features` armazena uma string JSON. Para facilitar a visualização, você pode criar um campo calculado que converte a string em uma lista.

## 🔄 Próximos Passos

Após importar as tabelas:

1. Configure as permissões de acesso
2. Teste a integração com o sistema
3. Implemente a lógica de validação de licenças
4. Configure o sistema de pagamentos
5. Implemente relatórios e analytics

## 📞 Suporte

Se encontrar problemas na importação ou configuração, verifique:

1. Se todos os campos estão configurados corretamente
2. Se os tipos de dados estão corretos
3. Se os relacionamentos estão funcionando
4. Se os dados de exemplo fazem sentido para seu caso de uso
