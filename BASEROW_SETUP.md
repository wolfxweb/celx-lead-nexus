# Configuração do Baserow - CELX Lead Nexus

## 📋 Visão Geral

Este guia explica como configurar o Baserow como backend para o projeto CELX Lead Nexus.

**URL do Baserow:** https://master-baserow.219u5p.easypanel.host

## 🚀 Passo a Passo

### 1. Acessar o Baserow

1. Acesse: https://master-baserow.219u5p.easypanel.host
2. Faça login com suas credenciais
3. Crie um novo workspace ou use um existente

### 2. Criar o Banco de Dados

1. Clique em "Create a new database"
2. Nome: `CELX Lead Nexus`
3. Descrição: `Banco de dados para e-commerce e blog`

### 3. Criar a Tabela `categories`

#### Estrutura da Tabela:

| Campo | Tipo | Configurações | Descrição |
|-------|------|---------------|-----------|
| `id` | Number | Auto-increment, Primary Key | ID único |
| `name` | Text | Obrigatório, Máx 255 chars | Nome da categoria |
| `slug` | Text | Obrigatório, Único, Máx 255 chars | URL amigável |
| `description` | Long Text | Opcional | Descrição |
| `color` | Single Select | Opções: blue, green, red, purple, orange, pink, teal, indigo | Cor |
| **`type`** | **Single Select** | **Obrigatório, Opções: product, blog** | **Tipo da categoria** |
| `created_at` | Date | Auto-created | Data de criação |
| `updated_at` | Date | Auto-updated | Data de atualização |

#### Configuração do Campo `type`:

**Tipo:** Single Select  
**Opções:**
- `product` (Categorias de Produtos)
- `blog` (Categorias de Blog)

**Configurações:**
- ✅ **Obrigatório:** Sim
- ✅ **Valor padrão:** `product`
- ✅ **Permitir valores vazios:** Não

### 4. Importar Dados Iniciais

1. Na tabela `categories`, clique em "Import"
2. Selecione o arquivo: `tabelas/categories.csv`
3. Mapeie os campos corretamente
4. Importe os dados

### 5. Configurar Permissões

#### Para Admin:
- ✅ Criar/editar/excluir categorias de qualquer tipo
- ✅ Ver todas as categorias

#### Para Editor:
- ✅ Criar/editar categorias de blog
- ❌ Não pode excluir categorias em uso
- ❌ Não pode gerenciar categorias de produtos

#### Para Vendedor:
- ✅ Criar/editar categorias de produtos  
- ❌ Não pode excluir categorias em uso
- ❌ Não pode gerenciar categorias de blog

### 6. Obter IDs e Token

#### Database ID:
1. Vá para o banco de dados
2. Copie o ID da URL: `https://master-baserow.219u5p.easypanel.host/database/{DATABASE_ID}/`

#### Table ID:
1. Vá para a tabela `categories`
2. Copie o ID da URL: `https://master-baserow.219u5p.easypanel.host/database/{DATABASE_ID}/table/{TABLE_ID}/`

#### API Token:
1. Vá em "Settings" → "API tokens"
2. Clique em "Create a new token"
3. Nome: `CELX Lead Nexus API`
4. Permissões: Selecione as permissões necessárias
5. Copie o token gerado

### 7. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Baserow Configuration
VITE_BASEROW_BASE_URL=https://master-baserow.219u5p.easypanel.host
VITE_BASEROW_API_URL=https://master-baserow.219u5p.easypanel.host/api
VITE_BASEROW_DATABASE_ID=your_database_id_here
VITE_BASEROW_TOKEN=your_api_token_here

# Table IDs
VITE_BASEROW_CATEGORIES_TABLE_ID=your_categories_table_id_here
VITE_BASEROW_PRODUCTS_TABLE_ID=your_products_table_id_here
VITE_BASEROW_BLOG_POSTS_TABLE_ID=your_blog_posts_table_id_here
VITE_BASEROW_USERS_TABLE_ID=your_users_table_id_here
VITE_BASEROW_ORDERS_TABLE_ID=your_orders_table_id_here
VITE_BASEROW_ORDER_ITEMS_TABLE_ID=your_order_items_table_id_here
VITE_BASEROW_REVIEWS_TABLE_ID=your_reviews_table_id_here

# App Configuration
VITE_APP_NAME=CELX Lead Nexus
VITE_APP_DESCRIPTION=Plataforma de produtos digitais e blog
VITE_APP_URL=http://localhost:3000
```

### 8. Testar a Conexão

1. Inicie o projeto: `npm run dev`
2. Acesse: `http://localhost:3000/baserow-test`
3. Execute os testes de conexão
4. Verifique se todos os testes passam

## 📊 Estrutura de Dados

### Categorias (categories.csv)

**Categorias de Produtos:**
- Templates (blue)
- Cursos (green)
- Plugins (purple)
- E-books (orange)
- Ícones (pink)
- Ferramentas (red)
- Design (teal)
- Marketing (indigo)

**Categorias de Blog:**
- Tecnologia (blue)
- Segurança (red)
- Cloud (purple)
- Inteligência Artificial (green)
- Marketing Digital (orange)
- Desenvolvimento (indigo)
- Design UX/UI (pink)
- E-commerce (teal)

## 🔧 API Endpoints

### Categorias

```bash
# Listar todas as categorias
GET /api/database/rows/table/{categories_table_id}/

# Filtrar por tipo
GET /api/database/rows/table/{categories_table_id}/?filter__field_{type_field_id}__equal=product
GET /api/database/rows/table/{categories_table_id}/?filter__field_{type_field_id}__equal=blog

# Buscar por nome
GET /api/database/rows/table/{categories_table_id}/?search=tecnologia

# Criar categoria
POST /api/database/rows/table/{categories_table_id}/
{
  "name": "Nova Categoria",
  "slug": "nova-categoria",
  "description": "Descrição da categoria",
  "color": "blue",
  "type": "product"
}

# Atualizar categoria
PATCH /api/database/rows/table/{categories_table_id}/{row_id}/
{
  "name": "Nome Atualizado"
}

# Deletar categoria
DELETE /api/database/rows/table/{categories_table_id}/{row_id}/
```

## 🎯 Próximos Passos

1. ✅ Configurar tabela `categories`
2. 🔄 Criar tabela `products`
3. 🔄 Criar tabela `blog_posts`
4. 🔄 Criar tabela `users`
5. 🔄 Criar tabela `orders`
6. 🔄 Criar tabela `order_items`
7. 🔄 Criar tabela `reviews`
8. 🔄 Configurar relacionamentos
9. 🔄 Implementar autenticação
10. 🔄 Migrar dados existentes

## 🐛 Troubleshooting

### Erro de Conexão
- Verifique se a URL está correta
- Confirme se o token é válido
- Verifique as permissões do token

### Erro de Permissão
- Verifique se o usuário tem permissão para a tabela
- Confirme se o token tem as permissões necessárias

### Erro de Campo
- Verifique se os nomes dos campos estão corretos
- Confirme se os tipos de dados estão corretos

## 📞 Suporte

Para dúvidas sobre a configuração do Baserow, consulte:
- [Documentação do Baserow](https://baserow.io/docs)
- [API Reference](https://baserow.io/docs/apis/rest-api)
- [Community Forum](https://community.baserow.io/)

# Configuração do Baserow para Autenticação

## 1. Configuração da Tabela de Usuários

### Criar Tabela "Users"
No seu Baserow, crie uma tabela chamada "Users" com os seguintes campos:

| Nome do Campo | Tipo | Configurações |
|---------------|------|---------------|
| ID | Number | Auto-incremento |
| Name | Text | Obrigatório |
| Email | Text | Obrigatório, Único |
| Password | Text | Obrigatório |
| Role | Single select | Opções: "user", "admin" |
| Avatar | Text | Opcional |
| Created At | Date | Automático |
| Updated At | Date | Automático |
| Last Login | Date | Opcional |

### Configurações Específicas:
- **Email**: Marcar como "Unique" para evitar duplicatas
- **Password**: Será armazenado como hash SHA-256 (em produção, use bcrypt)
- **Role**: Single select com opções "user" e "admin"
- **Created At** e **Updated At**: Configurar para preenchimento automático

## 2. Configuração das Permissões

### Permissões da Tabela Users:
- **Criar**: Todos os usuários autenticados
- **Ver**: Próprio registro + admins
- **Modificar**: Próprio registro + admins
- **Excluir**: Apenas admins

## 3. Configuração do Arquivo de Configuração

### Atualizar `src/config/baserowTables.ts`:
```typescript
export const BASEROW_TABLES = {
  USERS: {
    id: 1, // Substitua pelo ID real da sua tabela
    fields: {
      id: 'field_1',
      name: 'field_2',      // Substitua pelos IDs reais dos campos
      email: 'field_3',
      password: 'field_4',
      role: 'field_5',
      avatar: 'field_6',
      created_at: 'field_7',
      updated_at: 'field_8',
      last_login: 'field_9',
    }
  },
  // ... outras tabelas
};
```

### Como encontrar os IDs dos campos:
1. Vá para a tabela no Baserow
2. Clique em "Settings" (Configurações)
3. Vá para "Fields" (Campos)
4. Cada campo terá um ID como "field_1", "field_2", etc.

## 4. Variáveis de Ambiente

### Criar arquivo `.env.local`:
```env
VITE_BASEROW_BASE_URL=https://seu-baserow.easypanel.host
VITE_BASEROW_API_URL=https://seu-baserow.easypanel.host/api
VITE_BASEROW_DATABASE_ID=seu_database_id
VITE_BASEROW_TOKEN=seu_token_admin
```

### Como obter essas informações:
1. **BASE_URL** e **API_URL**: URL do seu Baserow
2. **DATABASE_ID**: ID do seu banco de dados no Baserow
3. **TOKEN**: Token de administrador do Baserow

## 5. Testando a Configuração

### Acesse a página de teste:
```
http://localhost:8080/auth-test
```

### Funcionalidades para testar:
1. **Registro**: Criar novo usuário
2. **Login**: Fazer login com usuário existente
3. **Logout**: Sair da aplicação
4. **Persistência**: Recarregar a página para verificar se o login persiste

## 6. Fluxo de Autenticação

### Registro:
1. Usuário preenche formulário
2. Sistema verifica se email já existe
3. Senha é hasheada (SHA-256)
4. Usuário é criado com role "user"
5. Usuário é automaticamente logado

### Login:
1. Usuário fornece email e senha
2. Sistema autentica com Baserow API
3. Se válido, busca dados completos do usuário
4. Atualiza último login
5. Salva token e dados no localStorage

### Logout:
1. Remove dados do localStorage
2. Limpa estado da aplicação

## 7. Segurança

### Implementações Atuais:
- Hash de senha (SHA-256)
- Validação de email único
- Tokens de autenticação
- Role-based access control

### Melhorias para Produção:
- Usar bcrypt para hash de senhas
- Implementar refresh tokens
- Adicionar rate limiting
- Implementar 2FA
- Usar HTTPS
- Implementar CORS adequadamente

## 8. Troubleshooting

### Problemas Comuns:

**Erro 401/403:**
- Verificar se o token está correto
- Verificar permissões da tabela

**Erro ao criar usuário:**
- Verificar se todos os campos obrigatórios estão configurados
- Verificar se o email é único

**Erro de conexão:**
- Verificar URLs do Baserow
- Verificar se o Baserow está acessível

**Campo não encontrado:**
- Verificar IDs dos campos no `baserowTables.ts`
- Verificar se os nomes dos campos estão corretos

## 9. Próximos Passos

1. Configurar tabelas para produtos, categorias, pedidos
2. Implementar upload de imagens
3. Configurar webhooks para sincronização
4. Implementar cache para melhor performance
5. Adicionar logs de auditoria 