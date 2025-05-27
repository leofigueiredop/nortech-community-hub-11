# Email Service Setup

## Overview
O sistema de convites de membros agora usa o **Resend** para envio de emails transacionais. Este documento explica como configurar e usar o serviço.

## Configuração

### 1. Criar conta no Resend
1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Verifique seu email

### 2. Obter API Key
1. No dashboard do Resend, vá para "API Keys"
2. Clique em "Create API Key"
3. Dê um nome (ex: "Nortech Community Hub")
4. Copie a API key gerada

### 3. Configurar variáveis de ambiente
Adicione no seu arquivo `.env`:

```bash
# Email Service (Resend)
VITE_RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Application URL (para links de convite)
VITE_APP_URL=http://localhost:5173
```

### 4. Configurar domínio (Opcional)
Para usar um domínio personalizado:

1. No Resend, vá para "Domains"
2. Adicione seu domínio
3. Configure os registros DNS conforme instruído
4. Atualize o `EmailService.ts` para usar seu domínio:

```typescript
from: `${communityName} <noreply@seudominio.com>`
```

## Funcionalidades

### Convite de Membros
- **Template HTML responsivo** com design moderno
- **Informações do convite**: comunidade, papel, plano
- **Link de convite** personalizado
- **Fallback gracioso** se o email falhar

### Email de Boas-vindas
- Enviado automaticamente para novos membros
- Template personalizado com guia de primeiros passos

## Estrutura dos Templates

### Template de Convite
- Header com gradiente roxo
- Card com detalhes do convite
- Botão CTA destacado
- Footer com branding

### Template de Boas-vindas
- Design consistente com convite
- Lista de ações recomendadas
- Link para explorar a comunidade

## Tratamento de Erros

O sistema é resiliente a falhas:

1. **API Key não configurada**: Log de aviso, convite criado sem email
2. **Erro no Resend**: Toast informativo, convite mantido
3. **Erro de rede**: Fallback gracioso com mensagem clara

## Monitoramento

### Logs
- Sucessos e erros são logados no console
- IDs de email do Resend para rastreamento

### Resend Dashboard
- Estatísticas de entrega
- Logs de emails enviados
- Métricas de abertura (se configurado)

## Custos

### Plano Gratuito Resend
- **3.000 emails/mês** gratuitos
- Ideal para comunidades pequenas/médias

### Planos Pagos
- A partir de $20/mês para 50.000 emails
- Recursos avançados: analytics, webhooks, etc.

## Desenvolvimento Local

Para testar localmente sem enviar emails reais:

```typescript
// No EmailService.ts, adicione no início do método:
if (import.meta.env.DEV) {
  console.log('DEV: Email would be sent to:', recipientEmail);
  return { success: true };
}
```

## Troubleshooting

### Email não enviado
1. Verifique se `VITE_RESEND_API_KEY` está configurada
2. Confirme que a API key é válida no dashboard
3. Verifique logs do console para erros específicos

### Emails na spam
1. Configure SPF, DKIM, DMARC no seu domínio
2. Use domínio verificado no Resend
3. Evite palavras que acionam filtros de spam

### Rate limiting
- Resend tem limites de taxa
- Para alto volume, considere implementar fila de emails

## Próximos Passos

1. **Templates avançados**: Editor visual de emails
2. **Webhooks**: Rastreamento de entrega e abertura
3. **Segmentação**: Emails personalizados por tipo de membro
4. **Automação**: Sequências de onboarding 