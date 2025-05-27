# Troubleshooting do Sistema de Convites

## Problema: Erro 403 ao criar convites

### Sintomas
- Erro 403 no console: "Failed to load resource: the server responded with a status of 403"
- Mensagem: "Failed to create invitation"

### Possíveis Causas

1. **Tabela de convites não existe**
2. **Políticas RLS muito restritivas**
3. **Foreign keys incorretas**
4. **Contexto da comunidade não definido**

### Soluções

#### 1. Executar as migrações no Supabase

Execute as seguintes migrações na ordem:

```sql
-- 1. Criar tabela básica (se não existir)
-- Execute: 20240430000009_create_invitations_table.sql

-- 2. Corrigir foreign keys
-- Execute: 20240430000012_fix_invitations_foreign_keys.sql
```

#### 2. Verificar se a tabela existe

No SQL Editor do Supabase:

```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'invitations' AND table_schema = 'public';
```

#### 3. Verificar estrutura da tabela

```sql
\d public.invitations;
```

#### 4. Testar inserção manual

```sql
INSERT INTO public.invitations (
    email, 
    role, 
    community_id, 
    invited_by, 
    expires_at
) VALUES (
    'test@example.com',
    'member',
    'your-community-uuid',
    'your-user-profile-id',
    NOW() + INTERVAL '7 days'
);
```

#### 5. Verificar políticas RLS

```sql
-- Ver políticas ativas
SELECT * FROM pg_policies WHERE tablename = 'invitations';

-- Desabilitar RLS temporariamente para teste
ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;
```

#### 6. Verificar logs do Supabase

1. Vá para o Dashboard do Supabase
2. Acesse "Logs" > "API"
3. Procure por erros relacionados a `invitations`

### Debug no Frontend

Adicione logs no console para verificar:

```typescript
// No useRealMembers.ts
console.log('Community context:', community?.id);
console.log('User context:', user?.id);
console.log('API client community:', api.getCurrentCommunityId());
```

### Checklist de Verificação

- [ ] Tabela `invitations` existe no Supabase
- [ ] Foreign keys estão corretas (`invited_by` → `profiles.id`)
- [ ] RLS está desabilitado temporariamente
- [ ] Contexto da comunidade está definido no API client
- [ ] Usuário está autenticado
- [ ] Variáveis de ambiente estão configuradas

### Solução Temporária

Se o problema persistir, use esta migração temporária:

```sql
-- Desabilitar RLS completamente
ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;

-- Permitir todas as operações para usuários autenticados
GRANT ALL ON public.invitations TO authenticated;
```

### Reativar RLS (Após correção)

```sql
-- Reabilitar RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Aplicar políticas corretas
-- Execute: 20240430000010_fix_invitations_policies.sql
```

### Contato para Suporte

Se o problema persistir:

1. Verifique os logs do Supabase
2. Teste a inserção manual no SQL Editor
3. Confirme que todas as migrações foram executadas
4. Verifique se o usuário tem as permissões corretas na comunidade 