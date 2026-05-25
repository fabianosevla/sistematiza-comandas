import { useState } from 'react'
import { fmt } from '../../data/storage'

// ─── Helpers ─────────────────────────────────────────────────
const calcTotal = (lista) =>
  lista.reduce((acc, c) => acc + c.itens.reduce((s, i) => s + i.quantidade * i.preco, 0), 0)

const calcItens = (lista) =>
  lista.reduce((acc, c) => acc + c.itens.reduce((s, i) => s + i.quantidade, 0), 0)

const calcMaisVendidos = (lista) => {
  const mapa = {}
  lista.forEach(c => {
    c.itens.forEach(i => {
      const key = (i.nome || '').toLowerCase()
      if (!mapa[key]) mapa[key] = { nome: i.nome, quantidade: 0, total: 0 }
      mapa[key].quantidade += i.quantidade
      mapa[key].total      += i.quantidade * i.preco
    })
  })
  return Object.values(mapa).sort((a, b) => b.quantidade - a.quantidade).slice(0, 5)
}

const calcPagamentos = (lista) => {
  const mapa = {}
  lista.forEach(c => {
    if (!mapa[c.formaPagamento]) mapa[c.formaPagamento] = { count: 0, total: 0 }
    mapa[c.formaPagamento].count++
    mapa[c.formaPagamento].total += c.itens.reduce((s, i) => s + i.quantidade * i.preco, 0)
  })
  return mapa
}

// ─── Subcomponente de conteúdo do relatório ───────────────────
function ConteudoRelatorio({ fechadas, abertas, label }) {
  const totalFaturado = calcTotal(fechadas)
  const totalItens    = calcItens(fechadas)
  const maisVendidos  = calcMaisVendidos(fechadas)
  const pgMapa        = calcPagamentos(fechadas)

  const stats = [
    { label: 'Faturado',         valor: fmt(totalFaturado), bg: 'var(--bg-layer-01)',     cor: 'var(--text-primary)',  border: 'var(--border-subtle)',   fs: '18px' },
    { label: 'Comandas fechadas',valor: fechadas.length,    bg: 'var(--mesa-livre-bg)',   cor: 'var(--mesa-livre)',    border: 'var(--mesa-livre-bg)',   fs: '28px' },
    { label: 'Comandas abertas', valor: abertas.length,     bg: 'var(--mesa-ocupada-bg)', cor: 'var(--mesa-ocupada)', border: 'var(--mesa-ocupada-bg)', fs: '28px' },
    { label: 'Itens servidos',   valor: totalItens,         bg: 'var(--brand-light)',     cor: 'var(--brand)',         border: 'var(--brand-light)',     fs: '28px' },
  ]

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {stats.map(c => (
          <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 'var(--radius-lg)', padding: '16px' }}>
            <p style={{ fontSize: c.fs, fontWeight: '800', color: c.cor, letterSpacing: '-0.5px', lineHeight: 1 }}>{c.valor}</p>
            <p style={{ fontSize: '10px', fontWeight: '600', color: c.cor, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.75 }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Mais vendidos */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header">
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Itens mais vendidos</p>
        </div>
        {maisVendidos.length === 0 ? (
          <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '13px' }}>Nenhum item vendido {label}.</p>
          </div>
        ) : (
          maisVendidos.map((item, idx) => (
            <div key={idx} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: idx < maisVendidos.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: 'var(--radius-sm)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--brand)', flexShrink: 0 }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.nome}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>{item.quantidade} unidade{item.quantidade !== 1 ? 's' : ''}</p>
              </div>
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', flexShrink: 0 }}>{fmt(item.total)}</p>
            </div>
          ))
        )}
      </div>

      {/* Formas de pagamento */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header">
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Formas de pagamento</p>
        </div>
        {Object.keys(pgMapa).length === 0 ? (
          <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '13px' }}>Nenhum pagamento registrado {label}.</p>
          </div>
        ) : (
          <>
            {Object.entries(pgMapa).map(([forma, dados], idx, arr) => (
              <div key={forma} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: idx < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{forma}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>{dados.count} comanda{dados.count !== 1 ? 's' : ''}</p>
                </div>
                <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{fmt(dados.total)}</p>
              </div>
            ))}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Total faturado</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{fmt(totalFaturado)}</span>
            </div>
          </>
        )}
      </div>

      {/* Histórico de comandas */}
      {fechadas.length > 0 && (
        <div className="card">
          <div className="card-header">
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Comandas fechadas</p>
          </div>
          {fechadas.map((c, idx) => {
            const total = c.itens.reduce((s, i) => s + i.quantidade * i.preco, 0)
            return (
              <div key={c.id} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: idx < fechadas.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'var(--mesa-livre-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--mesa-livre)', flexShrink: 0 }}>
                  {c.mesaNumero}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.clienteNome}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>Mesa {c.mesaNumero} · {c.formaPagamento} · {c.data}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{fmt(total)}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>{c.fechamento}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────
export default function Relatorio({ comandas }) {
  const [aba, setAba] = useState('diario')

  const hoje = new Date().toLocaleDateString('pt-BR')

  // Mês atual: MM/YYYY
  const mesAtual = new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }).replace(' de ', '/')

  const fechadas = comandas.filter(c => c.status === 'fechada')
  const abertas  = comandas.filter(c => c.status === 'aberta')

  const fechadasHoje  = fechadas.filter(c => c.data === hoje)
  const fechadasMes   = fechadas.filter(c => {
    // data no formato DD/MM/YYYY — pega MM/YYYY
    if (!c.data) return false
    const partes = c.data.split('/')
    return partes.length === 3 ? `${partes[1]}/${partes[2]}` === mesAtual : false
  })
  const fechadasTodas = fechadas

  const abas = [
    { key: 'diario',    label: 'Diário',    lista: fechadasHoje,  labelVazio: 'hoje' },
    { key: 'mensal',    label: 'Mensal',    lista: fechadasMes,   labelVazio: 'este mês' },
    { key: 'permanente',label: 'Permanente',lista: fechadasTodas, labelVazio: 'ainda' },
  ]

  const abaAtiva = abas.find(a => a.key === aba)

  const subtitulos = {
    diario:     hoje,
    mensal:     new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    permanente: 'Todos os registros',
  }

  return (
    <div className="page-content">

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 className="page-title">Relatório</h1>
        <p className="page-subtitle">{subtitulos[aba]}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-lg)', padding: '4px', border: '1px solid var(--border-subtle)' }}>
        {abas.map(a => (
          <button key={a.key} onClick={() => setAba(a.key)}
            style={{ flex: 1, background: aba === a.key ? 'var(--brand)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px 8px', fontSize: '13px', fontWeight: aba === a.key ? '700' : '500', cursor: 'pointer', color: aba === a.key ? '#fff' : 'var(--text-secondary)', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <ConteudoRelatorio
        fechadas={abaAtiva.lista}
        abertas={abertas}
        label={abaAtiva.labelVazio}
      />
    </div>
  )
}