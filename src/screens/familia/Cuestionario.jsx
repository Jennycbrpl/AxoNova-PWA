import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import OwlMascot from '../../components/OwlMascot';
import { useAxonovaStore } from '../../store/useAxonovaStore';

const REWARDS = [
  { points: 20, title: 'Primer paso', copy: '¡Ya empezaste a cuidar el desarrollo con información!' },
  { points: 50, title: 'Racha de cuidado', copy: 'Vas excelente. Una pregunta más y desbloqueas otro logro.' },
  { points: 90, title: 'Familia activa', copy: '¡Tu constancia suma! Sigue hasta completar el control.' },
];

function getMessage(progress, answer) {
  if (progress === 0) return '¡Hola! Yo te acompaño. Vamos una pregunta a la vez 💚';
  if (answer === 'no') return 'Gracias por contármelo. No hay respuestas buenas o malas: lo importante es observar.';
  if (progress >= 90) return '¡Último tramo! Ya casi terminamos este control.';
  if (progress >= 50) return '¡Muy bien! Cada respuesta nos ayuda a orientar mejor el siguiente paso.';
  return '¡Buen comienzo! Sigue así, estás construyendo el historial de desarrollo.';
}

export default function Cuestionario() {
  const navigate = useNavigate();
  const c = useAxonovaStore((s) => s.cuestionario);
  const responderPregunta = useAxonovaStore((s) => s.responderPregunta);
  const responderReverif = useAxonovaStore((s) => s.responderReverif);
  const calcularResultado = useAxonovaStore((s) => s.calcularResultado);
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [travelKey, setTravelKey] = useState(0);
  const [travelDirection, setTravelDirection] = useState(1);

  const steps = useMemo(() => [
    ...c.preguntasReverif.map((p, i) => ({ ...p, kind: 'reverif', index: i })),
    ...c.preguntasNuevas.map((p, i) => ({ ...p, kind: 'nueva', index: i })),
  ], [c.preguntasNuevas, c.preguntasReverif]);

  if (!c.etapa && c.etapa !== 0) { navigate('/familia'); return null; }
  if (!steps.length) return null;

  const current = steps[step];
  const currentValue = current.kind === 'reverif' ? c.respuestasReverif[current.index] : c.respuestas[current.index];
  const answeredCount = steps.filter((item) =>
    item.kind === 'reverif'
      ? c.respuestasReverif[item.index] !== undefined
      : c.respuestas[item.index] !== undefined
  ).length;
  const progress = Math.round((answeredCount / steps.length) * 100);
  const algunNo = Object.values(c.respuestas).includes('no') || Object.values(c.respuestasReverif).includes('no');

  const choose = (value) => {
    if (current.kind === 'reverif') responderReverif(current.index, value);
    else responderPregunta(current.index, value);
    if (!currentValue) setPoints((p) => p + 10);
    setAnswer(value);
  };

  const next = async () => {
    if (!currentValue) return;
    if (step < steps.length - 1) {
      setTravelDirection(1);
      setTravelKey((k) => k + 1);
      setStep((s) => s + 1);
      setAnswer(null);
      return;
    }
    await calcularResultado();
    navigate('/familia/resultado');
  };

  const reward = REWARDS.slice().reverse().find((r) => points >= r.points);
  const message = getMessage(progress, answer || currentValue);

  return (
    <div>
      <BackLink to="/familia/menu">Volver</BackLink>

      <div className="mb-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="font-mono text-[10.5px] uppercase tracking-[.08em] text-teal">Control de {c.etiquetaEdad}</div>
          <div className="font-mono text-xs font-bold text-teal">{step + 1}/{steps.length}</div>
        </div>
        <div className="progress-track" aria-label={`Progreso ${progress}%`}>
          <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 100, damping: 18 }} />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-ink-soft">
          <span>{progress}% completado</span>
          <span>+{points} puntos</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <OwlMascot size={76} mood={reward ? 'celebrando' : algunNo ? 'atento' : 'neutral'} travelKey={travelKey} travelDirection={travelDirection} />
        <motion.div key={message} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="owl-message">
          {message}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${current.kind}-${current.index}`} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }} transition={{ duration: 0.2 }}>
          <div className="card gamified-question">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className={`badge ${current.kind === 'reverif' ? 'badge-amber' : 'badge-pend'}`}>
                {current.kind === 'reverif' ? 'Reverificación' : 'Hito nuevo'}
              </span>
              <span className="text-xs text-ink-soft">{current.d}</span>
            </div>
            <h3 className="text-lg mb-5">{current.kind === 'reverif' ? <>¿Sigue logrando esto? {current.q}</> : current.q}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className={`q-opt ${currentValue === 'si' ? 'selected-yes' : ''}`} onClick={() => choose('si')}>
                <span className="text-xl block mb-1">✓</span> Sí, lo logra
              </button>
              <button type="button" className={`q-opt ${currentValue === 'no' ? 'selected-no' : ''}`} onClick={() => choose('no')}>
                <span className="text-xl block mb-1">○</span> Aún no
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {reward && (
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="reward-banner mt-3">
          <span className="reward-star">★</span>
          <div><strong>{reward.title}</strong><span>{reward.copy}</span></div>
        </motion.div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <button className="btn btn-ghost" disabled={step === 0} onClick={() => { setTravelDirection(-1); setTravelKey((k) => k + 1); setStep((s) => s - 1); setAnswer(null); }}>Atrás</button>
        <button className="btn btn-primary" disabled={!currentValue} onClick={next}>
          {step === steps.length - 1 ? 'Completar y ver resultado' : 'Siguiente →'}
        </button>
      </div>
    </div>
  );
}
