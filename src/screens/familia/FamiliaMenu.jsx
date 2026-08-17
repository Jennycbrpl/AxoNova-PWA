import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import { BadgeNivel } from '../../components/Badge';
import GrowthLine from '../../components/GrowthLine';
import OwlMascot from '../../components/OwlMascot';
import { useAxonovaStore, etapasPendientes, etapaLabel } from '../../store/useAxonovaStore';

export default function FamiliaMenu() {
  const navigate = useNavigate();
  const familia = useAxonovaStore((s) => s.familia);
  const cargarMenor = useAxonovaStore((s) => s.cargarMenor);
  const iniciarCuestionario = useAxonovaStore((s) => s.iniciarCuestionario);
  const [menor, setMenor] = useState(familia.menor);

  useEffect(() => {
    if (!familia.dniMenor) { navigate('/familia'); return; }
    cargarMenor(familia.dniMenor).then(setMenor);
  }, [familia.dniMenor]);

  if (!menor) return <p>Cargando historial evolutivo…</p>;
  const pendientes = etapasPendientes(menor);

  const handlePendiente = () => {
    iniciarCuestionario(pendientes[0]);
    navigate('/familia/cuestionario');
  };

  return (
    <div>
      <BackLink to="/">Salir</BackLink>
      <div className="flex items-start gap-4 mb-2">
        <img src="/AxoNovaGráfica.png" alt="Axonova Gráfica" className="w-[72px] h-auto object-contain shrink-0 mix-blend-multiply" />
        <div>
          <h2 className="text-xl">Historial evolutivo</h2>
          <p>Cada registro refleja el desarrollo real del menor, incluso si una habilidad ya adquirida se pierde.</p>
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="text-[15px]">Línea de tiempo</h3>
        <GrowthLine historial={menor.historial} />
        {menor.historial.slice().reverse().map((h, i) => (
          <div key={i} className="flex items-center justify-between gap-3.5 py-3.5 border-t border-line first:border-t-0">
            <div>
              <div className="font-semibold text-[14.5px]">{h.etiquetaEdad} · {h.fecha}</div>
              <div className="text-xs text-ink-soft mt-0.5">
                {h.dominios && h.dominios.length ? `Dominios a reforzar: ${h.dominios.join(', ')}` : 'Todos los hitos logrados'}
                {h.regresion && h.regresion.length ? ` · Retroceso en: ${h.regresion.join(', ')}` : ''}
              </div>
            </div>
            <BadgeNivel nivel={h.resultado} />
          </div>
        ))}
      </div>

      {pendientes.length > 0 ? (
        <>
          <div className="bg-peri-soft rounded-xl p-3.5 text-sm text-[#3B4A9C] mb-3.5">
            Tienes un control pendiente: <strong>{etapaLabel(pendientes[0])}</strong>.
          </div>
          <button className="btn btn-primary" onClick={handlePendiente}>Completar control pendiente</button>
        </>
      ) : (
        <div className="bg-peri-soft rounded-xl p-3.5 text-sm text-[#3B4A9C] mb-3.5">
          No hay controles pendientes por ahora. {menor.registrado ? 'Te avisaremos a tu correo o celular cuando corresponda el siguiente.' : 'Vuelve cuando el menor cumpla la siguiente etapa.'}
        </div>
      )}
      <button className={`btn btn-ghost ${pendientes.length > 0 ? 'ml-2' : ''}`} onClick={() => navigate('/contenido/familias')}>Ver contenido validado</button>
    </div>
  );
}
