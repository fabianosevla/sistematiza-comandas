export default function LogoIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Corpo principal do ticket */}
      <rect x="8" y="10" width="64" height="44" rx="5" fill="#fff" stroke="#D5DADD" strokeWidth="1.5"/>
      {/* Linha tracejada de corte */}
      <line x1="8" y1="45" x2="72" y2="45" stroke="#2ecc71" strokeWidth="1.5" strokeDasharray="4 3"/>
      {/* Perfuração esquerda */}
      <circle cx="8" cy="45" r="4" fill="#F4F4F4"/>
      {/* Perfuração direita */}
      <circle cx="72" cy="45" r="4" fill="#F4F4F4"/>
      {/* Linhas de texto no ticket */}
      <rect x="16" y="20" width="32" height="3" rx="1.5" fill="#0052CC"/>
      <rect x="16" y="28" width="24" height="2.5" rx="1.25" fill="#D5DADD"/>
      <rect x="16" y="34" width="28" height="2.5" rx="1.25" fill="#D5DADD"/>
      {/* Stub inferior */}
      <rect x="8" y="49" width="64" height="21" rx="5" fill="#2ecc71" opacity="0.15"/>
      <rect x="16" y="55" width="20" height="2.5" rx="1.25" fill="#2ecc71"/>
      <rect x="16" y="61" width="14" height="2" rx="1" fill="#2ecc71" opacity="0.6"/>
    </svg>
  )
}
