import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackLink from '../components/BackLink';
import OwlMascot from '../components/OwlMascot';
import DatoRapido from '../components/DatoRapido';
import ImpactCounter, { registerImpact } from '../components/ImpactCounter';
import InformationProgress, { resourceIdsFor, readCompletedInfo } from '../components/InformationProgress';
import { RECURSOS } from '../data/recursos';

const TEXTOS = {
  invitado: { titulo: 'Información para docentes, cuidadores y comunidad', sub: 'Recursos pensados para quienes acompañan a los niños fuera del hogar: qué observar y cómo orientar a la familia. Toca un título para ver el contenido completo.' },
  familias: { titulo: 'Información para acompañar el desarrollo', sub: 'Toca un título para ver el artículo, video o ejercicio completo.' },
  salud: { titulo: 'Biblioteca clínica', sub: 'Guías y protocolos para el equipo multidisciplinario.' },
};

const FINISH_COPY = {
  familias: {
    heading: 'Ya eres parte de este cambio.',
    body: 'Terminaste la experiencia de información. Gracias por dedicar este momento a conocer y acompañar el desarrollo.',
    ctaLabel: 'Continuar con Familia →',
    ctaTo: '/familia',
  },
  invitado: {
    heading: 'Ahora sabes qué observar y a quién avisar.',
    body: 'Completaste el recorrido para la comunidad educativa. Cada docente o cuidador que sabe reconocer una señal a tiempo acorta el camino hacia una detección oportuna.',
    ctaLabel: 'Volver al inicio →',
    ctaTo: '/',
  },
};

export default function Contenido() {
  const { tab='familias' } = useParams();
  const recursos = RECURSOS.filter((r) => r.p === tab);
  const textos = TEXTOS[tab] || TEXTOS.familias;
  const volverA = tab === 'salud' ? '/salud/panel' : '/';
  const isFamilies = tab === 'familias';
  const isInvitado = tab === 'invitado';
  const isGamified = isFamilies || isInvitado;
  const scope = isInvitado ? 'invitado' : 'familias';
  const [completed, setCompleted] = useState(() => isGamified ? readCompletedInfo(scope) : []);
  const [celebrating, setCelebrating] = useState(false);
  const [travelKey, setTravelKey] = useState(0);
  const [quizAciertos, setQuizAciertos] = useState(null);

  useEffect(() => {
    if (!isGamified) return;
    const sync = () => setCompleted(readCompletedInfo(scope));
    window.addEventListener('axonova:info-progress', sync);
    return () => window.removeEventListener('axonova:info-progress', sync);
  }, [isGamified, scope]);

  useEffect(() => {
    const total = resourceIdsFor(scope).length;
    if (!isGamified || completed.length !== total) return;
    const seenKey = `axonova:info-final-celebration:${scope}:v1`;
    let alreadySeen = false;
    try { alreadySeen = localStorage.getItem(seenKey) === '1'; } catch {}
    if (!alreadySeen) {
      registerImpact(isInvitado ? 'information-complete-invitado' : 'information-complete');
      try { localStorage.setItem(seenKey, '1'); } catch {}
    }
    setCelebrating(true);
  }, [completed, isGamified, scope, isInvitado]);

  const finish = FINISH_COPY[scope] || FINISH_COPY.familias;

  return (
    <div className={isGamified ? 'information-page' : ''}>
      <BackLink to={volverA}>Volver</BackLink>

      {isFamilies && (
        <>
          <InformationProgress completed={completed} />
          <div className="info-hero">
            <div className="info-hero-copy">
              <div className="eyebrow"><span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" /> Acompañamiento familiar</div>
              <h2 className="text-xl">{textos.titulo}</h2>
              <p>{textos.sub}</p>
            </div>
            <img src="/BuhoAxonovaLecture.png" alt="Buho leyendo" className="w-[84px] lg:w-[100px] h-auto object-contain shrink-0 mix-blend-multiply" />
          </div>
        </>
      )}

      {isInvitado && (
        <>
          <InformationProgress completed={completed} scope="invitado" />
          <div className="invitado-hero">
            <div className="invitado-hero-top">
              <div className="invitado-hero-copy">
                <div className="eyebrow"><span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" /> Comunidad educativa</div>
                <h2 className="text-xl">{textos.titulo}</h2>
                <p>{textos.sub}</p>
              </div>
              <OwlMascot size={86} mood={celebrating ? 'celebrando' : 'atento'} travelKey={travelKey} />
            </div>
            <DatoRapido onFinish={setQuizAciertos} />
          </div>
        </>
      )}

      {tab === 'salud' && (
        <>
          <div className="eyebrow"><span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" /> Contenido validado científicamente</div>
          <h2 className="text-xl">{textos.titulo}</h2>
          <p>{textos.sub}</p>
        </>
      )}

      <div className={`info-resource-list ${isGamified ? 'info-resource-list-enhanced' : 'card mt-2'}`}>
        {recursos.map((r, index) => (
          <motion.div key={r.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:index*.05 }}>
            <Link to={`/contenido/${tab}/${r.id}`} onClick={isGamified ? () => setTravelKey((k) => k + 1) : undefined} className="info-resource">
              <div className="info-resource-index">{isGamified ? String(index+1).padStart(2,'0') : r.tag.slice(0,1)}</div>
              <div className="info-resource-body">
                <span className="font-mono text-[10px] uppercase text-teal flex gap-2 items-center">{r.tag}<span className="text-peri">· {r.tipo}</span></span>
                <div className="font-semibold text-[14.5px]">{r.titulo}</div>
                <p className="mt-1">{r.resumen}</p>
                {isGamified && completed.includes(r.id) && <span className="info-complete-pill">✓ Completado</span>}
              </div>
              <span className="info-resource-arrow" aria-hidden="true">→</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isGamified && celebrating && (
          <motion.section className="info-finish" initial={{ opacity:0,y:24,scale:.98 }} animate={{ opacity:1,y:0,scale:1 }}
            transition={{ type:'spring', stiffness:100, damping:18 }}>
            <div className="info-finish-owl"><OwlMascot size={120} mood="celebrando" /></div>
            <div className="info-finish-copy">
              <span className="eyebrow"><span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" /> Recorrido completado</span>
              <h3>{finish.heading}</h3>
              <p>{finish.body}</p>
            </div>
            <ImpactCounter celebration audience={scope} />
            <Link className="btn btn-primary info-finish-action" to={finish.ctaTo}>{finish.ctaLabel}</Link>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
