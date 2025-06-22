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