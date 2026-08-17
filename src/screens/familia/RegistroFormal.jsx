import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import { useAxonovaStore, accedeTeleconsulta } from '../../store/useAxonovaStore';

export default function RegistroFormal() {
  const navigate = useNavigate();
  const registroIntent = useAxonovaStore((s) => s.registroIntent);
  const guardarRegistro = useAxonovaStore((s) => s.guardarRegistro);
  const [form, setForm] = useState({ apellidos: '', nombres: '', numDoc: '', contacto: '', direccion: '', establecimiento: '' });
  const intentTeleconsulta = registroIntent === 'teleconsulta';

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.apellidos || !form.nombres || !form.contacto) {
      alert('Completa al menos apellidos, nombres y un correo o celular de contacto.');
      return;
    }
    const menor = await guardarRegistro(form);
    if (registroIntent === 'teleconsulta') {
      if (accedeTeleconsulta(menor)) { navigate('/familia/teleconsulta'); }
      else {
        alert('Tu tipo de seguro o la falta de smartphone no permiten agendar teleconsulta directamente desde la plataforma. Te recomendamos acercarte a tu posta de salud más cercana.');
        navigate('/contenido/familias');
      }
    } else {
      navigate('/contenido/familias');
    }
  };

  return (
    <div>
      <BackLink to="/familia/resultado">Volver</BackLink>
      <h2 className="text-xl">Un último paso</h2>
      <p>{intentTeleconsulta ? 'Para agendar la teleconsulta y avisarte por correo o SMS del seguimiento, completa estos datos.' : 'Para llevar el registro del caso y avisarte por correo o SMS del seguimiento, completa estos datos.'}</p>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 mt-4">
        <form className="card w-full max-w-[480px] flex-1" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="field mb-4"><label>Apellidos del apoderado</label><input value={form.apellidos} onChange={(e) => set('apellidos', e.target.value)} /></div>
            <div className="field mb-4"><label>Nombres del apoderado</label><input value={form.nombres} onChange={(e) => set('nombres', e.target.value)} /></div>
          </div>
          <div className="field mb-4"><label>DNI del apoderado</label><input value={form.numDoc} onChange={(e) => set('numDoc', e.target.value)} /></div>
          <div className="field mb-4"><label>Correo o celular (para el seguimiento)</label><input value={form.contacto} onChange={(e) => set('contacto', e.target.value)} placeholder="999 999 999 o correo@ejemplo.com" /></div>
          <div className="field mb-4"><label>Dirección</label><input value={form.direccion} onChange={(e) => set('direccion', e.target.value)} /></div>
          <div className="field mb-5"><label>Posta o centro de salud más cercano</label><input value={form.establecimiento} onChange={(e) => set('establecimiento', e.target.value)} placeholder="Ej. C.S. San Martín de Porres" /></div>
          <p className="text-xs text-ink-soft mb-4">Al continuar aceptas nuestros <a href="/terminos" className="text-teal underline" target="_blank" rel="noreferrer">Términos y condiciones</a> y el tratamiento de estos datos según nuestra política de privacidad.</p>
          <button className="btn btn-primary btn-block" type="submit">Continuar</button>
        </form>
        <img src="/BuhoAxonovaNotes.png" alt="Buho tomando notas" className="hidden md:block w-[240px] lg:w-[320px] h-auto object-contain shrink-0 mix-blend-multiply" />
      </div>
    </div>
  );
}
