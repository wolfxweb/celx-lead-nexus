# Sequência de Importação - Sistema de Licenças WhatsApp

## 📋 Arquivos CSV Criados

✅ **Arquivos na pasta `tabelas`**:
- `whatsapp_licenses.csv` - Licenças disponíveis
- `whatsapp_license_purchases.csv` - Compras de licenças

## 🚀 Sequência de Importação

### 1. Criar as Tabelas no Baserow

#### Tabela: `whatsapp_licenses`
1. Criar nova tabela no Baserow
2. Nome: `whatsapp_licenses`
3. Configurar campos:
   - `id` (Number, Primary Key, Auto-increment)
   - `name` (Text, Required)
   - `description` (Long Text)
   - `short_description` (Text)
   - `price` (Number, Required)
   - `original_price` (Number)
   - `license_type` (Single Select, Required)
     - Opções: `trial`, `basic`, `professional`, `enterprise`
   - `instance_limit` (Number, Required)
   - `message_limit` (Number)
   - `duration_days` (Number, Required)
   - `features` (Text)
   - `is_active` (Boolean, Required)
   - `is_featured` (Boolean)
   - `sales_count` (Number)
   - `rating` (Number)
   - `created_at` (Date, Required)
   - `updated_at` (Date, Required)

#### Tabela: `whatsapp_license_purchases`
1. Criar nova tabela no Baserow
2. Nome: `whatsapp_license_purchases`
3. Configurar campos:
   - `id` (Number, Primary Key, Auto-increment)
   - `user_id` (Number, Required)
   - `license_id` (Number, Required)
   - `purchase_date` (Date, Required)
   - `expiry_date` (Date, Required)
   - `status` (Single Select, Required)
     - Opções: `active`, `expired`, `cancelled`, `suspended`
   - `instances_created` (Number)
   - `messages_sent` (Number)
   - `payment_status` (Single Select, Required)
     - Opções: `pending`, `completed`, `failed`, `refunded`
   - `created_at` (Date, Required)
   - `updated_at` (Date, Required)

### 2. Importar os Dados CSV

#### Ordem de Importação:
1. **Primeiro**: `whatsapp_licenses.csv`
2. **Segundo**: `whatsapp_license_purchases.csv`

### 3. Configurar Variáveis de Ambiente

Adicionar ao arquivo `.env`:

```env
# WhatsApp Licenses
VITE_BASEROW_WHATSAPP_LICENSES_TABLE_ID=647
VITE_BASEROW_WHATSAPP_LICENSE_PURCHASES_TABLE_ID=648
```

### 4. Verificar Configuração

Os IDs das tabelas devem ser adicionados ao arquivo `src/config/baserowTables.ts`:

```typescript
// Tabela de licenças do WhatsApp
WHATSAPP_LICENSES: {
  id: parseInt(import.meta.env.VITE_BASEROW_WHATSAPP_LICENSES_TABLE_ID || '647'),
  fields: {
    id: 'id',
    name: 'name',
    description: 'description',
    short_description: 'short_description',
    price: 'price',
    original_price: 'original_price',
    license_type: 'license_type',
    instance_limit: 'instance_limit',
    message_limit: 'message_limit',
    duration_days: 'duration_days',
    features: 'features',
    is_active: 'is_active',
    is_featured: 'is_featured',
    sales_count: 'sales_count',
    rating: 'rating',
    created_at: 'created_at',
    updated_at: 'updated_at',
  }
},

// Tabela de compras de licenças
WHATSAPP_LICENSE_PURCHASES: {
  id: parseInt(import.meta.env.VITE_BASEROW_WHATSAPP_LICENSE_PURCHASES_TABLE_ID || '648'),
  fields: {
    id: 'id',
    user_id: 'user_id',
    license_id: 'license_id',
    purchase_date: 'purchase_date',
    expiry_date: 'expiry_date',
    status: 'status',
    instances_created: 'instances_created',
    messages_sent: 'messages_sent',
    payment_status: 'payment_status',
    created_at: 'created_at',
    updated_at: 'updated_at',
  }
},
```

## ✅ Verificação Final

1. Verificar se as tabelas foram criadas corretamente
2. Confirmar se os dados foram importados
3. Testar a conexão através da aplicação
4. Verificar se as variáveis de ambiente estão configuradas

## 🔧 Próximos Passos

Após a importação, será necessário:
1. Criar o serviço de licenças
2. Criar a página de administração de licenças
3. Integrar com o sistema de pagamentos
4. Implementar validações de licenças
