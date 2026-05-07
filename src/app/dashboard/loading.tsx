// src/app/dashboard/loading.tsx
// Skeleton exibido enquanto o dashboard carrega

export default function DashboardLoading() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>

      {/* Header skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <div className="skeleton" style={{ width: '140px', height: '28px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '100px', height: '16px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '100px' }} />
          <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: '100px' }} />
        </div>
      </div>

      {/* Stats skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
          }}>
            <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '12px', marginBottom: '16px' }} />
            <div className="skeleton" style={{ width: '80px', height: '32px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '120px', height: '14px' }} />
          </div>
        ))}
      </div>

      {/* Gráfico + origens skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {[0,1].map(i => (
          <div key={i} style={{
            padding: '24px', height: '200px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
          }}>
            <div className="skeleton" style={{ width: '100px', height: '14px', marginBottom: '12px' }} />
            <div className="skeleton" style={{ width: '60px', height: '28px', marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '80px' }}>
              {[40,70,55,90,65,80,45].map((h, j) => (
                <div key={j} className="skeleton" style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Links skeleton */}
      <div style={{
        padding: '24px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
      }}>
        <div className="skeleton" style={{ width: '160px', height: '14px', marginBottom: '20px' }} />
        {[0,1,2,3].map(i => (
          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
            <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '120px', height: '14px', marginBottom: '6px' }} />
              <div className="skeleton" style={{ width: '100%', height: '4px', borderRadius: '2px' }} />
            </div>
            <div className="skeleton" style={{ width: '40px', height: '20px', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
