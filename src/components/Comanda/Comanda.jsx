import { useState } from 'react'
import { fmt, getTotalComanda, categorias } from '../../data/storage'

function NovaComandaForm({ onConfirmar, onCancelar }) {
  const [nome, setNome] = useState('')
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(22,22,22,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(2px)' }}>
      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', padding: '32px', maxWidth: '380px', width: '90%', boxShadow: 'var(--shadow-lg)' }}>
        <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Nova comanda</p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Informe o nome do cliente para abrir a comanda.</p>
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && nome.trim() && onConfirmar(nome.trim())}
          placeholder="Nome do cliente"
          autoFocus
          style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '14px', color: 'var(--text-primary)', outline: 'none', marginBottom: '16px', fontFamily: 'DM Sans, sans-serif' }}
          onFocus={e => e.target.style.borderColor = 'var(--brand)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancelar} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancelar</button>
          <button onClick={() => nome.trim() && onConfirmar(nome.trim())} className="btn-primary" style={{ flex: 1, padding: '10px' }}>Abrir</button>
        </div>
      </div>
    </div>
  )
}

function SeletorItens({ cardapio, onConfirmar, onCancelar }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState('comidas')
  const [quantidades, setQuantidades]       = useState({})

  const setQtd = (id, val) => {
    const novo = Math.max(0, val)
    setQuantidades(q => ({ ...q, [id]: novo }))
  }

  const itensSelecionados = Object.entries(quantidades)
    .filter(([, qtd]) => qtd > 0)
    .map(([id, qtd]) => {
      const item = cardapio.find(i => i.id === parseInt(id))
      return { ...item, quantidade: qtd }
    })

  const totalSelecionado = itensSelecionados.reduce((acc, i) => acc + i.quantidade * i.preco, 0)
  const itensFiltrados   = cardapio.filter(i => i.categoria === categoriaAtiva)

  const confirmar = () => {
    if (itensSelecionados.length === 0) return alert('Selecione pelo menos um item!')
    onConfirmar(itensSelecionados)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(22,22,22,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(2px)' }}>
      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', width: '90%', maxWidth: '560px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>

        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Adicionar itens</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Selecione os itens do cardápio.</p>
        </div>

        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
          {categorias.map(cat => {
            const ativo = categoriaAtiva === cat.key
            return (
              <button key={cat.key} onClick={() => setCategoriaAtiva(cat.key)}
                style={{ background: ativo ? 'var(--brand)' : 'var(--bg-primary)', border: `1px solid ${ativo ? 'var(--brand)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: '12px', fontWeight: ativo ? '600' : '400', cursor: 'pointer', color: ativo ? '#fff' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
                <span>{cat.emoji}</span><span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {itensFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '13px' }}>Nenhum item nesta categoria.</p>
            </div>
          ) : (
            itensFiltrados.map((item, idx) => {
              const qtd = quantidades[item.id] || 0
              return (
                <div key={item.id}
                  style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: idx < itensFiltrados.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: qtd > 0 ? 'var(--brand-light)' : 'transparent', transition: 'background 0.15s' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.nome}</p>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: qtd > 0 ? 'var(--brand)' : 'var(--text-secondary)', marginTop: '1px' }}>{fmt(item.preco)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => setQtd(item.id, qtd - 1)}
                      style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-sm)', background: qtd > 0 ? 'var(--brand)' : 'var(--bg-layer-02)', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '700', color: qtd > 0 ? '#fff' : 'var(--text-placeholder)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>−</button>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', minWidth: '20px', textAlign: 'center' }}>{qtd}</span>
                    <button onClick={() => setQtd(item.id, qtd + 1)}
                      style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-sm)', background: 'var(--brand)', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>+</button>
                  </div>
                  {qtd > 0 && (
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--brand)', minWidth: '60px', textAlign: 'right', flexShrink: 0 }}>{fmt(qtd * item.preco)}</p>
                  )}
                </div>
              )
            })
          )}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
          {itensSelecionados.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {itensSelecionados.reduce((a, i) => a + i.quantidade, 0)} iten{itensSelecionados.reduce((a, i) => a + i.quantidade, 0) !== 1 ? 's' : ''} selecionado{itensSelecionados.reduce((a, i) => a + i.quantidade, 0) !== 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{fmt(totalSelecionado)}</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onCancelar} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancelar</button>
            <button onClick={confirmar} className="btn-primary" style={{ flex: 2, padding: '10px', fontSize: '14px' }}>
              Adicionar {itensSelecionados.length > 0 ? `(${fmt(totalSelecionado)})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Comanda({ mesa, comandas, cardapio, onNovaComanda, onAdicionarItens, onRemoverItem, onFecharConta, onVoltar }) {
  const [showNovaComanda, setShowNovaComanda] = useState(false)
  const [showSeletor, setShowSeletor]         = useState(false)
  const [comandaAtiva, setComandaAtiva]       = useState(null)

  const comanda = comandaAtiva
    ? comandas.find(c => c.id === comandaAtiva.id) || comandas[0]
    : comandas[0]

  return (
    <div className="page-content">

      {showNovaComanda && (
        <NovaComandaForm
          onConfirmar={(nome) => { onNovaComanda(nome); setShowNovaComanda(false) }}
          onCancelar={() => setShowNovaComanda(false)} />
      )}

      {showSeletor && comanda && (
        <SeletorItens
          cardapio={cardapio}
          onConfirmar={(itens) => { onAdicionarItens(comanda, itens); setShowSeletor(false) }}
          onCancelar={() => setShowSeletor(false)} />
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar para mesas</span>
          </p>
          <h1 className="page-title">Mesa {mesa.numero}</h1>
          <p className="page-subtitle">{comandas.length} comanda{comandas.length !== 1 ? 's' : ''} aberta{comandas.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowNovaComanda(true)}>+ Nova comanda</button>
      </div>

      {comandas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍺</div>
          <p style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>Mesa vazia</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>Abra uma comanda para começar a registrar pedidos.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: comandas.length > 1 ? '220px 1fr' : '1fr', gap: '16px' }}>

          {/* Lista de comandas (sidebar interna) */}
          {comandas.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Comandas</p>
              {comandas.map(c => {
                const ativa = comanda?.id === c.id
                return (
                  <div key={c.id} onClick={() => setComandaAtiva(c)}
                    style={{ background: ativa ? 'var(--brand-light)' : 'var(--bg-layer-01)', border: `1.5px solid ${ativa ? 'var(--brand)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-lg)', padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: ativa ? 'var(--brand)' : 'var(--text-primary)' }}>{c.clienteNome}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{c.itens.length} item{c.itens.length !== 1 ? 's' : ''} · {fmt(getTotalComanda(c))}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-placeholder)', marginTop: '2px' }}>Aberta às {c.abertura}</p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Detalhe da comanda */}
          {comanda && (
            <div className="card">
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{comanda.clienteNome}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Aberta às {comanda.abertura}</p>
                </div>
                <button className="btn-primary" onClick={() => setShowSeletor(true)} style={{ padding: '8px 16px', fontSize: '13px' }}>
                  + Adicionar itens
                </button>
              </div>

              <div style={{ minHeight: '200px' }}>
                {comanda.itens.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <p style={{ fontSize: '13px' }}>Nenhum item adicionado ainda.</p>
                  </div>
                ) : (
                  comanda.itens.map((item, idx) => (
                    <div key={item.id}
                      style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: idx < comanda.itens.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', flexShrink: 0 }}>
                        {item.quantidade}x
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.nome}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>{fmt(item.preco)} cada</p>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', flexShrink: 0 }}>{fmt(item.quantidade * item.preco)}</p>
                      <button onClick={() => onRemoverItem(comanda, item.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--text-placeholder)', padding: '4px', opacity: 0.5, transition: 'opacity 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}>✕</button>
                    </div>
                  ))
                )}
              </div>

              <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>Total da comanda</span>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{fmt(getTotalComanda(comanda))}</span>
                </div>
                <button onClick={() => onFecharConta(comanda)}
                  style={{ width: '100%', background: 'var(--text-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '13px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Fechar conta
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}