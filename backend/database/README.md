# Base de Datos: Control Emocional y Cuidado de Recién Nacidos

Este directorio contiene los scripts de base de datos estructurados para el proyecto de investigación enfocado en el **control emocional materno y cuidado de bebés recién nacidos**.

## 🛠️ Arquitectura de la Base de Datos

La base de datos se ha diseñado utilizando un enfoque relacional de **1 a Muchos (1:N)** entre la madre/cuidador y sus recién nacidos (ya que una madre puede registrar múltiples bebés o gemelos en el sistema).

### 1. Secciones Requeridas por los Investigadores

#### 👥 Tabla `madres_cuidadores` (Secciones A, B, C y F)
Agrupa toda la información de la madre o cuidador responsable.
- **Sección A (Datos Personales y Acceso):**
  - `nombre`: Texto libre (mínimo 2 caracteres).
  - `edad`: Entero validado entre 12 y 50 años.
  - `telefono`: Texto numérico exacto de 10 dígitos (controlado con Expresiones Regulares).
  - `correo_electronico`: Correo electrónico (validado sintácticamente con Expresión Regular).
  - `contrasena_hash`: Contraseña encriptada para el inicio de sesión.
  - `numero_identificacion`: Cédula o número de identificación.
- **Sección B (Sociodemográficos):**
  - `nivel_educacion`: Opciones ampliadas (`Ninguno`, `Básico`, `Básica`, `Secundaria`, `Medio`, `Superior`).
  - `zona_residencia`: Opciones restringidas (`Urbana`, `Rural`).
  - `acceso_centro_salud`: Campo booleano (Sí/No).
  - `situacion_economica`: Opciones ampliadas (`Baja`, `Media`, `Alta`, `Estable`).
- **Sección C (Condiciones de Cuidado):**
  - `relacion_bebe`: Relación con el recién nacido (`Madre`, `Padre`, `Abuela`, `Tía`, `Otro cuidador`).
  - `numero_hijos`: Entero validado entre 0 y 10.
  - `tiene_dos_o_mas_hijos`: Booleano (Sí/No).
  - `es_madre_sola`: Booleano (Sí/No).
  - `tiene_apoyo_familiar`: Booleano (Sí/No).
  - `apoyo_principal`: Quién brinda el apoyo principal (`Pareja`, `Familiar`, `Amiga/vecina`, `Personal de salud`, `Otro`).
  - `es_madre_primeriza`: Booleano (Sí/No).
- **Sección F (Consentimiento Informado):**
  - `aceptacion_terminos`: Booleano obligatorio (Debe ser `TRUE`/`1` obligatoriamente para existir en la base de datos).

#### 👶 Tabla `recien_nacidos` (Secciones D y E)
Agrupa la información específica del recién nacido y sus datos clínicos al nacer.
- **Sección D (Datos del Recién Nacido):**
  - `nombre_bebe`: Texto libre (mínimo 2 caracteres).
  - `fecha_nacimiento`: Fecha validada para no ser futura.
  - `peso_al_nacer`: Decimal validado entre 1.0 kg y 5.0 kg (el backend convertirá gramos a kilogramos automáticamente).
  - `edad_gestacional`: Entero validado entre 24 y 42 semanas.
  - `sexo`: Opciones restringidas (`Masculino`, `Femenino`).
- **Sección E (Datos Clínicos Neonatales):**
  - `tipo_parto`: Opciones ampliadas (`Vaginal`, `Cesárea`, `Vaginal instrumentado`).
  - `complicaciones_al_nacer`: Booleano (Sí/No).
  - `especificacion_complicaciones`: Texto libre. Requerido si responde "Sí" a complicaciones.
  - `hospitalizacion_neonatal`: Booleano (Sí/No).
  - `motivo_hospitalizacion`: Detalles del motivo de la hospitalización.
  - `duracion_hospitalizacion`: Duración aproximada (`1 día`, `2 a 3 días`, `Más de 3 días`).
  - `requirio_cuidados_especiales`: Si requirió cuidados especiales (`Sí`, `No`, `No lo sé`).
  - `tipo_cuidado_recibido`: Detalle del cuidado (`Oxígeno`, `Incubadora`, `Fototerapia`, `Antibióticos`, `Observación médica`, `Otro`).

---

## ⚡ Reglas de Validación Avanzadas (A nivel de SQL)

Para garantizar consistencia absoluta sin depender únicamente de la lógica de programación de la App, se implementaron restricciones `CHECK` avanzadas:

1. **Consistencia de Hijos:** 
   Si `numero_hijos` es mayor o igual a 2, el sistema obliga a que `tiene_dos_o_mas_hijos` sea verdadero (`TRUE`/`1`). De lo contrario, debe ser falso.
2. **Lógica de Complicaciones Clínicas:**
   Si `complicaciones_al_nacer` es verdadero, `especificacion_complicaciones` **no puede ser nulo o vacío** y debe tener al menos 2 caracteres. Si es falso, la especificación debe ser obligatoriamente nula o vacía.
3. **Validación de Expresión Regular para Teléfono y Email:**
   Garantiza a nivel de base de datos que el número móvil tenga exactamente 10 dígitos y que el email posea un dominio y formato estándar de correo electrónico.
4. **Consentimiento Obligatorio:**
   La fila no puede insertarse si la aceptación de términos es falsa.
5. **Cálculo y Consistencia de Riesgo Neonatal:**
   En la tabla `evaluaciones_riesgo_bebe`, se valida que `puntuacion_total` sea exactamente la suma ponderada de los signos de riesgo presentes (alto riesgo = 3 ptos, riesgo moderado = 2 ptos, bajo riesgo = 1 pto). Asimismo, obliga a que `nivel_riesgo` corresponda con la puntuación: Bajo (0-2 ptos), Moderado (3-5 ptos) y Alto (>=6 ptos).

---

## 🚀 Tablas Propuestas para Completar el Sistema

Para que la aplicación sea funcional en un entorno real de seguimiento y no solo un formulario de registro, el script incluye las siguientes tablas dinámicas sugeridas:

### 📈 Tabla `bitacora_emocional`
Permite a las madres llevar un registro diario de su salud mental.
- **Métricas cuantitativas (1-5):** Nivel de ánimo, nivel de ansiedad, nivel de cansancio.
- **Métricas cualitativas:** Notas/diario personal.
- **Sintomatología:** Almacena sintomatología en un campo semiestructurado `JSON` (ej. dolores físicos, llanto recurrente, etc.).

### 🧠 Tabla `evaluaciones_epds` (Escala de Edimburgo)
Implementación SQL para registrar los resultados de la **Escala de Depresión Posparto de Edimburgo (EPDS)**, un estándar clínico internacional de 10 preguntas.
- Registra cada respuesta (0-3 puntos).
- Realiza una validación `CHECK` para asegurar que el `puntuacion_total` sea idéntico a la suma de las 10 preguntas individuales.

### 🩺 Tabla `evaluaciones_riesgo_bebe` (Tamizaje de Riesgo Neonatal)
Implementación SQL para el registro y clasificación del nivel de riesgo en recién nacidos.
- **Signos de Alto Riesgo (3 puntos cada uno):** Convulsiones, dificultad respiratoria, coloración azulada, fiebre o hipotermia, rechazo completo de la alimentación y disminución del estado de conciencia.
- **Signos de Riesgo Moderado (2 puntos cada uno):** Vómitos repetitivos, ictericia progresiva, disminución de la actividad habitual y llanto persistente.
- **Signos de Bajo Riesgo (1 punto cada uno):** Alteraciones leves del sueño, disminución leve del apetito e irritabilidad ocasional.
- Enforza consistencia a nivel de base de datos entre los signos activos, la puntuación total acumulada y el nivel de riesgo resultante (Verde/Bajo, Amarillo/Moderado, Rojo/Alto).

### 🍼 Tabla `bitacora_cuidado_bebe`
Permite registrar actividades clave para el cuidado neonatal:
- **Alimentación:** Frecuencia, tipo (lactancia materna, fórmula) y volumen.
- **Sueño:** Horas de sueño y calidad.
- **Pañales:** Frecuencia y consistencia.
- Utiliza la estructura flexible de datos `JSON` para no sobrecargar el servidor con tablas relacionales redundantes.

### 📚 Tabla `biblioteca_educativa`
Repositorio de recursos y guías de educación basadas en recomendaciones de la OMS/OPS.
- Almacena títulos, temas (Lactancia Materna, Control Temperatura, Ictericia, etc.), fuentes de referencia y URLs.
- Restringido con validaciones de URL e integridad para garantizar fuentes oficiales.

### 📅 Tabla `seguimiento_diario_neonato`
Módulo de monitoreo post-triaje para recién nacidos con signos reportados.
- Realiza el seguimiento estructurado por 5 días consecutivos en alimentación, temperatura, respiración, coloración de piel, eliminación, llanto y estado general.
- Escala de respuesta controlada por base de datos: `Mejoró`, `Igual`, `Empeoró`, `Sí`, `No`.
- Resultado de evolución final clasificado en semáforo (`Verde`, `Amarillo`, `Rojo`).

### 💉 Tabla `vacunacion_neonato`
Registro del calendario de vacunación e inmunización nacional.
- Registra el nombre de la vacuna, dosis aplicada, fecha programada, fecha de aplicación y estado (`Pendiente`, `Aplicada`, `Atrasada`).

### 🩺 Tabla `controles_nino_sano`
Seguimiento periódico de crecimiento y desarrollo del bebé.
- Registra el control pediátrico de peso (kg), talla (cm) y perímetro cefálico (cm).
- Restringe rangos clínicamente aceptables de desarrollo neonatal (ej. peso entre 1 y 25 kg, talla entre 30 y 120 cm).

### 🔔 Tabla `notificaciones_alertas`
Historial y despacho de alertas y notificaciones push.
- Clasifica las notificaciones según su tipo: recordatorios de vacunación (7, 3, 1 días antes), reevaluación de triaje amarillo/rojo, o pautas educativas.

---

## 💡 Recomendación para el Entorno de Trabajo
Dado que estás desarrollando este proyecto, te sugerimos abrir este directorio como tu espacio de trabajo en tu IDE para facilitar el desarrollo de backend, migraciones o testing.
