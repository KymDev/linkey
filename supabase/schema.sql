-- ============================================
-- LINKEY — SCHEMA COMPLETO
-- Execute no SQL Editor do Supabase
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- ENUM: tipos de profissão
-- ─────────────────────────────────────────
CREATE TYPE profissao_tipo AS ENUM (
  'musico',
  'tatuador',
  'cabeleireiro',
  'corretor',
  'personal',
  'fotografo',
  'outro'
);

-- ─────────────────────────────────────────
-- ENUM: planos
-- ─────────────────────────────────────────
CREATE TYPE plano_tipo AS ENUM (
  'free',
  'pro',
  'business'
);

-- ─────────────────────────────────────────
-- ENUM: status da assinatura
-- ─────────────────────────────────────────
CREATE TYPE subscription_status AS ENUM (
  'active',
  'canceled',
  'past_due',
  'trialing'
);

-- ─────────────────────────────────────────
-- ENUM: tipo de link
-- ─────────────────────────────────────────
CREATE TYPE link_tipo AS ENUM (
  'whatsapp',
  'instagram',
  'tiktok',
  'youtube',
  'spotify',
  'portfolio',
  'agenda',
  'pix',
  'maps',
  'site',
  'outro'
);

-- ─────────────────────────────────────────
-- TABELA: profiles
-- ─────────────────────────────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  nome          TEXT,
  profissao     profissao_tipo DEFAULT 'outro',
  plano         plano_tipo DEFAULT 'free',
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABELA: pages
-- ─────────────────────────────────────────
CREATE TABLE pages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  username      TEXT NOT NULL UNIQUE,
  titulo        TEXT NOT NULL,
  subtitulo     TEXT,
  cidade        TEXT,
  foto_url      TEXT,
  tema_cor      TEXT DEFAULT '#0a0a0f',
  cor_destaque  TEXT DEFAULT '#7C6FFF',
  ativo         BOOLEAN DEFAULT TRUE,
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT username_formato CHECK (
    username ~ '^[a-z0-9_-]{3,30}$'
  )
);

-- ─────────────────────────────────────────
-- TABELA: links
-- ─────────────────────────────────────────
CREATE TABLE links (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id   UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  emoji     TEXT DEFAULT '🔗',
  titulo    TEXT NOT NULL,
  url       TEXT NOT NULL,
  tipo      link_tipo DEFAULT 'outro',
  ordem     INTEGER DEFAULT 0,
  ativo     BOOLEAN DEFAULT TRUE,
  expira_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABELA: clicks (analytics)
-- ─────────────────────────────────────────
CREATE TABLE clicks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id     UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  link_id     UUID REFERENCES links(id) ON DELETE SET NULL,
  origem      TEXT DEFAULT 'direto',
  dispositivo TEXT DEFAULT 'mobile',
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABELA: subscriptions
-- ─────────────────────────────────────────
CREATE TABLE subscriptions (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_sub_id      TEXT UNIQUE,
  plano              plano_tipo NOT NULL,
  status             subscription_status DEFAULT 'active',
  proximo_pagamento  TIMESTAMPTZ,
  criado_em          TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- INDEXES (performance)
-- ─────────────────────────────────────────
CREATE INDEX idx_pages_username   ON pages(username);
CREATE INDEX idx_pages_user_id    ON pages(user_id);
CREATE INDEX idx_links_page_id    ON links(page_id);
CREATE INDEX idx_links_ordem      ON links(page_id, ordem);
CREATE INDEX idx_clicks_page_id   ON clicks(page_id);
CREATE INDEX idx_clicks_criado_em ON clicks(criado_em);
CREATE INDEX idx_clicks_link_id   ON clicks(link_id);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuário atualiza próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Página pública visível por todos"
  ON pages FOR SELECT
  USING (ativo = TRUE);

CREATE POLICY "Usuário gerencia próprias páginas"
  ON pages FOR ALL
  USING (auth.uid() = user_id);

-- links
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Links ativos visíveis por todos"
  ON links FOR SELECT
  USING (ativo = TRUE);

CREATE POLICY "Usuário gerencia próprios links"
  ON links FOR ALL
  USING (
    auth.uid() = (
      SELECT user_id FROM pages WHERE id = page_id
    )
  );

-- clicks
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode inserir clique"
  ON clicks FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Usuário vê cliques das próprias páginas"
  ON clicks FOR SELECT
  USING (
    page_id IN (
      SELECT id FROM pages WHERE user_id = auth.uid()
    )
  );

-- subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê própria assinatura"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- FUNÇÃO: criar perfil automaticamente
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────
-- FUNÇÃO: atualizar timestamp
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_atualizado_em
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

CREATE TRIGGER update_pages_atualizado_em
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

-- ─────────────────────────────────────────
-- STORAGE: bucket para fotos de perfil
-- ─────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT DO NOTHING;

CREATE POLICY "Avatars públicos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Usuário faz upload do próprio avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuário deleta próprio avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
