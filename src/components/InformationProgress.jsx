import { motion, useReducedMotion } from 'framer-motion';
import { RECURSOS } from '../data/recursos';

const COPY_BY_SCOPE = {
  familias: { eyebrow: 'Tu recorrido', title: 'Aprende, explora y avanza' },
  invitado: { eyebrow: 'Tu recorrido comunitario', title: 'Aprende a reconocer señales, paso a paso' },
};

export function resourceIdsFor(scope) {
  return RECURSOS.filter((r) => r.p === scope).map((r) => r.id);
}

// Compatibilidad: se mantiene el nombre y comportamiento original para la parte de Familia.
export const INFO_PROGRESS_KEY = 'axonova:information-completed:v1';
export const INFO_RESOURCE_IDS = resourceIdsFor('familias');

function storageKeyFor(scope) {
  return scope === 'familias' ? INFO_PROGRESS_KEY : `axonova:information-completed:${scope}:v1`;
}

export function readCompletedInfo(scope = 'familias') {
  const ids = resourceIdsFor(scope);
  try {
    const raw = JSON.parse(localStorage.getItem(storageKeyFor(scope)) || '[]');
    return Array.isArray(raw) ? raw.filter((id) => ids.includes(id)) : [];
  } catch { return []; }
}

export function markInfoComplete(id, scope = 'familias') {
  const current = readCompletedInfo(scope);
  if (!current.includes(id)) {
    const next = [...current, id];
    try { localStorage.setItem(storageKeyFor(scope), JSON.stringify(next)); } catch {}
    window.dispatchEvent(new Event('axonova:info-progress'));
    return next;
  }
  return current;
}

export default function InformationProgress({ completed, scope = 'familias' }) {
  const reduceMotion = useReducedMotion();
  const resourceIds = resourceIdsFor(scope);
  const resolvedCompleted = completed ?? readCompletedInfo(scope);
  const copy = COPY_BY_SCOPE[scope] || COPY_BY_SCOPE.familias;
  const total = resourceIds.length;
  const done = resolvedCompleted.length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  return (
    <section className="info-progress" aria-label={`Progreso de información: ${progress}%`}>
      <div className="info-progress-top">
        <div>
          <span className="eyebrow info-eyebrow"><span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" /> {copy.eyebrow}</span>
          <strong>{copy.title}</strong>
        </div>
        <span className="info-progress-percent">{progress}%</span>
      </div>
      <div className="info-progress-track">
        <motion.div className="info-progress-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 80, damping: 18 }} />
      </div>
      <div className="info-progress-meta">
        <span>{done} de {total} experiencias completadas</span>
        <span>{progress === 100 ? 'Recorrido completado' : 'Sigue a tu ritmo'}</span>
      </div>
      <div className="info-milestones" aria-hidden="true">
        {resourceIds.map((id, i) => (
          <span key={id} className={`info-milestone ${resolvedCompleted.includes(id) ? 'done' : ''}`}>
            <span>{resolvedCompleted.includes(id) ? '✓' : i + 1}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
