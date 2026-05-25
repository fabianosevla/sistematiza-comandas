import { useState } from 'react'
import { categorias, fmt } from '../../data/storage'

function FormItem({ item, onSalvar, onCancelar }) {
  const [form, setForm] = useState({
    nome:      item?.nome      || '',
    preco:     item?.preco     || '',
    categoria: item?.categoria || 'comidas',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const salvar = () => {
    if (!form.nome || !form.preco) return alert('Preencha nome e preço!')
    onSalvar({ ...form, preco: parseFloat(form.preco) || 0 })
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)', fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none', background: 'var(--bg-layer-01)', fontFamily: 'DM Sans, sans-serif',
  }
  const labelStyle = {
    fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(22,22,22,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(2px)' }}>
      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', padding: '32px', maxWidth: '420px', width: '90%', boxShadow: 'var(--shadow-lg)' }}>
        <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {item ? 'Editar item' : 'Novo item'}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {item ? 'Atualize as informações do item.' : 'Adicione um novo item ao cardápio.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={labelStyle}>Nome do item *</label>
            <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Cerveja 600ml" autoFocus style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--brand)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
          </div>
          <div>
            <label style={labelStyle}>Preço (R$) *</label>
            <input type="number" step="0.01" value={form.preco} onChange={e => set('preco', e.target.value)} placeholder="0,00" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--brand)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
          </div>
          <div>
            <label style={labelStyle}>Categoria *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {categorias.map(cat => {
                const ativo = form.categoria === cat.key
                return (
                  <button key={cat.key} onClick={() => set('categoria', cat.key)}
                    style={{ background: ativo ? 'var(--brand-light)' : 'var(--bg-primary)', border: `1.5px solid ${ativo ? 'var(--brand)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', padding: '10px 8px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
                    <span style={{ fontSize: '18px', display: 'block', marginBottom: '4px' }}>{cat.emoji}</span>
                    <span style={{ fontSize: '12px', fontWeight: ativo ? '600' : '400', color: ativo ? 'var(--brand)' : 'var(--text-secondary)' }}>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancelar} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancelar</button>
          <button onClick={salvar} className="btn-primary" style={{ flex: 1, padding: '10px' }}>
            {item ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Cardapio({ cardapio, onSalvar, onExcluir }) {
  const [showForm, setShowForm]         = useState(false)
  const [itemEditando, setItemEditando] = useState(null)
  const [categoriaAtiva, setCategoriaAtiva] = useState('comidas')

  const itensFiltrados = cardapio.filter(i => i.categoria === categoriaAtiva)

  const handleSalvar = (form) => {
    if (itemEditando) {
      onSalvar({ ...itemEditando, ...form })
    } else {
      onSalvar({ id: Date.now(), ...form })
    }
    setShowForm(false)
    setItemEditando(null)
  }

  return (
    <div className="page-content">

      {(showForm || itemEditando) && (
        <FormItem
          item={itemEditando}
          onSalvar={handleSalvar}
          onCancelar={() => { setShowForm(false); setItemEditando(null) }} />
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Cardápio</h1>
          <p className="page-subtitle">{cardapio.length} item{cardapio.length !== 1 ? 's' : ''} cadastrado{cardapio.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => { setItemEditando(null); setShowForm(true) }}>+ Novo item</button>
      </div>

      {/* Tabs de categoria */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {categorias.map(cat => {
          const ativo = categoriaAtiva === cat.key
          const count = cardapio.filter(i => i.categoria === cat.key).length
          return (
            <button key={cat.key} onClick={() => setCategoriaAtiva(cat.key)}
              style={{ background: ativo ? 'var(--brand)' : 'var(--bg-layer-01)', border: `1px solid ${ativo ? 'var(--brand)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '13px', fontWeight: ativo ? '600' : '400', cursor: 'pointer', color: ativo ? '#fff' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span style={{ background: ativo ? 'rgba(255,255,255,0.25)' : 'var(--bg-primary)', borderRadius: 'var(--radius-full)', padding: '1px 7px', fontSize: '11px', fontWeight: '700' }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Lista */}
      <div className="card">
        {itensFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{categorias.find(c => c.key === categoriaAtiva)?.emoji}</div>
            <p style={{ fontWeight: '500' }}>Nenhum item em {categorias.find(c => c.key === categoriaAtiva)?.label}</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Clique em "Novo item" para adicionar.</p>
          </div>
        ) : (
          itensFiltrados.map((item, idx) => (
            <div key={item.id}
              style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: idx < itensFiltrados.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-primary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.nome}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{categorias.find(c => c.key === item.categoria)?.label}</p>
              </div>
              <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', flexShrink: 0 }}>{fmt(item.preco)}</p>
              <button onClick={() => { setItemEditando(item); setShowForm(true) }}
                style={{ background: 'var(--bg-layer-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer', fontSize: '13px', flexShrink: 0, fontFamily: 'DM Sans, sans-serif' }}>✏️</button>
              <button onClick={() => onExcluir(item)}
                style={{ background: 'var(--pay-pending-bg)', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer', fontSize: '13px', flexShrink: 0, fontFamily: 'DM Sans, sans-serif' }}>🗑️</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}