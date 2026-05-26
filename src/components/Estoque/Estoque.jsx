import { useState } from 'react'
import { fmt } from '../../data/storage'

function FormProduto({ produto, onSalvar, onCancelar }) {
  const [form, setForm] = useState({
    nome:        produto?.nome        || '',
    unidade:     produto?.unidade     || 'un',
    qtdAtual:    produto?.qtdAtual    ?? '',
    qtdMinima:   produto?.qtdMinima   ?? '',
    precoCusto:  produto?.precoCusto  || '',
    categoria:   produto?.categoria   || 'bebidas',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const salvar = () => {
    if (!form.nome || form.qtdAtual === '' || form.qtdMinima === '')
      return alert('Preencha nome, quantidade atual e quantidade mínima!')
    onSalvar({
      ...form,
      qtdAtual:   parseFloat(form.qtdAtual)   || 0,
      qtdMinima:  parseFloat(form.qtdMinima)  || 0,
      precoCusto: parseFloat(form.precoCusto) || 0,
      id: produto?.id || String(Date.now()),
    })
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)', fontSize: '14px',
    color: 'var(--text-primary)', outline: 'none',
    background: 'var(--bg-layer-01)', fontFamily: 'DM Sans, sans-serif',
  }
  const label = (txt) => (
    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{txt}</label>
  )

  const categorias = [
    { key: 'bebidas',  label: 'Bebidas',   emoji: '🍺' },
    { key: 'comidas',  label: 'Comidas',   emoji: '🍽️' },
    { key: 'diversos', label: 'Diversos',  emoji: '📦' },
  ]

  const unidades = ['un', 'cx', 'kg', 'L', 'ml', 'g', 'fardo']

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(22,22,22,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(2px)', padding: '16px' }}>
      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', padding: '28px', maxWidth: '460px', width: '100%', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}>

        <p style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
          {produto ? 'Editar produto' : 'Novo produto'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>

          {/* Nome */}
          <div>
            {label('Nome do produto *')}
            <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Heineken 600ml" autoFocus style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--brand)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
          </div>

          {/* Categoria */}
          <div>
            {label('Categoria')}
            <div style={{ display: 'flex', gap: '8px' }}>
              {categorias.map(c => (
                <button key={c.key} onClick={() => set('categoria', c.key)}
                  style={{ flex: 1, background: form.categoria === c.key ? 'var(--brand-light)' : 'var(--bg-primary)', border: `1.5px solid ${form.categoria === c.key ? 'var(--brand)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', padding: '10px 6px', cursor: 'pointer', textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}>
                  <span style={{ fontSize: '18px', display: 'block', marginBottom: '3px' }}>{c.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: form.categoria === c.key ? '700' : '400', color: form.categoria === c.key ? 'var(--brand)' : 'var(--text-secondary)' }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Qtd atual e mínima */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              {label('Qtd. atual *')}
              <input type="number" step="1" value={form.qtdAtual} onChange={e => set('qtdAtual', e.target.value)} placeholder="0" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
            </div>
            <div>
              {label('Qtd. mínima (reserva) *')}
              <input type="number" step="1" value={form.qtdMinima} onChange={e => set('qtdMinima', e.target.value)} placeholder="0" style={{ ...inputStyle, borderColor: '#FECACA' }}
                onFocus={e => e.target.style.borderColor = '#DC2626'}
                onBlur={e => e.target.style.borderColor = '#FECACA'} />
              <p style={{ fontSize: '10px', color: '#DC2626', marginTop: '4px' }}>⚠️ Alerta quando atingir esse valor</p>
            </div>
          </div>

          {/* Unidade e custo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              {label('Unidade')}
              <select value={form.unidade} onChange={e => set('unidade', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {unidades.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              {label('Preço de custo (R$)')}
              <input type="number" step="0.01" value={form.precoCusto} onChange={e => set('precoCusto', e.target.value)} placeholder="0,00" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancelar} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancelar</button>
          <button onClick={salvar} className="btn-primary" style={{ flex: 1, padding: '10px' }}>
            {produto ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function FormMovimento({ produto, onSalvar, onCancelar }) {
  const [tipo, setTipo]   = useState('entrada')
  const [qtd, setQtd]     = useState('')
  const [obs, setObs]     = useState('')
  const [custo, setCusto] = useState(produto?.precoCusto || '')

  const salvar = () => {
    if (!qtd || parseFloat(qtd) <= 0) return alert('Informe a quantidade!')
    onSalvar({
      tipo,
      quantidade: parseFloat(qtd),
      obs,
      custo: parseFloat(custo) || 0,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(22,22,22,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(2px)', padding: '16px' }}>
      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', padding: '28px', maxWidth: '380px', width: '100%', boxShadow: 'var(--shadow-lg)' }}>

        <p style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Movimentar estoque</p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>{produto.nome}</p>

        {/* Tipo */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[{ key: 'entrada', label: '📥 Entrada', cor: '#059669' }, { key: 'saida', label: '📤 Saída', cor: '#DC2626' }].map(t => (
            <button key={t.key} onClick={() => setTipo(t.key)}
              style={{ flex: 1, background: tipo === t.key ? t.cor + '15' : 'var(--bg-primary)', border: `1.5px solid ${tipo === t.key ? t.cor : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', padding: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: tipo === t.key ? '700' : '400', color: tipo === t.key ? t.cor : 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quantidade *</label>
            <input type="number" step="1" value={qtd} onChange={e => setQtd(e.target.value)} placeholder="0" autoFocus
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
              onFocus={e => e.target.style.borderColor = 'var(--brand)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
          </div>

          {tipo === 'entrada' && (
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Custo unitário (R$)</label>
              <input type="number" step="0.01" value={custo} onChange={e => setCusto(e.target.value)} placeholder="0,00"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Observação</label>
            <input value={obs} onChange={e => setObs(e.target.value)} placeholder="Ex: Compra de quinta-feira"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
              onFocus={e => e.target.style.borderColor = 'var(--brand)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancelar} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancelar</button>
          <button onClick={salvar} className="btn-primary" style={{ flex: 1, padding: '10px' }}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

export default function Estoque({ estoque, onSalvar, onExcluir, onMovimentar }) {
  const [showForm, setShowForm]         = useState(false)
  const [showMov, setShowMov]           = useState(false)
  const [editando, setEditando]         = useState(null)
  const [movProduto, setMovProduto]     = useState(null)
  const [filtro, setFiltro]             = useState('todos')
  const [busca, setBusca]               = useState('')

  const handleSalvar = async (form) => {
    await onSalvar(form)
    setShowForm(false)
    setEditando(null)
  }

  const handleMovimentar = async (produto, movimento) => {
    await onMovimentar(produto, movimento)
    setShowMov(false)
    setMovProduto(null)
  }

  // Alertas de estoque baixo
  const emAlerta = estoque.filter(p => p.qtdAtual <= p.qtdMinima)

  // Filtros
  const filtrados = estoque
    .filter(p => {
      if (filtro === 'alerta') return p.qtdAtual <= p.qtdMinima
      if (filtro === 'bebidas') return p.categoria === 'bebidas'
      if (filtro === 'comidas') return p.categoria === 'comidas'
      if (filtro === 'diversos') return p.categoria === 'diversos'
      return true
    })
    .filter(p => busca === '' || p.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome))

  const getStatusEstoque = (p) => {
    if (p.qtdAtual === 0) return { label: 'Zerado', bg: '#FEF2F2', cor: '#DC2626', border: '#FECACA' }
    if (p.qtdAtual <= p.qtdMinima) return { label: 'Crítico', bg: '#FEF2F2', cor: '#DC2626', border: '#FECACA' }
    if (p.qtdAtual <= p.qtdMinima * 1.5) return { label: 'Baixo', bg: '#FFFBEB', cor: '#D97706', border: '#FDE68A' }
    return { label: 'OK', bg: '#ECFDF5', cor: '#059669', border: '#A7F3D0' }
  }

  const catEmoji = { bebidas: '🍺', comidas: '🍽️', diversos: '📦' }

  return (
    <div className="page-content">

      {(showForm || editando) && (
        <FormProduto
          produto={editando}
          onSalvar={handleSalvar}
          onCancelar={() => { setShowForm(false); setEditando(null) }} />
      )}

      {showMov && movProduto && (
        <FormMovimento
          produto={movProduto}
          onSalvar={(mov) => handleMovimentar(movProduto, mov)}
          onCancelar={() => { setShowMov(false); setMovProduto(null) }} />
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Estoque</h1>
          <p className="page-subtitle">{estoque.length} produto{estoque.length !== 1 ? 's' : ''} cadastrado{estoque.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditando(null); setShowForm(true) }}>+ Novo produto</button>
      </div>

      {/* Alertas */}
      {emAlerta.length > 0 && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>🚨</span>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#DC2626' }}>
              {emAlerta.length} produto{emAlerta.length !== 1 ? 's' : ''} abaixo do estoque mínimo!
            </p>
            <p style={{ fontSize: '12px', color: '#DC2626', opacity: 0.8, marginTop: '2px' }}>
              {emAlerta.map(p => p.nome).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
          <p style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{estoque.length}</p>
          <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Produtos</p>
        </div>
        <div style={{ background: emAlerta.length > 0 ? '#FEF2F2' : 'var(--mesa-livre-bg)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
          <p style={{ fontSize: '22px', fontWeight: '800', color: emAlerta.length > 0 ? '#DC2626' : 'var(--mesa-livre)', letterSpacing: '-0.5px' }}>{emAlerta.length}</p>
          <p style={{ fontSize: '10px', fontWeight: '600', color: emAlerta.length > 0 ? '#DC2626' : 'var(--mesa-livre)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Em alerta</p>
        </div>
        <div style={{ background: 'var(--brand-light)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
          <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--brand)', letterSpacing: '-0.5px' }}>
            {fmt(estoque.reduce((acc, p) => acc + (p.qtdAtual * p.precoCusto), 0))}
          </p>
          <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--brand)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valor em estoque</p>
        </div>
      </div>

      {/* Busca e filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar produto..."
          style={{ flex: 1, minWidth: '160px', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', outline: 'none', fontFamily: 'DM Sans, sans-serif', background: 'var(--bg-layer-01)' }}
          onFocus={e => e.target.style.borderColor = 'var(--brand)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />

        {[
          { key: 'todos',    label: 'Todos' },
          { key: 'alerta',   label: '🚨 Em alerta' },
          { key: 'bebidas',  label: '🍺 Bebidas' },
          { key: 'comidas',  label: '🍽️ Comidas' },
          { key: 'diversos', label: '📦 Diversos' },
        ].map(f => (
          <button key={f.key} onClick={() => setFiltro(f.key)}
            style={{ background: filtro === f.key ? 'var(--brand)' : 'var(--bg-layer-01)', border: `1px solid ${filtro === f.key ? 'var(--brand)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: '12px', fontWeight: filtro === f.key ? '600' : '400', cursor: 'pointer', color: filtro === f.key ? '#fff' : 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="card">
        {filtrados.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
            <p style={{ fontWeight: '500' }}>Nenhum produto encontrado</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Clique em "Novo produto" para adicionar.</p>
          </div>
        ) : (
          filtrados.map((p, idx) => {
            const status = getStatusEstoque(p)
            const pctEstoque = p.qtdMinima > 0 ? Math.min((p.qtdAtual / (p.qtdMinima * 3)) * 100, 100) : 100

            return (
              <div key={p.id}
                style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: idx < filtrados.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: p.qtdAtual <= p.qtdMinima ? '#FFF5F5' : 'transparent' }}>

                {/* Emoji categoria */}
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: p.qtdAtual <= p.qtdMinima ? '#FEE2E2' : 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  {catEmoji[p.categoria] || '📦'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: p.qtdAtual <= p.qtdMinima ? '#DC2626' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.qtdAtual <= p.qtdMinima && '⚠️ '}{p.nome}
                    </p>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: 'var(--radius-full)', background: status.bg, color: status.cor, border: `1px solid ${status.border}`, flexShrink: 0 }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Barra de estoque */}
                  <div style={{ height: '3px', background: 'var(--bg-layer-02)', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
                    <div style={{ height: '100%', width: `${pctEstoque}%`, background: p.qtdAtual <= p.qtdMinima ? '#DC2626' : p.qtdAtual <= p.qtdMinima * 1.5 ? '#D97706' : '#059669', borderRadius: '2px', transition: 'width 0.3s' }} />
                  </div>

                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Mínimo: {p.qtdMinima} {p.unidade}
                    {p.precoCusto > 0 && ` · Custo: ${fmt(p.precoCusto)}/${p.unidade}`}
                  </p>
                </div>

                {/* Quantidade atual */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '20px', fontWeight: '800', color: p.qtdAtual <= p.qtdMinima ? '#DC2626' : 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1 }}>
                    {p.qtdAtual}
                  </p>
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>{p.unidade}</p>
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => { setMovProduto(p); setShowMov(true) }}
                    style={{ background: 'var(--brand-light)', border: '1px solid var(--brand)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: 'var(--brand)', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
                    ±
                  </button>
                  <button onClick={() => { setEditando(p); setShowForm(true) }}
                    style={{ background: 'var(--bg-layer-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
                    ✏️
                  </button>
                  <button onClick={() => onExcluir(p)}
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
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