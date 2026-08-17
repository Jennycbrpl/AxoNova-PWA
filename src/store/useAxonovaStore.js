import { create } from 'zustand';
import { CUESTIONARIOS } from '../data/cuestionarios';

/* =========================================================
   AXONOVA — store central (Zustand)
   Regla de oro: nunca `store.familia.x = y`. Todo cambio pasa
   por una acción que arma un objeto NUEVO y llama a set(...).
========================================================= */

export const ETAPAS = [0, 3, 6, 9, 12, 18, 24, 30, 36, 48, 60, 96];
export const ETAPA_LABELS = {
  0: 'Recién nacido', 3: '3 meses', 6: '6 meses', 9: '9 meses', 12: '1 año',
  18: '18 meses', 24: '2 años', 30: '2 años y medio', 36: '3 años',
  48: '4 años', 60: '5 años', 96: '8 años',
};
export function etapaLabel(m) { return ETAPA_LABELS[m] ?? `${m} meses`; }
export function edadEnMeses(fechaNacimiento) {
  const nac = new Date(fechaNacimiento);
  const hoy = new Date();
  return Math.max(0, (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth()));
}
export function etapasPendientes(menor) {
  if (!menor) return [];
  const edad = edadEnMeses(menor.fechaNacimiento);
  const completadas = menor.etapasCompletadas || [];
  const pendientes = ETAPAS.filter((e) => e <= edad && !completadas.includes(e)).sort((a, b) => a - b);
  // Si el menor es nuevo en el sistema (sin ninguna etapa completada aún), no lo
  // forzamos a "ponerse al día" desde recién nacido: arrancamos directamente en
  // la etapa más cercana a su edad actual. El resto de controles anteriores
  // queda igual disponible después, por si se retoma el seguimiento completo.
  if (completadas.length === 0 && pendientes.length > 1) {
    const masCercana = pendientes[pendientes.length - 1];
    return [masCercana, ...pendientes.filter((e) => e !== masCercana)];
  }
  return pendientes;
}
export function etapaAnteriorCompletada(menor, etapaActual) {
  const completadas = (menor.etapasCompletadas || []).filter((e) => e < etapaActual).sort((a, b) => b - a);
  return completadas.length ? completadas[0] : null;
}
export function lookupAseguramiento(dni) {
  const d = (dni || '').replace(/\D/g, '');
  const last = d ? parseInt(d[d.length - 1], 10) : 0;
  if (last <= 3) return 'SIS';
  if (last <= 6) return 'EsSalud';
  if (last <= 8) return 'Seguro privado';
  return 'Sin seguro';
}
export function accedeTeleconsulta(menor) {
  return menor.aseguramiento === 'EsSalud' && !!menor.tieneSmartphone;
}

/* ---------------------------------------------------------
   PERSISTENCIA — localStorage real del navegador.
   Ver README del proyecto: esto es solo para desarrollo.
   La vista "Personal de salud" necesita un backend
   compartido (Firebase/Supabase/API propia) para producción,
   porque localStorage no se comparte entre dispositivos.
--------------------------------------------------------- */
const PREFIX = 'axonova:';
function readJSON(key, fallback) {
  try { const raw = localStorage.getItem(PREFIX + key); return raw ? JSON.parse(raw) : fallback; }
  catch (e) { console.error('No se pudo leer', key, e); return fallback; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
  catch (e) { console.error('No se pudo guardar', key, e); }
}
function readList(key) { return readJSON(key, []); }

export const useAxonovaStore = create((set, get) => ({
  familia: { dniMenor: '', fechaNacimiento: '', tieneSmartphone: null, aseguramiento: null, menor: null },
  cuestionario: { etapa: null, etiquetaEdad: '', preguntasNuevas: [], preguntasReverif: [], respuestas: {}, respuestasReverif: {} },
  resultado: null,
  registroIntent: 'contenido',
  salud: { logueado: false, usuario: '', especialidad: '' },

  // ----- familia -----
  setFamiliaField(field, value) {
    set((state) => ({ familia: { ...state.familia, [field]: value } }));
  },

  async iniciarFamilia() {
    const { dniMenor, fechaNacimiento, tieneSmartphone } = get().familia;
    if (!dniMenor || !fechaNacimiento || tieneSmartphone === null) {
      throw new Error('Completa el DNI, la fecha de nacimiento y si cuentan con smartphone.');
    }
    const aseguramiento = lookupAseguramiento(dniMenor);
    let menor = readJSON(`menor:${dniMenor}`, null);
    if (!menor) {
      menor = { dniMenor, fechaNacimiento, aseguramiento, tieneSmartphone, registrado: false, apoderado: null, establecimiento: '', historial: [], etapasCompletadas: [] };
    } else {
      menor = { ...menor, fechaNacimiento, aseguramiento, tieneSmartphone };
    }
    writeJSON(`menor:${dniMenor}`, menor);
    set((state) => ({ familia: { ...state.familia, aseguramiento, menor } }));
    return menor;
  },

  async cargarMenor(dniMenor) {
    const menor = readJSON(`menor:${dniMenor}`, null);
    set((state) => ({ familia: { ...state.familia, dniMenor, menor } }));
    return menor;
  },

  iniciarCuestionario(etapa) {
    const menor = get().familia.menor;
    const anterior = etapaAnteriorCompletada(menor, etapa);
    set({
      cuestionario: {
        etapa,
        etiquetaEdad: etapaLabel(etapa),
        preguntasNuevas: CUESTIONARIOS[etapa] || [],
        preguntasReverif: anterior !== null ? CUESTIONARIOS[anterior] || [] : [],
        respuestas: {},
        respuestasReverif: {},
      },
    });
  },

  responderPregunta(index, valor) {
    set((state) => ({ cuestionario: { ...state.cuestionario, respuestas: { ...state.cuestionario.respuestas, [index]: valor } } }));
  },
  responderReverif(index, valor) {
    set((state) => ({ cuestionario: { ...state.cuestionario, respuestasReverif: { ...state.cuestionario.respuestasReverif, [index]: valor } } }));
  },

  async calcularResultado() {
    const { cuestionario, familia } = get();
    const noLogrados = cuestionario.preguntasNuevas.filter((p, i) => cuestionario.respuestas[i] === 'no');
    const regresion = cuestionario.preguntasReverif.filter((p, i) => cuestionario.respuestasReverif[i] === 'no');

    let nivel = 'sin_alarma';
    if (noLogrados.length === 1 && regresion.length === 0) nivel = 'seguimiento';
    if (noLogrados.length >= 2 || regresion.length >= 1) nivel = 'alarma';

    const resultado = { nivel, dominios: noLogrados.map((p) => p.d), regresion: regresion.map((p) => p.d), etapa: cuestionario.etapa, etiquetaEdad: cuestionario.etiquetaEdad };

    const menor = familia.menor;
    const nuevoHistorial = [...(menor.historial || []), { fecha: new Date().toLocaleDateString('es-PE'), etiquetaEdad: cuestionario.etiquetaEdad, resultado: nivel, dominios: resultado.dominios, regresion: resultado.regresion }];
    const nuevasEtapasCompletadas = (menor.etapasCompletadas || []).includes(cuestionario.etapa) ? menor.etapasCompletadas : [...(menor.etapasCompletadas || []), cuestionario.etapa];
    const menorActualizado = { ...menor, historial: nuevoHistorial, etapasCompletadas: nuevasEtapasCompletadas };
    writeJSON(`menor:${familia.dniMenor}`, menorActualizado);

    if (nivel === 'alarma') {
      const casos = readList('casos');
      const existente = casos.find((k) => k.dniMenor === familia.dniMenor && k.estadoCaso !== 'En seguimiento');
      if (!existente) {
        const nuevoCaso = {
          id: 'CASO-' + Date.now(), dniMenor: familia.dniMenor,
          nombreMenor: menor.apoderado ? (menor.apoderado.nombreMenor || `Menor DNI ${familia.dniMenor}`) : `Menor DNI ${familia.dniMenor}`,
          fecha: new Date().toLocaleDateString('es-PE'), etapa: cuestionario.etiquetaEdad,
          dominios: resultado.dominios, regresion: resultado.regresion, estadoCaso: 'Detectado',
          establecimiento: menor.establecimiento || '', informes: [],
        };
        writeJSON('casos', [...casos, nuevoCaso]);
      }
    }

    set((state) => ({ resultado, familia: { ...state.familia, menor: menorActualizado } }));
    return resultado;
  },

  setRegistroIntent(intent) { set({ registroIntent: intent }); },

  async guardarRegistro(datosApoderado) {
    const { familia } = get();
    const menor = familia.menor;
    const actualizado = { ...menor, registrado: true, establecimiento: datosApoderado.establecimiento, apoderado: { ...datosApoderado, nombreMenor: menor.apoderado ? menor.apoderado.nombreMenor : '' } };
    writeJSON(`menor:${familia.dniMenor}`, actualizado);

    const casos = readList('casos');
    const idx = [...casos].reverse().findIndex((k) => k.dniMenor === familia.dniMenor);
    if (idx > -1) {
      const realIdx = casos.length - 1 - idx;
      casos[realIdx] = { ...casos[realIdx], establecimiento: datosApoderado.establecimiento };
      writeJSON('casos', casos);
    }
    set((state) => ({ familia: { ...state.familia, menor: actualizado } }));
    return actualizado;
  },

  // ----- citas -----
  async confirmarCita({ doctor, fecha, hora, motivo }) {
    const { familia } = get();
    const menor = familia.menor;
    const citas = readList('citas');
    const nuevaCita = {
      id: 'CITA-' + Date.now(), dniMenor: familia.dniMenor,
      nombreMenor: menor.apoderado ? (menor.apoderado.nombreMenor || `Menor DNI ${familia.dniMenor}`) : `Menor DNI ${familia.dniMenor}`,
      fecha, hora, doctorId: doctor.id, doctorNombre: doctor.nombre, especialidad: doctor.especialidad,
      motivo: motivo || 'Seguimiento', estado: 'agendada', establecimiento: menor.establecimiento || '',
    };
    writeJSON('citas', [...citas, nuevaCita]);

    const casos = readList('casos');
    const idx = [...casos].reverse().findIndex((k) => k.dniMenor === familia.dniMenor);
    if (idx > -1) {
      const realIdx = casos.length - 1 - idx;
      if (casos[realIdx].estadoCaso === 'Detectado') {
        casos[realIdx] = { ...casos[realIdx], estadoCaso: 'Derivado' };
        writeJSON('casos', casos);
      }
    }
    return nuevaCita;
  },
  getCitasOcupadas() {
    return new Set(readList('citas').filter((c) => c.doctorId).map((c) => `${c.doctorId}|${c.fecha}|${c.hora}`));
  },
  getCitas() { return readList('citas'); },

  // ----- casos / salud -----
  getCasos() { return readList('casos'); },
  async avanzarEstadoCaso(casoId, nuevoEstado) {
    const casos = readList('casos');
    const idx = casos.findIndex((c) => c.id === casoId);
    if (idx > -1) { casos[idx] = { ...casos[idx], estadoCaso: nuevoEstado }; writeJSON('casos', casos); }
    return casos[idx];
  },
  async agregarInforme(casoId, informe) {
    const casos = readList('casos');
    const idx = casos.findIndex((c) => c.id === casoId);
    if (idx > -1) {
      const informes = [...(casos[idx].informes || []), informe];
      casos[idx] = { ...casos[idx], informes };
      writeJSON('casos', casos);
    }
    return casos[idx];
  },

  loginSalud(usuario, especialidad) {
    set({ salud: { logueado: true, usuario: usuario || 'profesional.cred', especialidad } });
  },
  logoutSalud() { set({ salud: { logueado: false, usuario: '', especialidad: '' } }); },
}));
