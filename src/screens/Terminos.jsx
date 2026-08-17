import BackLink from '../components/BackLink';

export default function Terminos() {
  return (
    <div>
      <BackLink to="/">Volver</BackLink>
      <h2 className="text-xl">Términos y condiciones</h2>
      <p className="text-xs text-ink-soft mb-4">Última actualización: agosto de 2026. Este texto es un borrador inicial — revísalo con un abogado antes de publicarlo, especialmente en lo referido a datos de salud de menores de edad.</p>

      <div className="card space-y-4 text-sm leading-relaxed">
        <section>
          <h3 className="text-[15px]">1. Qué es AXONOVA</h3>
          <p>AXONOVA es una plataforma digital de tamizaje temprano del neurodesarrollo infantil, dirigida a familias, personal de salud y comunidad educativa en el Perú. No reemplaza una evaluación clínica ni constituye un diagnóstico médico: es una herramienta de apoyo para identificar señales de alarma y facilitar la derivación oportuna al sistema de salud.</p>
        </section>

        <section>
          <h3 className="text-[15px]">2. Consentimiento del apoderado</h3>
          <p>Si usas AXONOVA en representación de un menor de edad, declaras ser su padre, madre o apoderado legal, o contar con autorización para actuar en su nombre. Al registrar los datos del menor, otorgas tu consentimiento informado para que sean tratados con el fin de aplicar el cuestionario de tamizaje, generar el historial evolutivo y, de corresponder, facilitar la derivación y teleconsulta con personal de salud.</p>
        </section>

        <section>
          <h3 className="text-[15px]">3. Tratamiento de datos personales y de salud</h3>
          <p>Los datos que recolectamos (identificación del menor, fecha de nacimiento, respuestas del cuestionario, historial evolutivo, informes clínicos) se tratan conforme a la Ley N.º 29733, Ley de Protección de Datos Personales, y su reglamento. Al tratarse de datos sensibles de salud de un menor de edad, aplicamos medidas reforzadas de seguridad y limitamos el acceso a: (a) la familia o apoderado registrado, (b) el personal de salud autorizado que atiende el caso, y (c) el personal autorizado de la institución educativa, cuando corresponda.</p>
          <p>No vendemos ni compartimos estos datos con terceros para fines comerciales o publicitarios.</p>
        </section>

        <section>
          <h3 className="text-[15px]">4. Alcance clínico y limitaciones</h3>
          <p>El resultado del cuestionario clasifica al menor en "sin alarma", "seguimiento" o "con alarma" según criterios de tamizaje, no de diagnóstico. Un resultado "sin alarma" no garantiza ausencia de una condición del neurodesarrollo, así como un resultado "con alarma" no confirma un diagnóstico: en ambos casos, la evaluación de un profesional de salud es la que determina el diagnóstico y el plan de tratamiento.</p>
        </section>

        <section>
          <h3 className="text-[15px]">5. Teleconsulta</h3>
          <p>La disponibilidad de teleconsulta depende del tipo de aseguramiento del menor (SIS, EsSalud, seguro privado o sin seguro) y de contar con un dispositivo con cámara y micrófono funcionando. Cuando la teleconsulta no esté disponible, se recomienda la atención presencial en el establecimiento de salud más cercano.</p>
        </section>

        <section>
          <h3 className="text-[15px]">6. Uso por personal de salud e instituciones educativas</h3>
          <p>El acceso institucional (personal CRED, especialidades médicas, personal educativo) está sujeto a verificación de credenciales y al deber de confidencialidad propio de su ejercicio profesional. El historial evolutivo y los informes registrados son compartidos únicamente entre los profesionales que atienden activamente el caso.</p>
        </section>

        <section>
          <h3 className="text-[15px]">7. Derechos del titular de los datos</h3>
          <p>El apoderado puede solicitar en cualquier momento el acceso, rectificación, cancelación u oposición (derechos ARCO) sobre los datos del menor, escribiendo a los canales de contacto que la plataforma indique.</p>
        </section>

        <section>
          <h3 className="text-[15px]">8. Modificaciones</h3>
          <p>Estos términos pueden actualizarse para reflejar cambios normativos o de la plataforma. Notificaremos cambios relevantes a través de la propia aplicación.</p>
        </section>
      </div>
    </div>
  );
}
