import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import owlImage from '../assets/axonova-owl.png';

const MOTION_BY_MOOD = {
  neutral: { y: [0, -3, 0], rotate: [0, -1.2, 0, 1.2, 0], duration: 4.6 },
  feliz: { y: [0, -7, 0], rotate: [0, -2, 0, 2, 0], duration: 2.8 },
  atento: { y: [0, -4, 0], rotate: [0, -2.5, 0, 1.5, 0], duration: 3.5 },
  preocupado: { y: [0, -2, 0], rotate: [0, -1, 0, 1, 0], duration: 4.2 },
  celebrando: { y: [0, -12, 0], rotate: [-4, 4, -4, 4, 0], duration: 1.35 },
};

// La sombra respira en contrafase al vuelo: cuando el búho sube, la sombra se encoge y se aclara.
const SHADOW_BY_MOOD = {
  neutral: { scaleX: [1, 0.86, 1], opacity: [0.5, 0.32, 0.5] },
  feliz: { scaleX: [1, 0.72, 1], opacity: [0.55, 0.26, 0.55] },
  atento: { scaleX: [1, 0.8, 1], opacity: [0.5, 0.3, 0.5] },
  preocupado: { scaleX: [1, 0.92, 1], opacity: [0.45, 0.38, 0.45] },
  celebrando: { scaleX: [1, 0.55, 1], opacity: [0.55, 0.18, 0.55] },
};

const SPARKLE_POSITIONS = [
  { x: -8, y: 6, delay: 0 },
  { x: 100, y: 2, delay: 0.12 },
  { x: 92, y: 68, delay: 0.24 },
  { x: -4, y: 60, delay: 0.36 },
  { x: 48, y: -10, delay: 0.18 },
];

function Sparkle({ x, y, delay }) {
  return (
    <motion.span
      className="owl-sparkle"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.6], rotate: [0, 90] }}
      transition={{ duration: 1.1, delay, repeat: Infinity, repeatDelay: 0.9 }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#C08A2E">
        <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
      </svg>
    </motion.span>
  );
}

export default function OwlMascot({ mood='neutral', size=120, className='', interactive=true, travelKey=0, travelDirection=1 }) {
  const reducedMotion = useReducedMotion();
  const animation = MOTION_BY_MOOD[mood] || MOTION_BY_MOOD.neutral;
  const shadowAnim = SHADOW_BY_MOOD[mood] || SHADOW_BY_MOOD.neutral;
  const travel = travelKey > 0 && !reducedMotion;
  const celebrating = mood === 'celebrando' && !reducedMotion;

  return (
    <motion.div className={`relative inline-flex shrink-0 select-none owl-mascot owl-stage ${travel ? 'owl-mascot-travel' : ''} ${className}`}
      style={{ width:size, height:size*0.77 }} initial={{ opacity:0, scale:.92 }} animate={{ opacity:1, scale:1 }} transition={{duration:.28}}>

      <span className="owl-glow-ring" aria-hidden="true" />

      <motion.img key={travelKey} src="/AxoNovaHappy.png" alt="Búho Axonova" draggable="false"
        className="absolute inset-0 h-full w-full object-contain object-center mix-blend-multiply"
        animate={travel ? {
          x: travelDirection > 0 ? [-20,75,170,0] : [20,-75,-170,0],
          y:[0,-14,-5,0], rotate: travelDirection > 0 ? [0,6,2,0] : [0,-6,-2,0], scale:[1,1.02,1,1]
        } : { y:animation.y, rotate:animation.rotate }}
        transition={travel ? {duration:1.15,times:[0,.32,.72,1],ease:[.22,1,.36,1]} :
          {duration:animation.duration,repeat:Infinity,ease:'easeInOut'}}
        whileHover={interactive && !travel ? {scale:1.06,rotate:0}:undefined}
        whileTap={interactive && !travel ? {scale:.96}:undefined}
      />

      {!reducedMotion && !travel && (
        <motion.span
          className="owl-floor-shadow"
          animate={shadowAnim}
          transition={{ duration: animation.duration, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      )}

      <AnimatePresence>
        {celebrating && SPARKLE_POSITIONS.map((s, i) => (
          <Sparkle key={i} {...s} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
