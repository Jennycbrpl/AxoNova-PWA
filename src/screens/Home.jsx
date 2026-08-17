import { Link, useNavigate } from 'react-router-dom';
import OwlMascot from '../components/OwlMascot';
import { NOTA_JURADO_HABILIDADES } from '../data/cuestionarios';

const ICONS = {
  familia: <svg viewBox="0 0 24 24" fill="none" stroke="#5A6FC4" strokeWidth="1.8"><circle cx="9" cy="7" r="3" /><circle cx="17" cy="8" r="2.4" /><path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20" /><path d="M15.5 14.2a3.6 3.6 0 0 1 5.5 3v2.3" /></svg>,
  salud: <svg viewBox="0 0 24 24" fill="none" stroke="#1F5C56" strokeWidth="1.8"><path d="M12 21s-7-4.4-9.5-9C.8 8.2 3 4.5 6.8 4.5c2 0 3.4 1.1 4.2 2.2.8-1.1 2.2-2.2 4.2-2.2 3.8 0 6 3.7 4.3 7.5C19 16.6 12 21 12 21z" /><path d="M9 12h2l1-2 1.5 3L14.5 11h1.5" /></svg>,
  invitado: <svg viewBox="0 0 24 24" fill="none" stroke="#6E9A55" strokeWidth="1.8"><circle cx="12" cy="8" r="3.2" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg>,
};

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="pt-4 pb-8">
        <div className="eyebrow"><span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" /> Detección temprana del neurodesarrollo</div>
        <div className="flex items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-[42px] max-w-[620px] leading-[1.05]">Detectar a tiempo,<br /><span className="brand-wordmark" style={{fontSize:'inherit'}}>acompañar siempre.</span></h1>
            <p className="text-base max-w-[520px] mt-3">En el Perú, un trastorno del neurodesarrollo se detecta en promedio a los 4 años, cuando la intervención antes de los 2 años ofrece mejores resultados. AXONOVA conecta a la familia, al personal de salud y a la comunidad educativa en un mismo flujo de detección y derivación oportuna.</p>
          </div>
          <img src="/axonovapagprincipal.jpg" alt="Ilustración Axonova" className="hidden sm:block shrink-0 mix-blend-multiply w-[250px] lg:w-[300px] h-auto object-contain rounded-3xl" />
        </div>
      </section>

      <div className="grid sm:grid-cols-3 gap-3.5 mt-2">
        <Link to="/familia" className="card cursor-pointer hover:border-teal hover:-translate-y-0.5 transition-all block">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-peri-soft flex items-center justify-center mb-3.5">{ICONS.familia}</div>
          <h3 className="text-[17px]">Familia</h3>
          <p className="text-[13px] m-0">Solo necesitamos la fecha de nacimiento para aplicar el cuestionario. El registro completo se pide después, si lo necesitas.</p>
        </Link>
        <Link to="/salud/login" className="card cursor-pointer hover:border-teal hover:-translate-y-0.5 transition-all block">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-teal-soft flex items-center justify-center mb-3.5">{ICONS.salud}</div>
          <h3 className="text-[17px]">Personal de salud</h3>
          <p className="text-[13px] m-0">Checklist por edad, estado del caso y registro compartido entre especialidades.</p>
        </Link>
        <Link to="/contenido/invitado" className="card cursor-pointer hover:border-teal hover:-translate-y-0.5 transition-all block">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-sage-soft flex items-center justify-center mb-3.5">{ICONS.invitado}</div>
          <h3 className="text-[17px]">Invitado</h3>
          <p className="text-[13px] m-0">Datos rápidos, señales de alarma y contenido validado para docentes, cuidadores y público general, sin registro ni cuestionario clínico.</p>
        </Link>
      </div>

      <div className="mt-11 border-t border-line pt-6 grid sm:grid-cols-2 gap-6">
        <div><div className="font-serif text-[30px] text-teal">4 años</div><div className="text-[12.5px] text-ink-soft">edad promedio de detección actual en el Perú</div></div>
        <div><div className="font-serif text-[30px] text-teal">&lt; 2 años</div><div className="text-[12.5px] text-ink-soft">ventana con mejores resultados clínicos y funcionales</div></div>
      </div>

      <div className="bg-peri-soft rounded-xl p-3.5 text-sm text-[#3B4A9C] mt-6">
        <strong>Nota para el jurado:</strong> {NOTA_JURADO_HABILIDADES}
      </div>
    </div>
  );
}
