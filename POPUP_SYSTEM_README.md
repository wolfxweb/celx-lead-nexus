# Sistema de Pop-ups - CELX Lead Nexus

## 📋 Visão Geral

O sistema de pop-ups permite criar e gerenciar modais personalizados que aparecem automaticamente nas páginas do site. Os pop-ups podem capturar emails e oferecer downloads de PDFs.

## 🚀 Funcionalidades

### ✅ Recursos Principais
- **Configuração Flexível**: Título, mensagem e botão personalizáveis
- **Captura de Email**: Campo opcional para capturar emails dos visitantes
- **Download de PDF**: Botão para download após captura do email
- **Controle de Tempo**: Delay configurável antes de mostrar o pop-up
- **Seleção de Páginas**: Define em quais páginas o pop-up deve aparecer
- **Ativação/Desativação**: Controle total sobre quais pop-ups estão ativos

### 🎯 Casos de Uso
- **Lead Generation**: Capturar emails para newsletter
- **Content Marketing**: Oferecer e-books e materiais educativos
- **Consultoria**: Agendar reuniões e consultorias
- **Promoções**: Anunciar ofertas especiais

## 🛠️ Configuração

### 1. Criar Tabelas no Baserow

Use o arquivo `popup_tables_schema.csv` para criar as tabelas necessárias:

#### Tabela: POPUP_CONFIGS
- `title` (text) - Título do pop-up
- `message` (long_text) - Mensagem principal
- `show_email_field` (boolean) - Se deve mostrar campo de email
- `email_placeholder` (text) - Placeholder do campo email
- `button_text` (text) - Texto do botão
- `pdf_url` (url) - URL do PDF para download
- `delay` (number) - Delay em segundos
- `pages` (text) - Páginas onde deve aparecer (separadas por vírgula)
- `is_active` (boolean) - Se o pop-up está ativo

#### Tabela: POPUP_EMAILS
- `email` (email) - Email capturado
- `popup_id` (number) - ID do pop-up
- `page` (text) - Página onde foi capturado
- `timestamp` (date) - Data/hora da captura

### 2. Configurar Variáveis de Ambiente

Adicione ao seu arquivo `.env`:

```env
VITE_BASEROW_POPUP_CONFIGS_TABLE_ID=636
VITE_BASEROW_POPUP_EMAILS_TABLE_ID=637
```

### 3. Dados de Exemplo

Use o arquivo `popup_example_data.csv` para importar dados de exemplo no Baserow.

## 📱 Como Usar

### Para Administradores

1. **Acesse o Painel Admin**: `/admin/popups`
2. **Criar Novo Pop-up**:
   - Clique em "Novo Pop-up"
   - Preencha todos os campos obrigatórios
   - Configure o delay e as páginas
   - Ative o pop-up

3. **Editar Pop-up Existente**:
   - Clique no ícone de edição
   - Modifique os campos desejados
   - Salve as alterações

4. **Gerenciar Pop-ups**:
   - Visualize todos os pop-ups ativos/inativos
   - Exclua pop-ups desnecessários
   - Ative/desative conforme necessário

### Para Visitantes

1. **Navegação Normal**: Os pop-ups aparecem automaticamente
2. **Captura de Email**: Se configurado, preencha o email
3. **Download de PDF**: Após captura, clique em "Baixar PDF"
4. **Fechar Pop-up**: Use o X no canto superior direito

## 🎨 Personalização

### Estilo dos Pop-ups
Os pop-ups usam o design system do projeto com:
- Cores consistentes com a marca
- Animações suaves
- Responsividade total
- Acessibilidade

### Comportamento
- **Delay**: Tempo antes de aparecer (1-60 segundos)
- **Páginas**: Lista separada por vírgula (ex: "home,sobre,produtos")
- **Frequência**: Um pop-up por sessão por página

## 📊 Analytics

### Dados Capturados
- Email do visitante
- Página onde foi capturado
- Data/hora da captura
- ID do pop-up responsável

### Relatórios Disponíveis
- Total de emails capturados
- Performance por pop-up
- Conversão por página
- Histórico de capturas

## 🔧 Desenvolvimento

### Estrutura de Arquivos
```
src/
├── components/
│   └── PopupModal.tsx          # Componente do modal
├── hooks/
│   └── usePopup.ts             # Hook para gerenciar pop-ups
├── pages/
│   └── PopupAdmin.tsx          # Painel administrativo
└── config/
    └── baserowTables.ts        # Configuração das tabelas
```

### Componentes Principais

#### PopupModal
- Renderiza o modal do pop-up
- Gerencia estados de formulário
- Integra com WhatsApp para downloads
- Validação de email

#### usePopup Hook
- Busca configurações do Baserow
- Controla timing de exibição
- Salva emails capturados
- Gerencia estado do modal

#### PopupAdmin
- Interface completa de administração
- CRUD de pop-ups
- Visualização em tempo real
- Validação de dados

## 🚨 Troubleshooting

### Problemas Comuns

1. **Pop-up não aparece**:
   - Verifique se está ativo
   - Confirme se a página está na lista
   - Verifique o delay configurado

2. **Erro ao salvar email**:
   - Verifique a conexão com Baserow
   - Confirme se as tabelas existem
   - Verifique as variáveis de ambiente

3. **PDF não baixa**:
   - Confirme se a URL está correta
   - Verifique se o arquivo está acessível
   - Teste a URL diretamente

### Logs de Debug
Ative os logs no console do navegador para debug:
```javascript
console.log('Popup config:', popupConfig);
console.log('Current page:', currentPage);
```

## 📈 Melhores Práticas

### Para Conversão
- **Títulos Atraentes**: Use benefícios claros
- **Mensagens Curtas**: Foque no valor
- **CTAs Claras**: Ação específica
- **Timing Adequado**: Não seja intrusivo

### Para UX
- **Delay Mínimo**: 3-5 segundos
- **Fácil Fechamento**: X sempre visível
- **Mobile First**: Teste em dispositivos móveis
- **Acessibilidade**: Contraste e navegação por teclado

### Para Performance
- **Lazy Loading**: Pop-ups carregam sob demanda
- **Cache Inteligente**: Configurações em cache
- **Otimização**: Imagens e PDFs otimizados

## 🔮 Roadmap

### Próximas Funcionalidades
- [ ] A/B Testing de pop-ups
- [ ] Segmentação por dispositivo
- [ ] Integração com Google Analytics
- [ ] Templates pré-definidos
- [ ] Automação baseada em comportamento
- [ ] Relatórios avançados

### Melhorias Técnicas
- [ ] Cache mais inteligente
- [ ] Lazy loading de PDFs
- [ ] Animações mais suaves
- [ ] Suporte a múltiplos idiomas

---

**Desenvolvido por CELX Lead Nexus**  
*Sistema de pop-ups para captura de leads e conversão* 