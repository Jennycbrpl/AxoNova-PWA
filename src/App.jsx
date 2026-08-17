import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import TopBar from './components/TopBar';
import PageTransition from './components/PageTransition';

import Home from './screens/Home';
import FamiliaInicio from './screens/familia/FamiliaInicio';
import FamiliaMenu from './screens/familia/FamiliaMenu';
import Cuestionario from './screens/familia/Cuestionario';
import Resultado from './screens/familia/Resultado';
import RegistroFormal from './screens/familia/RegistroFormal';
import Teleconsulta from './screens/familia/Teleconsulta';
import Contenido from './screens/Contenido';
import ContenidoDetalle from './screens/ContenidoDetalle';
import SaludLogin from './screens/salud/SaludLogin';
import SaludPanel from './screens/salud/SaludPanel';
import SaludFicha from './screens/salud/SaludFicha';
import Terminos from './screens/Terminos';

export default function App() {
  const location = useLocation();
  return (
    <div className="max-w-[960px] mx-auto px-5 pb-20">
      <TopBar />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/familia" element={<FamiliaInicio />} />
            <Route path="/familia/menu" element={<FamiliaMenu />} />
            <Route path="/familia/cuestionario" element={<Cuestionario />} />
            <Route path="/familia/resultado" element={<Resultado />} />
            <Route path="/familia/registro" element={<RegistroFormal />} />
            <Route path="/familia/teleconsulta" element={<Teleconsulta />} />
            <Route path="/contenido/:tab" element={<Contenido />} />
            <Route path="/contenido/:tab/:id" element={<ContenidoDetalle />} />
            <Route path="/salud/login" element={<SaludLogin />} />
            <Route path="/salud/panel" element={<SaludPanel />} />
            <Route path="/salud/ficha/:origen/:id" element={<SaludFicha />} />
            <Route path="/terminos" element={<Terminos />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
      <div className="mt-12 pt-5 border-t border-line text-[11.5px] text-ink-soft">
        Prototipo — datos simulados en localStorage. La verificación de aseguramiento y la interoperabilidad con EsSalud/SIS se representan mediante lógica local para efectos de la demo. <a href="/terminos" className="underline">Términos y condiciones</a>.
      </div>
    </div>
  );
}
