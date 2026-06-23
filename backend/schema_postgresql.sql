-- ============================================================================
-- SCRIPT DE BASE DE DATOS: APP DE CONTROL EMOCIONAL Y CUIDADO DEL RECIÉN NACIDO
-- Motor de Base de Datos: PostgreSQL (versión 12 o superior)
-- ============================================================================

-- ============================================================================
-- 1. ESTRUCTURA PRINCIPAL (REQUERIDA POR INVESTIGADORES)
-- ============================================================================

-- Tabla: madres_cuidadores
-- Almacena la información de la sección A, B, C y F.
CREATE TABLE madres_cuidadores (
    id SERIAL PRIMARY KEY,
    
    -- 🔹 Sección A: Datos personales de la madre o cuidador
    nombre VARCHAR(150) NOT NULL CONSTRAINT chk_nombre_madre CHECK (char_length(TRIM(nombre)) >= 2),
    edad INTEGER NOT NULL CONSTRAINT chk_edad CHECK (edad BETWEEN 12 AND 60),
    telefono VARCHAR(15) NOT NULL CONSTRAINT chk_telefono CHECK (telefono ~ '^\d{10,15}$'),
    correo_electronico VARCHAR(255) NOT NULL CONSTRAINT chk_correo CHECK (correo_electronico ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
    contrasena_hash VARCHAR(255) NOT NULL,
    numero_identificacion VARCHAR(30) NOT NULL,
    
    -- 🔹 Sección B: Datos sociodemográficos
    nivel_educacion VARCHAR(20) NOT NULL CONSTRAINT chk_educacion CHECK (nivel_educacion IN ('Ninguno', 'Básico', 'Básica', 'Secundaria', 'Medio', 'Superior')),
    zona_residencia VARCHAR(10) NOT NULL CONSTRAINT chk_residencia CHECK (zona_residencia IN ('Urbana', 'Rural')),
    acceso_centro_salud BOOLEAN NOT NULL, -- TRUE = Sí, FALSE = No
    situacion_economica VARCHAR(15) NOT NULL CONSTRAINT chk_situacion_economica CHECK (situacion_economica IN ('Baja', 'Media', 'Alta', 'Estable')),
    
    -- 🔹 Sección C: Condiciones de cuidado
    relacion_bebe VARCHAR(50) NOT NULL,
    numero_hijos INTEGER NOT NULL CONSTRAINT chk_numero_hijos CHECK (numero_hijos BETWEEN 0 AND 10),
    tiene_dos_o_mas_hijos BOOLEAN NOT NULL,
    es_madre_sola BOOLEAN NOT NULL,
    tiene_apoyo_familiar BOOLEAN NOT NULL,
    apoyo_principal VARCHAR(50) NOT NULL,
    es_madre_primeriza BOOLEAN NOT NULL,
    
    -- 🔹 Sección F: Consentimiento informado
    aceptacion_terminos BOOLEAN NOT NULL CONSTRAINT chk_consentimiento CHECK (aceptacion_terminos = TRUE),
    
    -- Campos de control/auditoría
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 
    -- Restricciones de integridad de negocio lógicas
    -- 1. Validar que "tiene_dos_o_mas_hijos" sea consistente con "numero_hijos"
    CONSTRAINT chk_consistencia_dos_hijos CHECK (
        (numero_hijos >= 2 AND tiene_dos_o_mas_hijos = TRUE) OR 
        (numero_hijos < 2 AND tiene_dos_o_mas_hijos = FALSE)
    ),
    
    -- 2. Validar que si es madre primeriza, no tenga un número de hijos inconsistente (usualmente 1 si ya nació o 0 si está embarazada)
    CONSTRAINT chk_consistencia_primeriza CHECK (
        (es_madre_primeriza = TRUE AND numero_hijos <= 1) OR 
        (es_madre_primeriza = FALSE OR numero_hijos >= 0)
    )
);

-- Tabla: recien_nacidos
-- Almacena la información de la sección D y E.
CREATE TABLE recien_nacidos (
    id SERIAL PRIMARY KEY,
    madre_id INTEGER NOT NULL,
    
    -- 🔹 Sección D: Datos del recién nacido
    nombre_bebe VARCHAR(150) NOT NULL CONSTRAINT chk_nombre_bebe CHECK (char_length(TRIM(nombre_bebe)) >= 2),
    fecha_nacimiento DATE NOT NULL CONSTRAINT chk_fecha_nacimiento CHECK (fecha_nacimiento <= CURRENT_DATE),
    peso_al_nacer NUMERIC(3,2) NOT NULL CONSTRAINT chk_peso CHECK (peso_al_nacer BETWEEN 0.5 AND 6.0),
    edad_gestacional INTEGER NOT NULL CONSTRAINT chk_edad_gestacional CHECK (edad_gestacional BETWEEN 20 AND 45),
    sexo VARCHAR(10) NOT NULL CONSTRAINT chk_sexo CHECK (sexo IN ('Masculino', 'Femenino')),
    
    -- 🔹 Sección E: Datos clínicos neonatales
    tipo_parto VARCHAR(30) NOT NULL CONSTRAINT chk_tipo_parto CHECK (tipo_parto IN ('Vaginal', 'Cesárea', 'Vaginal instrumentado')),
    complicaciones_al_nacer BOOLEAN NOT NULL,
    especificacion_complicaciones TEXT,
    hospitalizacion_neonatal BOOLEAN NOT NULL,
    motivo_hospitalizacion TEXT,
    duracion_hospitalizacion VARCHAR(50),
    requirio_cuidados_especiales VARCHAR(20),
    tipo_cuidado_recibido VARCHAR(100),
    
    -- Campos de control/auditoría
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Llave foránea que asocia al recién nacido con su madre
    CONSTRAINT fk_madre_recien_nacido FOREIGN KEY (madre_id) 
        REFERENCES madres_cuidadores(id) 
        ON DELETE CASCADE,
        
    -- Restricción de integridad: especificación de complicaciones es requerida si y solo si complicaciones_al_nacer es TRUE
    CONSTRAINT chk_especificacion_complicaciones CHECK (
        (complicaciones_al_nacer = TRUE AND especificacion_complicaciones IS NOT NULL AND char_length(trim(especificacion_complicaciones)) >= 2) OR 
        (complicaciones_al_nacer = FALSE AND (especificacion_complicaciones IS NULL OR char_length(trim(especificacion_complicaciones)) = 0))
    )
);

-- Índices de búsqueda optimizada para campos principales
CREATE UNIQUE INDEX idx_madres_correo ON madres_cuidadores(correo_electronico);
CREATE INDEX idx_madres_telefono ON madres_cuidadores(telefono);
CREATE INDEX idx_recien_nacidos_madre ON recien_nacidos(madre_id);


-- ============================================================================
-- 2. TABLAS SUGERIDAS PARA EL COMPONENTE DE LA APP (CONTROL EMOCIONAL Y CUIDADO)
-- ============================================================================

-- Tabla: bitacora_emocional
-- Permite llevar un control diario o periódico del estado de ánimo de la madre.
CREATE TABLE bitacora_emocional (
    id SERIAL PRIMARY KEY,
    madre_id INTEGER NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Escalas de 1 a 5 (ej. 1: Muy bajo/Mal, 5: Excelente/Tranquila)
    nivel_animo INTEGER NOT NULL CONSTRAINT chk_nivel_animo CHECK (nivel_animo BETWEEN 1 AND 5),
    nivel_ansiedad INTEGER NOT NULL CONSTRAINT chk_nivel_ansiedad CHECK (nivel_ansiedad BETWEEN 1 AND 5),
    nivel_cansancio INTEGER NOT NULL CONSTRAINT chk_nivel_cansancio CHECK (nivel_cansancio BETWEEN 1 AND 5),
    
    -- Registro cualitativo de pensamientos
    nota_diaria TEXT,
    
    -- Síntomas asociados (almacenados en JSON para flexibilidad, ej: ["llanto_frecuente", "insomnio", "dolor_cabeza"])
    sintomas_fisicos JSONB,
    
    CONSTRAINT fk_madre_bitacora FOREIGN KEY (madre_id) 
        REFERENCES madres_cuidadores(id) 
        ON DELETE CASCADE
);

-- Tabla: test_depresion_postparto (Escala de Edimburgo - EPDS)
-- Herramienta clínica recomendada para tamizaje de depresión posparto.
CREATE TABLE evaluaciones_epds (
    id SERIAL PRIMARY KEY,
    madre_id INTEGER NOT NULL,
    fecha_evaluacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Respuestas a las 10 preguntas de la escala (cada una puntúa de 0 a 3)
    p1_capaz_reir INTEGER NOT NULL CONSTRAINT chk_p1 CHECK (p1_capaz_reir BETWEEN 0 AND 3),
    p2_mirar_futuro INTEGER NOT NULL CONSTRAINT chk_p2 CHECK (p2_mirar_futuro BETWEEN 0 AND 3),
    p3_culparme INTEGER NOT NULL CONSTRAINT chk_p3 CHECK (p3_culparme BETWEEN 0 AND 3),
    p4_ansiosa INTEGER NOT NULL CONSTRAINT chk_p4 CHECK (p4_ansiosa BETWEEN 0 AND 3),
    p5_asustada INTEGER NOT NULL CONSTRAINT chk_p5 CHECK (p5_asustada BETWEEN 0 AND 3),
    p6_abrumada INTEGER NOT NULL CONSTRAINT chk_p6 CHECK (p6_abrumada BETWEEN 0 AND 3),
    p7_infeliz_sueño INTEGER NOT NULL CONSTRAINT chk_p7 CHECK (p7_infeliz_sueño BETWEEN 0 AND 3),
    p8_triste INTEGER NOT NULL CONSTRAINT chk_p8 CHECK (p8_triste BETWEEN 0 AND 3),
    p9_infeliz_llanto INTEGER NOT NULL CONSTRAINT chk_p9 CHECK (p9_infeliz_llanto BETWEEN 0 AND 3),
    p10_hacerme_daño INTEGER NOT NULL CONSTRAINT chk_p10 CHECK (p10_hacerme_daño BETWEEN 0 AND 3),
    
    -- Suma total de las respuestas (0 a 30 puntos)
    puntuacion_total INTEGER NOT NULL CONSTRAINT chk_total CHECK (puntuacion_total BETWEEN 0 AND 30),
    
    CONSTRAINT fk_madre_epds FOREIGN KEY (madre_id) 
        REFERENCES madres_cuidadores(id) 
        ON DELETE CASCADE,
        
    -- Validación de consistencia: la puntuación total debe ser exactamente la suma de las individuales
    CONSTRAINT chk_consistencia_total CHECK (
        puntuacion_total = (p1_capaz_reir + p2_mirar_futuro + p3_culparme + p4_ansiosa + p5_asustada + 
                            p6_abrumada + p7_infeliz_sueño + p8_triste + p9_infeliz_llanto + p10_hacerme_daño)
    )
);

-- Tabla: bitacora_cuidado_bebe
-- Permite registrar actividades diarias del recién nacido (Alimentación, Sueño, Pañales, Síntomas).
CREATE TABLE bitacora_cuidado_bebe (
    id SERIAL PRIMARY KEY,
    bebe_id INTEGER NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Categoría de actividad
    tipo_registro VARCHAR(20) NOT NULL CONSTRAINT chk_tipo_registro CHECK (tipo_registro IN ('Alimentacion', 'Sueno', 'Panal', 'Sintomas', 'Otro')),
    
    -- Detalles específicos de cada tipo de registro (ej. mililitros consumidos, horas dormidas, estado del pañal)
    detalles JSONB NOT NULL,
    
    -- Notas adicionales del cuidador
    observaciones TEXT,
    
    CONSTRAINT fk_bebe_bitacora FOREIGN KEY (bebe_id) 
        REFERENCES recien_nacidos(id) 
        ON DELETE CASCADE
);

-- Tabla: evaluaciones_riesgo_bebe
-- Registro de evaluación de signos de riesgo en el recién nacido.
CREATE TABLE evaluaciones_riesgo_bebe (
    id SERIAL PRIMARY KEY,
    bebe_id INTEGER NOT NULL,
    fecha_evaluacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Signos de alto riesgo (3 puntos cada uno)
    convulsiones BOOLEAN NOT NULL,
    dificultad_respiratoria BOOLEAN NOT NULL,
    coloracion_azulada BOOLEAN NOT NULL,
    fiebre_hipotermia BOOLEAN NOT NULL,
    rechazo_alimentacion BOOLEAN NOT NULL,
    disminucion_conciencia BOOLEAN NOT NULL,
    
    -- Signos de riesgo moderado (2 puntos cada uno)
    vomitos_repetitivos BOOLEAN NOT NULL,
    ictericia_progresiva BOOLEAN NOT NULL,
    disminucion_actividad BOOLEAN NOT NULL,
    llanto_persistente BOOLEAN NOT NULL,
    
    -- Signos de bajo riesgo (1 punto cada uno)
    alteraciones_sueno BOOLEAN NOT NULL,
    disminucion_apetito BOOLEAN NOT NULL,
    irritabilidad_ocasional BOOLEAN NOT NULL,
    
    -- Suma total de las respuestas (0 a 29 puntos)
    puntuacion_total INTEGER NOT NULL CONSTRAINT chk_total_riesgo CHECK (puntuacion_total BETWEEN 0 AND 29),
    
    -- Clasificación del riesgo: Bajo, Moderado, Alto
    nivel_riesgo VARCHAR(15) NOT NULL CONSTRAINT chk_nivel_riesgo CHECK (nivel_riesgo IN ('Bajo', 'Moderado', 'Alto')),
    
    CONSTRAINT fk_bebe_riesgo FOREIGN KEY (bebe_id) 
        REFERENCES recien_nacidos(id) 
        ON DELETE CASCADE,
        
    -- Validación de consistencia: la puntuación total debe ser la suma ponderada de las respuestas
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
    
    -- Validación de consistencia: nivel de riesgo según puntuación
    CONSTRAINT chk_consistencia_nivel CHECK (
        (puntuacion_total BETWEEN 0 AND 2 AND nivel_riesgo = 'Bajo') OR
        (puntuacion_total BETWEEN 3 AND 5 AND nivel_riesgo = 'Moderado') OR
        (puntuacion_total >= 6 AND nivel_riesgo = 'Alto')
    )
);

-- Tabla: biblioteca_educativa
-- Almacena el contenido educativo e infografías basadas en las recomendaciones OMS/OPS.
CREATE TABLE biblioteca_educativa (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL CONSTRAINT chk_bib_titulo CHECK (char_length(TRIM(titulo)) >= 2),
    tema VARCHAR(50) NOT NULL CONSTRAINT chk_bib_tema CHECK (tema IN ('Signos Alarma', 'Cuidados Basicos', 'Lactancia Materna', 'Control Temperatura', 'Ictericia', 'Sepsis', 'Hipotermia', 'Atencion Medica')),
    url_recurso VARCHAR(500) NOT NULL CONSTRAINT chk_bib_url CHECK (url_recurso ~ '^https?://'),
    fuente_referencia VARCHAR(50) NOT NULL CONSTRAINT chk_bib_fuente CHECK (fuente_referencia IN ('OMS', 'OPS', 'UNICEF', 'AEP', 'KidsHealth', 'WIC')),
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: seguimiento_diario_neonato
-- Registro diario automatizado (durante 5 días) posterior a un triaje de riesgo.
CREATE TABLE seguimiento_diario_neonato (
    id SERIAL PRIMARY KEY,
    bebe_id INTEGER NOT NULL,
    evaluacion_riesgo_id INTEGER NOT NULL,
    dia_seguimiento INTEGER NOT NULL CONSTRAINT chk_seg_dia CHECK (dia_seguimiento BETWEEN 1 AND 5),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Escala de respuesta para cada ítem: Mejoró, Igual, Empeoró, Sí, No
    alimentacion_normal VARCHAR(15) NOT NULL CONSTRAINT chk_seg_alim_norm CHECK (alimentacion_normal IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    alimentacion_rechazo VARCHAR(15) NOT NULL CONSTRAINT chk_seg_alim_rech CHECK (alimentacion_rechazo IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    temperatura_fiebre VARCHAR(15) NOT NULL CONSTRAINT chk_seg_temp_fieb CHECK (temperatura_fiebre IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    temperatura_frio VARCHAR(15) NOT NULL CONSTRAINT chk_seg_temp_frio CHECK (temperatura_frio IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    actividad_normal VARCHAR(15) NOT NULL CONSTRAINT chk_seg_act_norm CHECK (actividad_normal IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    actividad_letargo VARCHAR(15) NOT NULL CONSTRAINT chk_seg_act_let CHECK (actividad_letargo IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    respiracion_normal VARCHAR(15) NOT NULL CONSTRAINT chk_seg_resp_norm CHECK (respiracion_normal IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    respiracion_dificultad VARCHAR(15) NOT NULL CONSTRAINT chk_seg_resp_dific CHECK (respiracion_dificultad IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    piel_normal VARCHAR(15) NOT NULL CONSTRAINT chk_seg_piel_norm CHECK (piel_normal IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    piel_alteracion VARCHAR(15) NOT NULL CONSTRAINT chk_seg_piel_alt CHECK (piel_alteracion IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    eliminacion_panales VARCHAR(15) NOT NULL CONSTRAINT chk_seg_elim_pan CHECK (eliminacion_panales IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    eliminacion_deposiciones VARCHAR(15) NOT NULL CONSTRAINT chk_seg_elim_dep CHECK (eliminacion_deposiciones IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    llanto_normal VARCHAR(15) NOT NULL CONSTRAINT chk_seg_llanto_norm CHECK (llanto_normal IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    llanto_alteracion VARCHAR(15) NOT NULL CONSTRAINT chk_seg_llanto_alt CHECK (llanto_alteracion IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    alarma_convulsiones VARCHAR(15) NOT NULL CONSTRAINT chk_seg_conv CHECK (alarma_convulsiones IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    alarma_vomito VARCHAR(15) NOT NULL CONSTRAINT chk_seg_vom CHECK (alarma_vomito IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    alarma_empeoramiento VARCHAR(15) NOT NULL CONSTRAINT chk_seg_empeoro CHECK (alarma_empeoramiento IN ('Mejoró', 'Igual', 'Empeoró', 'Sí', 'No')),
    
    resultado_evolucion VARCHAR(10) NOT NULL CONSTRAINT chk_seg_resultado CHECK (resultado_evolucion IN ('Verde', 'Amarillo', 'Rojo')),
    
    CONSTRAINT fk_bebe_seguimiento FOREIGN KEY (bebe_id) 
        REFERENCES recien_nacidos(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_triaje_seguimiento FOREIGN KEY (evaluacion_riesgo_id) 
        REFERENCES evaluaciones_riesgo_bebe(id) 
        ON DELETE CASCADE,
        
    -- Garantizar que no se registre dos veces el mismo día para una misma evaluación
    CONSTRAINT uq_bebe_dia_triaje UNIQUE (evaluacion_riesgo_id, dia_seguimiento)
);

-- Tabla: vacunacion_neonato
-- Control y seguimiento del esquema nacional de inmunización para el bebé.
CREATE TABLE vacunacion_neonato (
    id SERIAL PRIMARY KEY,
    bebe_id INTEGER NOT NULL,
    nombre_vacuna VARCHAR(100) NOT NULL CONSTRAINT chk_vac_nombre CHECK (char_length(TRIM(nombre_vacuna)) >= 2),
    dosis VARCHAR(50) NOT NULL,
    fecha_programada DATE NOT NULL,
    fecha_aplicacion DATE CONSTRAINT chk_vac_fecha CHECK (fecha_aplicacion <= CURRENT_DATE),
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CONSTRAINT chk_vac_estado CHECK (estado IN ('Pendiente', 'Aplicada', 'Atrasada')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bebe_vacunacion FOREIGN KEY (bebe_id) 
        REFERENCES recien_nacidos(id) 
        ON DELETE CASCADE
);

-- Tabla: controles_nino_sano
-- Monitoreo de crecimiento y desarrollo del bebé (peso, talla y perímetro cefálico).
CREATE TABLE controles_nino_sano (
    id SERIAL PRIMARY KEY,
    bebe_id INTEGER NOT NULL,
    fecha_control DATE NOT NULL CONSTRAINT chk_control_fecha CHECK (fecha_control <= CURRENT_DATE),
    peso_kg NUMERIC(4,2) NOT NULL CONSTRAINT chk_control_peso CHECK (peso_kg BETWEEN 1.00 AND 25.00),
    talla_cm NUMERIC(4,1) NOT NULL CONSTRAINT chk_control_talla CHECK (talla_cm BETWEEN 30.0 AND 120.0),
    perimetro_cefalico_cm NUMERIC(4,1) NOT NULL CONSTRAINT chk_control_pc CHECK (perimetro_cefalico_cm BETWEEN 25.0 AND 60.0),
    observaciones TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Programado' CONSTRAINT chk_control_estado CHECK (estado IN ('Programado', 'Realizado', 'Cancelado')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bebe_control FOREIGN KEY (bebe_id) 
        REFERENCES recien_nacidos(id) 
        ON DELETE CASCADE
);

-- Tabla: notificaciones_alertas
-- Registro de alertas push y recordatorios automáticos del sistema.
CREATE TABLE notificaciones_alertas (
    id SERIAL PRIMARY KEY,
    bebe_id INTEGER NOT NULL,
    tipo_alerta VARCHAR(30) NOT NULL CONSTRAINT chk_alerta_tipo CHECK (tipo_alerta IN ('Vacunacion', 'Control Nino Sano', 'Reevaluacion Triaje', 'Seguimiento Diario', 'Educativa')),
    mensaje TEXT NOT NULL CONSTRAINT chk_alerta_mensaje CHECK (char_length(TRIM(mensaje)) >= 5),
    fecha_envio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT fk_bebe_alerta FOREIGN KEY (bebe_id) 
        REFERENCES recien_nacidos(id) 
        ON DELETE CASCADE
);

-- Índices para mejorar rendimiento de los módulos de la aplicación
CREATE INDEX idx_bitacora_emocional_madre ON bitacora_emocional(madre_id);
CREATE INDEX idx_evaluaciones_epds_madre ON evaluaciones_epds(madre_id);
CREATE INDEX idx_bitacora_cuidado_bebe_bebe ON bitacora_cuidado_bebe(bebe_id);
CREATE INDEX idx_evaluaciones_riesgo_bebe_bebe ON evaluaciones_riesgo_bebe(bebe_id);
CREATE INDEX idx_seguimiento_diario_bebe ON seguimiento_diario_neonato(bebe_id);
CREATE INDEX idx_seguimiento_diario_triaje ON seguimiento_diario_neonato(evaluacion_riesgo_id);
CREATE INDEX idx_vacunacion_neonato_bebe ON vacunacion_neonato(bebe_id);
CREATE INDEX idx_controles_nino_sano_bebe ON controles_nino_sano(bebe_id);
CREATE INDEX idx_notificaciones_alertas_bebe ON notificaciones_alertas(bebe_id);
