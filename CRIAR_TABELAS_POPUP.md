# 🚀 Como Criar as Tabelas de Pop-up no Baserow

## 📋 Passo a Passo

### 1. Acessar o Baserow
1. Vá para: `https://master-baserow.219u5p.easypanel.host`
2. Faça login com suas credenciais
3. Acesse o banco de dados `CELX Lead Nexus`

### 2. Criar Tabela POPUP_CONFIGS

#### 2.1 Criar Nova Tabela
1. Clique em **"Create table"** ou **"+"**
2. Nome da tabela: `POPUP_CONFIGS`
3. Clique em **"Create"**

#### 2.2 Adicionar Campos
Adicione os seguintes campos na ordem:

| Nome do Campo | Tipo | Configurações |
|---------------|------|---------------|
| `title` | Text | Required: ✅ |
| `message` | Long text | Required: ✅ |
| `show_email_field` | Boolean | Default: false |
| `email_placeholder` | Text | Required: ❌ |
| `button_text` | Text | Required: ✅ |
| `pdf_url` | URL | Required: ❌ |
| `delay` | Number | Required: ✅, Default: 5 |
| `pages` | Text | Required: ✅ |
| `is_active` | Boolean | Required: ✅, Default: true |
| `created_at` | Date | Required: ✅ |
| `updated_at` | Date | Required: ✅ |

### 3. Criar Tabela POPUP_EMAILS

#### 3.1 Criar Nova Tabela
1. Clique em **"Create table"** ou **"+"**
2. Nome da tabela: `POPUP_EMAILS`
3. Clique em **"Create"**

#### 3.2 Adicionar Campos
Adicione os seguintes campos na ordem:

| Nome do Campo | Tipo | Configurações |
|---------------|------|---------------|
| `email` | Email | Required: ✅ |
| `popup_id` | Number | Required: ✅ |
| `page` | Text | Required: ✅ |
| `timestamp` | Date | Required: ✅ |
| `created_at` | Date | Required: ✅ |

### 4. Importar Dados de Exemplo

#### 4.1 Importar POPUP_CONFIGS
1. Abra a tabela `POPUP_CONFIGS`
2. Clique em **"Import"** ou **"Upload"**
3. Selecione o arquivo: `popup_configs.csv`
4. Configure o mapeamento dos campos
5. Clique em **"Import"**

#### 4.2 Importar POPUP_EMAILS
1. Abra a tabela `POPUP_EMAILS`
2. Clique em **"Import"** ou **"Upload"**
3. Selecione o arquivo: `popup_emails.csv`
4. Configure o mapeamento dos campos
5. Clique em **"Import"**

### 5. Obter IDs das Tabelas

#### 5.1 Verificar ID da POPUP_CONFIGS
1. Na tabela `POPUP_CONFIGS`, clique em **"Settings"**
2. Anote o **Table ID** (ex: 636)
3. Adicione ao seu `.env`:
   ```env
   VITE_BASEROW_POPUP_CONFIGS_TABLE_ID=636
   ```

#### 5.2 Verificar ID da POPUP_EMAILS
1. Na tabela `POPUP_EMAILS`, clique em **"Settings"**
2. Anote o **Table ID** (ex: 637)
3. Adicione ao seu `.env`:
   ```env
   VITE_BASEROW_POPUP_EMAILS_TABLE_ID=637
   ```

### 6. Testar o Sistema

#### 6.1 Verificar Configuração
1. Reinicie o servidor de desenvolvimento
2. Acesse: `http://localhost:3000/admin/popups`
3. Verifique se os pop-ups aparecem na lista

#### 6.2 Testar Pop-up
1. Acesse: `http://localhost:3000/`
2. Aguarde o delay configurado
3. Verifique se o pop-up aparece
4. Teste a captura de email

## 🔧 Configurações Adicionais

### Permissões
- Certifique-se de que o token do Baserow tem permissão de leitura/escrita nas tabelas
- Verifique se as tabelas estão visíveis para o usuário da API

### Validações
- Todos os campos obrigatórios devem estar marcados como "Required"
- Os campos de data devem ter formato ISO
- Os campos boolean devem ter valores padrão

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro 404 ao acessar tabelas**:
   - Verifique se os IDs das tabelas estão corretos
   - Confirme se as tabelas foram criadas no banco correto

2. **Erro de permissão**:
   - Verifique se o token tem acesso às tabelas
   - Confirme se o usuário tem permissões adequadas

3. **Dados não aparecem**:
   - Verifique se a importação foi bem-sucedida
   - Confirme se os nomes dos campos estão corretos

4. **Pop-up não aparece**:
   - Verifique se há pop-ups ativos
   - Confirme se a página atual está na lista de páginas

## ✅ Checklist Final

- [ ] Tabela POPUP_CONFIGS criada
- [ ] Tabela POPUP_EMAILS criada
- [ ] Todos os campos adicionados corretamente
- [ ] Dados de exemplo importados
- [ ] IDs das tabelas anotados
- [ ] Variáveis de ambiente configuradas
- [ ] Sistema testado e funcionando

---

**Pronto!** Agora você pode usar o sistema de pop-ups no painel administrativo. 🎉 