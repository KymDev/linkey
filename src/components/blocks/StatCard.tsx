'use client'

interface Props {
  emoji:    string
  numero:   number | string
  label:    string
  variacao?: number   // percentual vs período anterior
  cor?:     'purple' | 'pink' | 'cyan' | 'gold' | 'green'
  delay?:   number
}

const CORES = {
  purple: { bg: 'rgba(124,111,255,0.15)', border: 'rgba(124,111,255,0.25)', icon: 'rgba(124,111,255,0.2)' },
  pink:   { bg: 'rgba(255,111,189,0.15)', border: 'rgba(255,111,189,0.25)', icon: 'rgba(255,111,189,0.2)' },
  cyan:   { bg: 'rgba(111,255,233,0.12)', border: 'rgba(111,255,233,0.2)',  icon: 'rgba(111,255,233,0.15)' },
  gold:   { bg: 'rgba(255,213,128,0.12)', border: 'rgba(255,213,128,0.2)',  icon: 'rgba(255,213,128,0.15)' },
  green:  { bg: 'rgba(111,255,150,0.12)', border: 'rgba(111,255,150,0.2)',  icon: 'rgba(111,255,150,0.15)' },
}

export default function StatCard({ emoji, numero, label, variacao, cor = 'purple', delay = 0 }: Props) {
  const c = CORES[cor]
  const positivo = variacao !== undefined && variacao >= 0

  return (
    <div
      className="animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        padding: '24px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Ícone */}
      <div style={{
        width: '44px', height: '44px',
        borderRadius: '12px',
        background: c.icon,
        border: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px',
        marginBottom: '16px',
      }}>
        {emoji}
      </div>

      {/* Número */}
      <div style={{
        fontSize: '32px',
        fontWeight: 700,
        letterSpacing: '-1px',
        lineHeight: 1,
        marginBottom: '6px',
      }}>
        {typeof numero === 'number' ? numero.toLocaleString('pt-BR') : numero}
      </div>

      {/* Label */}
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
        {label}
      </div>

      {/* Variação */}
      {variacao !== undefined && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          marginTop: '10px',
          padding: '3px 8px',
          borderRadius: '100px',
          fontSize: '12px', fontWeight: 600,
          background: positivo
            ? 'rgba(111,255,150,0.12)'
            : 'rgba(255,111,111,0.12)',
          color: positivo ? '#6fff96' : '#ff9696',
        }}>
          {positivo ? '↑' : '↓'} {Math.abs(variacao)}% vs mês anterior
        </div>
      )}
    </div>
  )
}
