import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import { Badge } from '../../components/Badge';
import { useAxonovaStore, ETAPAS, etapaLabel } from '../../store/useAxonovaStore';
import { CUESTIONARIOS, NOTA_JURADO_HABILIDADES } from '../../data/cuestionarios';
import { RECURSOS } from '../../data/recursos';

const TABS = [['agenda', 'Agenda'], ['casos', 'Casos y trazabilidad'], ['checklist', 'Checklist por edad'], ['biblioteca', 'Biblioteca']];

export default function SaludPanel() {
  const navigate = useNavigate();
  const salud = useAxonovaStore((s) => s.salud);
  const getCitas = useAxonovaStore((s) => s.getCitas);
  const getCasos = useAxonovaStore((s) => s.getCasos);
  const [tab, setTab] = useState('agenda');
  const [citas, setCitas] = useState([]);
  const [casos, setCasos] = useState([]);

  useEffect(() => {
    if (!salud.logueado) { navigate('/salud/login'); return; }
    setCitas(getCitas());
    setCasos(getCasos());
  }, [salud.logueado]);

  if (!salud.logueado) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-12 mt-4 items-start">
      {/* Sidebar */}
      <div className="md:sticky md:top-8 flex flex-col justify-between bg-gradient-to-br from-teal-soft/90 to-white/90 backdrop-blur-2xl border border-white/70 shadow-[0_12px_30px_rgba(0,0,0,0.05)] rounded-[24px] p-6 h-auto md:h-[calc(100vh-140px)] md:min-h-[500px] relative overflow-hidden">
        <div className="flex flex-col gap-8 relative z-10">
          {/* Perfil */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-4">
              <div className="w-[46px] h-[46px] bg-gradient-to-br from-teal-soft to-teal/20 rounded-full flex items-center justify-center text-teal-deep font-bold text-lg border border-white shadow-sm shrink-0">
                {salud.usuario.charAt(0)}
              </div>
              <div>
                <h2 className="text-[16px] font-bold leading-tight text-ink">{salud.usuario}</h2>
                <div className="text-[11px] text-teal font-mono uppercase tracking-widest mt-0.5">{salud.especialidad}</div>
              </div>
            </div>
            
            {/* Logout Mobile */}
            <Link to="/" className="md:hidden flex items-center gap-2 text-[13px] font-medium text-coral hover:text-coral-deep transition-colors px-2 py-2 rounded-xl hover:bg-coral-soft/50 shrink-0">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
              Cerrar sesión
            </Link>
          </div>
          
          {/* Navegación */}
          <nav className="flex flex-row overflow-x-auto md:flex-col gap-1.5 pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-2 md:mx-0">
            <div className="text-[10px] font-mono text-ink-soft uppercase tracking-widest mb-2 font-semibold hidden md:block px-4">Panel</div>
            {TABS.map(([id, label]) => (
              <div 
                key={id} 
                onClick={() => setTab(id)} 
                className={`whitespace-nowrap text-[14px] font-medium px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                  tab === id 
                  ? 'bg-teal text-white shadow-sm border border-teal/10' 
                  : 'text-ink-soft hover:bg-white/80 hover:text-ink'
                }`}
              >
                {label}
              </div>
            ))}
          </nav>
        </div>

        {/* Salir Desktop */}
        <div className="hidden md:block mt-6 md:mt-0 pt-5 border-t border-line/40 relative z-10">
          <Link to="/" className="flex items-center gap-3 text-[14px] font-medium text-coral hover:text-coral-deep transition-colors px-4 py-2.5 rounded-xl hover:bg-coral-soft/50 -mx-4 md:mx-0">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            Cerrar sesión
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[500px]">
        {tab === 'agenda' && (
          <div>
            <div className="text-[11px] font-mono text-ink-soft uppercase tracking-widest mb-4 font-semibold">Citas Agendadas {citas.length > 0 && <span className="ml-2 bg-line px-2 py-0.5 rounded-full text-[10px]">{citas.length}</span>}</div>
            {citas.length === 0 ? <p className="text-ink-soft">Aún no hay teleconsultas agendadas por familias.</p> : citas.slice().reverse().map((c) => (
              <Link key={c.id} to={`/salud/ficha/cita/${c.id}`} className="block bg-white/80 backdrop-blur-xl border border-white/60 p-5 rounded-[20px] shadow-sm mb-4 hover:shadow-md hover:-translate-y-[1px] transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="font-semibold text-[16px] text-ink">{c.nombreMenor}</div>
                  <Badge>{c.estado}</Badge>
                </div>
                <div className="text-[13px] text-ink-soft flex items-center gap-2 mb-2">
                  <span className="font-mono bg-teal-soft/50 text-teal-deep px-2 py-0.5 rounded-md text-[11px]">{c.fecha}</span>
                  <span className="font-mono bg-amber-soft/50 text-[#B36B00] px-2 py-0.5 rounded-md text-[11px]">{c.hora}</span>
                </div>
                <div className="text-[13px] text-ink-soft border-t border-line/50 pt-3 mt-3">
                  <span className="font-medium">Motivo:</span> {c.motivo || '—'} {c.doctorNombre ? ` · Atendido por ${c.doctorNombre}` : ''}
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === 'casos' && (
          <div>
            <div className="text-[11px] font-mono text-ink-soft uppercase tracking-widest mb-4 font-semibold">Casos en seguimiento {casos.length > 0 && <span className="ml-2 bg-line px-2 py-0.5 rounded-full text-[10px]">{casos.length}</span>}</div>
            {casos.length === 0 ? <p className="text-ink-soft">Aún no hay casos registrados.</p> : casos.slice().reverse().map((k) => (
              <Link key={k.id} to={`/salud/ficha/caso/${k.id}`} className="block bg-white/80 backdrop-blur-xl border border-white/60 p-5 rounded-[20px] shadow-sm mb-4 hover:shadow-md hover:-translate-y-[1px] transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="font-semibold text-[16px] text-ink">{k.nombreMenor}</div>
                  <Badge>{k.estadoCaso}</Badge>
                </div>
                <div className="flex gap-2 mb-3">
                   <span className="bg-sage-soft/50 text-[#248A3D] font-mono px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wide">{k.etapa}</span>
                </div>
                <div className="text-[13px] text-ink-soft border-t border-line/50 pt-3">
                  <span className="font-medium text-ink">Dominios evaluados:</span> {(k.dominios || []).join(', ') || '—'}
                  {k.regresion?.length ? <div className="mt-1 text-coral-deep"><span className="font-medium">Alarma de retroceso:</span> {k.regresion.join(', ')}</div> : ''}
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === 'checklist' && <SaludChecklist />}

        {tab === 'biblioteca' && (
          <div>
            <div className="text-[11px] font-mono text-ink-soft uppercase tracking-widest mb-4 font-semibold">Recursos para el personal</div>
            <div className="grid gap-4">
              {RECURSOS.filter((r) => r.p === 'salud').map((r) => (
                <Link key={r.id} to={`/contenido/salud/${r.id}`} className="block bg-white/80 backdrop-blur-xl border border-white/60 p-5 rounded-[20px] shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all cursor-pointer">
                  <span className="font-mono text-[10px] uppercase text-teal mb-2 flex gap-2 items-center bg-teal-soft/50 inline-flex px-2 py-1 rounded-md">{r.tag}<span className="text-peri opacity-70">· {r.tipo}</span></span>
                  <div className="font-semibold text-[15px] text-ink mb-1">{r.titulo}</div>
                  <p className="text-[13px] text-ink-soft">{r.resumen}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SaludChecklist() {
  const [etapa, setEtapa] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const preguntas = CUESTIONARIOS[etapa];
  const respondidas = preguntas.filter((p, i) => respuestas[i] !== undefined).length;
  const noCount = preguntas.filter((p, i) => respuestas[i] === 'no').length;
  let recomendacion = null;
  if (respondidas === preguntas.length) {
    recomendacion = noCount === 0 ? 'Observar y continuar vigilancia habitual.' : noCount === 1 ? 'Estimular el dominio afectado y reevaluar en 3 meses.' : 'Derivar / ofrecer teleconsulta: 2 o más dominios afectados.';
  }
  const cambiarEtapa = (v) => { setEtapa(parseInt(v, 10)); setRespuestas({}); };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-[24px] shadow-sm">
      <div className="bg-peri-soft/50 rounded-xl p-4 text-[13.5px] text-[#4341C4] mb-6 border border-[#4341C4]/10">
        <strong className="block mb-1">¿Para qué sirve este checklist?</strong> Es una herramienta de tamizaje rápido para revisar señales de alarma durante la consulta presencial. Las respuestas no se guardan permanentemente.
      </div>
      
      <div className="field mb-6 max-w-[280px]">
        <label>Selecciona la etapa a revisar</label>
        <select value={etapa} onChange={(e) => cambiarEtapa(e.target.value)} className="font-medium bg-white shadow-sm">
          {ETAPAS.map((e) => <option key={e} value={e}>{etapaLabel(e)}</option>)}
        </select>
      </div>
      
      {etapa >= 48 && <div className="field-hint -mt-4 mb-6 bg-amber-soft/50 p-3 rounded-xl border border-amber/20 text-[#B36B00]">{NOTA_JURADO_HABILIDADES}</div>}
      
      <div className="flex flex-col gap-4">
        {preguntas.map((p, i) => (
          <div key={i} className="bg-white/50 border border-line/50 p-4 rounded-2xl">
            <div className="font-mono text-[10.5px] uppercase tracking-[.06em] text-peri mb-1.5 font-semibold">{p.d}</div>
            <div className="text-[14.5px] mb-4 text-ink font-medium">{p.q}</div>
            <div className="flex gap-3">
              <div className={`q-opt ${respuestas[i] === 'si' ? 'selected-yes shadow-sm' : 'bg-white hover:bg-white/80'}`} onClick={() => setRespuestas((r) => ({ ...r, [i]: 'si' }))}>Sí</div>
              <div className={`q-opt ${respuestas[i] === 'no' ? 'selected-no shadow-sm' : 'bg-white hover:bg-white/80'}`} onClick={() => setRespuestas((r) => ({ ...r, [i]: 'no' }))}>No</div>
            </div>
          </div>
        ))}
      </div>
      
      {recomendacion && (
        <div className="bg-sage-soft/60 rounded-xl p-4 text-[14px] text-[#248A3D] mt-6 border border-sage/20 shadow-sm flex items-start gap-3">
          <div className="font-bold">Recomendación:</div>
          <div>{recomendacion}</div>
        </div>
      )}
    </div>
  );
}
