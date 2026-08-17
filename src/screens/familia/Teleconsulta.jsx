import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import { useAxonovaStore } from '../../store/useAxonovaStore';
import { DOCTORES } from '../../data/doctores';

const ESPECIALIDAD_FIJA = 'Pediatría';

export default function Teleconsulta() {
  const navigate = useNavigate();
  const resultado = useAxonovaStore((s) => s.resultado);
  const familia = useAxonovaStore((s) => s.familia);
  const confirmarCita = useAxonovaStore((s) => s.confirmarCita);
  const getCitasOcupadas = useAxonovaStore((s) => s.getCitasOcupadas);

  const detectados = resultado ? [...(resultado.dominios || []), ...(resultado.regresion || [])] : [];
  const doctoresEsp = DOCTORES.filter((d) => d.especialidad === ESPECIALIDAD_FIJA);
  const [doctorId, setDoctorId] = useState(doctoresEsp[0]?.id || '');
  const [slot, setSlot] = useState('');
  const [ocupados, setOcupados] = useState(new Set());

  useEffect(() => { setOcupados(getCitasOcupadas()); }, []);

  const doctor = DOCTORES.find((d) => d.id === doctorId);
  const libres = doctor ? doctor.slots.filter((s) => !ocupados.has(`${doctor.id}|${s.split('|')[0]}|${s.split('|')[1]}`)) : [];

  const confirmar = async () => {
    if (!slot) { alert('Elige un horario disponible.'); return; }
    const [fecha, hora] = slot.split('|');
    await confirmarCita({ doctor, fecha, hora, motivo: detectados.join(', ') });
    alert(`Teleconsulta con ${doctor.nombre} (${doctor.especialidad}) agendada para el ${fecha} a las ${hora}. El caso ya es visible para el personal de salud.`);
    navigate('/familia/menu');
  };

  return (
    <div>
      <BackLink to="/familia/registro">Volver</BackLink>
      <h2 className="text-xl">Agendar teleconsulta</h2>
      <p>Elige la especialidad y el profesional: los horarios disponibles dependen de la agenda de cada uno, como en EsSalud o una clínica.</p>

      <div className="card max-w-[480px] mt-2">
        <div className="field mb-4">
          <label>Especialidad</label>
          <div className="field-fixed">Pediatría</div>
        </div>
        <div className="field mb-4">
          <label>Profesional</label>
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
            {doctoresEsp.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
        </div>
        <div className="field mb-5">
          <label>Horario disponible</label>
          {libres.length === 0 ? (
            <div className="field-hint">Este profesional no tiene horarios libres por ahora. Prueba con otro profesional de la misma especialidad.</div>
          ) : (
            <select value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option value="">Selecciona un horario</option>
              {libres.map((s) => { const [fecha, hora] = s.split('|'); return <option key={s} value={s}>{fecha} · {hora}</option>; })}
            </select>
          )}
        </div>
        <button className="btn btn-primary btn-block" disabled={!slot} onClick={confirmar}>Confirmar teleconsulta</button>
      </div>
    </div>
  );
}
