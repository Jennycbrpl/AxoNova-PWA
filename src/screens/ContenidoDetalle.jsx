import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackLink from '../components/BackLink';
import OwlMascot from '../components/OwlMascot';
import InformationProgress, { resourceIdsFor, markInfoComplete, readCompletedInfo } from '../components/InformationProgress';
import { RECURSOS } from '../data/recursos';

export default function ContenidoDetalle() {
  const { tab, id } = useParams();
  const navigate = useNavigate();
  const r = RECURSOS.find((x) => x.id === id);
  const isFamilies = tab === 'familias';
  const isInvitado = tab === 'invitado';
  const isGamified = isFamilies || isInvitado;
  const scope = isInvitado ? 'invitado' : 'familias';
  const [checked, setChecked] = useState({});
  const [completed, setCompleted] = useState(() => readCompletedInfo(scope));
  const [travelKey, setTravelKey] = useState(0);

  useEffect(() => {
    const sync = () => setCompleted(readCompletedInfo(scope));
    window.addEventListener('axonova:info-progress', sync);
    return () => window.removeEventListener('axonova:info-progress', sync);
  }, [scope]);

  if (!r) return <p>No se encontró el recurso.</p>;

  const markComplete = () => {
    if (isGamified) {
      const nextCompleted = markInfoComplete(r.id, scope);
      setCompleted(nextCompleted);
      setTravelKey((k) => k + 1);
      if (nextCompleted.length === resourceIdsFor(scope).length) {
        window.setTimeout(() => navigate(`/contenido/${tab}`), 650);
      }
    }
  };

  let body;
  if (r.tipo === 'video') {
    body = <><div className="content-video-stage"><svg viewBox="0 0 24 24" width={46} height={46} fill="#fff"><path d="M8 5v14l11-7z" /></svg><span>Contenido audiovisual</span></div><p>{r.cuerpo}</p></>;
  } else if (r.tipo === 'ejercicio') {
    body = <div className="content-steps">{r.pasos.map((p,i) => <motion.div key={i} className="content-step" initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} transition={{delay:i*.06}}><div className="content-step-number">{i+1}</div><div>{p}</div></motion.div>)}</div>;
  } else if (r.tipo === 'interactivo') {
    body = <div><p>{r.resumen}</p><div className="content-checklist">{r.checklist.map((item,i) => {
      const on=!!checked[i];
      return <button type="button" key={i} className={`content-check-item ${on?'is-checked':''}`} onClick={() => setChecked((c)=>({...c,[i]:!c[i]}))} aria-pressed={on}>
        <span className="content-check-box">{on?'✓':''}</span><span>{item}</span>
      </button>;
    })}</div><div className="bg-peri-soft rounded-xl p-3.5 text-sm text-[#3B4A9C] mt-3.5">Esto es solo una guía personal para ordenar tus observaciones; no reemplaza una evaluación profesional. Si marcaste varias, conversa con el equipo de salud.</div></div>;
  } else body = r.cuerpo.split('\n\n').map((p,i)=><p key={i}>{p}</p>);

  return (
    <div className={isGamified?'information-page':''}>
      <BackLink to={`/contenido/${tab}`}>Volver al contenido</BackLink>
      {isGamified && <InformationProgress completed={completed} scope={scope} />}
      <div className="content-detail-head">
        <div><span className="font-mono text-[10px] uppercase text-teal mb-1 flex gap-2 items-center">{r.tag}<span className="text-peri">· {r.tipo}</span></span><h2 className="text-xl">{r.titulo}</h2></div>
        {isGamified && <OwlMascot size={78} mood={completed.includes(r.id)?'feliz':'atento'} travelKey={travelKey} />}
      </div>
      <motion.div className="card content-detail-card" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>{body}</motion.div>
      {isGamified && <div className="content-complete-bar">
        <div><strong>{completed.includes(r.id)?'Experiencia completada':'¿Terminaste esta experiencia?'}</strong><span>{completed.includes(r.id)?'Tu progreso ya está guardado en este dispositivo.':'Márcala como completada para avanzar en tu recorrido.'}</span></div>
        <button type="button" className="btn btn-primary" onClick={markComplete}>{completed.includes(r.id)?'✓ Completada':'Completar etapa'}</button>
      </div>}
    </div>
  );
}
