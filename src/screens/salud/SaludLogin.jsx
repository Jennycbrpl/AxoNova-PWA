import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import { useAxonovaStore } from '../../store/useAxonovaStore';
import { ESPECIALIDADES } from '../../data/doctores';

export default function SaludLogin() {
  const navigate = useNavigate();
  const loginSalud = useAxonovaStore((s) => s.loginSalud);
  const [usuario, setUsuario] = useState('');
  const [especialidad, setEspecialidad] = useState(ESPECIALIDADES[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginSalud(usuario.trim() || 'profesional.cred', especialidad);
    navigate('/salud/panel');
  };

  return (
    <div>
      <BackLink to="/">Inicio</BackLink>
      <h2 className="text-xl">Acceso institucional</h2>
      <p>Ingreso con credenciales de profesional CRED, primer nivel de atención o especialidad.</p>
      <form className="card max-w-[420px] mt-2" onSubmit={handleSubmit}>
        <div className="field mb-4"><label>Usuario institucional</label><input placeholder="Ej. jcondori.cred" value={usuario} onChange={(e) => setUsuario(e.target.value)} /></div>
        <div className="field mb-4"><label>Especialidad</label>
          <select value={especialidad} onChange={(e) => setEspecialidad(e.target.value)}>
            {ESPECIALIDADES.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div className="field mb-5"><label>Contraseña</label><input type="password" placeholder="••••••••" /></div>
        <button className="btn btn-primary btn-block" type="submit">Ingresar</button>
      </form>
    </div>
  );
}
