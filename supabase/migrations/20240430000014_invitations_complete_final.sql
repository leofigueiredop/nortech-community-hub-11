-- MIGRAÇÃO COMPLETA PARA TABELA DE CONVITES
-- Tudo em um arquivo só, RLS desabilitado para desenvolvimento

-- Remove tabela se existir
DROP TABLE IF EXISTS public.invitations CASCADE;

-- Cria tabela completa com tipos corretos
CREATE TABLE public.invitations (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'member',
    community_id uuid NOT NULL,
    invited_by uuid NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz DEFAULT now() NOT NULL,
    expires_at timestamptz NOT NULL,
    accepted_at timestamptz NULL,
    
    -- Primary key
    CONSTRAINT invitations_pkey PRIMARY KEY (id),
    
    -- Foreign keys
    CONSTRAINT invitations_community_id_fkey 
        FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE,
    CONSTRAINT invitations_invited_by_fkey 
        FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Check constraints
    CONSTRAINT invitations_status_check 
        CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
    CONSTRAINT invitations_role_check 
        CHECK (role IN ('member', 'moderator', 'admin'))
);

-- Índices para performance
CREATE INDEX invitations_community_id_idx ON public.invitations USING btree (community_id);
CREATE INDEX invitations_email_idx ON public.invitations USING btree (email);
CREATE INDEX invitations_status_idx ON public.invitations USING btree (status);
CREATE INDEX invitations_expires_at_idx ON public.invitations USING btree (expires_at);
CREATE INDEX invitations_invited_by_idx ON public.invitations USING btree (invited_by);

-- Índice único para evitar convites duplicados
CREATE UNIQUE INDEX invitations_unique_pending_idx 
ON public.invitations (email, community_id) 
WHERE status = 'pending';

-- DESABILITA RLS COMPLETAMENTE
ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;

-- Permissões completas para todos
GRANT ALL ON TABLE public.invitations TO postgres;
GRANT ALL ON TABLE public.invitations TO anon;
GRANT ALL ON TABLE public.invitations TO authenticated;
GRANT ALL ON TABLE public.invitations TO service_role;

-- Função para expirar convites antigos
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
    UPDATE public.invitations 
    SET status = 'expired' 
    WHERE status = 'pending' 
    AND expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Comentário para lembrar
COMMENT ON TABLE public.invitations IS 'Tabela de convites - RLS DESABILITADO para desenvolvimento';

-- Dados de teste (opcional - remover em produção)
-- INSERT INTO public.invitations (email, role, community_id, invited_by, expires_at)
-- VALUES ('test@example.com', 'member', 'uuid-da-comunidade', 'uuid-do-usuario', NOW() + INTERVAL '7 days'); 