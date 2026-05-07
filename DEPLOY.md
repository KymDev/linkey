# 🚀 LINKEY — GUIA DE DEPLOY COMPLETO

## Visão geral do que vamos fazer
1. Preparar o projeto local
2. Configurar Supabase (produção)
3. Configurar Stripe (produção)
4. Configurar Resend (email)
5. Subir no GitHub
6. Deploy no Vercel
7. Conectar domínio
8. Configurar webhook do Stripe
9. Checklist final

Tempo estimado: 1h30 na primeira vez.

---

## ETAPA 1 — Preparar o projeto local

### 1.1 Instalar dependências
```bash
cd linkey
npm install
```

### 1.2 Testar localmente
```bash
npm run dev
```
Acesse http://localhost:3000 — deve aparecer a landing page.

### 1.3 Verificar build
```bash
npm run build
```
Se der erro, anote a mensagem e resolva antes de continuar.

---

## ETAPA 2 — Supabase (produção)

### 2.1 Criar projeto no Supabase
1. Acesse https://supabase.com
2. Clique em "New project"
3. Nome: `linkey-prod`
4. Senha do banco: anote em local seguro
5. Região: `sa-east-1` (São Paulo) — mais rápido para usuários BR
6. Clique em "Create new project" e aguarde ~2 min

### 2.2 Executar o schema
1. No painel do Supabase → SQL Editor
2. Clique em "New query"
3. Cole o conteúdo do arquivo `supabase/schema.sql`
4. Clique em "Run"
5. Deve aparecer "Success" para cada comando

### 2.3 Configurar autenticação Google
1. Supabase → Authentication → Providers → Google → Enable
2. Acesse https://console.cloud.google.com
3. Crie um projeto → APIs & Services → Credentials
4. Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `https://xxxx.supabase.co/auth/v1/callback`
   (substitua xxxx pelo seu project ID do Supabase)
7. Copie Client ID e Client Secret
8. Cole no Supabase → Providers → Google

### 2.4 Configurar email de auth
1. Supabase → Authentication → Email Templates
2. Confirm signup → personalize com o nome LinKey se quiser
3. Supabase → Authentication → URL Configuration:
   - Site URL: `https://seudominio.com.br`
   - Redirect URLs: `https://seudominio.com.br/auth/callback`

### 2.5 Copiar as chaves
1. Supabase → Settings → API
2. Copie:
   - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
   - `anon public` → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - `service_role` → SUPABASE_SERVICE_ROLE_KEY (⚠️ nunca exponha no frontend)

---

## ETAPA 3 — Stripe (produção)

### 3.1 Criar produtos e preços
1. Acesse https://dashboard.stripe.com
2. Products → Add product

**Produto 1: LinKey Pro**
- Name: LinKey Pro
- Pricing model: Recurring
- Preço mensal: R$19,00 BRL / month → copie o Price ID (price_xxx)
- Adicione outro preço: R$190,00 BRL / year → copie o Price ID

**Produto 2: LinKey Business**
- Name: LinKey Business
- Preço mensal: R$47,00 BRL / month → copie o Price ID
- Preço anual: R$470,00 BRL / year → copie o Price ID

### 3.2 Copiar as chaves
1. Stripe Dashboard → Developers → API Keys
2. Copie:
   - `Publishable key` → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - `Secret key` → STRIPE_SECRET_KEY

### 3.3 Configurar o portal do cliente
1. Stripe → Settings → Billing → Customer portal
2. Ative as opções: cancelar, trocar plano, atualizar cartão
3. Save

---

## ETAPA 4 — Resend (email)

### 4.1 Configurar
1. Acesse https://resend.com → Sign up
2. Domains → Add Domain → adicione seu domínio
3. Siga as instruções de DNS (adiciona registros TXT/MX no seu provedor)
4. API Keys → Create API Key → copie

### 4.2 Verificar domínio
Aguarde a propagação DNS (pode levar até 24h, mas geralmente é rápido).

---

## ETAPA 5 — GitHub

### 5.1 Criar repositório
1. Acesse https://github.com → New repository
2. Nome: `linkey`
3. Private → Create repository

### 5.2 Subir o código
```bash
cd linkey
git init
git add .
git commit -m "feat: LinKey v1.0 — lançamento inicial"
git branch -M main
git remote add origin https://github.com/seuusuario/linkey.git
git push -u origin main
```

### 5.3 Criar .gitignore
```
node_modules/
.next/
.env.local
.env
*.log
.DS_Store
```

---

## ETAPA 6 — Deploy no Vercel

### 6.1 Conectar repositório
1. Acesse https://vercel.com → New Project
2. Import Git Repository → selecione `linkey`
3. Framework Preset: Next.js (detectado automaticamente)
4. Root Directory: `./` (padrão)
5. NÃO clique em Deploy ainda — configure as variáveis primeiro

### 6.2 Configurar variáveis de ambiente no Vercel
Em "Environment Variables", adicione uma a uma:

```
NEXT_PUBLIC_SUPABASE_URL          = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = eyJhb...
SUPABASE_SERVICE_ROLE_KEY         = eyJhb...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_SECRET_KEY                  = sk_live_...
STRIPE_WEBHOOK_SECRET              = whsec_... (preencha depois)

STRIPE_PRICE_PRO_MONTHLY          = price_...
STRIPE_PRICE_PRO_YEARLY           = price_...
STRIPE_PRICE_BUSINESS_MONTHLY     = price_...
STRIPE_PRICE_BUSINESS_YEARLY      = price_...

RESEND_API_KEY                     = re_...
RESEND_FROM_EMAIL                  = noreply@seudominio.com.br

NEXT_PUBLIC_APP_URL               = https://seudominio.com.br
```

### 6.3 Fazer o deploy
1. Clique em "Deploy"
2. Aguarde ~3 min
3. Vercel vai gerar uma URL como `linkey.vercel.app`
4. Teste essa URL — deve aparecer a landing page

---

## ETAPA 7 — Domínio próprio

### 7.1 Conectar domínio no Vercel
1. Vercel → seu projeto → Settings → Domains
2. Add Domain → `linkey.cloud` (ou o seu)
3. Vercel vai mostrar os registros DNS

### 7.2 Configurar DNS no seu registrador
No painel do seu registrador (Registro.br, GoDaddy, Cloudflare etc):

**Se usar nameservers do Vercel (recomendado):**
```
Tipo: NS
Valor: ns1.vercel-dns.com
Valor: ns2.vercel-dns.com
```

**Se preferir manter DNS no registrador:**
```
Tipo: A
Nome: @
Valor: 76.76.21.21

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

Aguarde propagação (5 min a 24h).

### 7.3 Atualizar URLs no Supabase
1. Supabase → Authentication → URL Configuration
2. Site URL: `https://linkey.cloud`
3. Redirect URLs: `https://linkey.cloud/auth/callback`

### 7.4 Atualizar variável no Vercel
1. Vercel → Settings → Environment Variables
2. Altere `NEXT_PUBLIC_APP_URL` para `https://linkey.cloud`
3. Redeploy: Vercel → Deployments → clique nos 3 pontinhos → Redeploy

---

## ETAPA 8 — Webhook do Stripe

### 8.1 Criar webhook
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://linkey.cloud/api/stripe/webhook`
3. Events to send — selecione:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Add endpoint

### 8.2 Copiar o signing secret
1. Clique no webhook criado
2. Signing secret → Reveal → copie

### 8.3 Atualizar no Vercel
1. Vercel → Settings → Environment Variables
2. `STRIPE_WEBHOOK_SECRET` = `whsec_...` (o que você copiou)
3. Vercel → Deployments → Redeploy

### 8.4 Testar o webhook
1. No dashboard do Stripe → seu webhook → Send test event
2. Selecione `checkout.session.completed`
3. Verifique se chegou 200 OK

---

## ETAPA 9 — Configurar portal de billing do Stripe

1. Stripe → Settings → Billing → Customer portal
2. Business information → adicione nome e logo do LinKey
3. Customer portal link → ative
4. Cancellations → ative "Allow customers to cancel"
5. Plan changes → ative
6. Payment methods → ative "Allow customers to update"
7. Save

---

## ✅ CHECKLIST FINAL

Antes de divulgar, teste cada item:

### Fluxo de cadastro
- [ ] Acessar linkey.cloud → landing page carrega
- [ ] Clicar "Criar grátis" → vai para /auth/cadastro
- [ ] Cadastrar com email → recebe email de confirmação
- [ ] Confirmar email → vai para /onboarding
- [ ] Completar onboarding (4 passos) → vai para /dashboard
- [ ] Dashboard carrega com stats zerados

### Página pública
- [ ] Acessar linkey.cloud/seuusername
- [ ] Avatar aparece corretamente
- [ ] Links clicáveis
- [ ] Clique no WhatsApp abre o WhatsApp
- [ ] Pix copia a chave ao clicar
- [ ] Rodapé "Criado com LinKey" aparece (plano free)

### Editor
- [ ] Mudar nome → preview ao vivo atualiza
- [ ] Mudar cor de destaque → preview atualiza
- [ ] Upload de foto → aparece no preview
- [ ] Salvar → página pública atualiza

### Links
- [ ] Adicionar link → aparece na lista
- [ ] Toggle inativo → link some da página pública
- [ ] Drag and drop → reordena
- [ ] Deletar → link removido

### Analytics
- [ ] Visitar a página pública 3x
- [ ] Dashboard mostra visitas
- [ ] Analytics → gráfico com dados

### Stripe
- [ ] Clicar "Assinar Pro" → vai para checkout do Stripe
- [ ] Usar cartão de teste: 4242 4242 4242 4242
- [ ] Após pagamento → plano muda para Pro
- [ ] Features Pro desbloqueadas (sem marca, pix etc)
- [ ] "Gerenciar assinatura" → portal do Stripe abre
- [ ] Cancelar no portal → volta para free

### Auth Google
- [ ] Login com Google → funciona
- [ ] Vai para onboarding se novo usuário

---

## 🎉 LinKey está no ar!

Seu checklist de lançamento:

1. **Comunidade** — Entre em grupos de músicos, tatuadores, estética no Facebook/WhatsApp e ofereça 3 meses grátis para os primeiros 30 usuários

2. **Conteúdo** — Poste no Instagram/TikTok mostrando como criar a página em 3 minutos — isso viraliza

3. **Afiliados** — Para cada pessoa que indicar e assinar Pro, dê 20% de comissão recorrente

4. **Product Hunt** — Lance na Product Hunt para visibilidade global

5. **SEO** — Sua landing já tem as keywords certas. Em 30 dias começa a ranquear para "link na bio brasil"

---

## 📊 Métricas para acompanhar

| Métrica | Meta Mês 1 | Meta Mês 3 |
|---|---|---|
| Usuários cadastrados | 100 | 500 |
| Clientes pagantes | 10 | 60 |
| MRR | R$190 | R$1.500 |
| Churn mensal | < 15% | < 8% |

---

## 🆘 Problemas comuns e soluções

**Build falha no Vercel**
→ Rode `npm run build` local primeiro. O erro vai aparecer no terminal.

**Webhook do Stripe retorna 400**
→ Verifique se `STRIPE_WEBHOOK_SECRET` está correto. Use o Stripe CLI local para testar: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

**Login não funciona após deploy**
→ Verifique as Redirect URLs no Supabase. Deve ter `https://seudominio.com.br/auth/callback` cadastrado.

**Foto não faz upload**
→ Verifique se o bucket `avatars` foi criado no Supabase Storage (está no schema.sql).

**Página /[username] dá 500**
→ Verifique se o `SUPABASE_SERVICE_ROLE_KEY` está configurado no Vercel.

**Stripe checkout não abre**
→ Verifique se os Price IDs estão corretos e se está usando chaves `live_` em produção (não `test_`).
