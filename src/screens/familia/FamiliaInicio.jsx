import { useNavigate } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import OwlMascot from '../../components/OwlMascot';
import { useAxonovaStore, etapasPendientes } from '../../store/useAxonovaStore';

export default function FamiliaInicio() {
  const navigate = useNavigate();
  const familia = useAxonovaStore((s) => s.familia);
  const setFamiliaField = useAxonovaStore((s) => s.setFamiliaField);
  const iniciarFamilia = useAxonovaStore((s) => s.iniciarFamilia);
  const iniciarCuestionario = useAxonovaStore((s) => s.iniciarCuestionario);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const menor = await iniciarFamilia();
      if (menor.historial.length > 0) { navigate('/familia/menu'); return; }
      const pendientes = etapasPendientes(menor);
      if (pendientes.length === 0) { alert('Aún no corresponde un nuevo control según la edad del menor.'); navigate('/'); return; }
      iniciarCuestionario(pendientes[0]);
      navigate('/familia/cuestionario');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <BackLink to="/">Inicio</BackLink>
      <div className="flex items-start gap-4 mb-2">
        <OwlMascot size={64} mood="atento" />
        <div>
          <h2 className="text-xl">Antes de empezar</h2>
          <p>Solo necesitamos estos datos para aplicar el cuestionario y verificar tu afiliación de salud. No te vamos a pedir que te registres todavía.</p>
        </div>
      </div>
      <form className="card max-w-[480px]" onSubmit={handleSubmit}>
        <div className="field mb-4">
          <label>DNI del menor</label>
          <input maxLength={8} placeholder="Ej. 88888888" value={familia.dniMenor} onChange={(e) => setFamiliaField('dniMenor', e.target.value)} />
          <div className="field-hint">Lo usamos para verificar si cuenta con SIS, EsSalud o seguro privado.</div>
        </div>
        <div className="field mb-4">
          <label>Fecha de nacimiento del menor</label>
          <input type="date" value={familia.fechaNacimiento} onChange={(e) => setFamiliaField('fechaNacimiento', e.target.value)} />
        </div>
        <div className="field mb-5">
          <label>¿Cuentan con un smartphone con cámara y micrófono funcionando?</label>
          <div className="grid grid-cols-2 gap-2.5" role="group" aria-label="Disponibilidad de smartphone">
            <button type="button" className={`q-opt ${familia.tieneSmartphone === true ? 'selected-yes' : ''}`} onClick={() => setFamiliaField('tieneSmartphone', true)}>Sí</button>
            <button type="button" className={`q-opt ${familia.tieneSmartphone === false ? 'selected-no' : ''}`} onClick={() => setFamiliaField('tieneSmartphone', false)}>No</button>
          </div>
          <div className="field-hint">Nos permite saber si la teleconsulta es una opción viable para ustedes.</div>
        </div>
        <button className="btn btn-primary btn-block" type="submit">Continuar</button>
      </form>
    </div>
  );
}
