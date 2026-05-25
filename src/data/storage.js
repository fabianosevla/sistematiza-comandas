// ─────────────────────────────────────────────────────────────
//  storage.js — Firebase Firestore
//  Substitui o localStorage por dados em tempo real na nuvem.
//  Troque os valores de firebaseConfig pelos do SEU projeto.
// ─────────────────────────────────────────────────────────────
 
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
 
// ─── 1. CONFIGURAÇÃO ─────────────────────────────────────────
// Cole aqui os dados do seu projeto Firebase
// (você pega isso em: Firebase Console → Seu Projeto → Configurações → Seus apps)
const firebaseConfig = {
  apiKey: "AIzaSyA9dZjJHvNknlzzk5CKWV7LZtlPWzFb2GI",
  authDomain: "sistematiza-comandas.firebaseapp.com",
  projectId: "sistematiza-comandas",
  storageBucket: "sistematiza-comandas.firebasestorage.app",
  messagingSenderId: "63337414601",
  appId: "1:63337414601:web:07fbef18c64df41bfe3218"
};


 
const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)
 
// ─── 2. CONSTANTES ───────────────────────────────────────────
export const formasPagamento = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito']
 
export const categorias = [
  { key: 'comidas',  label: 'Comidas',  emoji: '🍽️' },
  { key: 'bebidas',  label: 'Bebidas',  emoji: '🍺' },
  { key: 'diversos', label: 'Diversos', emoji: '📦' },
]
 
// ─── 3. HELPERS ──────────────────────────────────────────────
export const fmt = (v) =>
  `R$ ${parseFloat(v || 0).toFixed(2).replace('.', ',')}`
 
export const getTotalComanda = (comanda) =>
  comanda.itens.reduce((acc, item) => acc + item.quantidade * item.preco, 0)
 
export const getMesaStatus = (mesaId, comandas) => {
  const abertas = comandas.filter(c => c.mesaId === mesaId && c.status === 'aberta')
  return abertas.length === 0 ? 'livre' : 'ocupada'
}
 
// ─── 4. CONFIG DO ESTABELECIMENTO ────────────────────────────
// Salvo como documento único: config/estabelecimento
export const getConfig = async () => {
  const snap = await getDoc(doc(db, 'config', 'estabelecimento'))
  return snap.exists() ? snap.data() : null
}
 
export const saveConfig = async (dados) => {
  await setDoc(doc(db, 'config', 'estabelecimento'), dados)
}
 
// ─── 5. MESAS ────────────────────────────────────────────────
const mesasIniciais = [
  { id: '1', numero: 1 }, { id: '2', numero: 2 },
  { id: '3', numero: 3 }, { id: '4', numero: 4 },
  { id: '5', numero: 5 }, { id: '6', numero: 6 },
  { id: '7', numero: 7 }, { id: '8', numero: 8 },
]
 
// Leitura única (usada no carregamento inicial)
export const getMesas = async () => {
  const snap = await getDocs(collection(db, 'mesas'))
  if (snap.empty) {
    // Primeira vez: salva as mesas iniciais
    for (const mesa of mesasIniciais) {
      await setDoc(doc(db, 'mesas', mesa.id), mesa)
    }
    return mesasIniciais
  }
  return snap.docs.map(d => d.data()).sort((a, b) => a.numero - b.numero)
}
 
export const saveMesa = async (mesa) => {
  await setDoc(doc(db, 'mesas', String(mesa.id)), mesa)
}
 
export const deleteMesa = async (mesaId) => {
  await deleteDoc(doc(db, 'mesas', String(mesaId)))
}
 
// Listener em tempo real para mesas
export const onMesasChange = (callback) => {
  return onSnapshot(collection(db, 'mesas'), (snap) => {
    const mesas = snap.docs.map(d => d.data()).sort((a, b) => a.numero - b.numero)
    callback(mesas)
  })
}
 
// ─── 6. COMANDAS ─────────────────────────────────────────────
export const saveComanda = async (comanda) => {
  await setDoc(doc(db, 'comandas', String(comanda.id)), comanda)
}
 
// Listener em tempo real para comandas
export const onComandasChange = (callback) => {
  return onSnapshot(collection(db, 'comandas'), (snap) => {
    const comandas = snap.docs.map(d => d.data())
    callback(comandas)
  })
}
 
// ─── 7. CARDÁPIO ─────────────────────────────────────────────
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
    for (const item of cardapioInicial) {
      await setDoc(doc(db, 'cardapio', item.id), item)
    }
    return cardapioInicial
  }
  return snap.docs.map(d => d.data())
}
 
export const saveItemCardapio = async (item) => {
  await setDoc(doc(db, 'cardapio', String(item.id)), item)
}
 
export const deleteItemCardapio = async (itemId) => {
  await deleteDoc(doc(db, 'cardapio', String(itemId)))
}
 
// Listener em tempo real para cardápio
export const onCardapioChange = (callback) => {
  return onSnapshot(collection(db, 'cardapio'), (snap) => {
    const cardapio = snap.docs.map(d => d.data())
    callback(cardapio)
  })
}