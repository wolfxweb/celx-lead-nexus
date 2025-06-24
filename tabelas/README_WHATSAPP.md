# Configuração das Tabelas WhatsApp no Baserow

Este documento descreve como configurar as tabelas necessárias para a integração WhatsApp com a Evolution API no Baserow.

## 🔒 Segurança Implementada

**IMPORTANTE**: Todas as tabelas agora incluem filtros automáticos por `user_id` para garantir que cada usuário só acesse seus próprios dados. O sistema automaticamente:

- Filtra todas as consultas pelo `user_id` do usuário logado
- Verifica permissões antes de qualquer operação de modificação
- Impede acesso a dados de outros usuários
- Adiciona automaticamente o `user_id` em todas as criações

## 📋 Tabelas Necessárias

### 1. WhatsApp Instances (`whatsapp_instances`)

**Descrição**: Armazena as instâncias do WhatsApp conectadas à Evolution API.

**Campos**:
- `id` (Number, Primary Key, Auto-increment)
- `name` (Text, Required) - Nome da instância
- `phone` (Text, Required) - Número do telefone
- `status` (Single Select, Required) - Status da conexão
  - Opções: `connected`, `disconnected`, `connecting`, `error`
- `qr_code` (Long Text, Optional) - Código QR para conexão
- `created_at` (Date, Required) - Data de criação
- `updated_at` (Date, Required) - Data de atualização
- `user_id` (Number, Required) - ID do usuário proprietário

**Configuração**:
```sql
-- Criar tabela
CREATE TABLE whatsapp_instances (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'disconnected',
  qr_code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES auth_user(id)
);

-- Índice para performance
CREATE INDEX idx_whatsapp_instances_user_id ON whatsapp_instances(user_id);
```

### 2. WhatsApp Messages (`whatsapp_messages`)

**Descrição**: Armazena todas as mensagens enviadas e recebidas.

**Campos**:
- `id` (Number, Primary Key, Auto-increment)
- `instance_id` (Number, Required) - Referência à instância
- `to` (Text, Required) - Número de destino
- `message` (Long Text, Required) - Conteúdo da mensagem
- `type` (Single Select, Required) - Tipo da mensagem
  - Opções: `text`, `image`, `document`, `audio`, `video`
- `status` (Single Select, Required) - Status da mensagem
  - Opções: `pending`, `sent`, `delivered`, `read`, `failed`
- `scheduled_at` (Date, Optional) - Data agendada para envio
- `sent_at` (Date, Optional) - Data de envio
- `created_at` (Date, Required) - Data de criação
- `user_id` (Number, Required) - ID do usuário proprietário

**Configuração**:
```sql
-- Criar tabela
CREATE TABLE whatsapp_messages (
  id SERIAL PRIMARY KEY,
  instance_id INTEGER NOT NULL REFERENCES whatsapp_instances(id),
  to_number VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'text',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES auth_user(id)
);

-- Índices para performance
CREATE INDEX idx_whatsapp_messages_user_id ON whatsapp_messages(user_id);
CREATE INDEX idx_whatsapp_messages_instance_id ON whatsapp_messages(instance_id);
CREATE INDEX idx_whatsapp_messages_status ON whatsapp_messages(status);
```

### 3. WhatsApp Webhooks (`whatsapp_webhooks`)

**Descrição**: Configurações de webhooks para receber eventos da Evolution API.

**Campos**:
- `id` (Number, Primary Key, Auto-increment)
- `instance_id` (Number, Required) - Referência à instância
- `url` (Text, Required) - URL do webhook
- `events` (Long Text, Required) - Array JSON de eventos
- `is_active` (Boolean, Required) - Status ativo/inativo
- `created_at` (Date, Required) - Data de criação
- `user_id` (Number, Required) - ID do usuário proprietário

**Configuração**:
```sql
-- Criar tabela
CREATE TABLE whatsapp_webhooks (
  id SERIAL PRIMARY KEY,
  instance_id INTEGER NOT NULL REFERENCES whatsapp_instances(id),
  url VARCHAR(500) NOT NULL,
  events JSON NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES auth_user(id)
);

-- Índices para performance
CREATE INDEX idx_whatsapp_webhooks_user_id ON whatsapp_webhooks(user_id);
CREATE INDEX idx_whatsapp_webhooks_instance_id ON whatsapp_webhooks(instance_id);
```

### 4. WhatsApp Settings (`whatsapp_settings`)

**Descrição**: Configurações globais do WhatsApp para cada usuário.

**Campos**:
- `id` (Number, Primary Key, Auto-increment)
- `user_id` (Number, Required) - ID do usuário proprietário
- `evolution_api_url` (Text, Required) - URL da Evolution API
- `evolution_api_key` (Text, Required) - Chave da API
- `default_instance_id` (Number, Optional) - Instância padrão
- `created_at` (Date, Required) - Data de criação
- `updated_at` (Date, Required) - Data de atualização

**Configuração**:
```sql
-- Criar tabela
CREATE TABLE whatsapp_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES auth_user(id) UNIQUE,
  evolution_api_url VARCHAR(500) NOT NULL,
  evolution_api_key VARCHAR(255) NOT NULL,
  default_instance_id INTEGER REFERENCES whatsapp_instances(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para performance
CREATE INDEX idx_whatsapp_settings_user_id ON whatsapp_settings(user_id);
```

## 🔧 Configuração no Baserow

### Passo 1: Criar as Tabelas

1. Acesse o Baserow
2. Crie uma nova tabela para cada uma das 4 tabelas acima
3. Configure os campos conforme especificado
4. Configure as relações entre as tabelas

### Passo 2: Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# WhatsApp Tables
VITE_BASEROW_WHATSAPP_INSTANCES_TABLE_ID=YOUR_TABLE_ID
VITE_BASEROW_WHATSAPP_MESSAGES_TABLE_ID=YOUR_TABLE_ID
VITE_BASEROW_WHATSAPP_WEBHOOKS_TABLE_ID=YOUR_TABLE_ID
VITE_BASEROW_WHATSAPP_SETTINGS_TABLE_ID=YOUR_TABLE_ID

# Evolution API
VITE_EVOLUTION_API_URL=https://sua-evolution-api.com
VITE_EVOLUTION_API_KEY=sua-api-key
```

### Passo 3: Configurar Relacionamentos

No Baserow, configure os seguintes relacionamentos:

1. **WhatsApp Messages** → **WhatsApp Instances** (via `instance_id`)
2. **WhatsApp Webhooks** → **WhatsApp Instances** (via `instance_id`)
3. **WhatsApp Settings** → **WhatsApp Instances** (via `default_instance_id`)
4. **Todas as tabelas** → **Users** (via `user_id`)

## 🚀 Funcionalidades Implementadas

### Segurança Automática
- ✅ Filtro automático por `user_id` em todas as consultas
- ✅ Verificação de permissões antes de operações
- ✅ Isolamento completo de dados entre usuários
- ✅ Prevenção de acesso não autorizado

### Gestão de Instâncias
- ✅ Criar, listar e deletar instâncias
- ✅ Conectar/desconectar instâncias
- ✅ Visualizar status e QR code
- ✅ Filtro automático por usuário

### Gestão de Mensagens
- ✅ Enviar mensagens (texto, imagem, documento, áudio, vídeo)
- ✅ Agendar mensagens
- ✅ Visualizar histórico de mensagens
- ✅ Filtrar por instância e status
- ✅ Relatórios de envio

### Gestão de Webhooks
- ✅ Criar e configurar webhooks
- ✅ Definir eventos específicos
- ✅ Ativar/desativar webhooks
- ✅ Visualizar logs de eventos

### Configurações
- ✅ Configurar Evolution API por usuário
- ✅ Definir instância padrão
- ✅ Gerenciar chaves de API
- ✅ Configurações personalizadas

## 📊 Relatórios Disponíveis

O sistema gera automaticamente relatórios baseados nos dados do usuário:

- Total de mensagens enviadas
- Taxa de entrega e leitura
- Mensagens por tipo
- Performance por instância
- Histórico de atividades

## 🔄 Próximos Passos

1. **Testar a Integração**:
   - Criar uma instância de teste
   - Configurar a Evolution API
   - Enviar uma mensagem de teste

2. **Configurar Webhooks**:
   - Definir URLs de callback
   - Configurar eventos desejados
   - Testar recebimento de eventos

3. **Monitoramento**:
   - Configurar alertas de status
   - Monitorar performance
   - Revisar logs de erro

4. **Produção**:
   - Configurar SSL para webhooks
   - Implementar rate limiting
   - Configurar backup dos dados

## 🛡️ Considerações de Segurança

- Todas as operações são filtradas automaticamente por `user_id`
- Verificação de permissões em todas as operações de modificação
- Isolamento completo de dados entre usuários
- Logs de auditoria para todas as operações
- Validação de entrada em todos os campos
- Sanitização de dados antes do armazenamento

## 📞 Suporte

Para dúvidas ou problemas com a configuração, consulte:
- Documentação da Evolution API
- Logs do sistema
- Configurações do Baserow
- Variáveis de ambiente 