import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, doc,
  getDocs, getDoc, setDoc, deleteDoc, onSnapshot,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

// ─── CONSTANTES ───────────────────────────────────────────────
export const formasPagamento = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito']

export const categorias = [
  { key: 'comidas',  label: 'Comidas',  emoji: '🍽️' },
  { key: 'bebidas',  label: 'Bebidas',  emoji: '🍺' },
  { key: 'diversos', label: 'Diversos', emoji: '📦' },
]

export const categoriasFinanceiro = [
  { key: 'aluguel',        label: 'Aluguel',          emoji: '🏢', tipo: 'despesa' },
  { key: 'energia',        label: 'Energia elétrica',  emoji: '⚡', tipo: 'despesa' },
  { key: 'agua',           label: 'Água',              emoji: '💧', tipo: 'despesa' },
  { key: 'funcionarios',   label: 'Funcionários',      emoji: '👥', tipo: 'despesa' },
  { key: 'estoque',        label: 'Compra de estoque', emoji: '📦', tipo: 'despesa' },
  { key: 'manutencao',     label: 'Manutenção',        emoji: '🔧', tipo: 'despesa' },
  { key: 'marketing',      label: 'Marketing',         emoji: '📣', tipo: 'despesa' },
  { key: 'taxas',          label: 'Taxas e impostos',  emoji: '🧾', tipo: 'despesa' },
  { key: 'outros_desp',    label: 'Outras despesas',   emoji: '💸', tipo: 'despesa' },
  { key: 'mensalidade',    label: 'Mensalidade',       emoji: '📅', tipo: 'receita' },
  { key: 'aluguel_quadra', label: 'Aluguel de quadra', emoji: '⚽', tipo: 'receita' },
  { key: 'evento',         label: 'Evento',            emoji: '🎉', tipo: 'receita' },
  { key: 'outros_rec',     label: 'Outras receitas',   emoji: '💰', tipo: 'receita' },
]

export const taxasCartaoPadrao = { credito: 2.99, debito: 1.49 }

// ─── HELPERS ─────────────────────────────────────────────────
export const fmt = (v) =>
  `R$ ${parseFloat(v || 0).toFixed(2).replace('.', ',')}`

export const getTotalComanda = (comanda) =>
  comanda.itens.reduce((acc, item) => acc + item.quantidade * item.preco, 0)

export const getMesaStatus = (mesaId, comandas) => {
  const abertas = comandas.filter(c => c.mesaId === mesaId && c.status === 'aberta')
  return abertas.length === 0 ? 'livre' : 'ocupada'
}

export const getTaxaCartao = (formaPagamento, taxas = taxasCartaoPadrao) => {
  if (formaPagamento === 'Cartão de crédito') return taxas.credito
  if (formaPagamento === 'Cartão de débito')  return taxas.debito
  return 0
}

export const getValorLiquido = (valorBruto, formaPagamento, taxas) => {
  const taxa = getTaxaCartao(formaPagamento, taxas)
  return valorBruto * (1 - taxa / 100)
}

// ─── CONFIG ──────────────────────────────────────────────────
export const getConfig = async () => {
  const snap = await getDoc(doc(db, 'config', 'estabelecimento'))
  return snap.exists() ? snap.data() : null
}
export const saveConfig = async (dados) =>
  setDoc(doc(db, 'config', 'estabelecimento'), dados)

export const getConfigFinanceira = async () => {
  const snap = await getDoc(doc(db, 'config', 'financeiro'))
  return snap.exists() ? snap.data() : {
    cnpj: '', endereco: '', cidade: '', telefone: '',
    taxaCredito: 2.99, taxaDebito: 1.49, razaoSocial: '',
  }
}
export const saveConfigFinanceira = async (dados) =>
  setDoc(doc(db, 'config', 'financeiro'), dados)

// ─── MESAS ───────────────────────────────────────────────────
const mesasIniciais = [
  { id: '1', numero: 1 }, { id: '2', numero: 2 },
  { id: '3', numero: 3 }, { id: '4', numero: 4 },
  { id: '5', numero: 5 }, { id: '6', numero: 6 },
  { id: '7', numero: 7 }, { id: '8', numero: 8 },
]

export const getMesas = async () => {
  const snap = await getDocs(collection(db, 'mesas'))
  if (snap.empty) {
    for (const mesa of mesasIniciais) await setDoc(doc(db, 'mesas', mesa.id), mesa)
    return mesasIniciais
  }
  return snap.docs.map(d => d.data()).sort((a, b) => a.numero - b.numero)
}
export const saveMesa   = async (mesa) => setDoc(doc(db, 'mesas', String(mesa.id)), mesa)
export const deleteMesa = async (id)   => deleteDoc(doc(db, 'mesas', String(id)))
export const onMesasChange = (cb) =>
  onSnapshot(collection(db, 'mesas'), snap =>
    cb(snap.docs.map(d => d.data()).sort((a, b) => a.numero - b.numero)))

// ─── COMANDAS ────────────────────────────────────────────────
export const saveComanda = async (comanda) =>
  setDoc(doc(db, 'comandas', String(comanda.id)), comanda)
export const onComandasChange = (cb) =>
  onSnapshot(collection(db, 'comandas'), snap => cb(snap.docs.map(d => d.data())))

// ─── CARDÁPIO ────────────────────────────────────────────────
const cardapioInicial = [
  { id: '1', nome: 'Cerveja 600ml',      preco: 12.00, categoria: 'bebidas' },
  { id: '2', nome: 'Refrigerante Lata',  preco: 6.00,  categoria: 'bebidas' },
  { id: '3', nome: 'Água Mineral',       preco: 4.00,  categoria: 'bebidas' },
  { id: '4', nome: 'Espetinho de Carne', preco: 8.00,  categoria: 'comidas' },
  { id: '5', nome: 'Porção de Fritas',   preco: 18.00, categoria: 'comidas' },
  { id: '6', nome: 'Carvão',             preco: 5.00,  categoria: 'diversos' },
]

export const getCardapio = async () => {
  const snap = await getDocs(collection(db, 'cardapio'))
  if (snap.empty) {
    for (const item of cardapioInicial) await setDoc(doc(db, 'cardapio', item.id), item)
    return cardapioInicial
  }
  return snap.docs.map(d => d.data())
}
export const saveItemCardapio   = async (item) => setDoc(doc(db, 'cardapio', String(item.id)), item)
export const deleteItemCardapio = async (id)   => deleteDoc(doc(db, 'cardapio', String(id)))
export const onCardapioChange   = (cb) =>
  onSnapshot(collection(db, 'cardapio'), snap => cb(snap.docs.map(d => d.data())))

// ─── LANÇAMENTOS FINANCEIROS ─────────────────────────────────
export const saveLancamento   = async (l)  => setDoc(doc(db, 'lancamentos', String(l.id)), l)
export const deleteLancamento = async (id) => deleteDoc(doc(db, 'lancamentos', String(id)))
export const onLancamentosChange = (cb) =>
  onSnapshot(collection(db, 'lancamentos'), snap => cb(snap.docs.map(d => d.data())))

// ─── ESTOQUE ─────────────────────────────────────────────────
// Produto: { id, nome, categoria, unidade, qtdAtual, qtdMinima, precoCusto }
// Movimento: { id, produtoId, tipo: 'entrada'|'saida', quantidade, custo, obs, data, hora }

export const saveEstoqueProduto   = async (p)  => setDoc(doc(db, 'estoque', String(p.id)), p)
export const deleteEstoqueProduto = async (id) => deleteDoc(doc(db, 'estoque', String(id)))
export const onEstoqueChange      = (cb) =>
  onSnapshot(collection(db, 'estoque'), snap => cb(snap.docs.map(d => d.data())))

export const saveMovimento = async (mov) =>
  setDoc(doc(db, 'movimentos', String(mov.id)), mov)
export const onMovimentosChange = (cb) =>
  onSnapshot(collection(db, 'movimentos'), snap => cb(snap.docs.map(d => d.data())))