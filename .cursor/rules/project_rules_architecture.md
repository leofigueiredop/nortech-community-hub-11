# cursor_rules.md – Arquivo de Regras do Cursor

> **Propósito** — orientar o modelo Claude 3.5 (Haiko) no Cursor a conectar Supabase, aplicar regras de negócio, RLS e realtime **sem alterar a UI**.
> Salve este arquivo na raiz do workspace ou em `.cursor/rules.md` e refira-se a ele nos prompts: "**Siga `cursor_rules.md`**".

---
## 0 · Princípio base
**Não modifique a experiência visual.** Apenas integre lógica, dados e segurança preservando todos os componentes e estilos existentes.

---
## 1 · Estrutura & convenções
```txt
src/
  api/
    interfaces/          # contratos dos repositórios
    repositories/        # impl. Supabase (Repository Pattern)
    migrations/          # SQL (functions, seeds, RLS)
  components/
    ui/                  # shadcn
    layout/              # Header, Sidebar
    library/ events/ feed/ points/  # domínios
  context/               # Auth, Points, Notifications
  hooks/                # lógica reutilizável (useUser, useLibraryContent…)
  pages/                # rotas (Dashboard, Library, Events…)
  types/                # definições TypeScript
  utils/                # adapters & helpers
```
| Tema | Regra |
|------|-------|
| **Linguagem** | TypeScript **estrito** (`strict: true`) |
| **Nomenclatura** | Repos `Supabase<X>Repository.ts`, hooks `use<X>()`, context `<X>Context.tsx` |
| **Singleton** | `ApiClient` expõe repositórios e mantém única instância do Supabase SDK |
| **Adapters** | `utils/contentTypeAdapter.ts` converte `types/library` ⇄ `types/content` |
| **Erros** | Repos herdam `BaseRepository` com tratamento padronizado de erros |
| **Cache** | SWR global (revalidate-clearon-focus) |
| **Testes** | Vitest + RTL; Supabase mock via `useMockData` flag |

---
## 2 · Multi-tenancy & comunidade
### 2.1 Descoberta de `community_id`
* **/signup/:communityId** — cadastro via link direto; usuário torna-se *member* dessa comunidade.
* **Signup de Membro Genérico** — sem slug → componente **SelectCommunity** no fluxo de auth.
* **Signup de Creator** (landing) — cria **nova** comunidade e vincula o usuário como `owner`.

### 2.2 Tenant Context
O tenant context é gerenciado inteiramente via código:

1. `BaseRepository` mantém `currentCommunityId` protegido
2. `ApiClient` centraliza o contexto e propaga para todos os repos via `setCommunityContext`
3. Cada repo filtra queries com `.eq('community_id', this.currentCommunityId)`
4. `AuthContext` atualiza o tenant após login/troca de comunidade

### 2.3 Fallback e Mock Data
* Flag `useMockData` em `SupabaseAuthRepository` para problemas de conexão
* Dados mock em `api/mock/` para desenvolvimento offline
* Fallback automático para mock em caso de erro de DNS/conexão

---
## 3 · Papéis & permissões
| Papel | Descrição |
|-------|-----------|
| `owner` | criador; total acesso |
| `admin` | gestão total exceto deletar comunidade |
| `moderator` | leitura + flags configuráveis |
| `member` | consumo de conteúdo |

### Flags do moderador (`community_moderator_permissions`)
`can_delete_content`, `can_ban_users`, `can_edit_user_content`, `can_approve_flagged_content`.

### Matriz CRUD
| Entidade | owner/admin | moderator | member |
|----------|------------|-----------|--------|
| `content_items` | C R U D | R (+U/D se flag) | R |
| `events` | C R U D | R | R (inscrição) |
| `discussions` | C R U D | R (+U/D se flag) | C R (U/D próprios) |
| `rewards` / `store_items` | C R U D | R | R |

> **Leitura pública** permitida, mas **sempre filtrada por `community_id`**.

---
## 4 · Autenticação
* **Provedores** : e-mail/senha, Google, Apple (Supabase Auth)
* `email_confirmed = true` obrigatório.
* Sessões: default Supabase (`1w`) com refresh automático do SDK.

Fluxo pós-login:
1. Verificar conexão com Supabase (fallback para mock se necessário)
2. Carregar perfil do usuário (criar se não existir)
3. Buscar comunidade (creator ou member)
4. Definir `AuthContext` e propagar `community_id`
5. Redirecionar para `Dashboard`

---
## 5 · Tratamento de Erros
### 5.1 BaseRepository
* Método `handleError` para log e propagação consistente
* `handleResponse` com tratamento específico para:
  - Erros em string
  - Objetos com `message`
  - Erros desconhecidos
* Todos os repos herdam este comportamento

### 5.2 Resiliência
* Verificação de conexão no startup
* Fallback automático para mock data
* Logs detalhados para debug
* Tratamento de erros de rede/DNS

---
## 6 · Conteúdo & Library
* Campo `access_level` ∈ **free**, **premium**, **unlockable**.
* `premium` exige assinatura ativa na comunidade.
* `unlockable` → modal **ConfirmUnlock** → RPC `unlock_item(user_id, item_id)` (débito atômico de pontos).
* Filtros adicionais: tags, formatos, recentes, populares, acesso (free/premium).

---
## 7 · Pontos & gamificação
### 7.1 Configuração
Tabela `points_actions` por comunidade; seeds iniciais:
| action_key | default_points |
|------------|---------------|
| `daily_login` | 2 |
| `comment` | 3 |
| `like` | 1 |
| `course_completion` | 20 |
| `event_checkin` | 15 |
| `referral` | 10 |
Creators podem adicionar/editar ações nas **Settings › Points Configuration**.

### 7.2 Processamento
* `PointsContext` consome Canal Realtime `points:userId`.
* Leaderboard paginado (`/leaderboard`) ordenado por `total_points DESC`.
* Resgate na store → dedução **imediata**.

---
## 8 · Eventos
* `capacity` rígida, sem wait-list.
* Inscrição: `SupabaseEventsRepository.register(eventId)`.
* Check-in manual (botão ou QR) → seta `attended = true` e credita pontos `event_checkin`.

---
## 9 · Discussões
* Posts: edit/del por owner/admin.
* Replies: autor ou moderador (flags).
* Reações: curtidas (tabela `discussion_likes`).

---
## 10 · Pagamentos (placeholder)
* Tabelas: `platform_subscription_plans` (global) e `community_subscription_plans` (tenant).
* Checkout Stripe placeholder em `payments/checkout.ts`.
* Trial opcional; cancelamento mantém acesso até `subscription_end_date`.

---
## 11 · Realtime & presença
| Canal | Uso |
|-------|-----|
| `content_items` | feed / library (tempo real) |
| `chat_messages` | chat de eventos / comunidade |
| `leaderboard` | atualização de pontos |
| `presence_online_users` | usuários online (por comunidade) |

---
## 12 · Processo de trabalho
1. **Antes** — confirmar regra de negócio.
2. **Durante** — não alterar UI; cobertura ≥ 80 % nos hooks/repositories.
3. **Depois** — `bun test`; PR com _Why / What / How_; atualizar `CHANGELOG.md`.

---
## 13 · Segurança & performance
* Ativar RLS em todas as tabelas; políticas base:
  ```sql
  create policy "Members read" on <table>
    for select using (community_id = auth.jwt() ->> 'community_id');
  ```
* Buckets > 50 MB → `private-large-files`.
* Sanitizar HTML rich-text com DOMPurify.

