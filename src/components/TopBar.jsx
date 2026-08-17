import { Link } from 'react-router-dom';
import owlImage from '../assets/axonova-owl.png';

export default function TopBar() {
  return (
    <header className="flex items-center justify-between py-5">
      <Link to="/" className="brand-mark cursor-pointer block">
        <img src="/AxoNovaLOGOx2.png" alt="Axonova Logo" className="h-[68px] md:h-[80px] w-auto object-contain mix-blend-multiply" />
      </Link>
      <div className="early-access-tag">
        <span className="dot" aria-hidden="true" />
        Acceso anticipado · Perú
      </div>
    </header>
  );
}
