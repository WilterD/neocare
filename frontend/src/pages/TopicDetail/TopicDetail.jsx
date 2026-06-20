import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./TopicDetail.css";

import flechImage from "../../assets/FLECH.png";
import saImage from "../../assets/SA.png";
import lactanciaImg from "../../assets/lactancia_materna_1781987394324.png";
import signosImg from "../../assets/signos_alarma_1781987384190.png";
import temperaturaImg from "../../assets/control_temperatura_1781987404201.png";
import hipotermiaImg from "../../assets/hipotermia_neonatal_1781987412472.png";
// Fallback for others
import cuidadosBasicosImage from "../../assets/CUIDADOSBASICOS.png";
import datosBebeImage from "../../assets/DatosBebe.png";
import sepsisImage from "../../assets/sepsis.png";
import controlImage from "../../assets/CONTROL.png";

const topicsContent = {
  "lactancia-materna": {
    title: "Lactancia materna",
    description: "Beneficios, frecuencia y recomendaciones para una lactancia adecuada.",
    image: lactanciaImg,
    sections: [
      {
        title: "1. Lactancia materna exclusiva durante los primeros 6 meses",
        content: "La leche materna es el único alimento que tu bebé necesita. Lo protege de enfermedades y fortalece su sistema inmunológico. Favorece su desarrollo físico y cognitivo. Fortalece el vínculo madre e hijo. Desde el nacimiento hasta los 6 meses: solo leche materna, ni agua, ni té, ni jugos."
      },
      {
        title: "2. Frecuencia adecuada de alimentación",
        content: "Alimenta a tu bebé a libre demanda, día y noche.\n- 0 a 1 mes: Cada 2 a 3 horas (8 a 12 veces al día).\n- 1 a 6 meses: Cada 2 a 3 horas.\n- 6 meses en adelante: Continúa a libre demanda e inicia alimentación complementaria según indicación de salud.\n\nSeñales de que tu bebé tiene hambre: se mueve, abre la boca, busca el pecho, se chupa las manos, hace sonidos."
      },
      {
        title: "3. Identificación de signos de agarre correcto",
        content: "- Boca bien abierta: El bebé abre bien la boca antes de tomar el pecho.\n- Labio inferior hacia afuera.\n- Más areola visible arriba del labio superior.\n- Mentón tocando el pecho.\n- Succión lenta y profunda: Se escuchan tragos y el bebé se ve relajado.\n\nUn buen agarre no duele y ayuda a una lactancia exitosa."
      },
      {
        title: "4. Extracción y conservación de leche materna",
        content: "Extracción manual: Lava bien tus manos. Coloca el pulgar arriba y los dedos debajo de la areola. Presiona hacia atrás suavemente y luego comprime. Repite.\nConservación:\n- Refrigeradora (2°C a 4°C): Hasta 4 días.\n- Congelador 1 puerta (-18°C): Hasta 2 semanas.\n- Congelador 2 puertas (-18°C): Hasta 6 meses.\n\nUsa recipientes de vidrio o plástico con tapa. No llenes hasta el borde. Rotula con fecha."
      }
    ],
    alert: "La lactancia materna es amor, protección y salud para tu bebé. NeoCare te acompaña en cada etapa.",
    source: "Organización Panamericana de la Salud (OPS) y Organización Mundial de la Salud (OMS)"
  },
  "signos-alarma": {
    title: "Signos de alarma en el recién nacido",
    description: "Aprende a identificar señales que pueden indicar que tu bebé necesita atención médica.",
    image: signosImg,
    sections: [
      {
        title: "Reconocimiento de peligro",
        content: "Es fundamental estar alerta a cambios bruscos en el comportamiento y apariencia de tu bebé. Algunos signos que requieren evaluación inmediata incluyen fiebre (mayor a 37.5°C) o temperatura baja (menor a 35.5°C), dificultad para respirar, coloración azulada en la piel, falta de apetito o rechazo del alimento, y somnolencia excesiva o irritabilidad constante."
      }
    ],
    alert: "Si tu bebé presenta alguno de estos signos de alarma, debes buscar atención médica inmediata. ¡No automediques a tu bebé!",
    source: "Organización Panamericana de la Salud (OPS) y Organización Mundial de la Salud (OMS)"
  },
  "temperatura": {
    title: "Control de temperatura",
    description: "Cómo mantener a tu bebé a una temperatura adecuada y reconocer señales de alerta.",
    image: temperaturaImg,
    sections: [
      {
        title: "Importancia de la temperatura",
        content: "Los recién nacidos tienen dificultad para regular su temperatura corporal. La temperatura normal de un bebé está entre 36.5°C y 37.4°C."
      },
      {
        title: "Consejos para mantener la temperatura",
        content: "- Viste al bebé con ropa adecuada (generalmente una capa más de la que usa un adulto).\n- Evita corrientes de aire.\n- Usa gorrito en los primeros días.\n- Mantén la habitación a una temperatura cálida."
      }
    ],
    alert: "Tanto la fiebre (mayor a 37.5°C) como la hipotermia (menor a 36°C) son signos de alarma que requieren revisión médica.",
    source: "Organización Panamericana de la Salud (OPS) y Organización Mundial de la Salud (OMS)"
  },
  "hipotermia-neonatal": {
    title: "Hipotermia neonatal",
    description: "Qué es, causas, cómo prevenirla y cuándo buscar ayuda.",
    image: hipotermiaImg,
    sections: [
      {
        title: "¿Qué es la hipotermia?",
        content: "La hipotermia ocurre cuando la temperatura del bebé desciende por debajo de lo normal (menos de 36°C). Puede causar complicaciones graves si no se trata a tiempo."
      },
      {
        title: "Prevención y contacto piel a piel",
        content: "El método 'mamá canguro' o contacto piel a piel es una de las formas más efectivas de prevenir la hipotermia. Asegúrate de secar bien al bebé después del baño y abrigarlo correctamente."
      }
    ],
    alert: "Si tu bebé está frío al tacto y no logra calentarse con abrigo y contacto piel a piel, acude a urgencias.",
    source: "Organización Panamericana de la Salud (OPS) y Organización Mundial de la Salud (OMS)"
  },
  "ictericia-neonatal": {
    title: "Ictericia neonatal",
    description: "Qué es, cómo identificarla y cuándo consultar al personal de salud.",
    image: datosBebeImage,
    sections: [
      {
        title: "Coloración amarilla",
        content: "La ictericia es la coloración amarillenta de la piel y los ojos del bebé debido a la acumulación de bilirrubina. Es común en los primeros días, pero debe ser monitoreada."
      },
      {
        title: "Cuidados recomendados",
        content: "Mantén una alimentación frecuente (lactancia materna) para ayudar a eliminar la bilirrubina a través de las deposiciones. Observa si el color amarillo se extiende hacia el abdomen o las piernas."
      }
    ],
    alert: "Si la piel del bebé se vuelve muy amarilla, el bebé está muy somnoliento o no quiere comer, consulta a tu médico.",
    source: "Organización Panamericana de la Salud (OPS) y Organización Mundial de la Salud (OMS)"
  },
  "cuidados-basicos": {
    title: "Cuidados básicos del recién nacido",
    description: "Conoce prácticas diarias para mantener a tu bebé seguro en casa.",
    image: cuidadosBasicosImage,
    sections: [
      {
        title: "Higiene y baño",
        content: "Baña al bebé con agua tibia (alrededor de 37°C) usando un jabón suave y neutro. No es necesario bañarlo todos los días; 2 a 3 veces por semana es suficiente. Limpia el área del pañal con algodón y agua tibia o toallitas sin alcohol."
      },
      {
        title: "Cuidado del cordón umbilical",
        content: "Mantén el cordón umbilical limpio y seco. Límpialo con agua y jabón, y sécalo suavemente. Deja el pañal doblado por debajo del cordón para evitar roce y humedad. Caerá de forma natural entre la primera y tercera semana."
      }
    ],
    alert: "Vigila signos de infección en el cordón: enrojecimiento alrededor, mal olor o secreción con sangre o pus.",
    source: "Organización Panamericana de la Salud (OPS) y Organización Mundial de la Salud (OMS)"
  },
  "sepsis-neonatal": {
    title: "Sepsis neonatal",
    description: "Información importante para prevenirla y actuar a tiempo.",
    image: sepsisImage,
    sections: [
      {
        title: "Infecciones graves",
        content: "La sepsis es una infección generalizada que puede ser muy grave en los recién nacidos porque su sistema inmunológico aún es inmaduro."
      },
      {
        title: "Medidas de prevención",
        content: "Lávate siempre las manos antes de tocar al bebé. Limita las visitas, especialmente de personas enfermas. Mantén la vacunación de la madre al día."
      }
    ],
    alert: "La fiebre, el letargo extremo, el rechazo total al alimento y la piel pálida o azulada son signos urgentes de posible infección grave.",
    source: "Organización Panamericana de la Salud (OPS) y Organización Mundial de la Salud (OMS)"
  },
  "centro-salud": {
    title: "¿Cuándo acudir al centro de salud?",
    description: "Situaciones que requieren atención médica inmediata.",
    image: controlImage,
    sections: [
      {
        title: "Emergencias",
        content: "Acude inmediatamente si notas: pausas en la respiración mayores a 20 segundos, convulsiones o movimientos anormales, fiebre alta persistente, o si el bebé está muy pálido o morado."
      },
      {
        title: "Búsqueda oportuna de atención",
        content: "Ante la duda, es mejor que un profesional de la salud evalúe al recién nacido. No esperes a que los síntomas empeoren."
      }
    ],
    alert: "Ten siempre a mano los números de emergencia y la ubicación de tu centro de salud más cercano.",
    source: "Organización Panamericana de la Salud (OPS) y Organización Mundial de la Salud (OMS)"
  }
};

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(location.state?.user || null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem("neocareUser");
    if (storedUser && !usuario) {
      setUsuario(JSON.parse(storedUser));
    }
  }, [usuario, id]);

  const topic = topicsContent[id];

  if (!topic) {
    return (
      <main className="topic-detail-page">
        <Header2 user={usuario} />
        <div className="topic-detail-container error-state">
          <h2>Tema no encontrado</h2>
          <button onClick={() => navigate("/educacion")}>Volver a Educación</button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="topic-detail-page">
      <Header2 user={usuario} />

      <div className="topic-detail-container">
        <button className="topic-back-button" onClick={() => navigate("/educacion")}>
          <img src={flechImage} alt="Atrás" className="topic-back-icon" />
          Volver a Educación
        </button>

        <article className="topic-content-card">
          <div className="topic-header">
            <div className="topic-header-text">
              <h1>{topic.title}</h1>
              <p>{topic.description}</p>
              <div className="topic-source">
                <span className="source-label">Fuente de información:</span> {topic.source}
              </div>
            </div>
            <div className="topic-header-image-box">
              <img src={topic.image} alt={topic.title} className="topic-header-image" />
            </div>
          </div>

          <div className="topic-body">
            {topic.sections.map((sec, index) => (
              <section key={index} className="topic-section">
                <h3>{sec.title}</h3>
                <p>{sec.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}</p>
              </section>
            ))}
          </div>

          <div className="topic-alert-box">
            <div className="topic-alert-icon">!</div>
            <div className="topic-alert-content">
              <h4>Alerta preventiva educativa</h4>
              <p>{topic.alert}</p>
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </main>
  );
};

export default TopicDetail;
