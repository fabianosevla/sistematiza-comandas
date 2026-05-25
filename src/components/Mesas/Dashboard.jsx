import { getMesaStatus, fmt, getTotalComanda } from '../../data/storage'

export default function Dashboard({ mesas, comandas, config, onAbrirMesa, onAdicionarMesa, onRemoverMesa }) {
  const hoje     = new Date().toLocaleDateString('pt-BR')
  const abertas  = comandas.filter(c => c.status === 'aberta').length
  const fechadas = comandas.filter(c => c.status === 'fechada' && c.data === hoje).length
  const faturado = comandas
    .filter(c => c.status === 'fechada' && c.data === hoje)
    .reduce((acc, c) => acc + getTotalComanda(c), 0)

  return (
    <div className="page-content">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Mesas</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
        </div>
        <button className="btn-primary" onClick={onAdicionarMesa}>+ Nova mesa</button>
      </div>

      {/* Stats do dia */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
        <div style={{ background: 'var(--mesa-ocupada-bg)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--mesa-ocupada)', letterSpacing: '-1px', lineHeight: 1 }}>{abertas}</p>
          <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--mesa-ocupada)', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Abertas</p>
        </div>
        <div style={{ background: 'var(--mesa-livre-bg)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--mesa-livre)', letterSpacing: '-1px', lineHeight: 1 }}>{fechadas}</p>
          <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--mesa-livre)', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fechadas hoje</p>
        </div>
        <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1 }}>{fmt(faturado)}</p>
          <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Faturado hoje</p>
        </div>
      </div>

      {/* Grid de mesas */}
      <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
        {mesas.length} mesa{mesas.length !== 1 ? 's' : ''} cadastrada{mesas.length !== 1 ? 's' : ''}
      </p>

      {mesas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍽️</div>
          <p style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>Nenhuma mesa cadastrada</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>Clique em "Nova mesa" para adicionar.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
          {mesas.map(mesa => {
            const status       = getMesaStatus(mesa.id, comandas)
            const comandasMesa = comandas.filter(c => c.mesaId === mesa.id && c.status === 'aberta')
            const qtdComandas  = comandasMesa.length
            const totalMesa    = comandasMesa.reduce((acc, c) => acc + getTotalComanda(c), 0)
            // Nomes dos clientes para exibir no card
            const nomeClientes = comandasMesa.map(c => c.clienteNome).join(', ')
            const isLivre      = status === 'livre'
            const bg   = isLivre ? 'var(--bg-layer-01)'   : 'var(--mesa-ocupada-bg)'
            const cor  = isLivre ? 'var(--mesa-livre)'    : 'var(--mesa-ocupada)'
            const bord = isLivre ? 'var(--border-subtle)' : 'var(--mesa-ocupada-bg)'

            return (
              <div key={mesa.id}
                onClick={() => onAbrirMesa(mesa)}
                style={{ background: bg, border: `1.5px solid ${bord}`, borderRadius: 'var(--radius-xl)', padding: '16px', cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.1s', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>

                <button
                  onClick={e => { e.stopPropagation(); onRemoverMesa(mesa) }}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', opacity: 0.3, padding: '2px', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.3'}>
                  ✕
                </button>

                <p style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Mesa</p>
                <p style={{ fontSize: '36px', fontWeight: '800', color: cor, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '8px' }}>{mesa.numero}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: isLivre ? 0 : '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cor, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', fontWeight: '600', color: cor }}>{isLivre ? 'Livre' : 'Ocupada'}</span>
                </div>

                {!isLivre && (
                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '8px' }}>
                    {/* ✅ NOME DO CLIENTE NO CARD */}
                    {nomeClientes && (
                      <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--mesa-ocupada)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {nomeClientes}
                      </p>
                    )}
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{qtdComandas} comanda{qtdComandas !== 1 ? 's' : ''}</p>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>{fmt(totalMesa)}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}