import { fmt, getTotalComanda, getValorLiquido } from '../../data/storage'

// Gera o texto do cupom para WhatsApp
const gerarTextoWhatsApp = (comanda, config, configFin, total, liquido) => {
  const linhas = [
    `🧾 *RECIBO DE CONSUMO*`,
    ``,
    `*${config?.nome || 'Estabelecimento'}*`,
    configFin?.cnpj ? `CNPJ: ${configFin.cnpj}` : '',
    configFin?.endereco ? configFin.endereco : '',
    ``,
    `─────────────────────`,
    `Data: ${comanda.data} às ${comanda.fechamento || comanda.abertura}`,
    `Cliente: ${comanda.clienteNome}`,
    `Mesa: ${comanda.mesaNumero}`,
    `─────────────────────`,
    `*ITENS*`,
    ...comanda.itens.map(i =>
      `${i.quantidade}x ${i.nome}\n   ${fmt(i.preco)} cada = *${fmt(i.quantidade * i.preco)}*`
    ),
    `─────────────────────`,
    `*TOTAL: ${fmt(total)}*`,
    `Pagamento: ${comanda.formaPagamento}`,
    liquido < total ? `Valor líquido: ${fmt(liquido)}` : '',
    ``,
    `Obrigado pela preferência! 🙏`,
    `Powered by sistematiza.ai`,
  ].filter(l => l !== null && l !== undefined)

  return linhas.join('\n')
}

export default function Recibo({ comanda, config, configFin, onFechar }) {
  const total   = getTotalComanda(comanda)
  const taxaPorc = comanda.formaPagamento === 'Cartão de crédito'
    ? (configFin?.taxaCredito ?? 2.99)
    : comanda.formaPagamento === 'Cartão de débito'
      ? (configFin?.taxaDebito ?? 1.49)
      : 0
  const desconto = total * (taxaPorc / 100)
  const liquido  = total - desconto

  const handlePrint = () => {
    const conteudo = document.getElementById('recibo-print').innerHTML
    const janela = window.open('', '_blank', 'width=400,height=700')
    janela.document.write(`
      <html>
        <head>
          <title>Recibo — ${comanda.clienteNome}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              padding: 16px;
              max-width: 300px;
              margin: 0 auto;
              color: #000;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; margin: 3px 0; }
            .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; }
            .small { font-size: 10px; }
            h1 { font-size: 14px; text-align: center; }
            h2 { font-size: 11px; text-align: center; font-weight: normal; }
          </style>
        </head>
        <body>${conteudo}</body>
      </html>
    `)
    janela.document.close()
    janela.focus()
    setTimeout(() => { janela.print(); janela.close() }, 300)
  }

  const handleWhatsApp = () => {
    const texto = gerarTextoWhatsApp(comanda, config, configFin, total, liquido)
    const encoded = encodeURIComponent(texto)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(22,22,22,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '16px' }}>
      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '420px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Recibo gerado</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Compartilhe ou imprima</p>
          </div>
          <button onClick={onFechar}
            style={{ background: 'var(--bg-primary)', border: 'none', borderRadius: 'var(--radius-full)', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Cupom */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f9f9f9' }}>
          <div id="recibo-print"
            style={{ background: '#fff', borderRadius: '8px', padding: '20px', fontFamily: "'Courier New', monospace", fontSize: '12px', color: '#000', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>

            {/* Cabeçalho */}
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <p style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.05em' }}>{config?.nome || 'ESTABELECIMENTO'}</p>
              {configFin?.razaoSocial && <p style={{ fontSize: '10px', marginTop: '2px' }}>{configFin.razaoSocial}</p>}
              {configFin?.cnpj && <p style={{ fontSize: '10px', marginTop: '2px' }}>CNPJ: {configFin.cnpj}</p>}
              {configFin?.endereco && <p style={{ fontSize: '10px', marginTop: '2px' }}>{configFin.endereco}</p>}
              {configFin?.cidade && <p style={{ fontSize: '10px' }}>{configFin.cidade}</p>}
              {configFin?.telefone && <p style={{ fontSize: '10px' }}>Tel: {configFin.telefone}</p>}
            </div>

            <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />

            <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '8px' }}>
              *** NÃO É DOCUMENTO FISCAL ***
            </p>

            <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />

            {/* Dados */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Data:</span><span>{comanda.data}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Hora:</span><span>{comanda.fechamento || comanda.abertura}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Cliente:</span><span style={{ fontWeight: 'bold' }}>{comanda.clienteNome}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mesa:</span><span>{comanda.mesaNumero}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />

            {/* Itens */}
            <p style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '11px', letterSpacing: '0.05em' }}>ITENS CONSUMIDOS</p>
            {comanda.itens.map((item) => (
              <div key={item.id} style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>{item.nome}</span>
                  <span style={{ fontWeight: 'bold' }}>{fmt(item.quantidade * item.preco)}</span>
                </div>
                <div style={{ fontSize: '10px', color: '#555' }}>
                  {item.quantidade}x {fmt(item.preco)}
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />

            {/* Totais */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Subtotal:</span><span>{fmt(total)}</span>
            </div>
            {taxaPorc > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: '#555' }}>
                <span>Taxa cartão ({taxaPorc}%):</span><span>- {fmt(desconto)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginTop: '6px' }}>
              <span>TOTAL:</span><span>{fmt(total)}</span>
            </div>
            {taxaPorc > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#555', marginTop: '2px' }}>
                <span>Valor líquido recebido:</span><span>{fmt(liquido)}</span>
              </div>
            )}

            <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Pagamento:</span><span style={{ fontWeight: 'bold' }}>{comanda.formaPagamento}</span>
            </div>

            <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />

            {/* Rodapé */}
            <div style={{ textAlign: 'center', fontSize: '10px', lineHeight: 1.6 }}>
              <p>Obrigado pela preferência!</p>
              <p>Volte sempre 🙏</p>
              <p style={{ marginTop: '6px', color: '#888' }}>sistematiza.ai</p>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px' }}>
          <button onClick={handleWhatsApp}
            style={{ flex: 1, background: '#25D366', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            📱 WhatsApp
          </button>
          <button onClick={handlePrint}
            style={{ flex: 1, background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            🖨️ Imprimir
          </button>
        </div>
      </div>
    </div>
  )
}