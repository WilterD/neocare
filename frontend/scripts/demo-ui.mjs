/**
 * Demo visual NeoCare — rellena formularios en el frontend paso a paso.
 *
 * Requisitos:
 *   1. Backend:  cd backend && npm start   (puerto 4000)
 *   2. Frontend: cd frontend && npm run dev (puerto 5173)
 *   3. Primera vez: npx playwright install chromium
 *
 * Uso:
 *   npm run demo:ui
 *   npm run demo:ui -- --slow=800
 *   npm run demo:ui -- --from=registro
 *   $env:DEMO_SLOW=600; $env:DEMO_FROM="registro"; npm run demo:ui
 */
import { chromium } from "playwright";

const BASE = process.env.DEMO_URL || "http://localhost:5173";

function arg(name, fallback) {
  const fromCli = process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
  const fromEnv = process.env[`DEMO_${name.toUpperCase()}`];
  return fromCli ?? fromEnv ?? fallback;
}

const SLOW = Number(arg("slow", 400));
const FROM = arg("from", "contacto");

const ts = Date.now();
const DEMO = {
  nombre: "María Demo NeoCare",
  edad: "28",
  cedula: `V${ts}`,
  telefono: "04141234567",
  correo: `demo_${ts}@neocare.test`,
  password: "Demo1234",
  bebe: "Lucas Demo",
  peso: "3200",
  gestacional: "39",
};

function fechaNacimientoBebe() {
  const d = new Date();
  d.setDate(d.getDate() - 45);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

const wait = (ms = SLOW) => new Promise((r) => setTimeout(r, ms));

async function log(step, msg) {
  console.log(`\n▶ Paso ${step}: ${msg}`);
}

async function typeHuman(page, selector, text) {
  await page.click(selector);
  await page.fill(selector, "");
  for (const ch of text) {
    await page.type(selector, ch, { delay: 45 });
    await wait(30);
  }
}

async function clickSiguiente(page) {
  const btn = page.getByRole("button", { name: /Siguiente|Finalizar/ });
  await btn.scrollIntoViewIfNeeded();
  await wait(200);
  await btn.click();
  await wait(600);
}

async function pillInGroup(page, groupTitle, option) {
  const group = page.locator(".option-group").filter({ hasText: groupTitle });
  await group.getByRole("button", { name: option, exact: true }).click();
  await wait(250);
}

async function runRegister(page) {
  await log("REG", "Registro completo (6 pasos)");
  await page.goto(`${BASE}/registro`);
  await page.waitForLoadState("networkidle");
  await wait(800);

  // Paso 1 — datos personales
  await typeHuman(page, 'input[name="nombreCompleto"]', DEMO.nombre);
  await typeHuman(page, 'input[name="edad"]', DEMO.edad);
  await typeHuman(page, 'input[name="numeroIdentificacion"]', DEMO.cedula);
  await typeHuman(page, 'input[name="telefono"]', DEMO.telefono);
  await typeHuman(page, 'input[name="correo"]', DEMO.correo);
  await typeHuman(page, 'input[name="password"]', DEMO.password);
  await typeHuman(page, 'input[name="confirmPassword"]', DEMO.password);
  await clickSiguiente(page);

  // Paso 2 — sociodemográfica
  await pillInGroup(page, "Nivel educativo", "Superior");
  await pillInGroup(page, "Zona de residencia", "Urbana");
  await pillInGroup(page, "centro de salud", "Sí");
  await pillInGroup(page, "Situación económica", "Media");
  await clickSiguiente(page);

  // Paso 3 — condiciones de cuidado
  await pillInGroup(page, "relación con el recién nacido", "Madre");
  await pillInGroup(page, "primera vez cuidando", "Sí");
  await pillInGroup(page, "sin apoyo constante", "No");
  await typeHuman(page, 'input[name="numeroNinosCuidado"]', "1");
  await pillInGroup(page, "apoyo familiar", "Sí");
  await pillInGroup(page, "apoya principalmente", "Pareja");
  await clickSiguiente(page);

  // Paso 4 — bebé
  await typeHuman(page, 'input[name="nombreBebe"]', DEMO.bebe);
  await typeHuman(page, 'input[name="fechaNacimiento"]', fechaNacimientoBebe());
  await pillInGroup(page, "Sexo", "Masculino");
  await typeHuman(page, 'input[name="pesoNacer"]', DEMO.peso);
  await typeHuman(page, 'input[name="edadGestacional"]', DEMO.gestacional);
  await clickSiguiente(page);

  // Paso 5 — clínico
  await pillInGroup(page, "Tipo de parto", "Vaginal");
  await pillInGroup(page, "complicaciones al nacer", "No");
  await pillInGroup(page, "hospitalización neonatal", "No");
  await pillInGroup(page, "cuidados especiales", "No");
  await clickSiguiente(page);

  // Paso 6 — consentimiento
  await page.locator(".consent-checkbox input[type=checkbox]").check();
  await wait(400);
  await clickSiguiente(page);

  await page.waitForURL(/\/evaluacion/, { timeout: 30000 });
  console.log("   ✓ Registro OK → /evaluacion");
}

async function runEvaluation(page) {
  await log("EVA", "Evaluación de riesgo");
  await page.getByRole("button", { name: /Realizar evaluación/i }).click();
  await page.waitForURL(/\/resultado/, { timeout: 15000 });
  await wait(1500);
  console.log("   ✓ Evaluación OK → /resultado");
}

async function runContact(page) {
  await log("1", "Contacto");
  await page.goto(`${BASE}/contacto`);
  await wait(600);
  await typeHuman(page, 'input[name="nombre"]', "Visitante Demo");
  await typeHuman(page, 'input[name="correo"]', "contacto@neocare.test");
  await typeHuman(page, 'input[name="telefono"]', "04140001122");
  await page.selectOption('select[name="asunto"]', "proyecto");
  await typeHuman(page, 'textarea[name="mensaje"]', "Mensaje de prueba automática NeoCare demo.");
  await page.getByRole("button", { name: /Enviar mensaje/i }).click();
  await wait(2000);
}

async function runTestimonios(page) {
  await log("2", "Testimonios");
  await page.goto(`${BASE}/testimonios`);
  await wait(2000);
}

async function runEducation(page) {
  await log("EDU", "Educación");
  await page.goto(`${BASE}/educacion`);
  await page.waitForResponse((r) => r.url().includes("/api/educacion") && r.ok(), { timeout: 15000 }).catch(() => {});
  await wait(2000);
  const firstTopic = page.locator(".education-topic-card, .topic-card, a[href*='/educacion/tema/']").first();
  if (await firstTopic.count()) {
    await firstTopic.click();
    await wait(2000);
  }
}

async function runBebes(page) {
  await log("BEB", "Lista y detalle de bebés");
  await page.goto(`${BASE}/bebes`);
  await page.waitForResponse((r) => r.url().includes("/api/bebes") && r.ok(), { timeout: 15000 }).catch(() => {});
  await wait(1500);
  const card = page.locator(".bebe-card").first();
  if (await card.count()) {
    await card.click();
    await wait(2500);
  }
}

async function runDiario(page) {
  await log("DIA", "Diario emocional");
  await page.goto(`${BASE}/diario`);
  await wait(1000);
  await typeHuman(page, ".neo-form textarea", "Hoy me siento bien cuidando a mi bebé. Demo automática.");
  await page.getByRole("button", { name: /Guardar entrada/i }).click();
  await wait(2000);
}

async function runEpds(page) {
  await log("EPDS", "Cuestionario EPDS");
  await page.goto(`${BASE}/epds`);
  await wait(1000);
  for (let i = 1; i <= 10; i++) {
    await page.selectOption(`#p${i}`, "0");
    await wait(120);
  }
  await page.getByRole("button", { name: /Enviar|Guardar|Calcular/i }).click();
  await wait(2000);
}

async function runProfile(page) {
  await log("PER", "Perfil");
  await page.goto(`${BASE}/perfil`);
  await wait(2000);
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log(" NeoCare — Demo visual UI");
  console.log(` URL: ${BASE}  |  slow: ${SLOW}ms`);
  console.log(` Usuario demo: ${DEMO.correo} / ${DEMO.password}`);
  console.log("═══════════════════════════════════════");

  const browser = await chromium.launch({
    headless: false,
    slowMo: 80,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  try {
    if (FROM === "contacto") {
      await runContact(page);
      await runTestimonios(page);
    }

    await runRegister(page);
    await runEvaluation(page);
    await runEducation(page);
    await runBebes(page);
    await runDiario(page);
    await runEpds(page);
    await runProfile(page);

    console.log("\n✅ Demo completada.");
    console.log(`   Login manual: ${DEMO.correo} / ${DEMO.password}`);
    console.log("   El navegador permanece abierto 15s para revisar...");
    await wait(15000);
  } catch (err) {
    console.error("\n❌ Error en demo:", err.message);
    console.log("   Revisa que backend (4000) y frontend (5173) estén activos.");
    await wait(10000);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
