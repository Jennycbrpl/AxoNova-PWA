# AXONOVA — App React

Detección temprana del neurodesarrollo infantil. Migrado desde el prototipo HTML a React + Vite con estado correcto (Zustand), rutas (React Router) y animación (Framer Motion).

## Instalar y correr

```
npm install
npm run dev
```

## Estructura

```
src/
  store/useAxonovaStore.js   # todo el estado global (sin mutaciones directas)
  data/                      # cuestionarios, recursos, doctores — igual que el prototipo
  components/                # TopBar, OwlMascot (búho animado), GrowthLine, etc.
  screens/
    familia/                 # flujo de la familia
    salud/                   # panel del personal de salud
    Contenido.jsx, Home.jsx, Terminos.jsx
```

## Pendiente / próximos pasos

1. **Reemplazar `public/owl-icon.svg`** por el ícono real de tu diseñador (mismo nombre de archivo, o actualiza la ruta en `index.html` y `manifest.webmanifest`).
2. **`src/components/OwlMascot.jsx`** es un búho vectorial hecho a mano para que la mascota tenga vida (parpadeo, alitas, cejas que cambian de expresión). Si tu diseñador entrega un SVG por capas, se puede reemplazar el contenido interno del `<motion.svg>` manteniendo los mismos `<motion.g>`/`mood` para no perder la animación.
3. **Backend compartido**: ahora mismo todo se guarda en `localStorage` (por dispositivo). Para que el personal de salud vea en tiempo real los casos que reporta una familia desde otro celular, se necesita un backend real — recomendado: Supabase o Firebase, reemplazando las funciones `readJSON`/`writeJSON` del store por llamadas a esa base de datos.
4. Revisar `src/screens/Terminos.jsx` con un abogado antes de publicar — es un borrador funcional, no asesoría legal.

## Subir a GitHub

```
git init
git add .
git commit -m "AXONOVA — versión React"
```
Luego crea un repositorio vacío en github.com y copia los 2-3 comandos que te da la sección "…or push an existing repository from the command line".


## UX gamificado y contador de impacto

- `src/components/OwlMascot.jsx` usa la ilustración real de `src/assets/axonova-owl.png` y la anima con Framer Motion.
- `Cuestionario.jsx` ahora presenta una pregunta por pantalla, barra de progreso, puntos, rachas, mensajes del búho y recompensas visuales.
- `ImpactCounter.jsx` intenta obtener el total global desde `GET /api/stats` con `{ "registrations": 12345 }`.
- Si el endpoint no existe, el prototipo usa un contador local de demo. Para una cifra realmente global entre dispositivos, conecta `/api/stats` a tu backend/analytics.
- `VITE_AXONOVA_DEMO_BASE` permite cambiar la cifra base usada solo por el fallback de demo.
