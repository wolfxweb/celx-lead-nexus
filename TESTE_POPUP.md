# 🧪 Como Testar o Sistema de Pop-ups

## ✅ Pré-requisitos

1. **Tabela criada no Baserow**: `POPUP_CONFIGS` com ID 636
2. **Variável de ambiente configurada**: `VITE_BASEROW_POPUP_CONFIGS_TABLE_ID=636`
3. **Servidor rodando**: `npm run dev`

## 🔍 Componente de Debug

O sistema inclui um componente de debug que aparece no canto inferior direito da tela. Ele mostra:

- **Página atual** detectada
- **Status** do pop-up (carregando, ativo, visível)
- **Configurações** do pop-up ativo
- **Informações** sobre captura de email e PDF

## 📋 Passos para Testar

### 1. Verificar Configuração
1. Acesse: `http://localhost:3000/`
2. Olhe no canto inferior direito
3. Deve aparecer o componente de debug
4. Verifique se mostra "Popup Ativo" ou "Nenhum popup ativo"

### 2. Testar Pop-up na Home
1. Se há pop-up configurado para "home":
   - Aguarde o delay configurado (ex: 10 segundos)
   - O pop-up deve aparecer automaticamente
   - Teste fechar com o X
   - Se tem campo de email, teste preencher

### 3. Testar em Outras Páginas
1. Navegue para `/sobre`
2. Verifique se o debug mostra a página correta
3. Aguarde o pop-up aparecer (se configurado)
4. Teste em `/produtos`, `/blog`, etc.

### 4. Testar Captura de Email
1. Preencha um email válido
2. Clique em "Enviar"
3. Verifique se aparece "Email cadastrado com sucesso!"
4. Se tem PDF, teste o botão "Baixar PDF"

### 5. Verificar no Baserow
1. Acesse o Baserow
2. Vá para a tabela `POPUP_EMAILS`
3. Verifique se o email foi salvo
4. Confirme os dados: email, popup_id, page, timestamp

## 🚨 Troubleshooting

### Pop-up não aparece
1. **Verifique o debug**: Está mostrando "Popup Ativo"?
2. **Verifique o delay**: Está aguardando o tempo correto?
3. **Verifique a página**: A página atual está na lista de páginas do pop-up?
4. **Verifique o console**: Há erros no console do navegador?

### Erro ao salvar email
1. **Verifique a tabela**: `POPUP_EMAILS` foi criada?
2. **Verifique o ID**: `VITE_BASEROW_POPUP_EMAILS_TABLE_ID` está configurado?
3. **Verifique o console**: Qual erro específico aparece?

### Debug não aparece
1. **Verifique o import**: O componente PopupDebug está importado?
2. **Verifique o console**: Há erros de JavaScript?
3. **Verifique a rede**: As requisições para o Baserow estão funcionando?

## 📊 Logs Úteis

Abra o console do navegador (F12) para ver logs detalhados:

```javascript
// Logs esperados:
"Página mudou para: home"
"Popup config encontrado: {...}"
"Agendando pop-up para aparecer em 10 segundos"
"Mostrando pop-up"
"Salvando email: {...}"
"Email salvo com sucesso"
```

## 🎯 Testes Específicos

### Teste 1: Pop-up sem email
- Configure um pop-up com `show_email_field: false`
- Deve mostrar apenas o botão de ação

### Teste 2: Pop-up com email
- Configure um pop-up com `show_email_field: true`
- Deve mostrar campo de email
- Após enviar, deve mostrar botão de PDF (se configurado)

### Teste 3: Pop-up com PDF
- Configure um pop-up com `pdf_url`
- Após capturar email, deve mostrar "Baixar PDF"
- Clique deve abrir o PDF em nova aba

### Teste 4: Múltiplas páginas
- Configure um pop-up para aparecer em "home,sobre"
- Teste navegar entre as páginas
- Deve aparecer em ambas

## 🔧 Configurações de Teste

### Pop-up de Teste Rápido
```json
{
  "title": "Teste Rápido",
  "message": "Este é um pop-up de teste",
  "show_email_field": true,
  "email_placeholder": "teste@exemplo.com",
  "button_text": "Testar",
  "pdf_url": "https://exemplo.com/teste.pdf",
  "delay": 3,
  "pages": "home",
  "is_active": true
}
```

### Pop-up sem Delay
```json
{
  "title": "Teste Imediato",
  "message": "Aparece imediatamente",
  "show_email_field": false,
  "button_text": "OK",
  "delay": 1,
  "pages": "home",
  "is_active": true
}
```

## ✅ Checklist de Teste

- [ ] Debug aparece no canto inferior direito
- [ ] Página atual é detectada corretamente
- [ ] Pop-up aparece após o delay configurado
- [ ] Pop-up pode ser fechado com X
- [ ] Campo de email funciona (se configurado)
- [ ] Email é salvo no Baserow
- [ ] PDF abre em nova aba (se configurado)
- [ ] Funciona em diferentes páginas
- [ ] Não aparece em páginas não configuradas

---

**Dica**: Mantenha o console do navegador aberto para ver os logs em tempo real! 🔍 