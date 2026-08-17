import { useNavigate } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import { BadgeNivel } from '../../components/Badge';
import OwlMascot from '../../components/OwlMascot';
import ImpactCounter from '../../components/ImpactCounter';
import { useAxonovaStore, accedeTeleconsulta } from '../../store/useAxonovaStore';

const CFG = {
  alarma: { titulo: 'Se detectaron señales de alarma', mood: 'preocupado' },
  seguimiento: { titulo: 'Un dominio necesita seguimiento cercano', mood: 'atento' },
  sin_alarma: { titulo: 'No se detectaron señales de alarma', mood: 'feliz' },
};

export default function Resultado() {
  const navigate = useNavigate();
  const r = useAxonovaStore((s) => s.resultado);
  const familia = useAxonovaStore((s) => s.familia);
  const setRegistroIntent = useAxonovaStore((s) => s.setRegistroIntent);

  if (!r) { navigate('/familia'); return null; }
  const cfg = CFG[r.nivel];

  const continuarDesdeResultado = (intent) => {
    setRegistroIntent(intent);
    const menor = familia.menor;
    if (menor && menor.registrado) {
      if (intent === 'teleconsulta') {
        if (accedeTeleconsulta(menor)) { navigate('/familia/teleconsulta'); }
        else {
          alert('Tu tipo de seguro o la falta de smartphone no permiten agendar teleconsulta directamente desde la plataforma. Te recomendamos acercarte a tu posta de salud más cercana. Te mostramos información validada mientras tanto.');
          navigate('/contenido/familias');
        }
      } else {
        navigate('/contenido/familias');
      }
    } else {
      navigate('/familia/registro');
    }
  };

  return (
    <div>
      <div className="flex items-start gap-4 mb-2">
        <OwlMascot size={64} mood={cfg.mood} />
        <div>
          <div className="eyebrow"><span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" /> Resultado · {r.etiquetaEdad}</div>
          <h2 className="text-xl">{cfg.titulo}</h2>
        </div>
      </div>

      <ImpactCounter />

      <div className="card">
        <div className="mb-3.5"><BadgeNivel nivel={r.nivel} /></div>

        {r.nivel === 'alarma' && (
          <>
            <p>
              {r.dominios.length ? <>Se identificaron hitos no logrados en 2 o más dominios: <strong>{r.dominios.join(', ')}</strong>. </> : ''}
              {r.regresion.length ? <>Además, parece haber un retroceso en: <strong>{r.regresion.join(', ')}</strong>. </> : ''}
            </p>
            <div className="bg-coral-soft rounded-xl p-3.5 text-sm text-coral-deep mb-3.5">
              <strong>Recomendación:</strong> acércate a tu posta de salud más cercana o agenda una teleconsulta lo antes posible.
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <button className="btn btn-coral" onClick={() => continuarDesdeResultado('teleconsulta')}>Agendar teleconsulta</button>
              <button className="btn btn-ghost" onClick={() => continuarDesdeResultado('contenido')}>Ver información y ejercicios</button>
            </div>
          </>
        )}

        {r.nivel === 'seguimiento' && (
          <>
            <p>El menor no logra aún un hito en <strong>{r.dominios.join(', ')}</strong>. Lo habitual es estimular esa área en casa y volver a evaluar en el siguiente control; si el hito sigue sin lograrse, pasará a alarma. Si prefieres no esperar, también puedes agendar una teleconsulta.</p>
            <div className="grid grid-cols-2 gap-3.5">
              <button className="btn btn-ghost" onClick={() => continuarDesdeResultado('contenido')}>Ver ejercicios de estimulación</button>
              <button className="btn btn-ghost" onClick={() => continuarDesdeResultado('teleconsulta')}>Agendar teleconsulta de todas formas</button>
            </div>
          </>
        )}

        {r.nivel === 'sin_alarma' && (
          <>
            <p>El menor logra los hitos esperados para {r.etiquetaEdad}. No se registra alarma, por lo que no es necesaria una teleconsulta. Puedes seguir revisando contenido validado para acompañar el siguiente periodo de desarrollo.</p>
            <button className="btn btn-primary" onClick={() => navigate('/contenido/familias')}>Ver contenido validado</button>
          </>
        )}
      </div>

      <div className="reward-banner mt-3.5">
        <span className="reward-star">★</span>
        <div><strong>¡Control completado!</strong><span>Tu familia acaba de sumar un nuevo paso al historial de desarrollo.</span></div>
      </div>

      <div className="mt-3.5"><BackLink to="/familia/menu">Volver al historial evolutivo</BackLink></div>
    </div>
  );
}
