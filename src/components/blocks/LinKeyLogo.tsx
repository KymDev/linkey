import React from 'react'

interface LinKeyLogoProps {
  size?: number
  textSize?: number
  showText?: boolean
  style?: React.CSSProperties
}

export function LinKeyLogo({
  size = 32, // Reduzido de 40 para 32 como padrão
  textSize = 24,
  showText = true,
  style,
}: LinKeyLogoProps) {
  const gid = `lk-grad-${size}`
  const fid = `lk-glow-${size}`

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px', // Reduzido de 10px para 8px
        userSelect: 'none',
        lineHeight: 0,
        ...style,
      }}
    >
      {/* ICON - Logo D: Minimalista Clean (Ajustado para ser menor) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 90 95" // Aumentado o viewBox levemente para dar respiro interno e parecer menor
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${fid})`} transform="translate(5, 5)"> {/* Adicionado um pequeno recuo */}
          {/* Cabo da chave (elo horizontal) */}
          <rect 
            x="4.5" 
            y="4.5" 
            width="71" 
            height="25" 
            rx="12.5" 
            stroke={`url(#${gid})`} 
            strokeWidth="9" 
          />
          
          {/* Segundo elo menor sobreposto */}
          <rect 
            x="22.5" 
            y="14.5" 
            width="35" 
            height="11" 
            rx="5.5" 
            stroke={`url(#${gid})`} 
            strokeWidth="5" 
            opacity="0.35" 
          />
          
          {/* Haste longa */}
          <rect 
            x="36" 
            y="32" 
            width="10" 
            height="52" 
            rx="5" 
            fill={`url(#${gid})`} 
          />
          
          {/* Dente 1 */}
          <rect 
            x="46" 
            y="52" 
            width="16" 
            height="9" 
            rx="4.5" 
            fill={`url(#${gid})`} 
          />
          
          {/* Dente 2 menor */}
          <rect 
            x="46" 
            y="65" 
            width="12" 
            height="8" 
            rx="4" 
            fill={`url(#${gid})`} 
          />
          
          {/* Dente 3 menor ainda */}
          <rect 
            x="46" 
            y="77" 
            width="8" 
            height="7" 
            rx="3.5" 
            fill={`url(#${gid})`} 
          />
        </g>
      </svg>

      {/* TEXTO */}
      {showText && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: `${textSize}px`,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <span style={{ color: '#94A3B8' }}>Lin</span>
          <span
            style={{
              background: 'linear-gradient(to right, #8B5CF6, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginLeft: '2px',
            }}
          >
            Key
          </span>
        </span>
      )}
    </span>
  )
}
