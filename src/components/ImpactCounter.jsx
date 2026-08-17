import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const STORAGE_KEY = 'axonova:impact-registrations';
const DEMO_BASE = Number(import.meta.env.VITE_AXONOVA_DEMO_BASE || 12847);

function getLocalRegistrations() {
  try { return Number(localStorage.getItem(STORAGE_KEY) || 0); }
  catch { return 0; }
}

export function registerImpact(uniqueId) {
  if (uniqueId) {
    try {
      const seenKey = `${STORAGE_KEY}:seen:${uniqueId}`;
      if (localStorage.getItem(seenKey) === '1') return DEMO_BASE + getLocalRegistrations();
      localStorage.setItem(seenKey, '1');
    } catch {}
  }
  const next = getLocalRegistrations() + 1;
  try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
  window.dispatchEvent(new Event('axonova:impact'));
  return DEMO_BASE + next;
}

function AnimatedNumber({ value }) {
  const spring = useSpring(value, { stiffness: 70, damping: 18, mass: 0.8 });
  const rounded = useTransform(spring, (latest) => Math.round(latest).toLocaleString('es-PE'));
  useEffect(() => spring.set(value), [value, spring]);
  return <motion.span>{rounded}</motion.span>;
}

const COPY_BY_AUDIENCE = {
  familias: { label: 'familias peruanas que ya se sumaron', done: 'Ya eres parte de este cambio.', pending: '¡Tú puedes ser la siguiente!' },
  invitado: { label: 'docentes y cuidadores que ya aprendieron a detectar señales', done: 'Ya sabes qué observar y a quién avisar.', pending: '¡Súmate a la red de detección temprana!' },
};

export default function ImpactCounter({ compact = false, celebration = false, audience = 'familias' }) {
  const copy = COPY_BY_AUDIENCE[audience] || COPY_BY_AUDIENCE.familias;
  const targetCount = DEMO_BASE + getLocalRegistrations();
  const [count, setCount] = useState(celebration ? 0 : targetCount);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let timer;
    if (celebration) timer = window.setTimeout(() => setCount(DEMO_BASE + getLocalRegistrations()), 280);
    const syncLocal = () => setCount(DEMO_BASE + getLocalRegistrations());
    window.addEventListener('axonova:impact', syncLocal);

    // Producción: si existe /api/stats, el total global reemplaza el fallback local.
    fetch('/api/stats', { headers: { Accept: 'application/json' } })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        if (Number.isFinite(Number(data.registrations))) {
          setCount(Number(data.registrations));
          setOnline(true);
        }
      })
      .catch(() => {});

    return () => { window.clearTimeout(timer); window.removeEventListener('axonova:impact', syncLocal); };
  }, []);

  return (
    <motion.div
      layout
      className={`impact-counter ${compact ? 'impact-counter-compact' : ''} ${celebration ? 'impact-counter-celebration' : ''}`}
      initial={{ opacity: 0, y: 12, scale: celebration ? 0.97 : 1 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="impact-live-dot" aria-hidden="true" />
      <div>
        <div className="impact-label">{online ? 'Impacto Axonova · en vivo' : 'Impacto Axonova · demo'}</div>
        <div className="impact-number"><AnimatedNumber value={count} /></div>
      </div>
      <div className="impact-copy">
        <strong>{copy.label}</strong>
        <span>{celebration ? copy.done : copy.pending}</span>
      </div>
    </motion.div>
  );
}
