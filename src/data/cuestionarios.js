// Cuestionario adaptativo por edad — 5 dominios. Redacción propia basada en hitos
// generales del desarrollo infantil (no reproduce ningún instrumento con derechos reservados).
export const CUESTIONARIOS = {
  0: [
    { d: 'Motor grueso', q: '¿Mueve los brazos y piernas de forma simétrica (igual de un lado y otro)?' },
    { d: 'Motor fino', q: '¿Cierra la mano con fuerza al colocarle un dedo en la palma?' },
    { d: 'Cognitiva', q: '¿Reacciona (se sobresalta o parpadea) ante un sonido fuerte cercano?' },
    { d: 'Social', q: '¿Fija brevemente la mirada en un rostro a corta distancia?' },
    { d: 'Lenguaje', q: '¿Llora de forma vigorosa para expresar hambre o incomodidad?' },
  ],
  3: [
    { d: 'Motor grueso', q: '¿Levanta y sostiene brevemente la cabeza estando boca abajo?' },
    { d: 'Motor fino', q: '¿Mantiene las manos abiertas la mayor parte del tiempo, sin puños cerrados?' },
    { d: 'Cognitiva', q: '¿Sigue con la mirada un rostro u objeto que se mueve frente a él?' },
    { d: 'Social', q: '¿Sonríe al ver la cara de un adulto conocido, sin cosquillas de por medio?' },
    { d: 'Lenguaje', q: '¿Emite sonidos guturales distintos al llanto (arrullos)?' },
  ],
  6: [
    { d: 'Motor grueso', q: '¿Se mantiene sentado unos segundos sin apoyarse con las manos?' },
    { d: 'Motor fino', q: '¿Pasa un objeto de una mano a la otra?' },
    { d: 'Cognitiva', q: '¿Explora los objetos llevándolos a la boca o agitándolos?' },
    { d: 'Social', q: '¿Estira los brazos hacia un adulto para pedir que lo carguen?' },
    { d: 'Lenguaje', q: '¿Combina una consonante con una vocal al balbucear (ba, da, ma)?' },
  ],
  9: [
    { d: 'Motor grueso', q: '¿Se sienta solo desde la posición boca abajo, sin ayuda?' },
    { d: 'Motor fino', q: '¿Toma objetos pequeños usando toda la mano (pinza aún inmadura)?' },
    { d: 'Cognitiva', q: '¿Busca un objeto que vio esconder frente a él?' },
    { d: 'Social', q: '¿Imita gestos simples como decir "chau" con la mano?' },
    { d: 'Lenguaje', q: '¿Repite sílabas dobles al balbucear (ba-ba, ta-ta)?' },
  ],
  12: [
    { d: 'Motor grueso', q: '¿Da algunos pasos sin apoyo?' },
    { d: 'Motor fino', q: '¿Toma objetos pequeños con el pulgar y el índice (pinza fina)?' },
    { d: 'Cognitiva', q: '¿Voltea o responde cuando lo llaman por su nombre?' },
    { d: 'Social', q: '¿Señala con el dedo para pedir o mostrar algo?' },
    { d: 'Lenguaje', q: '¿Dice al menos una palabra dirigida con sentido ("mamá", "papá" u otra)?' },
  ],
  18: [
    { d: 'Motor grueso', q: '¿Camina solo de forma estable, sin apoyo?' },
    { d: 'Motor fino', q: '¿Garabatea de forma espontánea con un lápiz o crayón?' },
    { d: 'Cognitiva', q: '¿Reconoce al menos dos partes de su cuerpo cuando se las nombran?' },
    { d: 'Social', q: '¿Muestra o trae objetos para compartir su interés con un adulto?' },
    { d: 'Lenguaje', q: '¿Entiende y usa alrededor de 15 a 20 palabras?' },
  ],
  24: [
    { d: 'Motor grueso', q: '¿Corre y sube escaleras con ayuda?' },
    { d: 'Motor fino', q: '¿Arma torres de al menos 4 cubos?' },
    { d: 'Cognitiva', q: '¿Recuerda y trae, al pedido, un objeto que no está a la vista?' },
    { d: 'Social', q: '¿Juega cerca de otros niños, aunque sea en paralelo?' },
    { d: 'Lenguaje', q: '¿Junta dos palabras en una frase corta ("quiero agua")?' },
  ],
  30: [
    { d: 'Motor grueso', q: '¿Salta con ambos pies juntos?' },
    { d: 'Motor fino', q: '¿Copia una línea vertical u horizontal al imitar a un adulto?' },
    { d: 'Cognitiva', q: '¿Sigue una orden de dos pasos relacionados ("recoge el juguete y dámelo")?' },
    { d: 'Social', q: '¿Participa en juego simbólico simple (dar de comer a un muñeco)?' },
    { d: 'Lenguaje', q: '¿Forma frases de 3 palabras incluyendo un verbo?' },
  ],
  36: [
    { d: 'Motor grueso', q: '¿Sube y baja escaleras alternando los pies, sin apoyo?' },
    { d: 'Motor fino', q: '¿Copia un círculo al imitar a un adulto?' },
    { d: 'Cognitiva', q: '¿Sigue una orden de tres pasos no relacionados entre sí?' },
    { d: 'Social', q: '¿Participa en juego con turnos simples junto a otros niños, no solo en paralelo?' },
    { d: 'Lenguaje', q: '¿Forma frases de 4 o más palabras y es comprendido por adultos fuera de la familia?' },
  ],
  48: [
    { d: 'Motor grueso', q: '¿Salta en un pie 2 o 3 veces seguidas sin apoyo?' },
    { d: 'Motor fino', q: '¿Usa tijeras para cortar siguiendo una línea recta simple?' },
    { d: 'Cognitiva', q: '¿Reconoce y nombra al menos 4 colores?' },
    { d: 'Social', q: '¿Juega de forma cooperativa con otros niños, respetando turnos sencillos?' },
    { d: 'Lenguaje', q: '¿Cuenta un evento reciente con oraciones de 4 o más palabras, entendible para un adulto fuera de la familia?' },
  ],
  60: [
    { d: 'Motor grueso', q: '¿Se para en un pie sin apoyo por al menos 5 segundos?' },
    { d: 'Motor fino', q: '¿Dibuja una figura humana con al menos 3 partes del cuerpo?' },
    { d: 'Cognitiva', q: '¿Reconoce y nombra la mayoría de las letras de su nombre?' },
    { d: 'Social', q: '¿Sigue reglas simples de un juego grupal y espera su turno sin apoyo constante?' },
    { d: 'Lenguaje', q: '¿Usa oraciones completas y responde preguntas de "por qué" de forma coherente?' },
  ],
  96: [
    { d: 'Motor grueso', q: '¿Participa en juegos o deportes que requieren coordinación (correr, saltar la soga, andar en bicicleta)?' },
    { d: 'Motor fino', q: '¿Escribe de forma legible manteniendo el renglón, sin apoyo constante?' },
    { d: 'Cognitiva', q: '¿Sigue instrucciones de 3 o más pasos dadas en el aula sin necesitar repetirlas varias veces?' },
    { d: 'Social', q: '¿Mantiene relaciones de amistad estables y maneja la frustración sin conflictos frecuentes?' },
    { d: 'Lenguaje', q: '¿Lee y comprende textos cortos adecuados a su grado, y se expresa con claridad ante adultos fuera de casa?' },
  ],
};

export const NOTA_JURADO_HABILIDADES =
  'Trabajamos con la Lista de habilidades y conductas esperadas por edad del niño de 4 a 11 años, 11 meses y 29 días. Por alcance del MVP, implementamos 3 checkpoints representativos de ese rango — 4, 5 y 8 años — en vez de los ~96 meses que cubre la lista oficial completa.';
