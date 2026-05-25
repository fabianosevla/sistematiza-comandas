import { useState, useRef, useEffect } from 'react'
import {
  getConfig, saveConfig,
  getMesas, saveMesa, deleteMesa, onMesasChange,
  getCardapio, saveItemCardapio, deleteItemCardapio, onCardapioChange,
  saveComanda, onComandasChange,
  getTotalComanda, getMesaStatus, fmt,
} from './data/storage'

import Dashboard   from './components/Mesas/Dashboard'
import Comanda     from './components/Comanda/Comanda'
import FecharConta from './components/Comanda/FecharConta'
import Relatorio   from './components/Relatorio/Relatorio'
import Cardapio    from './components/Cardapio/Cardapio'
import LogoIcon    from './components/LogoIcon'

/* ─── Helpers ──────────────────────────────────────────────── */
const tipos = [
  { key: 'bar',         label: 'Bar',        emoji: '🍺' },
  { key: 'restaurante', label: 'Restaurante', emoji: '🍽️' },
  { key: 'espetinho',   label: 'Espetinho',   emoji: '🍢' },
  { key: 'lanchonete',  label: 'Lanchonete',  emoji: '🥪' },
  { key: 'outros',      label: 'Outro',       emoji: '🏪' },
]
const getEmoji = (tipo) => tipos.find(t => t.key === tipo)?.emoji || '🏪'

/* ─── Logo ──────────────────────────────────────────────────── */
function SidebarLogo() {
  return (
    <div className="sidebar-logo">
      <div className="sidebar-logo-mark">
        <LogoIcon size={28} />
        <div>
          <div className="sidebar-logo-text">
            sistematiza<span className="suffix">.comandas</span>
          </div>
        </div>
      </div>
      <div className="sidebar-logo-sub">Gestão de Comandas</div>
    </div>
  )
}

/* ─── Setup ─────────────────────────────────────────────────── */
function Setup({ onConcluir }) {
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('bar')
  const [loading, setLoading] = useState(false)

  const concluir = async () => {
    if (!nome.trim()) return alert('Informe o nome do estabelecimento!')
    setLoading(true)
    await saveConfig({ nome: nome.trim(), tipo })
    onConcluir({ nome: nome.trim(), tipo })
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', padding: '48px', maxWidth: '480px', width: '100%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-subtle)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <LogoIcon size={36} />
          <div>
            <div style={{ fontWeight: '700', fontSize: '17px', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
              sistematiza<span style={{ color: '#2ecc71' }}>.comandas</span>
            </div>
            <div style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-placeholder)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>
              Gestão de Comandas
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '8px' }}>Bem-vindo! 👋</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
          Antes de começar, nos diga um pouco sobre o seu estabelecimento.
        </p>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tipo de estabelecimento</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {tipos.map(t => {
              const ativo = tipo === t.key
              return (
                <button key={t.key} onClick={() => setTipo(t.key)}
                  style={{ background: ativo ? 'var(--brand-light)' : 'var(--bg-primary)', border: `1.5px solid ${ativo ? 'var(--brand)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-lg)', padding: '14px 8px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
                  <span style={{ fontSize: '22px', display: 'block', marginBottom: '4px' }}>{t.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: ativo ? '600' : '400', color: ativo ? 'var(--brand)' : 'var(--text-secondary)' }}>{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nome do estabelecimento *</label>
          <input value={nome} onChange={e => setNome(e.target.value)} onKeyDown={e => e.key === 'Enter' && concluir()} placeholder="Ex: Bar do João" autoFocus
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '15px', color: 'var(--text-primary)', outline: 'none', background: 'var(--bg-layer-01)', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = 'var(--brand)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
        </div>

        <button onClick={concluir} disabled={loading}
          style={{ width: '100%', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Salvando...' : 'Começar a usar →'}
        </button>
      </div>
    </div>
  )
}

/* ─── Tela de carregamento inicial ──────────────────────────── */
function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <LogoIcon size={48} />
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>Conectando ao servidor...</p>
    </div>
  )
}

/* ─── UserMenu ──────────────────────────────────────────────── */
function UserMenu({ config, onSalvarConfig }) {
  const [open, setOpen]         = useState(false)
  const [editando, setEditando] = useState(false)
  const [nome, setNome]         = useState(config.nome)
  const [tipo, setTipo]         = useState(config.tipo)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const salvar = async () => {
    if (!nome.trim()) return alert('Informe o nome!')
    await onSalvarConfig({ nome: nome.trim(), tipo })
    setEditando(false)
    setOpen(false)
  }

  const iniciais = config.nome.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="avatar" onClick={() => setOpen(o => !o)}
        style={{ border: `2px solid ${open ? 'var(--brand)' : 'transparent'}` }}>
        {iniciais}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: '42px', right: 0, background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', width: '280px', overflow: 'hidden', zIndex: 200 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'var(--brand)', flexShrink: 0 }}>{iniciais}</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getEmoji(config.tipo)} {config.nome}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>{tipos.find(t => t.key === config.tipo)?.label}</p>
              </div>
            </div>
          </div>

          {!editando ? (
            <>
              <div style={{ padding: '8px 0' }}>
                <button onClick={() => setEditando(true)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '10px 20px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'DM Sans, sans-serif' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-primary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  ✏️ <span>Editar estabelecimento</span>
                </button>
              </div>
              <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-placeholder)', textAlign: 'center' }}>Powered by <strong>sistematiza.ai</strong></p>
              </div>
            </>
          ) : (
            <div style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' }}>Editar estabelecimento</p>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nome</label>
                <input value={nome} onChange={e => setNome(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
                  onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditando(false)} className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>Cancelar</button>
                <button onClick={salvar} className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>Salvar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Modal ─────────────────────────────────────────────────── */
function Modal({ mensagem, onConfirmar, onCancelar }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(22,22,22,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(2px)' }}>
      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', padding: '32px', maxWidth: '380px', width: '90%', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</div>
        <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>Confirmar ação</p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>{mensagem}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancelar} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancelar</button>
          <button onClick={onConfirmar} style={{ flex: 1, background: '#DC2626', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

const telaInfo = {
  dashboard: { title: 'Dashboard',    sub: 'Visão geral das mesas' },
  comanda:   { title: 'Comanda',      sub: 'Pedidos da mesa' },
  fechar:    { title: 'Fechar conta', sub: 'Confirmação de pagamento' },
  cardapio:  { title: 'Cardápio',     sub: 'Itens disponíveis' },
  relatorio: { title: 'Relatório',    sub: 'Resumo do dia' },
}

const navItems = [
  { key: 'dashboard', icon: '🏠', label: 'Mesas' },
  { key: 'cardapio',  icon: '🍽️', label: 'Cardápio' },
  { key: 'relatorio', icon: '📊', label: 'Relatório' },
]

/* ─── App principal ─────────────────────────────────────────── */
export default function App() {
  const [iniciando, setIniciando]                   = useState(true)  // carregando Firebase
  const [config, setConfig]                         = useState(null)
  const [tela, setTela]                             = useState('dashboard')
  const [mesas, setMesas]                           = useState([])
  const [comandas, setComandas]                     = useState([])
  const [cardapio, setCardapio]                     = useState([])
  const [mesaSelecionada, setMesaSelecionada]       = useState(null)
  const [comandaSelecionada, setComandaSelecionada] = useState(null)
  const [modal, setModal]                           = useState(null)

  // ── Carregamento inicial + listeners em tempo real ──
  useEffect(() => {
    let unsubMesas, unsubComandas, unsubCardapio

    const init = async () => {
      // Config (não precisa de listener, muda raramente)
      const cfg = await getConfig()
      setConfig(cfg)

      // Carrega dados iniciais (cria defaults se vazio)
      await getMesas()
      await getCardapio()

      // Liga os listeners em tempo real
      unsubMesas = onMesasChange(setMesas)
      unsubComandas = onComandasChange(setComandas)
      unsubCardapio = onCardapioChange(setCardapio)

      setIniciando(false)
    }

    init()

    // Desliga os listeners quando o componente desmonta
    return () => {
      unsubMesas?.()
      unsubComandas?.()
      unsubCardapio?.()
    }
  }, [])

  if (iniciando) return <Loading />

  if (!config) {
    return <Setup onConcluir={(dados) => setConfig(dados)} />
  }

  /* ── Handlers de mesas ── */
  const adicionarMesa = async () => {
    const novoNumero = mesas.length > 0 ? Math.max(...mesas.map(m => m.numero)) + 1 : 1
    const nova = { id: String(Date.now()), numero: novoNumero }
    await saveMesa(nova)
    // onMesasChange atualiza o estado automaticamente
  }

  const removerMesa = (mesa) => {
    const temAberta = comandas.some(c => c.mesaId === mesa.id && c.status === 'aberta')
    if (temAberta) return alert('Esta mesa tem comandas abertas. Feche-as antes de remover.')
    setModal({
      mensagem: `Deseja remover a Mesa ${mesa.numero}?`,
      onConfirmar: async () => {
        await deleteMesa(mesa.id)
        setModal(null)
      }
    })
  }

  /* ── Handlers de comandas ── */
  const abrirNovaComanda = async (mesa, clienteNome) => {
    const nova = {
      id: String(Date.now()),
      mesaId: mesa.id,
      mesaNumero: mesa.numero,
      clienteNome,
      itens: [],
      status: 'aberta',
      abertura: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      data:     new Date().toLocaleDateString('pt-BR'),
    }
    await saveComanda(nova)
  }

  const adicionarItens = async (comanda, itens) => {
    const novosItens = [...comanda.itens]
    itens.forEach(item => {
      const existente = novosItens.find(i => i.itemId === item.id)
      if (existente) {
        existente.quantidade += item.quantidade
      } else {
        novosItens.push({
          id: String(Date.now() + Math.random()),
          itemId: item.id,
          nome: item.nome,
          preco: item.preco,
          quantidade: item.quantidade,
        })
      }
    })
    await saveComanda({ ...comanda, itens: novosItens })
  }

  const removerItem = async (comanda, itemId) => {
    const novosItens = comanda.itens.filter(i => i.id !== itemId)
    await saveComanda({ ...comanda, itens: novosItens })
  }

  const fecharComanda = async (comanda, formaPagamento) => {
    await saveComanda({
      ...comanda,
      status: 'fechada',
      formaPagamento,
      fechamento: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    })
    setComandaSelecionada(null)
    setMesaSelecionada(null)
    setTela('dashboard')
  }

  /* ── Handlers de cardápio ── */
  const salvarItemCardapio = async (item) => {
    await saveItemCardapio(item)
  }

  const excluirItemCardapio = (item) => {
    setModal({
      mensagem: `Deseja excluir "${item.nome}" do cardápio?`,
      onConfirmar: async () => {
        await deleteItemCardapio(item.id)
        setModal(null)
      }
    })
  }

  /* ── Navegação ── */
  const navegar = (destino) => {
    setTela(destino)
    if (destino === 'dashboard') { setMesaSelecionada(null); setComandaSelecionada(null) }
  }

  const info = telaInfo[tela] || telaInfo.dashboard

  return (
    <div className="app-shell">

      {/* Sidebar */}
      <aside className="sidebar">
        <SidebarLogo />
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Menu</div>
          {navItems.map(item => (
            <button key={item.key} className={`nav-item${tela === item.key ? ' active' : ''}`} onClick={() => navegar(item.key)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {getEmoji(config.tipo)} {config.nome}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-placeholder)' }}>
              {tipos.find(t => t.key === config.tipo)?.label}
            </p>
          </div>
        </div>
      </aside>

      {/* Área principal */}
      <div className="main-area">
        <header className="topbar">
          <div>
            <div className="topbar-title">{info.title}</div>
            <div className="topbar-sub">{info.sub}</div>
          </div>
          <UserMenu config={config} onSalvarConfig={async (dados) => { await saveConfig(dados); setConfig(dados) }} />
        </header>

        {modal && <Modal mensagem={modal.mensagem} onConfirmar={modal.onConfirmar} onCancelar={() => setModal(null)} />}

        {tela === 'dashboard' && (
          <Dashboard
            mesas={mesas} comandas={comandas} config={config}
            onAbrirMesa={(mesa) => { setMesaSelecionada(mesa); setTela('comanda') }}
            onAdicionarMesa={adicionarMesa}
            onRemoverMesa={removerMesa}
          />
        )}

        {tela === 'comanda' && mesaSelecionada && (
          <Comanda
            mesa={mesaSelecionada}
            comandas={comandas.filter(c => c.mesaId === mesaSelecionada.id && c.status === 'aberta')}
            cardapio={cardapio}
            onNovaComanda={(nome) => abrirNovaComanda(mesaSelecionada, nome)}
            onAdicionarItens={adicionarItens}
            onRemoverItem={removerItem}
            onFecharConta={(comanda) => { setComandaSelecionada(comanda); setTela('fechar') }}
            onVoltar={() => { setMesaSelecionada(null); setTela('dashboard') }}
          />
        )}

        {tela === 'fechar' && comandaSelecionada && (
          <FecharConta
            comanda={comandaSelecionada}
            config={config}
            onConfirmar={(fp) => fecharComanda(comandaSelecionada, fp)}
            onVoltar={() => setTela('comanda')}
          />
        )}

        {tela === 'cardapio' && (
          <Cardapio
            cardapio={cardapio}
            onSalvar={salvarItemCardapio}
            onExcluir={excluirItemCardapio}
          />
        )}

        {tela === 'relatorio' && (
          <Relatorio comandas={comandas} config={config} />
        )}
      </div>
    </div>
  )
}