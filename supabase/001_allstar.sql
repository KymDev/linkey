-- ─────────────────────────────────────────────────────────────────
-- MIGRATION 001: All-Star plan
-- Rode isso no SQL Editor do Supabase (projeto de produção)
-- ─────────────────────────────────────────────────────────────────

-- 1. Adicionar 'allstar' ao enum de planos (substitui 'business')
ALTER TYPE plano_tipo ADD VALUE IF NOT EXISTS 'allstar';

-- 2. Adicionar profissões All-Star ao enum de profissões
ALTER TYPE profissao_tipo ADD VALUE IF NOT EXISTS 'atleta_futebol';
ALTER TYPE profissao_tipo ADD VALUE IF NOT EXISTS 'lutador';
ALTER TYPE profissao_tipo ADD VALUE IF NOT EXISTS 'musico_allstar';
ALTER TYPE profissao_tipo ADD VALUE IF NOT EXISTS 'ator_influencer';
ALTER TYPE profissao_tipo ADD VALUE IF NOT EXISTS 'nadador_atletismo';
ALTER TYPE profissao_tipo ADD VALUE IF NOT EXISTS 'escritor_autor';
ALTER TYPE profissao_tipo ADD VALUE IF NOT EXISTS 'empresa_marca';

-- 3. Tabela de dados All-Star (1:1 com profiles)
CREATE TABLE IF NOT EXISTS allstar_data (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Verificação
  verificado        BOOLEAN DEFAULT false,
  link_verificacao  TEXT,                        -- Instagram, Wikipedia, etc.
  verificado_em     TIMESTAMPTZ,

  -- Campos comuns a todas as categorias
  categoria         TEXT NOT NULL,               -- atleta_futebol, lutador, etc.
  apelido           TEXT,                        -- nome de guerra / ring name
  pais              TEXT,
  escudo_url        TEXT,                        -- escudo do time / logo da empresa

  -- Futebol
  clube_atual       TEXT,
  posicao           TEXT,                        -- Atacante, Goleiro, etc.
  numero_camisa     INT,
  overall           INT CHECK (overall BETWEEN 1 AND 99),
  pe_dominante      TEXT,                        -- Direito / Esquerdo / Ambidestro
  altura_cm         INT,
  peso_kg           INT,
  valor_mercado     TEXT,                        -- "€ 45M", livre, etc.

  -- Lutador
  categoria_peso    TEXT,                        -- Peso Pesado, Meio-médio, etc.
  cartel_vitorias   INT DEFAULT 0,
  cartel_derrotas   INT DEFAULT 0,
  cartel_empates    INT DEFAULT 0,
  nocautes          INT DEFAULT 0,
  finalizacoes      INT DEFAULT 0,
  academia          TEXT,
  ranking_posicao   TEXT,                        -- "#3 no UFC Peso Pesado"

  -- Nadador / Atletismo
  modalidade        TEXT,                        -- 100m livre, 110m com barreiras
  federacao         TEXT,
  recordes          TEXT,                        -- texto livre "1:52.34 - Brasileiro"
  olimpiadas        TEXT,                        -- "Paris 2024, Tokyo 2020"

  -- Músico / Artista
  genero_musical    TEXT,
  album_atual       TEXT,
  gravadora         TEXT,
  streamings_mes    TEXT,                        -- "2.3M ouvintes/mês"

  -- Ator / Influencer
  seguidores_total  TEXT,                        -- "1.2M"
  obras_destaque    TEXT,                        -- texto livre

  -- Escritor / Autor
  livros_publicados INT DEFAULT 0,
  genero_literario  TEXT,
  editora           TEXT,

  -- Empresa / Marca
  setor             TEXT,
  ano_fundacao      INT,
  funcionarios      TEXT,                        -- "50-100", "500+"

  criado_em         TIMESTAMPTZ DEFAULT now(),
  atualizado_em     TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT allstar_data_user_id_key UNIQUE (user_id)
);

-- 4. RLS na tabela allstar_data
ALTER TABLE allstar_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dono vê e edita próprio allstar"
  ON allstar_data FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Público lê allstar verificados"
  ON allstar_data FOR SELECT
  USING (verificado = true);

-- 5. Trigger para atualizar atualizado_em
CREATE TRIGGER update_allstar_data_atualizado_em
  BEFORE UPDATE ON allstar_data
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

-- 6. Index para buscas por user_id
CREATE INDEX IF NOT EXISTS allstar_data_user_id_idx ON allstar_data(user_id);
