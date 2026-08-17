import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DATOS_INVITADO } from '../data/datosInvitado';

export default function DatoRapido({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const total = DATOS_INVITADO.length;
  const dato = DATOS_INVITADO[index];
  const isLast = index === total - 1;

  const responder = (valor) => {
    if (selected !== null) return;
    setSelected(valor);
    if (valor === dato.respuesta) setScore((s) => s + 1);
  };

  const siguiente = () => {
    if (isLast) {
      onFinish?.(score + (selected === dato.respuesta ? 0 : 0));
      setIndex(0);
      setSelected(null);
      setScore(0);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const acertado = selected !== null && selected === dato.respuesta;

  return (
    <div className="dato-rapido">
      <div className="dato-rapido-top">
        <span className="eyebrow" style={{ marginBottom: 0 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" /> ¿Verdadero o falso?
        </span>
        <span className="dato-rapido-counter">{index + 1} / {total}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
          <p className="dato-rapido-text">{dato.afirmacion}</p>

          <div className="dato-rapido-actions">
            <button type="button" className={`dato-opt ${selected !== null && dato.respuesta === true ? 'dato-correct' : ''} ${selected === true && dato.respuesta !== true ? 'dato-incorrect' : ''}`}
              onClick={() => responder(true)} disabled={selected !== null} aria-pressed={selected === true}>
              Verdadero
            </button>
            <button type="button" className={`dato-opt ${selected !== null && dato.respuesta === false ? 'dato-correct' : ''} ${selected === false && dato.respuesta !== false ? 'dato-incorrect' : ''}`}
              onClick={() => responder(false)} disabled={selected !== null} aria-pressed={selected === false}>
              Falso
            </button>
          </div>

          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`dato-feedback ${acertado ? '' : 'is-wrong'}`}>
              <strong>{acertado ? '¡Exacto! ' : 'No exactamente. '}</strong>{dato.explicacion}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-3.5">
        <div className="dato-progress-dots" aria-hidden="true">
          {DATOS_INVITADO.map((_, i) => (
            <span key={i} className={`dato-progress-dot ${i === index ? 'is-active' : ''} ${i < index ? 'is-done' : ''}`} />
          ))}
        </div>
        {selected !== null && (
          <button type="button" className="btn btn-primary dato-rapido-next" onClick={siguiente}>
            {isLast ? 'Volver a empezar' : 'Siguiente dato →'}
          </button>
        )}
      </div>
    </div>
  );
}
