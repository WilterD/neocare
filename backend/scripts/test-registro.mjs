const BASE = "http://localhost:4000/api";
const ts = Date.now();

const payload = {
  datosPersonales: {
    nombreCompleto: "Usuario Prueba",
    edad: "28",
    numeroIdentificacion: `V${ts}`,
    telefono: "04141234567",
    correo: `test_${ts}@neocare.test`,
    password: "Test1234",
  },
  sociodemografica: {
    nivelEducativo: "Superior",
    zonaResidencia: "Urbana",
    accesoCentroSalud: "Sí",
    situacionEconomica: "Media",
  },
  condicionesCuidado: {
    relacionRecienNacido: "Madre",
    primeraVezCuidando: "Sí",
    cuidaSinApoyo: "No",
    numeroNinosCuidado: "1",
    apoyoFamiliar: "Sí",
    apoyoPrincipal: "Pareja",
  },
  recienNacido: {
    nombreBebe: "Bebe Prueba",
    fechaNacimiento: "01/03/2026",
    sexo: "Masculino",
    pesoNacer: "3200",
    edadGestacional: "39",
  },
  datosClinicos: {
    tipoParto: "Vaginal",
    complicacionesNacer: "No",
    hospitalizacionNeonatal: "No",
    cuidadosEspeciales: "No",
  },
  consentimientoAceptado: true,
};

const res = await fetch(`${BASE}/registro`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const data = await res.json();
console.log("Status:", res.status);
console.log(JSON.stringify(data, null, 2));

if (!res.ok) process.exit(1);

const token = data.token;
const bebeId = data.usuario?.bebe?.id;

const triajeRes = await fetch(`${BASE}/bebes/${bebeId}/triaje`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    signos: { alteracionesSueno: true },
  }),
});
const triajeData = await triajeRes.json();
console.log("\nTriaje status:", triajeRes.status);
console.log(JSON.stringify(triajeData, null, 2));

process.exit(triajeRes.ok ? 0 : 1);
