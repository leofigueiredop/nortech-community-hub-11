# Nortech Community Hub - Scripts de Teste

Este diretório contém scripts para testar a funcionalidade e a saúde da aplicação Nortech Community Hub.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM (versão 6 ou superior)
- Aplicação rodando em http://localhost:8081 (ou URL personalizada em credentials.js)
- Conexão com o Supabase

## Configuração

1. Instale as dependências necessárias:

```bash
npm install
```

2. Atualize as credenciais no arquivo `credentials.js`:

```javascript
module.exports = {
  // Configurações do Supabase
  SUPABASE_URL: 'sua-url-do-supabase',
  SUPABASE_ANON_KEY: 'sua-chave-anonima-do-supabase',
  
  // Credenciais de usuário para testes
  TEST_EMAIL: 'seu-email-de-teste',
  TEST_PASSWORD: 'sua-senha-de-teste',
  
  // URL base para testes de UI
  TEST_URL: 'http://localhost:8081' // Ou sua URL personalizada
};
```

## Scripts Disponíveis

### Verificação de Saúde da Aplicação

Verifica se todas as páginas principais estão respondendo:

```bash
npm run test:health
```

### Verificação de Integridade de Dados

Verifica a integridade dos dados no Supabase:

```bash
npm run test:data
```

### Testes de API

Testa funcionalidades de criação de posts, tópicos e discussões via API Supabase:

```bash
npm run test:api
```

### Testes de Componentes

Testa os componentes críticos da aplicação:

```bash
npm run test:components
```

### Testes de Permissões de Usuário

Testa as permissões de usuário e a visibilidade de botões de ação baseado no papel (role):

```bash
npm run test:permissions
```

### Testes de UI

Testa a interface do usuário usando Playwright (requer a aplicação rodando):

```bash
npm run test:ui
```

### Testes de Jornada do Usuário e Owner

Testa jornadas completas de diferentes tipos de usuários:

```bash
# Executa a jornada do owner (proprietário de comunidade)
npm run test:journey:owner

# Executa a jornada do usuário regular
npm run test:journey:user

# Executa ambas as jornadas
npm run test:journey:all
```

### Análise de Conexões com Supabase

Analisa todos os componentes e páginas para identificar quais estão usando dados reais do Supabase e quais ainda estão usando dados mockados:

```bash
# Gera um relatório em texto
npm run test:connections

# Gera um relatório em PDF detalhado
npm run test:connections:pdf
```

O relatório PDF contém:
- Lista completa de páginas e seus status de conexão
- Lista de componentes e suas fontes de dados
- Hooks e repositórios e seus status
- Features potencialmente faltantes identificadas pela análise

### Relatório de Status do Projeto

Gera um relatório de status detalhado do projeto:

```bash
# Gera um relatório em markdown
npm run status:md

# Gera um relatório em PDF
npm run status:pdf
```

O relatório de status contém:
- Resumo executivo do estado atual do projeto
- Estatísticas de conexão por tipo de componente
- Detalhamento por área funcional do sistema
- Identificação de áreas que necessitam de atenção
- Features potencialmente faltantes

### Geração de Relatório Geral

Gera um relatório HTML completo sobre o estado do sistema:

```bash
npm run report
```

### Verificação Rápida

Executa verificação de saúde e de dados, e gera um relatório:

```bash
npm run check
```

### Todos os Testes

Executa todos os testes disponíveis:

```bash
npm test
```

## Interpretação dos Resultados

Os scripts usam emojis para indicar o status:

- ✅ SUCESSO: O teste passou com sucesso
- ⚠️ AVISO: Há problemas menores que precisam de atenção
- ❌ ERRO: Há problemas graves que precisam ser corrigidos

## Solução de Problemas

- Se os testes de API falharem, verifique as credenciais do Supabase e se o usuário tem permissões adequadas.
- Se os testes de UI falharem, verifique se a aplicação está rodando na URL configurada.
- Se houver erros de conexão, verifique sua conexão com a internet e se o Supabase está acessível.

## Relatório de Saúde

O relatório gerado por `npm run report` inclui:

- Informações do sistema
- Resultados da verificação de saúde
- Resultados da verificação de integridade de dados
- Recomendações para melhorias 