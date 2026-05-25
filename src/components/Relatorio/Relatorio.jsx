import { fmt } from '../../data/storage'

export default function Relatorio({ comandas, onVoltar }) {
    const hoje = new Date().toLocaleDateString('pt-BR')
    const fechadasHoje = comandas.filter(c => c.status === 'fechada' && c.data === hoje)
    const abertas = comandas.filter(c => c.status === 'aberta')

    const totalFaturado = fechadasHoje.reduce((acc, c) =>
        acc + c.itens.reduce((s, i) => s + i.quantidade * i.preco, 0), 0)

    const totalItens = fechadasHoje.reduce((acc, c) =>
        acc + c.itens.reduce((s, i) => s + i.quantidade, 0), 0)

    // Itens mais vendidos
    const itensMapa = {}
    fechadasHoje.forEach(c => {
        c.itens.forEach(i => {
            const key = (i.nome || i.descricao || '').toLowerCase()
            if (!itensMapa[key]) itensMapa[key] = { descricao: i.descricao, quantidade: 0, total: 0 }
            itensMapa[key].quantidade += i.quantidade
            itensMapa[key].total += i.quantidade * i.preco
        })
    })
    const maisVendidos = Object.values(itensMapa).sort((a, b) => b.quantidade - a.quantidade).slice(0, 5)

    // Formas de pagamento
    const pgMapa = {}
    fechadasHoje.forEach(c => {
        if (!pgMapa[c.formaPagamento]) pgMapa[c.formaPagamento] = { count: 0, total: 0 }
        pgMapa[c.formaPagamento].count++
        pgMapa[c.formaPagamento].total += c.itens.reduce((s, i) => s + i.quantidade * i.preco, 0)
    })

    return (
        <div style={{ padding: '32px' }}>

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar</span>
                </p>
                <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Relatório do dia</h1>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* Cards principais */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {[
                    { label: 'Faturado hoje', valor: fmt(totalFaturado), bg: 'var(--bg-layer-01)', cor: 'var(--text-primary)', border: 'var(--border-subtle)' },
                    { label: 'Comandas fechadas', valor: fechadasHoje.length, bg: 'var(--mesa-livre-bg)', cor: 'var(--mesa-livre)', border: 'var(--mesa-livre-bg)' },
                    { label: 'Comandas abertas', valor: abertas.length, bg: 'var(--mesa-ocupada-bg)', cor: 'var(--mesa-ocupada)', border: 'var(--mesa-ocupada-bg)' },
                    { label: 'Itens servidos', valor: totalItens, bg: 'var(--brand-light)', cor: 'var(--brand)', border: 'var(--brand-light)' },
                ].map(c => (
                    <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                        <p style={{ fontSize: '22px', fontWeight: '700', color: c.cor, letterSpacing: '-0.5px', lineHeight: 1 }}>{c.valor}</p>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: c.cor, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.8 }}>{c.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

                {/* Itens mais vendidos */}
                <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Itens mais vendidos</p>
                    </div>
                    {maisVendidos.length === 0 ? (
                        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p style={{ fontSize: '13px' }}>Nenhum item vendido hoje.</p>
                        </div>
                    ) : (
                        maisVendidos.map((item, idx) => (
                            <div key={idx} style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: idx < maisVendidos.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--brand)', flexShrink: 0 }}>
                                    {idx + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.descricao}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>{item.quantidade} unidade{item.quantidade !== 1 ? 's' : ''}</p>
                                </div>
                                <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', flexShrink: 0 }}>{fmt(item.total)}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Formas de pagamento */}
                <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Formas de pagamento</p>
                    </div>
                    {Object.keys(pgMapa).length === 0 ? (
                        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p style={{ fontSize: '13px' }}>Nenhum pagamento registrado hoje.</p>
                        </div>
                    ) : (
                        Object.entries(pgMapa).map(([forma, dados], idx, arr) => (
                            <div key={forma} style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: idx < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{forma}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>{dados.count} comanda{dados.count !== 1 ? 's' : ''}</p>
                                </div>
                                <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{fmt(dados.total)}</p>
                            </div>
                        ))
                    )}

                    {/* Total */}
                    {Object.keys(pgMapa).length > 0 && (
                        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Total faturado</span>
                            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{fmt(totalFaturado)}</span>
                        </div>
                    )}
                </div>

            </div>

            {/* Histórico de comandas do dia */}
            {fechadasHoje.length > 0 && (
                <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Comandas fechadas hoje</p>
                    </div>
                    {fechadasHoje.map((c, idx) => {
                        const total = c.itens.reduce((s, i) => s + i.quantidade * i.preco, 0)
                        return (
                            <div key={c.id} style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: idx < fechadasHoje.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--mesa-livre-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--mesa-livre)', flexShrink: 0 }}>
                                    {c.mesaNumero}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{c.clienteNome}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>Mesa {c.mesaNumero} · {c.itens.length} item{c.itens.length !== 1 ? 's' : ''} · {c.formaPagamento}</p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{fmt(total)}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>Fechada às {c.fechamento}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

        </div>
    )
}