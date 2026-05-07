'use client'

interface BarData {
  label: string
  valor: number
}

interface Props {
  dados:    BarData[]
  cor?:     string
  altura?:  number
}

export default function BarChart({ dados, cor = '#7C6FFF', altura = 80 }: Props) {
  if (!dados.length) return null

  const max   = Math.max(...dados.map(d => d.valor), 1)
  const hoje  = new Date().getDay() // 0=Dom ... 6=Sáb

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: '6px',
      height: `${altura}px`,
      width: '100%',
    }}>
      {dados.map((d, i) => {
        const pct      = (d.valor / max) * 100
        const ehHoje   = i === dados.length - 1
        const barCor   = ehHoje ? cor : `${cor}66`

        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            {/* Tooltip ao hover */}
            <div
              title={`${d.label}: ${d.valor} visitas`}
              style={{
                width: '100%',
                height: `${Math.max(pct, 4)}%`,
                background: ehHoje
                  ? `linear-gradient(180deg, ${cor}, ${cor}88)`
                  : `linear-gradient(180deg, ${cor}66, ${cor}22)`,
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                cursor: 'default',
                position: 'relative',
              }}
              onMouseOver={e => {
                e.currentTarget.style.opacity = '0.8'
                e.currentTarget.style.transform = 'scaleX(1.05)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'scaleX(1)'
              }}
            />
            <span style={{
              fontSize: '10px',
              color: ehHoje ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
              fontWeight: ehHoje ? 600 : 400,
            }}>
              {d.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
