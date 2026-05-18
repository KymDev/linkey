-- ─────────────────────────────────────────────────────────────────
-- MIGRATION 003: Domínios Personalizados (Pro + All-Star)
-- Rode no SQL Editor do Supabase
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dominios_personalizados (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dominio     TEXT NOT NULL,               -- ex: "meusite.com.br"
  verificado  BOOLEAN DEFAULT false,       -- true após Vercel confirmar
  criado_em   TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT dominios_personalizados_user_id_key UNIQUE (user_id),
  CONSTRAINT dominios_personalizados_dominio_key UNIQUE (dominio)
);

-- RLS
ALTER TABLE dominios_personalizados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dono vê e edita próprio domínio"
  ON dominios_personalizados FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Middleware precisa buscar por domínio sem auth — leitura pública
CREATE POLICY "Leitura pública por domínio"
  ON dominios_personalizados FOR SELECT
  USING (true);

-- Trigger atualizado_em
CREATE TRIGGER update_dominios_atualizado_em
  BEFORE UPDATE ON dominios_personalizados
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

-- Index para o middleware (busca rápida por domínio)
CREATE INDEX IF NOT EXISTS dominios_dominio_idx ON dominios_personalizados(dominio);
