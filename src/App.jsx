import { useState, useRef, useEffect } from 'react'
import {
  getConfig, saveConfig, getConfigFinanceira, saveConfigFinanceira,
  getMesas, saveMesa, deleteMesa, onMesasChange,
  getCardapio, saveItemCardapio, deleteItemCardapio, onCardapioChange,
  saveComanda, onComandasChange,
  saveLancamento, deleteLancamento, onLancamentosChange,
  saveEstoqueProduto, deleteEstoqueProduto, onEstoqueChange,
  saveMovimento,
  getTotalComanda, getMesaStatus,
} from './data/storage'

import Dashboard   from './components/Mesas/Dashboard'
import Comanda     from './components/Comanda/Comanda'
import FecharConta from './components/Comanda/FecharConta'
import Relatorio   from './components/Relatorio/Relatorio'
import Cardapio    from './components/Cardapio/Cardapio'
import Financeiro  from './components/Financeiro/Financeiro'
import Faturamento from './components/Faturamento/Faturamento'
import Estoque     from './components/Estoque/Estoque'
import LogoIcon    from './components/LogoIcon'

const tipos = [
  { key: 'bar',         label: 'Bar',        emoji: '🍺' },
  { key: 'restaurante', label: 'Restaurante', emoji: '🍽️' },
  { key: 'espetinho',   label: 'Espetinho',   emoji: '🍢' },
  { key: 'lanchonete',  label: 'Lanchonete',  emoji: '🥪' },
  { key: 'outros',      label: 'Outro',       emoji: '🏪' },
]
const getEmoji = (tipo) => tipos.find(t => t.key === tipo)?.emoji || '🏪'

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

function Setup({ onConcluir }) {
  const [nome, setNome]       = useState('')
  const [tipo, setTipo]       = useState('bar')
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
            <div style={{ fontWeight: '700', fontSize: '17px', color: 'var(--text-primary)' }}>
              sistematiza<span style={{ color: '#2ecc71' }}>.comandas</span>
            </div>
            <div style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-placeholder)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>
              Gestão de Comandas
            </div>
          </div>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Bem-vindo! 👋</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>Antes de começar, nos diga um pouco sobre o seu estabelecimento.</p>
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
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nome *</label>
          <input value={nome} onChange={e => setNome(e.target.value)} onKeyDown={e => e.key === 'Enter' && concluir()} placeholder="Ex: Bar do João" autoFocus
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '15px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
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

function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <LogoIcon size={48} />
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>Conectando ao servidor...</p>
    </div>
  )
}

function UserMenu({ config, configFin, onSalvarConfig, onSalvarConfigFin }) {
  const [open, setOpen] = useState(false)
  const [aba, setAba]   = useState('estabelecimento')
  const [nome, setNome] = useState(config.nome)
  const [tipo, setTipo] = useState(config.tipo)
  const [fin, setFin]   = useState(configFin || {})
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const salvar = async () => {
    if (!nome.trim()) return alert('Informe o nome!')
    await onSalvarConfig({ nome: nome.trim(), tipo })
    await onSalvarConfigFin(fin)
    setOpen(false)
  }

  const iniciais = config.nome.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  const inputStyle = { width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', outline: 'none', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="avatar" onClick={() => setOpen(o => !o)}
        style={{ border: `2px solid ${open ? 'var(--brand)' : 'transparent'}` }}>
        {iniciais}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: '42px', right: 0, background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', width: '320px', overflow: 'hidden', zIndex: 200 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-full)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--brand)', flexShrink: 0 }}>{iniciais}</div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{getEmoji(config.tipo)} {config.nome}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{tipos.find(t => t.key === config.tipo)?.label}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
            {[{ key: 'estabelecimento', label: 'Geral' }, { key: 'fiscal', label: 'Fiscal / Taxas' }].map(a => (
              <button key={a.key} onClick={() => setAba(a.key)}
                style={{ flex: 1, background: 'none', border: 'none', borderBottom: `2px solid ${aba === a.key ? 'var(--brand)' : 'transparent'}`, padding: '10px', fontSize: '12px', fontWeight: aba === a.key ? '700' : '400', color: aba === a.key ? 'var(--brand)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                {a.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '16px 18px' }}>
            {aba === 'estabelecimento' ? (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nome</label>
                  <input value={nome} onChange={e => setNome(e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tipo</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginTop: '6px' }}>
                    {tipos.map(t => {
                      const ativo = tipo === t.key
                      return (
                        <button key={t.key} onClick={() => setTipo(t.key)}
                          style={{ background: ativo ? 'var(--brand-light)' : 'var(--bg-primary)', border: `1.5px solid ${ativo ? 'var(--brand)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', padding: '6px 4px', cursor: 'pointer', textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}>
                          <span style={{ fontSize: '14px', display: 'block' }}>{t.emoji}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CNPJ</label>
                    <input value={fin.cnpj || ''} onChange={e => setFin(f => ({ ...f, cnpj: e.target.value }))} placeholder="00.000.000/0001-00" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Telefone</label>
                    <input value={fin.telefone || ''} onChange={e => setFin(f => ({ ...f, telefone: e.target.value }))} placeholder="(00) 00000-0000" style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Razão social</label>
                  <input value={fin.razaoSocial || ''} onChange={e => setFin(f => ({ ...f, razaoSocial: e.target.value }))} placeholder="Nome jurídico" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Endereço</label>
                  <input value={fin.endereco || ''} onChange={e => setFin(f => ({ ...f, endereco: e.target.value }))} placeholder="Rua, número" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cidade / UF</label>
                  <input value={fin.cidade || ''} onChange={e => setFin(f => ({ ...f, cidade: e.target.value }))} placeholder="Cidade - UF" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Taxa crédito (%)</label>
                    <input type="number" step="0.01" value={fin.taxaCredito ?? 2.99} onChange={e => setFin(f => ({ ...f, taxaCredito: parseFloat(e.target.value) }))} style={{ ...inputStyle, borderColor: '#FECACA' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Taxa débito (%)</label>
                    <input type="number" step="0.01" value={fin.taxaDebito ?? 1.49} onChange={e => setFin(f => ({ ...f, taxaDebito: parseFloat(e.target.value) }))} style={{ ...inputStyle, borderColor: '#FECACA' }} />
                  </div>
                </div>
              </>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setOpen(false)} className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>Cancelar</button>
              <button onClick={salvar} className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>Salvar</button>
            </div>
          </div>

          <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-placeholder)', textAlign: 'center' }}>Powered by <strong>sistematiza.ai</strong></p>
          </div>
        </div>
      )}
    </div>
  )
}

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
  dashboard:   { title: 'Dashboard',    sub: 'Visão geral das mesas' },
  comanda:     { title: 'Comanda',      sub: 'Pedidos da mesa' },
  fechar:      { title: 'Fechar conta', sub: 'Confirmação de pagamento' },
  cardapio:    { title: 'Cardápio',     sub: 'Itens disponíveis' },
  relatorio:   { title: 'Relatório',    sub: 'Resumo do dia' },
  financeiro:  { title: 'Financeiro',   sub: 'Contas a pagar e receber' },
  faturamento: { title: 'Faturamento',  sub: 'Receita, despesas e lucro' },
  estoque:     { title: 'Estoque',      sub: 'Controle de produtos do bar' },
}

const navItems = [
  { key: 'dashboard',   icon: '🏠', label: 'Mesas',       grupo: 'operação' },
  { key: 'cardapio',    icon: '🍽️', label: 'Cardápio',    grupo: 'operação' },
  { key: 'estoque',     icon: '📦', label: 'Estoque',     grupo: 'operação' },
  { key: 'financeiro',  icon: '💸', label: 'Financeiro',  grupo: 'gestão' },
  { key: 'faturamento', icon: '📈', label: 'Faturamento', grupo: 'gestão' },
  { key: 'relatorio',   icon: '📊', label: 'Relatório',   grupo: 'gestão' },
]

export default function App() {
  const [iniciando, setIniciando]                   = useState(true)
  const [config, setConfig]                         = useState(null)
  const [configFin, setConfigFin]                   = useState(null)
  const [tela, setTela]                             = useState('dashboard')
  const [mesas, setMesas]                           = useState([])
  const [comandas, setComandas]                     = useState([])
  const [cardapio, setCardapio]                     = useState([])
  const [lancamentos, setLancamentos]               = useState([])
  const [estoque, setEstoque]                       = useState([])
  const [mesaSelecionada, setMesaSelecionada]       = useState(null)
  const [comandaSelecionada, setComandaSelecionada] = useState(null)
  const [modal, setModal]                           = useState(null)

  useEffect(() => {
    let unsubMesas, unsubComandas, unsubCardapio, unsubLanc, unsubEstoque

    const init = async () => {
      const [cfg, cfgFin] = await Promise.all([getConfig(), getConfigFinanceira()])
      setConfig(cfg)
      setConfigFin(cfgFin)
      await getMesas()
      await getCardapio()
      unsubMesas    = onMesasChange(setMesas)
      unsubComandas = onComandasChange(setComandas)
      unsubCardapio = onCardapioChange(setCardapio)
      unsubLanc     = onLancamentosChange(setLancamentos)
      unsubEstoque  = onEstoqueChange(setEstoque)
      setIniciando(false)
    }

    init()
    return () => {
      unsubMesas?.(); unsubComandas?.(); unsubCardapio?.()
      unsubLanc?.(); unsubEstoque?.()
    }
  }, [])

  if (iniciando) return <Loading />
  if (!config)   return <Setup onConcluir={(d) => setConfig(d)} />

  /* ── Mesas ── */
  const adicionarMesa = async () => {
    const novoNumero = mesas.length > 0 ? Math.max(...mesas.map(m => m.numero)) + 1 : 1
    await saveMesa({ id: String(Date.now()), numero: novoNumero })
  }

  const removerMesa = (mesa) => {
    if (comandas.some(c => c.mesaId === mesa.id && c.status === 'aberta'))
      return alert('Esta mesa tem comandas abertas. Feche-as antes de remover.')
    setModal({
      mensagem: `Deseja remover a Mesa ${mesa.numero}?`,
      onConfirmar: async () => { await deleteMesa(mesa.id); setModal(null) }
    })
  }

  /* ── Comandas ── */
  const abrirNovaComanda = async (mesa, clienteNome) => {
    await saveComanda({
      id: String(Date.now()), mesaId: mesa.id, mesaNumero: mesa.numero,
      clienteNome, itens: [], status: 'aberta',
      abertura: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      data: new Date().toLocaleDateString('pt-BR'),
    })
  }

  const adicionarItens = async (comanda, itens) => {
    const novosItens = [...comanda.itens]
    itens.forEach(item => {
      const existente = novosItens.find(i => i.itemId === item.id)
      if (existente) existente.quantidade += item.quantidade
      else novosItens.push({ id: String(Date.now() + Math.random()), itemId: item.id, nome: item.nome, preco: item.preco, quantidade: item.quantidade })
    })
    await saveComanda({ ...comanda, itens: novosItens })
  }

  const removerItem = async (comanda, itemId) =>
    saveComanda({ ...comanda, itens: comanda.itens.filter(i => i.id !== itemId) })

  const fecharComanda = async (comanda, formaPagamento) => {
    await saveComanda({
      ...comanda, status: 'fechada', formaPagamento,
      fechamento: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    })
    setComandaSelecionada(null); setMesaSelecionada(null); setTela('dashboard')
  }

  /* ── Cardápio ── */
  const salvarItemCardapio  = async (item) => saveItemCardapio(item)
  const excluirItemCardapio = (item) => setModal({
    mensagem: `Deseja excluir "${item.nome}" do cardápio?`,
    onConfirmar: async () => { await deleteItemCardapio(item.id); setModal(null) }
  })

  /* ── Financeiro ── */
  const salvarLancamento  = async (l) => saveLancamento(l)
  const excluirLancamento = (l) => setModal({
    mensagem: `Deseja excluir "${l.descricao}"?`,
    onConfirmar: async () => { await deleteLancamento(l.id); setModal(null) }
  })
  const marcarPago = async (l) =>
    saveLancamento({ ...l, status: l.tipo === 'despesa' ? 'pago' : 'recebido', dataPagamento: new Date().toLocaleDateString('pt-BR') })

  /* ── Estoque ── */
  const salvarEstoqueProduto = async (p) => saveEstoqueProduto(p)

  const excluirEstoqueProduto = (p) => setModal({
    mensagem: `Deseja excluir "${p.nome}" do estoque?`,
    onConfirmar: async () => { await deleteEstoqueProduto(p.id); setModal(null) }
  })

  const movimentarEstoque = async (produto, movimento) => {
    // Atualiza quantidade do produto
    const novaQtd = movimento.tipo === 'entrada'
      ? produto.qtdAtual + movimento.quantidade
      : Math.max(0, produto.qtdAtual - movimento.quantidade)

    const produtoAtualizado = { ...produto, qtdAtual: novaQtd }
    if (movimento.tipo === 'entrada' && movimento.custo > 0) {
      produtoAtualizado.precoCusto = movimento.custo
    }
    await saveEstoqueProduto(produtoAtualizado)

    // Salva o movimento no histórico
    await saveMovimento({
      id: String(Date.now()),
      produtoId: produto.id,
      produtoNome: produto.nome,
      ...movimento,
    })

    // Se foi entrada de estoque, cria lançamento financeiro automaticamente
    if (movimento.tipo === 'entrada' && movimento.custo > 0) {
      await saveLancamento({
        id: String(Date.now() + 1),
        tipo: 'despesa',
        categoria: 'estoque',
        descricao: `Compra: ${produto.nome} (${movimento.quantidade} ${produto.unidade})`,
        valor: movimento.custo * movimento.quantidade,
        vencimento: new Date().toISOString().split('T')[0],
        status: 'pago',
        dataPagamento: new Date().toLocaleDateString('pt-BR'),
        recorrente: false,
        createdAt: new Date().toISOString(),
        obs: movimento.obs || '',
      })
    }
  }

  /* ── Navegação ── */
  const navegar = (destino) => {
    setTela(destino)
    if (destino === 'dashboard') { setMesaSelecionada(null); setComandaSelecionada(null) }
  }

  const info   = telaInfo[tela] || telaInfo.dashboard
  const grupos = [...new Set(navItems.map(n => n.grupo))]

  // Alertas de estoque para badge na sidebar
  const estoqueAlerta = estoque.filter(p => p.qtdAtual <= p.qtdMinima).length

  return (
    <div className="app-shell">

      {/* Sidebar */}
      <aside className="sidebar">
        <SidebarLogo />
        <nav className="sidebar-nav">
          {grupos.map(grupo => (
            <div key={grupo}>
              <div className="sidebar-nav-label">{grupo}</div>
              {navItems.filter(n => n.grupo === grupo).map(item => (
                <button key={item.key}
                  className={`nav-item${tela === item.key ? ' active' : ''}`}
                  onClick={() => navegar(item.key)}>
                  <span className="nav-icon">{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.key === 'estoque' && estoqueAlerta > 0 && (
                    <span style={{ background: '#DC2626', color: '#fff', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: '700', padding: '1px 6px', minWidth: '18px', textAlign: 'center' }}>
                      {estoqueAlerta}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: '10px 12px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {getEmoji(config.tipo)} {config.nome}
            </p>
            <p style={{ fontSize: '10px', color: 'var(--text-placeholder)', marginTop: '1px' }}>
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
          <UserMenu
            config={config} configFin={configFin}
            onSalvarConfig={async (d) => { await saveConfig(d); setConfig(d) }}
            onSalvarConfigFin={async (d) => { await saveConfigFinanceira(d); setConfigFin(d) }}
          />
        </header>

        {modal && <Modal mensagem={modal.mensagem} onConfirmar={modal.onConfirmar} onCancelar={() => setModal(null)} />}

        {tela === 'dashboard' && (
          <Dashboard mesas={mesas} comandas={comandas} config={config}
            onAbrirMesa={(mesa) => { setMesaSelecionada(mesa); setTela('comanda') }}
            onAdicionarMesa={adicionarMesa} onRemoverMesa={removerMesa} />
        )}
        {tela === 'comanda' && mesaSelecionada && (
          <Comanda mesa={mesaSelecionada}
            comandas={comandas.filter(c => c.mesaId === mesaSelecionada.id && c.status === 'aberta')}
            cardapio={cardapio}
            onNovaComanda={(nome) => abrirNovaComanda(mesaSelecionada, nome)}
            onAdicionarItens={adicionarItens} onRemoverItem={removerItem}
            onFecharConta={(comanda) => { setComandaSelecionada(comanda); setTela('fechar') }}
            onVoltar={() => { setMesaSelecionada(null); setTela('dashboard') }} />
        )}
        {tela === 'fechar' && comandaSelecionada && (
          <FecharConta comanda={comandaSelecionada} config={config} configFin={configFin}
            onConfirmar={(fp) => fecharComanda(comandaSelecionada, fp)}
            onVoltar={() => setTela('comanda')} />
        )}
        {tela === 'cardapio' && (
          <Cardapio cardapio={cardapio} onSalvar={salvarItemCardapio} onExcluir={excluirItemCardapio} />
        )}
        {tela === 'relatorio' && (
          <Relatorio comandas={comandas} config={config} />
        )}
        {tela === 'financeiro' && (
          <Financeiro lancamentos={lancamentos}
            onSalvar={salvarLancamento} onExcluir={excluirLancamento} onMarcarPago={marcarPago} />
        )}
        {tela === 'faturamento' && (
          <Faturamento comandas={comandas} lancamentos={lancamentos} configFin={configFin} />
        )}
        {tela === 'estoque' && (
          <Estoque
            estoque={estoque}
            onSalvar={salvarEstoqueProduto}
            onExcluir={excluirEstoqueProduto}
            onMovimentar={movimentarEstoque} />
        )}
      </div>
    </div>
  )
}