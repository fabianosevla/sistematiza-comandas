import { useState } from 'react'
import { fmt, getTotalComanda, formasPagamento } from '../../data/storage'

export default function FecharConta({ comanda, onConfirmar, onVoltar }) {
  const [formaPagamento, setFormaPagamento] = useState('Pix')
  const total = getTotalComanda(comanda)

  return (
    <div className="page-content">

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar para comanda</span>
        </p>
        <h1 className="page-title">Fechar conta</h1>
        <p className="page-subtitle">{comanda.clienteNome} · Mesa {comanda.mesaNumero}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Resumo dos itens */}
        <div className="card">
          <div className="card-header">
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Itens consumidos</p>
          </div>

          <div>
            {comanda.itens.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p style={{ fontSize: '13px' }}>Nenhum item na comanda.</p>
              </div>
            ) : (
              comanda.itens.map((item, idx) => (
                <div key={item.id}
                  style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: idx < comanda.itens.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {item.quantidade}x
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{item.nome}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>{fmt(item.preco)} cada</p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{fmt(item.quantidade * item.preco)}</p>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Total</span>
            <span style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{fmt(total)}</span>
          </div>
        </div>

        {/* Pagamento */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div className="card" style={{ padding: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>Forma de pagamento</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formasPagamento.map(f => {
                const ativo = formaPagamento === f
                return (
                  <button key={f} onClick={() => setFormaPagamento(f)}
                    style={{ background: ativo ? 'var(--brand-light)' : 'var(--bg-primary)', border: `1.5px solid ${ativo ? 'var(--brand)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', padding: '12px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ativo ? 'var(--brand)' : 'var(--border-strong)', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', fontWeight: ativo ? '600' : '400', color: ativo ? 'var(--brand)' : 'var(--text-primary)' }}>{f}</span>
                    {ativo && <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--brand)', fontWeight: '700' }}>✓</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Resumo dark */}
          <div style={{ background: 'var(--text-primary)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Resumo</p>
            {[
              { label: 'Cliente',    value: comanda.clienteNome },
              { label: 'Mesa',       value: comanda.mesaNumero },
              { label: 'Pagamento',  value: formaPagamento },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>Total a pagar</span>
              <span style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '-0.8px' }}>{fmt(total)}</span>
            </div>
          </div>

          <button onClick={() => onConfirmar(formaPagamento)}
            style={{ width: '100%', background: 'var(--mesa-livre)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', letterSpacing: '-0.2px', fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            ✓ Confirmar pagamento
          </button>
        </div>
      </div>
    </div>
  )
}