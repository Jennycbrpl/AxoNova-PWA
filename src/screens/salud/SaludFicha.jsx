import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import GrowthLine from '../../components/GrowthLine';
import { useAxonovaStore } from '../../store/useAxonovaStore';
import { ESPECIALIDADES, ESTADOS_CASO } from '../../data/doctores';

export default function SaludFicha() {
  const { origen, id } = useParams(); // origen: 'cita' | 'caso'
  const salud = useAxonovaStore((s) => s.salud);
  const getCitas = useAxonovaStore((s) => s.getCitas);
  const getCasos = useAxonovaStore((s) => s.getCasos);
  const cargarMenor = useAxonovaStore((s) => s.cargarMenor);
  const avanzarEstadoCaso = useAxonovaStore((s) => s.avanzarEstadoCaso);
  const agregarInforme = useAxonovaStore((s) => s.agregarInforme);

  const [cita, setCita] = useState(null);
  const [caso, setCaso] = useState(null);
  const [menor, setMenor] = useState(null);
  const [form, setForm] = useState({ especialidad: salud.especialidad, hallazgos: '', impresion: '', plan: '', proximoControl: '' });

  const refrescar = async () => {
    const citas = getCitas();
    const casos = getCasos();
    let dni;
    if (origen === 'cita') {
      const c = citas.find((x) => x.id === id);
      setCita(c); dni = c?.dniMenor;
      setCaso(casos.slice().reverse().find((k) => k.dniMenor === c?.dniMenor) || null);
    } else {
      const k = casos.find((x) => x.id === id);
      setCaso(k); dni = k?.dniMenor;
      setCita(null);
    }
    if (dni) setMenor(await cargarMenor(dni));
  };

  useEffect(() => { refrescar(); }, [origen, id]);

  if (!menor) return <p>Cargando ficha…</p>;
  const nombre = cita?.nombreMenor || caso?.nombreMenor || 'Menor';
  const motivo = cita?.motivo || (caso ? [...(caso.dominios || []), ...(caso.regresion || [])].join(', ') : '—');
  const establecimiento = cita?.establecimiento || caso?.establecimiento;

  const handleAvanzar = async (estado) => { await avanzarEstadoCaso(caso.id, estado); refrescar(); };
  const handleInforme = async () => {
    if (!form.hallazgos.trim()) { alert('Describe al menos los hallazgos o el motivo de la atención.'); return; }
    await agregarInforme(caso.id, { ...form, profesional: salud.usuario, fecha: new Date().toLocaleDateString('es-PE') });
    setForm({ especialidad: salud.especialidad, hallazgos: '', impresion: '', plan: '', proximoControl: '' });
    refrescar();
  };

  return (
    <div>
      <BackLink to="/salud/panel">Volver al panel</BackLink>
      <h2 className="text-xl">Ficha de {nombre}</h2>
      <p>{cita ? `Cita del ${cita.fecha} a las ${cita.hora}. ` : ''}Motivo: {motivo || '—'}. {establecimiento ? `Establecimiento de origen: ${establecimiento}.` : ''}</p>

      <div className="card mb-4">
        <h3 className="text-[15px]">Historial evolutivo (compartido entre especialidades)</h3>
        <GrowthLine historial={menor.historial} />
      </div>

      {caso ? (
        <div className="card mb-4">
          <h3 className="text-[15px]">Estado del caso — ruta de atención</h3>
          <div className="flex gap-1.5 flex-wrap my-3.5">
            {ESTADOS_CASO.map((e, i) => {
              const idxActual = ESTADOS_CASO.indexOf(caso.estadoCaso);
              const cls = e === caso.estadoCaso ? 'bg-teal text-white border-teal' : i < idxActual ? 'bg-teal-soft text-teal-deep border-transparent' : 'text-ink-soft border-line';
              return <div key={e} onClick={() => handleAvanzar(e)} className={`font-mono text-[11px] px-3 py-1.5 rounded-full border cursor-pointer ${cls}`}>{e}</div>;
            })}
          </div>
          {caso.estadoCaso === 'En seguimiento' && (
            <div className="bg-peri-soft rounded-xl p-3.5 text-sm text-[#3B4A9C]">Se coordina el seguimiento con <strong>{caso.establecimiento || 'el establecimiento de origen'}</strong> y los profesionales responsables, para que el menor continúe su control en la comunidad.</div>
          )}

          <h3 className="text-[15px] mt-5">Informes por especialidad (ficha completa)</h3>
          {(caso.informes || []).length === 0 ? <p>Aún no hay informes registrados.</p> : caso.informes.map((inf, i) => (
            <div key={i} className="border-t border-line py-3 first:border-t-0">
              <div className="font-mono text-[10.5px] uppercase text-teal">{inf.especialidad} · {inf.fecha}{inf.profesional ? ` · ${inf.profesional}` : ''}</div>
              {inf.hallazgos && <p className="mt-1.5 mb-0.5"><strong>Hallazgos / motivo:</strong> {inf.hallazgos}</p>}
              {inf.impresion && <p className="my-0.5"><strong>Impresión diagnóstica:</strong> {inf.impresion}</p>}
              {inf.plan && <p className="my-0.5"><strong>Plan / indicaciones:</strong> {inf.plan}</p>}
              {inf.proximoControl && <p className="my-0.5"><strong>Próximo control:</strong> {inf.proximoControl}</p>}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3.5 mt-3.5">
            <div className="field mb-0"><label>Especialidad</label>
              <select value={form.especialidad} onChange={(e) => setForm((f) => ({ ...f, especialidad: e.target.value }))}>
                {ESPECIALIDADES.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="field mb-0"><label>Próximo control (opcional)</label><input type="date" value={form.proximoControl} onChange={(e) => setForm((f) => ({ ...f, proximoControl: e.target.value }))} /></div>
          </div>
          <div className="field mt-4"><label>Hallazgos / motivo de la atención</label><textarea value={form.hallazgos} onChange={(e) => setForm((f) => ({ ...f, hallazgos: e.target.value }))} placeholder="Ej. Evaluación inicial: no logra atención conjunta ni señalar para pedir objetos." /></div>
          <div className="field"><label>Impresión diagnóstica (opcional)</label><input value={form.impresion} onChange={(e) => setForm((f) => ({ ...f, impresion: e.target.value }))} placeholder="Ej. Sospecha de TEA — pendiente confirmación" /></div>
          <div className="field"><label>Plan / indicaciones</label><textarea value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))} placeholder="Ej. Inicia terapia de lenguaje 2x/semana. Reevaluar en 3 meses." /></div>
          <button className="btn btn-ghost" onClick={handleInforme}>Agregar informe a la ficha</button>
        </div>
      ) : (
        <div className="bg-peri-soft rounded-xl p-3.5 text-sm text-[#3B4A9C] mb-4">Este menor aún no tiene un caso formal de alarma registrado.</div>
      )}

      <button className="btn btn-primary" onClick={() => alert(`Enlace de videollamada simulado: meet.axonova.pe/${cita?.id || menor.dniMenor}`)}>Unirse a la videollamada</button>
    </div>
  );
}
