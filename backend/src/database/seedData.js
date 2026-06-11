const TEMA_MAP = {
  signos_alarma: "Signos Alarma",
  cuidados_basicos: "Cuidados Basicos",
  lactancia: "Lactancia Materna",
  temperatura: "Control Temperatura",
  ictericia: "Ictericia",
  sepsis: "Sepsis",
  hipotermia: "Hipotermia",
  cuando_buscar_ayuda: "Atencion Medica",
};

const nivel = (n) => (n === "ALTO" ? "Alto" : n === "MEDIO" ? "Medio" : "Bajo");

const RAW = [
  ["Signos de alarma en el recién nacido", "signos_alarma", "Aprende a identificar los cambios que pueden indicar que tu bebé necesita atención médica: fiebre, hipotermia, dificultad para alimentarse, rechazo del pecho, cambios anormales en la coloración de la piel, ictericia intensa, respiración rápida o dificultosa, disminución de la actividad, llanto débil o persistente, convulsiones, vómito frecuente y somnolencia excesiva.", "Si observas cualquiera de estos signos, no esperes. Comunícate con tu centro de salud o acude a urgencias de inmediato.", "ALTO"],
  ["Respiración anormal en recién nacidos", "signos_alarma", "La respiración normal en bebés es más rápida que en adultos. Sin embargo, presta atención si la respiración es muy profunda, hace ruido (sibilancias, chiripeos), si el pecho se hunde con cada respiración o si el bebé tiene dificultad para respirar.", "Acude a urgencias si el bebé tiene respiración superficial, gruñidos, o si ven las arrugas del cuello con cada respiración.", "ALTO"],
  ["Cambios en el llanto del bebé", "signos_alarma", "El llanto es la forma principal de comunicación del bebé. Está alerta si notas un llanto más débil de lo normal, llanto inconsolable que no cesa con los cuidados habituales, o un bebé que rara vez llora.", "Un cambio significativo en el patrón de llanto puede indicar dolor o malestar. Consulta a tu pediatra.", "ALTO"],
  ["Dificultad para alimentarse", "signos_alarma", "Si el bebé rechaza la leche materna o fórmula, se le voltea la comida con frecuencia, tiene debilidad para succionar o no puede tomar suficiente para satisfacer su hambre, es una señal de alerta.", "Ofrece pequeños partidos frecuentemente. Si después de 2 o 3 intentos el bebé aún no alimenta, busca ayuda médica.", "ALTO"],
  ["Cuidados básicos del recién nacido", "cuidados_basicos", "Conoce las prácticas diarias para mantener a tu bebé sano y seguro: higiene del cordón umbilical, cambio de pañales, baño, cuidado de la piel, posición para dormir (boca arriba), temperatura ambiental adecuada y visitas de control pediátrico.", "Mantén una rutina diaria, lava tus manos antes de tocar al bebé y asiste a todos los controles médicos programados.", "BAJO"],
  ["Higiene del cordón umbilical", "cuidados_basicos", "El cordón umbilical se seca y cae entre 7 a 14 días. Durante este tiempo, mantén el área limpia y seca.", "Evita sumersión en agua. No apliques alcohol sin prescripción médica. Usa pañales sueltos.", "BAJO"],
  ["Baño del recién nacido", "cuidados_basicos", "No es necesario bañar al bebé a diario. Un baño 2-3 veces por semana es suficiente. El baño debe ser corto (5-10 minutos) y con agua tibia.", "Utiliza jabón suave específico para bebés y sécalo inmediatamente después del baño.", "BAJO"],
  ["Posición segura para dormir", "cuidados_basicos", "Para prevenir el síndrome de muerte súbita, el bebé debe dormir en posición boca arriba, en una superficie firme y plana, sin almohadas ni mantas sueltas.", "El bebé debe dormir en su cuna, en la misma habitación pero en cama separada.", "BAJO"],
  ["Lactancia materna", "lactancia", "La leche materna es el mejor alimento para tu bebé durante los primeros 6 meses. Aprende la técnica correcta de agarre, las posiciones para amamantar y cómo identificar si tu bebé está comiendo suficiente.", "Amamanta a demanda (8 a 12 veces al día) y consulta con una asesora de lactancia si tienes dudas.", "BAJO"],
  ["Agarre correcto para amamantar", "lactancia", "Un buen agarre implica que el bebé tome no solo la areola, sino también parte del tejido con el pezón. Los labios deben estar caídos hacia afuera y la nariz libre para respirar.", "Si sientes dolor intenso o el bebé no succiona bien, busca ayuda de una consultora de lactancia.", "MEDIO"],
  ["Secuelas de la lactancia materna", "lactancia", "Es normal sentir tensión en el pecho a las 24-48 horas postparto. La extracción de leche materna puede aliviar la molestia si el bebé aún no viene con facilidad.", "Aplica frío local después de amamantar. Si persisten o tienen fiebre, contacta a tu médico.", "MEDIO"],
  ["Alimentación y crecimiento", "lactancia", "Durante los primeros 3 meses, los bebés lactantes deberían comer entre 8-12 veces cada 24 horas.", "Confía en las señales de hambre de tu bebé. El control de peso con tu pediatra es esencial.", "BAJO"],
  ["Control de temperatura", "temperatura", "Cómo medir correctamente la temperatura del bebé. Rango normal: 36.5°C a 37.5°C.", "Mide la temperatura con un termómetro digital en la axila. Si está fuera del rango normal, contacta a tu pediatra.", "MEDIO"],
  ["Termómetro seguro para bebés", "temperatura", "Los termómetros digitales de axila son los más seguros y precisos para recién nacidos.", "Para la axila, coloca el termómetro bajo el brazo y espera 2-3 minutos sin mover al bebé.", "BAJO"],
  ["Hipotermia vs fiebre en recién nacidos", "temperatura", "La fiebre en recién nacidos es siempre un signo de alerta. La hipotermia puede ocurrir por ambientes fríos o deshidratación.", "Acude inmediatamente si la temperatura es mayor a 38°C o menor a 36.5°C.", "ALTO"],
  ["Ictericia neonatal", "ictericia", "La ictericia es la coloración amarillenta de la piel y mucosas por acumulación de bilirrubina. Es frecuente pero requiere vigilancia.", "Si la coloración amarilla se intensifica o se extiende a las piernas, acude a tu centro de salud.", "MEDIO"],
  ["Ictericia fisiológica vs patológica", "ictericia", "La ictericia fisiológica aparece alrededor del tercer día. La patológica aparece en el primer día o se extiende rápidamente a manos y pies.", "La ictericia prematura o temprana requiere evaluación médica inmediata.", "MEDIO"],
  ["Fototerapia para ictericia", "ictericia", "La fototerapia es un tratamiento seguro y efectivo para reducir la bilirrubina.", "Puedes seguir amamantando durante la fototerapia. Sigue las indicaciones de tu pediatra.", "BAJO"],
  ["Sepsis neonatal", "sepsis", "La sepsis es una infección grave. Sus señales son inespecíficas: fiebre, hipotermia, rechazo alimentario, letargo o dificultad respiratoria.", "La detección temprana es vital. Ante cualquier señal compatible, busca atención médica de urgencia.", "ALTO"],
  ["Prevensión de infecciones en recién nacidos", "sepsis", "Los recién nacidos tienen sistemas inmunes frágiles. Protege a tu bebé lavando tus manos frecuentemente.", "Todos los que tengan contacto directo con el bebé deben lavarse las manos.", "BAJO"],
  ["Tratamiento de la sepsis neonatal", "sepsis", "El tratamiento incluye antibióticos y apoyo vital en UCIN si es necesario.", "El pronóstico mejora significativamente con tratamiento temprano.", "ALTO"],
  ["Hipotermia neonatal", "hipotermia", "Ocurre cuando la temperatura desciende por debajo de 36.5°C. Es más común en prematuros o ambientes fríos.", "Mantén al bebé cerca de tu cuerpo (contacto piel con piel) y abrígalo adecuadamente.", "MEDIO"],
  ["Contacto piel a piel para prematuritos", "hipotermia", "El contacto piel a piel ayuda a regular la temperatura, la frecuencia cardíaca y el estado emocional del bebé prematuro.", "Coloca al bebé sobre tu pecho desnudo. Ideal para 30-60 minutos varias veces al día.", "BAJO"],
  ["Clima frío y protección del bebé", "hipotermia", "En climas fríos, viste a tu bebé con una capa adicional, usa gorro y mantitas ajustadas.", "Asegúrate de que el bebé pueda mover las manos y dedos de los pies libremente.", "BAJO"],
  ["¿Cuándo acudir al centro de salud?", "cuando_buscar_ayuda", "Situaciones que requieren atención inmediata: fiebre mayor a 38°C, hipotermia, dificultad para respirar, convulsiones, rechazo total de alimentación.", "Ante la duda, siempre es mejor consultar. NeoCare no reemplaza la valoración médica profesional.", "ALTO"],
  ["Urgencias vs consultas programadas", "cuando_buscar_ayuda", "Las urgencias son para situaciones que ponen en riesgo la vida. Las consultas programadas son para seguimiento y prevención.", "Si no estás segura, llama a tu centro de salud.", "MEDIO"],
  ["Línea telefónica de maternidad segura", "cuando_buscar_ayuda", "Línea disponible 24/7 para orientarte sobre síntomas y cuándo buscar ayuda profesional.", "Guarda el número en tu celular.", "BAJO"],
  ["Síntomas postparto que requieren atención", "cuando_buscar_ayuda", "Como madre también necesitas atención: fiebre alta, sangrado abundante, dolor intenso, visión borrosa o mareos persistentes.", "Incluye tu salud en las evaluaciones. Busca ayuda si algo no está bien.", "ALTO"],
];

export const CONTENIDO_EDUCATIVO = RAW.map(([titulo, cat, descripcion, recomendacion, n]) => ({
  titulo,
  tema: TEMA_MAP[cat] || cat,
  categoria: cat,
  descripcion,
  recomendacion,
  nivel_alerta: nivel(n),
  url_recurso: `https://www.who.int/es/health-topics/newborn-health`,
  fuente_referencia: "OMS",
}));

export const TESTIMONIOS = [
  { nombre: "Carolina, 32", etapa: "postparto_early", contenido: "Las primeras semanas fueron las más difíciles de mi vida. La app me ayudó a poner nombre a lo que sentía y a entender que no estaba sola." },
  { nombre: "Mariana, 28", etapa: "prenatal", contenido: "Estar embarazada me generaba una mezcla de alegría y miedo. Aquí encontré un espacio sin juicio donde podía ser honesta sobre mis emociones." },
  { nombre: "Patricia, 35", etapa: "postparto_tardio", contenido: "Nadie me dijo que un año después del parto todavía podía sentirme agotada. Validar lo que siento me dio permiso para pedir ayuda." },
  { nombre: "Andrea, 26", etapa: "postparto_early", contenido: "La rutina de ejercicios suaves me ayudó a reconectar con mi cuerpo. Lo más valioso fue el espacio para hablar de identidad." },
];

export const VACUNAS_DEFAULT = [
  { nombre: "BCG", dosis: "Única", diasDesdeNacimiento: 0 },
  { nombre: "Hepatitis B", dosis: "Primera", diasDesdeNacimiento: 0 },
  { nombre: "Pentavalente", dosis: "Primera", diasDesdeNacimiento: 60 },
  { nombre: "Polio oral", dosis: "Primera", diasDesdeNacimiento: 60 },
  { nombre: "Rotavirus", dosis: "Primera", diasDesdeNacimiento: 60 },
];
