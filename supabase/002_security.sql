-- ─────────────────────────────────────────────────────────────────
-- MIGRATION 002: Security hardening
-- Rode no SQL Editor do Supabase
-- ─────────────────────────────────────────────────────────────────

-- ── OBSERVAÇÃO ───────────────────────────────────────────────────
-- O banco já tem o constraint de username correto na tabela pages:
-- CHECK (username ~ '^(?!.*\.\.)[a-z0-9][a-z0-9.]{1,28}[a-z0-9]$')
-- Inclusive mais completo que o nosso (bloqueia ponto duplo "..")
-- NÃO rodar o ALTER TABLE pages — já está certo.
-- ─────────────────────────────────────────────────────────────────

-- 1. Index para busca rápida de username (performance)
CREATE INDEX IF NOT EXISTS pages_username_lower_idx
  ON pages (lower(username));

-- 2. Bloqueia escrita direta em subscriptions
--    Só o webhook com service_role pode gravar aqui.
CREATE POLICY "Bloqueia INSERT direto em subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Bloqueia UPDATE direto em subscriptions"
  ON subscriptions FOR UPDATE
  USING (false);

CREATE POLICY "Bloqueia DELETE direto em subscriptions"
  ON subscriptions FOR DELETE
  USING (false);

-- 3. Protege profiles contra auto-promoção de plano
--    Usuário pode editar nome, foto etc mas NÃO pode mudar o campo plano.
--    Plano só muda via webhook do Stripe (service_role bypassa RLS).
DROP POLICY IF EXISTS "Usuário atualiza próprio perfil" ON profiles;

CREATE POLICY "Usuário atualiza próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND plano = (SELECT plano FROM profiles WHERE id = auth.uid())
  );

-- 4. Bloqueia DELETE direto em profiles
DROP POLICY IF EXISTS "Usuário deleta próprio perfil" ON profiles;

CREATE POLICY "Bloqueia DELETE direto em profiles"
  ON profiles FOR DELETE
  USING (false);

-- 5. Policies da tabela allstar_data
--    A tabela existe no banco (criada pela migration 001).
--    Dropa a policy antiga genérica e recria segmentada.
DROP POLICY IF EXISTS "Dono vê e edita próprio allstar" ON allstar_data;
DROP POLICY IF EXISTS "Público lê allstar verificados" ON allstar_data;

-- Dono lê a própria ficha (mesmo não verificada)
CREATE POLICY "Dono lê próprio allstar"
  ON allstar_data FOR SELECT
  USING (auth.uid() = user_id);

-- Público só vê fichas verificadas
CREATE POLICY "Público lê allstar verificados"
  ON allstar_data FOR SELECT
  USING (verificado = true);

-- Só cria ficha se tiver plano allstar ativo no banco
CREATE POLICY "Dono cria próprio allstar"
  ON allstar_data FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (SELECT plano FROM profiles WHERE id = auth.uid()) = 'allstar'
  );

-- Só atualiza a própria ficha se ainda tiver plano allstar
CREATE POLICY "Dono atualiza próprio allstar"
  ON allstar_data FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (SELECT plano FROM profiles WHERE id = auth.uid()) = 'allstar'
  );

-- Dono pode deletar a própria ficha
CREATE POLICY "Dono deleta próprio allstar"
  ON allstar_data FOR DELETE
  USING (auth.uid() = user_id);
