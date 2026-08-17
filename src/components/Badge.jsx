const NIVEL = {
  alarma: { cls: 'badge-alarma', label: 'Con alarma' },
  seguimiento: { cls: 'badge-amber', label: 'Seguimiento' },
  sin_alarma: { cls: 'badge-sin', label: 'Sin alarma' },
};
export function BadgeNivel({ nivel }) {
  const cfg = NIVEL[nivel] || NIVEL.sin_alarma;
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}
export function Badge({ className = '', children }) {
  return <span className={`badge badge-pend ${className}`}>{children}</span>;
}
