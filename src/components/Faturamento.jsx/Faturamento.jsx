import { useState } from 'react'
import { fmt, getTotalComanda, categoriasFinanceiro } from '../../data/storage'

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function getMesAno(dataStr) {
  if (!dataStr) return null
  const partes = dataStr.split('/')
  if (partes.length === 3) return `${partes[1]}/${partes[2]}`
  return null
}

function getAno(dataStr) {
  if (!dataStr) return null
  const partes = dataStr.split('/')
  if (partes.length === 3) return partes[2]
  return null
}

export default function Faturamento({ comandas, lancamentos, configFin }) {
  const [periodo, setPeriodo] = useState('mes')

  const agora    = new Date()
  const mesAtual = `${String(agora.getMonth() + 1).padStart(2,'0')}/${agora.getFullYear()}`
  const anoAtual = String(agora.getFullYear())
  const hoje     = agora.toLocaleDateString('pt-BR')

  // Filtra comandas por período
  const comandasFiltradas = comandas.filter(c => {
    if (c.status !== 'fechada') return false
    if (periodo === 'hoje') return c.data === hoje
    if (periodo === 'mes')  return getMesAno(c.data) === mesAtual
    if (periodo === 'ano')  return getAno(c.data) === anoAtual
    return true // todos
  })

  // Filtra lançamentos por período
  const lancFiltrados = lancamentos.filter(l => {
    if (!l.vencimento) return false
    const d = new Date(l.vencimento + 'T12:00:00')
    const dStr = d.toLocaleDateString('pt-BR')
    if (periodo === 'hoje') return dStr === hoje
    if (periodo === 'mes')  return getMesAno(dStr) === mesAtual
    if (periodo === 'ano')  return getAno(dStr) === anoAtual
    return true
  })

  // Receita bruta das comandas
  const receitaBruta = comandasFiltradas.reduce((acc, c) => acc + getTotalComanda(c), 0)

  // Calcular taxa de cartão por comanda
  const totalTaxas = comandasFiltradas.reduce((acc, c) => {
    const total = getTotalComanda(c)
    const taxa  = c.formaPagamento === 'Cartão de crédito' ? (configFin?.taxaCredito ?? 2.99)
                : c.formaPagamento === 'Cartão de débito'  ? (configFin?.taxaDebito  ?? 1.49)
                : 0
    return acc + total * (taxa / 100)
  }, 0)

  // Despesas pagas no período
  const totalDespesas = lancFiltrados
    .filter(l => l.tipo === 'despesa' && (l.status === 'pago'))
    .reduce((acc, l) => acc + l.valor, 0)

  // Receitas extras (não comanda)
  const receitasExtras = lancFiltrados
    .filter(l => l.tipo === 'receita' && (l.status === 'recebido'))
    .reduce((acc, l) => acc + l.valor, 0)

  const receitaLiquida   = receitaBruta - totalTaxas + receitasExtras
  const lucroEstimado    = receitaLiquida - totalDespesas
  const ticketMedio      = comandasFiltradas.length > 0 ? receitaBruta / comandasFiltradas.length : 0

  // Por forma de pagamento
  const pgMapa = {}
  comandasFiltradas.forEach(c => {
    const k = c.formaPagamento || 'Outros'
    if (!pgMapa[k]) pgMapa[k] = { count: 0, total: 0 }
    pgMapa[k].count++
    pgMapa[k].total += getTotalComanda(c)
  })

  // Despesas por categoria
  const despCat = {}
  lancFiltrados.filter(l => l.tipo === 'despesa').forEach(l => {
    if (!despCat[l.categoria]) despCat[l.categoria] = 0
    despCat[l.categoria] += l.valor
  })

  // Evolução mensal (últimos 6 meses) — sempre visível
  const ultimos6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const mes  = String(d.getMonth() + 1).padStart(2, '0')
    const ano  = String(d.getFullYear())
    const key  = `${mes}/${ano}`
    const rec  = comandas.filter(c => c.status === 'fechada' && getMesAno(c.data) === key)
                   .reduce((acc, c) => acc + getTotalComanda(c), 0)
    return { label: MESES[d.getMonth()], valor: rec }
  })
  const maxVal = Math.max(...ultimos6.map(m => m.valor), 1)

  const periodos = [
    { key: 'hoje', label: 'Hoje' },
    { key: 'mes',  label: 'Este mês' },
    { key: 'ano',  label: 'Este ano' },
    { key: 'todos',label: 'Tudo' },
  ]

  return (
    <div className="page-content">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Faturamento</h1>
          <p className="page-subtitle">Receita, despesas e lucro estimado</p>
        </div>
        {/* Seletor de período */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-lg)', padding: '4px', border: '1px solid var(--border-subtle)' }}>
          {periodos.map(p => (
            <button key={p.key} onClick={() => setPeriodo(p.key)}
              style={{ background: periodo === p.key ? 'var(--brand)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', padding: '7px 14px', fontSize: '12px', fontWeight: periodo === p.key ? '700' : '500', cursor: 'pointer', color: periodo === p.key ? '#fff' : 'var(--text-secondary)', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards principais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Receita bruta',    valor: fmt(receitaBruta),   bg: 'var(--bg-layer-01)',     cor: 'var(--text-primary)', border: 'var(--border-subtle)', sub: `${comandasFiltradas.length} comanda(s)` },
          { label: 'Taxas de cartão',  valor: fmt(totalTaxas),     bg: '#FEF2F2',                cor: '#DC2626',             border: '#FECACA',              sub: 'Crédito + débito' },
          { label: 'Receita líquida',  valor: fmt(receitaLiquida), bg: '#ECFDF5',                cor: '#059669',             border: '#A7F3D0',              sub: 'Bruta − taxas + extras' },
          { label: 'Lucro estimado',   valor: fmt(lucroEstimado),  bg: lucroEstimado >= 0 ? 'var(--brand-light)' : '#FEF2F2', cor: lucroEstimado >= 0 ? 'var(--brand)' : '#DC2626', border: lucroEstimado >= 0 ? '#BFDBFE' : '#FECACA', sub: 'Líquida − despesas' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 'var(--radius-lg)', padding: '16px' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: c.cor, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.75, marginBottom: '6px' }}>{c.label}</p>
            <p style={{ fontSize: '20px', fontWeight: '800', color: c.cor, letterSpacing: '-0.5px', lineHeight: 1 }}>{c.valor}</p>
            <p style={{ fontSize: '10px', color: c.cor, opacity: 0.6, marginTop: '4px' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Métricas secundárias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Ticket médio</p>
          <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{fmt(ticketMedio)}</p>
        </div>
        <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Total despesas</p>
          <p style={{ fontSize: '18px', fontWeight: '800', color: '#DC2626', letterSpacing: '-0.5px' }}>{fmt(totalDespesas)}</p>
        </div>
        <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Receitas extras</p>
          <p style={{ fontSize: '18px', fontWeight: '800', color: '#059669', letterSpacing: '-0.5px' }}>{fmt(receitasExtras)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Evolução mensal */}
        <div className="card">
          <div className="card-header">
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Evolução — últimos 6 meses</p>
          </div>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px' }}>
            {ultimos6.map((m, i) => {
              const h = maxVal > 0 ? Math.max((m.valor / maxVal) * 100, 4) : 4
              const isAtual = i === 5
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                  <p style={{ fontSize: '9px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    {m.valor > 0 ? `R$${(m.valor/1000).toFixed(1)}k` : ''}
                  </p>
                  <div style={{ width: '100%', height: `${h}%`, background: isAtual ? 'var(--brand)' : 'var(--brand-light)', borderRadius: '4px 4px 0 0', transition: 'height 0.3s', minHeight: '4px' }} />
                  <p style={{ fontSize: '10px', color: isAtual ? 'var(--brand)' : 'var(--text-secondary)', fontWeight: isAtual ? '700' : '400' }}>{m.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Formas de pagamento */}
        <div className="card">
          <div className="card-header">
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Por forma de pagamento</p>
          </div>
          {Object.keys(pgMapa).length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '13px' }}>Sem dados no período.</p>
            </div>
          ) : (
            Object.entries(pgMapa)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([forma, dados], idx, arr) => {
                const pct = receitaBruta > 0 ? (dados.total / receitaBruta * 100).toFixed(1) : 0
                return (
                  <div key={forma} style={{ padding: '12px 20px', borderBottom: idx < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{forma}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{fmt(dados.total)}</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--brand)', borderRadius: '2px', transition: 'width 0.4s' }} />
                    </div>
                    <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>{pct}% do total · {dados.count} comanda(s)</p>
                  </div>
                )
              })
          )}
        </div>
      </div>

      {/* Despesas por categoria */}
      {Object.keys(despCat).length > 0 && (
        <div className="card">
          <div className="card-header">
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Despesas por categoria</p>
          </div>
          {Object.entries(despCat)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, valor], idx, arr) => {
              const info = categoriasFinanceiro.find(c => c.key === cat)
              const pct  = totalDespesas > 0 ? (valor / totalDespesas * 100).toFixed(1) : 0
              return (
                <div key={cat} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: idx < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{info?.emoji || '💸'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{info?.label || cat}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#DC2626' }}>{fmt(valor)}</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#DC2626', borderRadius: '2px' }} />
                    </div>
                    <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '3px' }}>{pct}% das despesas</p>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}