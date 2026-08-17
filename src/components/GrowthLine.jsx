const DOMINIOS_ORDEN = ['Motor grueso', 'Motor fino', 'Cognitiva', 'Social', 'Lenguaje'];
const DOMINIO_COLOR = { 'Motor grueso': '#5A6FC4', 'Motor fino': '#8A63D2', 'Cognitiva': '#1F5C56', 'Social': '#6E9A55', 'Lenguaje': '#DD5B3B' };

function estadoDominio(h, dominio) {
  if ((h.regresion || []).includes(dominio)) return 'regresion';
  if ((h.dominios || []).includes(dominio)) return 'no_logrado';
  return 'ok';
}
function colorEstado(estado) { return estado === 'regresion' ? '#C08A2E' : estado === 'no_logrado' ? '#DD5B3B' : '#6E9A55'; }

export default function GrowthLine({ historial }) {
  if (!historial || historial.length === 0) {
    return <div className="bg-peri-soft rounded-xl p-3.5 text-sm text-[#3B4A9C]">Aún no hay registros previos.</div>;
  }
  const w = 680, padL = 112, padR = 16, n = historial.length;
  const step = n > 1 ? (w - padL - padR) / (n - 1) : 0;
  const rowH = 28, topPad = 14, h = topPad + rowH * DOMINIOS_ORDEN.length + 22;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMinYMid meet" className="w-full block">
        {DOMINIOS_ORDEN.map((dom, di) => {
          const y = topPad + rowH * di;
          const color = DOMINIO_COLOR[dom];
          let path = '';
          historial.forEach((hh, i) => { const x = padL + step * i; path += (i === 0 ? 'M' : ' L') + x + ' ' + y; });
          return (
            <g key={dom}>
              <text x="0" y={y + 4} className="font-mono text-[10px]" style={{ fill: color, fontWeight: 600 }}>{dom}</text>
              <path d={path} fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
              {historial.map((hh, i) => {
                const x = padL + step * i;
                const c = colorEstado(estadoDominio(hh, dom));
                return <circle key={i} cx={x} cy={y} r="5.5" fill={c} stroke="#fff" strokeWidth="1.5" />;
              })}
            </g>
          );
        })}
        {historial.map((hh, i) => {
          const x = padL + step * i;
          return <text key={i} x={x} y={h - 6} textAnchor="middle" className="font-mono text-[10px] fill-ink-soft">{hh.etiquetaEdad}</text>;
        })}
      </svg>
      <div className="flex gap-3.5 flex-wrap mt-0.5">
        <span className="text-[11px] text-ink-soft flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sage inline-block" />Hito logrado</span>
        <span className="text-[11px] text-ink-soft flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-coral inline-block" />No logrado</span>
        <span className="text-[11px] text-ink-soft flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber inline-block" />Regresión (lo perdió)</span>
      </div>
    </div>
  );
}
