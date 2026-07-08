-- ============================================================================
-- SCHEMA POSTGRESQL - NEOCARE
-- Base de datos para control emocional materno y cuidado del recién nacido
-- ============================================================================

-- IMPORTANTE:
-- Este script reinicia las tablas principales del sistema.
-- Si tienes datos de prueba guardados, se eliminarán al ejecutarlo.

DROP TABLE IF EXISTS seguimiento_diario_neonato CASCADE;
DROP TABLE IF EXISTS vacunacion_neonato CASCADE;
DROP TABLE IF EXISTS controles_nino_sano CASCADE;
DROP TABLE IF EXISTS bitacora_cuidado_bebe CASCADE;
DROP TABLE IF EXISTS evaluaciones_riesgo_bebe CASCADE;
DROP TABLE IF EXISTS evaluaciones_riesgo_registro CASCADE;
DROP TABLE IF EXISTS evaluaciones_epds CASCADE;
DROP TABLE IF EXISTS bitacora_emocional CASCADE;
DROP TABLE IF EXISTS notificaciones_alertas CASCADE;
DROP TABLE IF EXISTS biblioteca_educativa CASCADE;
DROP TABLE IF EXISTS contacto_mensajes CASCADE;
DROP TABLE IF EXISTS testimonios CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS recien_nacidos CASCADE;
DROP TABLE IF EXISTS madres_cuidadores CASCADE;

-- ============================================================================
-- FUNCIÓN AUXILIAR PARA COMPATIBILIDAD CON authController.js
-- El controller usa datetime(expira_en) y datetime('now').
-- Esta función evita error en PostgreSQL.
-- ============================================================================

CREATE OR REPLACE FUNCTION datetime(value TEXT)
RETURNS TIMESTAMP AS $$
  SELECT CASE
    WHEN lower(value) = 'now' THEN CURRENT_TIMESTAMP
    ELSE value::timestamp
  END;
$$ LANGUAGE SQL STABLE;

-- ============================================================================
-- TABLA: madres_cuidadores
-- ============================================================================

CREATE TABLE madres_cuidadores (
    id SERIAL PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL
        CONSTRAINT chk_nombre_madre CHECK (char_length(TRIM(nombre)) >= 2),

    edad INTEGER NOT NULL
        CONSTRAINT chk_edad CHECK (edad BETWEEN 12 AND 60),

    telefono VARCHAR(15) NOT NULL
        CONSTRAINT chk_telefono CHECK (telefono ~ '^\d{10,15}$'),

    correo_electronico VARCHAR(255) NOT NULL
        CONSTRAINT chk_correo CHECK (
            correo_electronico ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}$'
        ),

    contrasena_hash VARCHAR(255) NOT NULL,

    numero_identificacion VARCHAR(30) NOT NULL,

    nivel_educacion VARCHAR(20) NOT NULL
        CONSTRAINT chk_educacion CHECK (
            nivel_educacion IN ('Ninguno', 'Básico', 'Básica', 'Secundaria', 'Medio', 'Superior')
        ),

    zona_residencia VARCHAR(10) NOT NULL
        CONSTRAINT chk_residencia CHECK (zona_residencia IN ('Urbana', 'Rural')),

    acceso_centro_salud BOOLEAN NOT NULL,

    situacion_economica VARCHAR(15) NOT NULL
        CONSTRAINT chk_situacion_economica CHECK (
            situacion_economica IN ('Baja', 'Media', 'Alta', 'Estable')
        ),

    relacion_bebe VARCHAR(50) NOT NULL,

    numero_hijos INTEGER NOT NULL
        CONSTRAINT chk_numero_hijos CHECK (numero_hijos BETWEEN 0 AND 10),

    tiene_dos_o_mas_hijos BOOLEAN NOT NULL,
    es_madre_sola BOOLEAN NOT NULL,
    tiene_apoyo_familiar BOOLEAN NOT NULL,

    apoyo_principal VARCHAR(50),

    es_madre_primeriza BOOLEAN NOT NULL,

    aceptacion_terminos BOOLEAN NOT NULL
        CONSTRAINT chk_consentimiento CHECK (aceptacion_terminos = TRUE),

    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_madres_correo UNIQUE (correo_electronico),
    CONSTRAINT uq_madres_identificacion UNIQUE (numero_identificacion),

    CONSTRAINT chk_consistencia_dos_hijos CHECK (
        (numero_hijos >= 2 AND tiene_dos_o_mas_hijos = TRUE) OR
        (numero_hijos < 2 AND tiene_dos_o_mas_hijos = FALSE)
    ),

    CONSTRAINT chk_consistencia_primeriza CHECK (
        (es_madre_primeriza = TRUE AND numero_hijos <= 1) OR
        (es_madre_primeriza = FALSE OR numero_hijos >= 0)
    )
);

CREATE INDEX idx_madres_telefono ON madres_cuidadores(telefono);
CREATE INDEX idx_madres_correo_lower ON madres_cuidadores(LOWER(correo_electronico));

-- ============================================================================
-- TABLA: recien_nacidos
-- ============================================================================

CREATE TABLE recien_nacidos (
    id SERIAL PRIMARY KEY,

    madre_id INTEGER NOT NULL,

    nombre_bebe VARCHAR(150) NOT NULL
        CONSTRAINT chk_nombre_bebe CHECK (char_length(TRIM(nombre_bebe)) >= 2),

    fecha_nacimiento DATE NOT NULL
        CONSTRAINT chk_fecha_nacimiento CHECK (fecha_nacimiento <= CURRENT_DATE),

    peso_al_nacer NUMERIC(3,2) NOT NULL
        CONSTRAINT chk_peso CHECK (peso_al_nacer BETWEEN 0.50 AND 6.00),

    edad_gestacional INTEGER NOT NULL
        CONSTRAINT chk_edad_gestacional CHECK (edad_gestacional BETWEEN 20 AND 45),

    sexo VARCHAR(10) NOT NULL
        CONSTRAINT chk_sexo CHECK (sexo IN ('Masculino', 'Femenino', 'M', 'F')),

    tipo_parto VARCHAR(30) NOT NULL
        CONSTRAINT chk_tipo_parto CHECK (
            tipo_parto IN ('Vaginal', 'Cesárea', 'Vaginal instrumentado')
        ),

    complicaciones_al_nacer BOOLEAN NOT NULL,

    especificacion_complicaciones TEXT,

    hospitalizacion_neonatal BOOLEAN NOT NULL,

    motivo_hospitalizacion TEXT,

    duracion_hospitalizacion VARCHAR(50),

    requirio_cuidados_especiales VARCHAR(20),

    tipo_cuidado_recibido VARCHAR(100),

    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_madre_recien_nacido FOREIGN KEY (madre_id)
        REFERENCES madres_cuidadores(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_especificacion_complicaciones CHECK (
        (complicaciones_al_nacer = TRUE
            AND especificacion_complicaciones IS NOT NULL
            AND char_length(trim(especificacion_complicaciones)) >= 2)
        OR
        (complicaciones_al_nacer = FALSE
            AND (especificacion_complicaciones IS NULL
            OR char_length(trim(especificacion_complicaciones)) = 0))
    )
);

CREATE INDEX idx_recien_nacidos_madre ON recien_nacidos(madre_id);

-- ============================================================================
-- TABLA: evaluaciones_riesgo_registro
-- Evaluación inicial generada al completar el registro
-- ============================================================================

CREATE TABLE evaluaciones_riesgo_registro (
    id SERIAL PRIMARY KEY,

    madre_id INTEGER NOT NULL,
    bebe_id INTEGER NOT NULL,

    fecha_evaluacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    puntaje_materno INTEGER NOT NULL DEFAULT 0,

    clasificacion_materna VARCHAR(15) NOT NULL
        CONSTRAINT chk_eval_reg_materna CHECK (
            clasificacion_materna IN ('Bajo', 'Medio', 'Moderado', 'Alto')
        ),

    puntaje_neonatal INTEGER NOT NULL DEFAULT 0,

    clasificacion_neonatal VARCHAR(15) NOT NULL
        CONSTRAINT chk_eval_reg_neonatal CHECK (
            clasificacion_neonatal IN ('Bajo', 'Medio', 'Moderado', 'Alto')
        ),

    clasificacion_final VARCHAR(15) NOT NULL
        CONSTRAINT chk_eval_reg_final CHECK (
            clasificacion_final IN ('Bajo', 'Medio', 'Moderado', 'Alto')
        ),

    recomendacion_seguimiento TEXT,

    CONSTRAINT fk_eval_reg_madre FOREIGN KEY (madre_id)
        REFERENCES madres_cuidadores(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_eval_reg_bebe FOREIGN KEY (bebe_id)
        REFERENCES recien_nacidos(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_eval_reg_madre ON evaluaciones_riesgo_registro(madre_id);
CREATE INDEX idx_eval_reg_bebe ON evaluaciones_riesgo_registro(bebe_id);
CREATE INDEX idx_eval_reg_fecha ON evaluaciones_riesgo_registro(fecha_evaluacion);

-- ============================================================================
-- TABLA: evaluaciones_riesgo_bebe
-- Triaje neonatal
-- ============================================================================

CREATE TABLE evaluaciones_riesgo_bebe (
    id SERIAL PRIMARY KEY,

    bebe_id INTEGER NOT NULL,
    madre_id INTEGER NOT NULL,

    fecha_evaluacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    convulsiones BOOLEAN NOT NULL,
    dificultad_respiratoria BOOLEAN NOT NULL,
    coloracion_azulada BOOLEAN NOT NULL,
    fiebre_hipotermia BOOLEAN NOT NULL,
    rechazo_alimentacion BOOLEAN NOT NULL,
    disminucion_conciencia BOOLEAN NOT NULL,

    vomitos_repetitivos BOOLEAN NOT NULL,
    ictericia_progresiva BOOLEAN NOT NULL,
    disminucion_actividad BOOLEAN NOT NULL,
    llanto_persistente BOOLEAN NOT NULL,

    alteraciones_sueno BOOLEAN NOT NULL,
    disminucion_apetito BOOLEAN NOT NULL,
    irritabilidad_ocasional BOOLEAN NOT NULL,

    puntuacion_total INTEGER NOT NULL
        CONSTRAINT chk_total_riesgo CHECK (puntuacion_total BETWEEN 0 AND 29),

    nivel_riesgo VARCHAR(15) NOT NULL
        CONSTRAINT chk_nivel_riesgo CHECK (nivel_riesgo IN ('Bajo', 'Moderado', 'Alto')),

    CONSTRAINT fk_bebe_riesgo FOREIGN KEY (bebe_id)
        REFERENCES recien_nacidos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_madre_riesgo_bebe FOREIGN KEY (madre_id)
        REFERENCES madres_cuidadores(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_consistencia_puntuacion CHECK (
        puntuacion_total = (
            (CASE WHEN convulsiones THEN 3 ELSE 0 END) +
            (CASE WHEN dificultad_respiratoria THEN 3 ELSE 0 END) +
            (CASE WHEN coloracion_azulada THEN 3 ELSE 0 END) +
            (CASE WHEN fiebre_hipotermia THEN 3 ELSE 0 END) +
            (CASE WHEN rechazo_alimentacion THEN 3 ELSE 0 END) +
            (CASE WHEN disminucion_conciencia THEN 3 ELSE 0 END) +
            (CASE WHEN vomitos_repetitivos THEN 2 ELSE 0 END) +
            (CASE WHEN ictericia_progresiva THEN 2 ELSE 0 END) +
            (CASE WHEN disminucion_actividad THEN 2 ELSE 0 END) +
            (CASE WHEN llanto_persistente THEN 2 ELSE 0 END) +
            (CASE WHEN alteraciones_sueno THEN 1 ELSE 0 END) +
            (CASE WHEN disminucion_apetito THEN 1 ELSE 0 END) +
            (CASE WHEN irritabilidad_ocasional THEN 1 ELSE 0 END)
        )
    ),

    CONSTRAINT chk_consistencia_nivel CHECK (
        (
            nivel_riesgo = 'Alto'
            AND (
                convulsiones = TRUE OR
                dificultad_respiratoria = TRUE OR
                coloracion_azulada = TRUE OR
                fiebre_hipotermia = TRUE OR
                rechazo_alimentacion = TRUE OR
                disminucion_conciencia = TRUE OR
                puntuacion_total >= 6
            )
        )
        OR
        (
            nivel_riesgo = 'Moderado'
            AND puntuacion_total BETWEEN 3 AND 5
            AND convulsiones = FALSE
            AND dificultad_respiratoria = FALSE
            AND coloracion_azulada = FALSE
            AND fiebre_hipotermia = FALSE
            AND rechazo_alimentacion = FALSE
            AND disminucion_conciencia = FALSE
        )
        OR
        (
            nivel_riesgo = 'Bajo'
            AND puntuacion_total BETWEEN 0 AND 2
            AND convulsiones = FALSE
            AND dificultad_respiratoria = FALSE
            AND coloracion_azulada = FALSE
            AND fiebre_hipotermia = FALSE
            AND rechazo_alimentacion = FALSE
            AND disminucion_conciencia = FALSE
        )
    )
);

CREATE INDEX idx_evaluaciones_riesgo_bebe_bebe ON evaluaciones_riesgo_bebe(bebe_id);
CREATE INDEX idx_evaluaciones_riesgo_bebe_madre ON evaluaciones_riesgo_bebe(madre_id);
CREATE INDEX idx_evaluaciones_riesgo_bebe_fecha ON evaluaciones_riesgo_bebe(fecha_evaluacion);

-- ============================================================================
-- TABLA: seguimiento_diario_neonato
-- ============================================================================

CREATE TABLE seguimiento_diario_neonato (
    id SERIAL PRIMARY KEY,

    bebe_id INTEGER NOT NULL,
    madre_id INTEGER NOT NULL,
    evaluacion_riesgo_id INTEGER NOT NULL,

    dia_seguimiento INTEGER NOT NULL
        CONSTRAINT chk_seg_dia CHECK (dia_seguimiento BETWEEN 1 AND 5),

    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    alimentacion_normal VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_alim_norm CHECK (alimentacion_normal IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    alimentacion_rechazo VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_alim_rech CHECK (alimentacion_rechazo IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    temperatura_fiebre VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_temp_fieb CHECK (temperatura_fiebre IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    temperatura_frio VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_temp_frio CHECK (temperatura_frio IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    actividad_normal VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_act_norm CHECK (actividad_normal IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    actividad_letargo VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_act_let CHECK (actividad_letargo IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    respiracion_normal VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_resp_norm CHECK (respiracion_normal IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    respiracion_dificultad VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_resp_dific CHECK (respiracion_dificultad IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    piel_normal VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_piel_norm CHECK (piel_normal IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    piel_alteracion VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_piel_alt CHECK (piel_alteracion IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    eliminacion_panales VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_elim_pan CHECK (eliminacion_panales IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    eliminacion_deposiciones VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_elim_dep CHECK (eliminacion_deposiciones IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    llanto_normal VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_llanto_norm CHECK (llanto_normal IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    llanto_alteracion VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_llanto_alt CHECK (llanto_alteracion IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    alarma_convulsiones VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_conv CHECK (alarma_convulsiones IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    alarma_vomito VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_vom CHECK (alarma_vomito IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    alarma_empeoramiento VARCHAR(15) NOT NULL
        CONSTRAINT chk_seg_empeoro CHECK (alarma_empeoramiento IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),

    resultado_evolucion VARCHAR(10) NOT NULL
        CONSTRAINT chk_seg_resultado CHECK (resultado_evolucion IN ('Verde', 'Amarillo', 'Rojo')),

    CONSTRAINT fk_bebe_seguimiento FOREIGN KEY (bebe_id)
        REFERENCES recien_nacidos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_madre_seguimiento FOREIGN KEY (madre_id)
        REFERENCES madres_cuidadores(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_triaje_seguimiento FOREIGN KEY (evaluacion_riesgo_id)
        REFERENCES evaluaciones_riesgo_bebe(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_bebe_dia_triaje UNIQUE (evaluacion_riesgo_id, dia_seguimiento)
);

CREATE INDEX idx_seguimiento_diario_bebe ON seguimiento_diario_neonato(bebe_id);
CREATE INDEX idx_seguimiento_diario_madre ON seguimiento_diario_neonato(madre_id);
CREATE INDEX idx_seguimiento_diario_triaje ON seguimiento_diario_neonato(evaluacion_riesgo_id);

-- ============================================================================
-- TABLA: vacunacion_neonato
-- ============================================================================

CREATE TABLE vacunacion_neonato (
    id SERIAL PRIMARY KEY,

    bebe_id INTEGER NOT NULL,

    nombre_vacuna VARCHAR(100) NOT NULL
        CONSTRAINT chk_vac_nombre CHECK (char_length(TRIM(nombre_vacuna)) >= 2),

    dosis VARCHAR(50) NOT NULL,

    fecha_programada DATE NOT NULL,

    fecha_aplicacion DATE
        CONSTRAINT chk_vac_fecha CHECK (
            fecha_aplicacion IS NULL OR fecha_aplicacion <= CURRENT_DATE
        ),

    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
        CONSTRAINT chk_vac_estado CHECK (estado IN ('Pendiente', 'Aplicada', 'Atrasada')),

    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bebe_vacunacion FOREIGN KEY (bebe_id)
        REFERENCES recien_nacidos(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_vacunacion_neonato_bebe ON vacunacion_neonato(bebe_id);

-- ============================================================================
-- TABLA: controles_nino_sano
-- ============================================================================

CREATE TABLE controles_nino_sano (
    id SERIAL PRIMARY KEY,

    bebe_id INTEGER NOT NULL,
    madre_id INTEGER NOT NULL,

    fecha_control DATE NOT NULL
        CONSTRAINT chk_control_fecha CHECK (fecha_control <= CURRENT_DATE),

    peso_kg NUMERIC(4,2) NOT NULL
        CONSTRAINT chk_control_peso CHECK (peso_kg BETWEEN 1.00 AND 25.00),

    talla_cm NUMERIC(4,1) NOT NULL
        CONSTRAINT chk_control_talla CHECK (talla_cm BETWEEN 30.0 AND 120.0),

    perimetro_cefalico_cm NUMERIC(4,1) NOT NULL
        CONSTRAINT chk_control_pc CHECK (perimetro_cefalico_cm BETWEEN 25.0 AND 60.0),

    observaciones TEXT,

    estado VARCHAR(20) NOT NULL DEFAULT 'Programado'
        CONSTRAINT chk_control_estado CHECK (estado IN ('Programado', 'Realizado', 'Cancelado')),

    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bebe_control FOREIGN KEY (bebe_id)
        REFERENCES recien_nacidos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_madre_control FOREIGN KEY (madre_id)
        REFERENCES madres_cuidadores(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_controles_nino_sano_bebe ON controles_nino_sano(bebe_id);
CREATE INDEX idx_controles_nino_sano_madre ON controles_nino_sano(madre_id);

-- ============================================================================
-- TABLA: bitacora_cuidado_bebe
-- ============================================================================

CREATE TABLE bitacora_cuidado_bebe (
    id SERIAL PRIMARY KEY,

    bebe_id INTEGER NOT NULL,
    madre_id INTEGER NOT NULL,

    tipo_registro VARCHAR(50) NOT NULL,
    detalles TEXT,
    observaciones TEXT,

    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bitacora_bebe FOREIGN KEY (bebe_id)
        REFERENCES recien_nacidos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_bitacora_madre FOREIGN KEY (madre_id)
        REFERENCES madres_cuidadores(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_bitacora_cuidado_bebe ON bitacora_cuidado_bebe(bebe_id);
CREATE INDEX idx_bitacora_cuidado_madre ON bitacora_cuidado_bebe(madre_id);

-- ============================================================================
-- TABLA: bitacora_emocional
-- ============================================================================

CREATE TABLE bitacora_emocional (
    id SERIAL PRIMARY KEY,

    madre_id INTEGER NOT NULL,

    nivel_animo INTEGER NOT NULL
        CONSTRAINT chk_nivel_animo CHECK (nivel_animo BETWEEN 1 AND 5),

    nivel_ansiedad INTEGER NOT NULL
        CONSTRAINT chk_nivel_ansiedad CHECK (nivel_ansiedad BETWEEN 1 AND 5),

    nivel_cansancio INTEGER NOT NULL
        CONSTRAINT chk_nivel_cansancio CHECK (nivel_cansancio BETWEEN 1 AND 5),

    puntaje_simple INTEGER NOT NULL
        CONSTRAINT chk_puntaje_emocional CHECK (puntaje_simple BETWEEN 3 AND 15),

    nota_diaria TEXT,
    sintomas_fisicos TEXT,

    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_emocional_madre FOREIGN KEY (madre_id)
        REFERENCES madres_cuidadores(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_bitacora_emocional_madre ON bitacora_emocional(madre_id);
CREATE INDEX idx_bitacora_emocional_fecha ON bitacora_emocional(fecha_registro);

-- ============================================================================
-- TABLA: evaluaciones_epds
-- ============================================================================

CREATE TABLE evaluaciones_epds (
    id SERIAL PRIMARY KEY,

    madre_id INTEGER NOT NULL,

    p1 INTEGER NOT NULL CHECK (p1 BETWEEN 0 AND 3),
    p2 INTEGER NOT NULL CHECK (p2 BETWEEN 0 AND 3),
    p3 INTEGER NOT NULL CHECK (p3 BETWEEN 0 AND 3),
    p4 INTEGER NOT NULL CHECK (p4 BETWEEN 0 AND 3),
    p5 INTEGER NOT NULL CHECK (p5 BETWEEN 0 AND 3),
    p6 INTEGER NOT NULL CHECK (p6 BETWEEN 0 AND 3),
    p7 INTEGER NOT NULL CHECK (p7 BETWEEN 0 AND 3),
    p8 INTEGER NOT NULL CHECK (p8 BETWEEN 0 AND 3),
    p9 INTEGER NOT NULL CHECK (p9 BETWEEN 0 AND 3),
    p10 INTEGER NOT NULL CHECK (p10 BETWEEN 0 AND 3),

    puntuacion_total INTEGER NOT NULL
        CONSTRAINT chk_epds_total CHECK (puntuacion_total BETWEEN 0 AND 30),

    clasificacion VARCHAR(20) NOT NULL
        CONSTRAINT chk_epds_clasificacion CHECK (clasificacion IN ('Bajo', 'Moderado', 'Alto')),

    fecha_evaluacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_epds_madre FOREIGN KEY (madre_id)
        REFERENCES madres_cuidadores(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_epds_suma CHECK (
        puntuacion_total = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10
    )
);

CREATE INDEX idx_epds_madre ON evaluaciones_epds(madre_id);
CREATE INDEX idx_epds_fecha ON evaluaciones_epds(fecha_evaluacion);

-- ============================================================================
-- TABLA: notificaciones_alertas
-- ============================================================================

CREATE TABLE notificaciones_alertas (
    id SERIAL PRIMARY KEY,

    madre_id INTEGER NOT NULL,
    bebe_id INTEGER,

    tipo_alerta VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,

    leido BOOLEAN NOT NULL DEFAULT FALSE,

    fecha_envio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notif_madre FOREIGN KEY (madre_id)
        REFERENCES madres_cuidadores(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_notif_bebe FOREIGN KEY (bebe_id)
        REFERENCES recien_nacidos(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_notificaciones_madre ON notificaciones_alertas(madre_id);
CREATE INDEX idx_notificaciones_bebe ON notificaciones_alertas(bebe_id);
CREATE INDEX idx_notificaciones_fecha ON notificaciones_alertas(fecha_envio);

-- ============================================================================
-- TABLA: biblioteca_educativa
-- ============================================================================

CREATE TABLE biblioteca_educativa (
    id SERIAL PRIMARY KEY,

    titulo VARCHAR(150) NOT NULL,
    tema VARCHAR(100) NOT NULL,

    descripcion TEXT NOT NULL,
    recomendacion TEXT,

    nivel_alerta VARCHAR(20)
        CONSTRAINT chk_biblioteca_nivel CHECK (
            nivel_alerta IS NULL OR nivel_alerta IN ('Bajo', 'Moderado', 'Alto', 'General')
        ),

    url_recurso TEXT,
    fuente_referencia TEXT,

    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_biblioteca_tema ON biblioteca_educativa(tema);
CREATE INDEX idx_biblioteca_nivel ON biblioteca_educativa(nivel_alerta);

-- ============================================================================
-- TABLA: contacto_mensajes
-- ============================================================================

CREATE TABLE contacto_mensajes (
    id SERIAL PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),

    asunto VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,

    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacto_correo ON contacto_mensajes(correo);
CREATE INDEX idx_contacto_fecha ON contacto_mensajes(creado_en);

-- ============================================================================
-- TABLA: testimonios
-- ============================================================================

CREATE TABLE testimonios (
    id SERIAL PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL,
    contenido TEXT NOT NULL,
    etapa VARCHAR(100),

    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_testimonios_fecha ON testimonios(creado_en);

-- ============================================================================
-- TABLA: password_reset_tokens
-- ============================================================================

CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,

    madre_id INTEGER NOT NULL,

    token VARCHAR(255) NOT NULL UNIQUE,
    expira_en TEXT NOT NULL,

    usado INTEGER NOT NULL DEFAULT 0
        CONSTRAINT chk_reset_usado CHECK (usado IN (0, 1)),

    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reset_madre FOREIGN KEY (madre_id)
        REFERENCES madres_cuidadores(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_reset_madre ON password_reset_tokens(madre_id);

-- ============================================================================
-- DATOS INICIALES: biblioteca_educativa
-- ============================================================================

INSERT INTO biblioteca_educativa (
    titulo,
    tema,
    descripcion,
    recomendacion,
    nivel_alerta,
    url_recurso,
    fuente_referencia
) VALUES
(
    'Signos de alarma en el recién nacido',
    'Signos de alarma',
    'Información educativa sobre señales que requieren atención médica, como dificultad respiratoria, fiebre, rechazo de alimentación, convulsiones o coloración azulada.',
    'Si aparece algún signo de alarma, se recomienda acudir al centro de salud más cercano.',
    'Alto',
    NULL,
    'OMS/OPS'
),
(
    'Cuidados básicos del recién nacido',
    'Cuidados básicos',
    'Orientación general sobre higiene, alimentación, sueño seguro, control de temperatura y observación diaria del recién nacido.',
    'Mantener observación constante durante los primeros 28 días de vida.',
    'General',
    NULL,
    'OMS/OPS'
),
(
    'Lactancia materna',
    'Lactancia',
    'Guía educativa sobre la importancia de la lactancia materna, frecuencia de alimentación y señales de buena succión.',
    'Consultar con un profesional de salud si el bebé rechaza la alimentación o presenta signos de deshidratación.',
    'General',
    NULL,
    'OMS/UNICEF'
),
(
    'Control de temperatura',
    'Temperatura',
    'Información sobre fiebre, hipotermia y medidas básicas para mantener una temperatura adecuada en el recién nacido.',
    'Evitar la automedicación y buscar orientación médica ante fiebre o temperatura baja.',
    'Moderado',
    NULL,
    'OMS/OPS'
),
(
    'Ictericia neonatal',
    'Ictericia',
    'Contenido educativo sobre coloración amarilla de piel u ojos y cuándo debe ser evaluada por personal de salud.',
    'Acudir a consulta si la coloración amarilla aumenta o se acompaña de decaimiento.',
    'Moderado',
    NULL,
    'OMS/OPS'
),
(
    'Sepsis neonatal',
    'Sepsis',
    'Información sobre posibles signos de infección neonatal, como fiebre, hipotermia, letargo, rechazo alimentario o dificultad respiratoria.',
    'Ante sospecha de infección, buscar atención médica inmediata.',
    'Alto',
    NULL,
    'OMS/OPS'
),
(
    'Hipotermia en recién nacidos',
    'Hipotermia',
    'Orientación sobre signos de frío corporal, prevención y medidas de cuidado inicial.',
    'Si el bebé está frío, decaído o no se alimenta, acudir a un centro de salud.',
    'Alto',
    NULL,
    'OMS/OPS'
),
(
    'Cuándo acudir al médico',
    'Consulta médica',
    'Resumen de situaciones en las que se debe buscar ayuda médica durante el periodo neonatal.',
    'No esperar si hay dificultad respiratoria, convulsiones, fiebre, hipotermia o rechazo alimentario.',
    'General',
    NULL,
    'OMS/OPS'
);

-- ============================================================================
-- DATOS INICIALES: testimonios
-- ============================================================================

INSERT INTO testimonios (nombre, contenido, etapa) VALUES
(
    'María',
    'NeoCare me ayudó a reconocer señales importantes durante los primeros días de mi bebé.',
    'Madre primeriza'
),
(
    'Andrea',
    'La información educativa fue clara y me permitió sentirme más acompañada.',
    'Cuidadora'
),
(
    'Camila',
    'El registro de riesgo me orientó para saber cuándo debía consultar al médico.',
    'Madre'
);

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================