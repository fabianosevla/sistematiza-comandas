import { useState } from 'react'
import { fmt, categoriasFinanceiro, saveLancamento, deleteLancamento } from '../../data/storage'

const hoje = () => new Date().toLocaleDateString('pt-BR')
const mesAtual = () => {
  const d = new Date()
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function FormLancamento({ lancamento, onSalvar, onCancelar }) {
  const [form, setForm] = useState({
    tipo:      lancamento?.tipo      || 'despesa',
    categoria: lancamento?.categoria || 'outros_desp',
    descricao: lancamento?.descricao || '',
    valor:     lancamento?.valor     || '',
    vencimento:lancamento?.vencimento|| '',
    status:    lancamento?.status    || 'pendente',
    recorrente:lancamento?.recorrente|| false,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const cats = categoriasFinanceiro.filter(c => c.tipo === form.tipo)

  const salvar = () => {
    if (!form.descricao || !form.valor || !form.vencimento)
      return alert('Preencha descrição, valor e vencimento!')
    onSalvar({
      ...form,
      valor: parseFloat(String(form.valor).replace(',', '.')) || 0,
      id: lancamento?.id || String(Date.now()),
      createdAt: lancamento?.createdAt || new Date().toISOString(),
    })
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)', fontSize: '14px',
    color: 'var(--text-primary)', outline: 'none',
    background: 'var(--bg-layer-01)', fontFamily: 'DM Sans, sans-serif',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(22,22,22,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(2px)', padding: '16px' }}>
      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', padding: '28px', maxWidth: '460px', width: '100%', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}>

        <p style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
          {lancamento ? 'Editar lançamento' : 'Novo lançamento'}
        </p>

        {/* Tipo */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[{ key: 'despesa', label: '💸 Despesa' }, { key: 'receita', label: '💰 Receita' }].map(t => (
            <button key={t.key} onClick={() => { set('tipo', t.key); set('categoria', t.key === 'despesa' ? 'outros_desp' : 'outros_rec') }}
              style={{ flex: 1, background: form.tipo === t.key ? (t.key === 'despesa' ? '#FEF2F2' : '#ECFDF5') : 'var(--bg-primary)', border: `1.5px solid ${form.tipo === t.key ? (t.key === 'despesa' ? '#DC2626' : '#059669') : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', padding: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: form.tipo === t.key ? '700' : '400', color: form.tipo === t.key ? (t.key === 'despesa' ? '#DC2626' : '#059669') : 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>

          {/* Descrição */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Descrição *</label>
            <input value={form.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Ex: Conta de luz de maio" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--brand)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
          </div>

          {/* Valor e Vencimento */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Valor (R$) *</label>
              <input type="number" step="0.01" value={form.valor} onChange={e => set('valor', e.target.value)} placeholder="0,00" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Vencimento *</label>
              <input type="date" value={form.vencimento} onChange={e => set('vencimento', e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Categoria</label>
            <select value={form.categoria} onChange={e => set('categoria', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              {cats.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { key: 'pendente',  label: 'Pendente',  cor: '#D97706' },
                { key: form.tipo === 'despesa' ? 'pago' : 'recebido', label: form.tipo === 'despesa' ? 'Pago' : 'Recebido', cor: '#059669' },
              ].map(s => (
                <button key={s.key} onClick={() => set('status', s.key)}
                  style={{ flex: 1, background: form.status === s.key ? s.cor + '20' : 'var(--bg-primary)', border: `1.5px solid ${form.status === s.key ? s.cor : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', padding: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: form.status === s.key ? '700' : '400', color: form.status === s.key ? s.cor : 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recorrente */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.recorrente} onChange={e => set('recorrente', e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--brand)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Lançamento recorrente (mensal)</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancelar} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancelar</button>
          <button onClick={salvar} className="btn-primary" style={{ flex: 1, padding: '10px' }}>
            {lancamento ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Financeiro({ lancamentos, onSalvar, onExcluir, onMarcarPago }) {
  const [showForm, setShowForm]         = useState(false)
  const [editando, setEditando]         = useState(null)
  const [aba, setAba]                   = useState('todos')
  const [filtroTipo, setFiltroTipo]     = useState('todos')

  const handleSalvar = async (form) => {
    await onSalvar(form)
    setShowForm(false)
    setEditando(null)
  }

  // Filtros
  const filtrados = lancamentos.filter(l => {
    if (filtroTipo !== 'todos' && l.tipo !== filtroTipo) return false
    if (aba === 'pendentes') return l.status === 'pendente'
    if (aba === 'pagos')     return l.status === 'pago' || l.status === 'recebido'
    return true
  }).sort((a, b) => (a.vencimento || '').localeCompare(b.vencimento || ''))

  // Totais
  const totalDespesas  = lancamentos.filter(l => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0)
  const totalReceitas  = lancamentos.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0)
  const totalPendente  = lancamentos.filter(l => l.status === 'pendente').reduce((s, l) => s + l.valor, 0)
  const saldo          = totalReceitas - totalDespesas

  const getCatLabel = (key) => categoriasFinanceiro.find(c => c.key === key)?.label || key
  const getCatEmoji = (key) => categoriasFinanceiro.find(c => c.key === key)?.emoji || '💸'

  const isVencido = (venc, status) => {
    if (status !== 'pendente' || !venc) return false
    const [ano, mes, dia] = venc.split('-').map(Number)
    const dataVenc = new Date(ano, mes - 1, dia)
    return dataVenc < new Date()
  }

  return (
    <div className="page-content">

      {(showForm || editando) && (
        <FormLancamento
          lancamento={editando}
          onSalvar={handleSalvar}
          onCancelar={() => { setShowForm(false); setEditando(null) }} />
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Financeiro</h1>
          <p className="page-subtitle">Contas a pagar e a receber</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditando(null); setShowForm(true) }}>+ Novo lançamento</button>
      </div>

      {/* Cards resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: '#ECFDF5', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Total receitas</p>
          <p style={{ fontSize: '22px', fontWeight: '800', color: '#059669', letterSpacing: '-0.5px' }}>{fmt(totalReceitas)}</p>
        </div>
        <div style={{ background: '#FEF2F2', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Total despesas</p>
          <p style={{ fontSize: '22px', fontWeight: '800', color: '#DC2626', letterSpacing: '-0.5px' }}>{fmt(totalDespesas)}</p>
        </div>
        <div style={{ background: saldo >= 0 ? '#ECFDF5' : '#FEF2F2', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: saldo >= 0 ? '#059669' : '#DC2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Saldo</p>
          <p style={{ fontSize: '22px', fontWeight: '800', color: saldo >= 0 ? '#059669' : '#DC2626', letterSpacing: '-0.5px' }}>{fmt(saldo)}</p>
        </div>
        <div style={{ background: 'var(--mesa-ocupada-bg)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--mesa-ocupada)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Em aberto</p>
          <p style={{ fontSize: '22px', fontWeight: '800', color: 'var(--mesa-ocupada)', letterSpacing: '-0.5px' }}>{fmt(totalPendente)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {/* Tipo */}
        {[{ key: 'todos', label: 'Todos' }, { key: 'despesa', label: '💸 Despesas' }, { key: 'receita', label: '💰 Receitas' }].map(f => (
          <button key={f.key} onClick={() => setFiltroTipo(f.key)}
            style={{ background: filtroTipo === f.key ? 'var(--brand)' : 'var(--bg-layer-01)', border: `1px solid ${filtroTipo === f.key ? 'var(--brand)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: '12px', fontWeight: filtroTipo === f.key ? '600' : '400', cursor: 'pointer', color: filtroTipo === f.key ? '#fff' : 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
            {f.label}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {[{ key: 'todos', label: 'Todos' }, { key: 'pendentes', label: 'Pendentes' }, { key: 'pagos', label: 'Pagos/Recebidos' }].map(f => (
            <button key={f.key} onClick={() => setAba(f.key)}
              style={{ background: aba === f.key ? 'var(--text-primary)' : 'var(--bg-layer-01)', border: `1px solid ${aba === f.key ? 'var(--text-primary)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: '11px', fontWeight: aba === f.key ? '600' : '400', cursor: 'pointer', color: aba === f.key ? '#fff' : 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="card">
        {filtrados.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💸</div>
            <p style={{ fontWeight: '500' }}>Nenhum lançamento encontrado</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Clique em "Novo lançamento" para adicionar.</p>
          </div>
        ) : (
          filtrados.map((l, idx) => {
            const vencido  = isVencido(l.vencimento, l.status)
            const pago     = l.status === 'pago' || l.status === 'recebido'
            const corValor = l.tipo === 'receita' ? '#059669' : '#DC2626'
            const dataFormatada = l.vencimento
              ? new Date(l.vencimento + 'T12:00:00').toLocaleDateString('pt-BR')
              : '—'

            return (
              <div key={l.id}
                style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: idx < filtrados.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: vencido ? '#FEF2F2' : pago ? '#F0FDF4' : 'transparent', transition: 'background 0.1s' }}>

                {/* Emoji categoria */}
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: l.tipo === 'receita' ? '#ECFDF5' : '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  {getCatEmoji(l.categoria)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.descricao}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                    {getCatLabel(l.categoria)} · Vence: {dataFormatada}
                    {vencido && <span style={{ color: '#DC2626', fontWeight: '700' }}> · VENCIDO</span>}
                    {l.recorrente && <span style={{ color: 'var(--brand)' }}> · Recorrente</span>}
                  </p>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: corValor }}>
                    {l.tipo === 'despesa' ? '- ' : '+ '}{fmt(l.valor)}
                  </p>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: pago ? '#ECFDF5' : vencido ? '#FEF2F2' : '#FFFBEB', color: pago ? '#059669' : vencido ? '#DC2626' : '#D97706' }}>
                    {pago ? (l.tipo === 'despesa' ? 'PAGO' : 'RECEBIDO') : vencido ? 'VENCIDO' : 'PENDENTE'}
                  </span>
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {!pago && (
                    <button onClick={() => onMarcarPago(l)}
                      style={{ background: '#ECFDF5', border: '1px solid #059669', borderRadius: 'var(--radius-sm)', padding: '5px 8px', cursor: 'pointer', fontSize: '12px', color: '#059669', fontWeight: '700', fontFamily: 'DM Sans, sans-serif' }}>
                      ✓
                    </button>
                  )}
                  <button onClick={() => { setEditando(l); setShowForm(true) }}
                    style={{ background: 'var(--bg-layer-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '5px 8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
                    ✏️
                  </button>
                  <button onClick={() => onExcluir(l)}
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', padding: '5px 8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
                    🗑️
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}