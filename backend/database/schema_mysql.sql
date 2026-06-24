-- ============================================================================
-- SCRIPT DE BASE DE DATOS: APP DE CONTROL EMOCIONAL Y CUIDADO DEL RECIÉN NACIDO
-- Motor de Base de Datos: MySQL / MariaDB (Compatible con MySQL 8.0+)
-- ============================================================================

-- ============================================================================
-- 1. ESTRUCTURA PRINCIPAL (REQUERIDA POR INVESTIGADORES)
-- ============================================================================

-- Tabla: madres_cuidadores
-- Almacena la información de la sección A, B, C y F.
CREATE TABLE madres_cuidadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- 🔹 Sección A: Datos personales de la madre o cuidador
    nombre VARCHAR(150) NOT NULL CONSTRAINT chk_nombre_madre CHECK (char_length(TRIM(nombre)) >= 2),
    edad INT NOT NULL CONSTRAINT chk_edad CHECK (edad BETWEEN 12 AND 60),
    telefono VARCHAR(15) NOT NULL CONSTRAINT chk_telefono CHECK (telefono REGEXP '^[0-9]{10,15}$'),
    correo_electronico VARCHAR(255) NOT NULL CONSTRAINT chk_correo CHECK (correo_electronico REGEXP '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'),
    contrasena_hash VARCHAR(255) NOT NULL,
    numero_identificacion VARCHAR(30) NOT NULL,
    
    -- 🔹 Sección B: Datos sociodemográficos
    nivel_educacion VARCHAR(20) NOT NULL CONSTRAINT chk_educacion CHECK (nivel_educacion IN ('Ninguno', 'Básico', 'Básica', 'Secundaria', 'Medio', 'Superior')),
    zona_residencia VARCHAR(10) NOT NULL CONSTRAINT chk_residencia CHECK (zona_residencia IN ('Urbana', 'Rural')),
    acceso_centro_salud BOOLEAN NOT NULL, -- 1: Sí, 0: No
    situacion_economica VARCHAR(15) NOT NULL CONSTRAINT chk_situacion_economica CHECK (situacion_economica IN ('Baja', 'Media', 'Alta', 'Estable')),
    
    -- 🔹 Sección C: Condiciones de cuidado
    relacion_bebe VARCHAR(50) NOT NULL,
    numero_hijos INT NOT NULL CONSTRAINT chk_numero_hijos CHECK (numero_hijos BETWEEN 0 AND 10),
    tiene_dos_o_mas_hijos BOOLEAN NOT NULL,
    es_madre_sola BOOLEAN NOT NULL,
    tiene_apoyo_familiar BOOLEAN NOT NULL,
    apoyo_principal VARCHAR(50) NOT NULL,
    es_madre_primeriza BOOLEAN NOT NULL,
    
    -- 🔹 Sección F: Consentimiento informado
    aceptacion_terminos BOOLEAN NOT NULL CONSTRAINT chk_consentimiento CHECK (aceptacion_terminos = 1),
    
    -- Campos de control/auditoría
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Restricciones de integridad de negocio lógicas
    -- 1. Validar que "tiene_dos_o_mas_hijos" sea consistente con "numero_hijos"
    CONSTRAINT chk_consistencia_dos_hijos CHECK (
        (numero_hijos >= 2 AND tiene_dos_o_mas_hijos = 1) OR 
        (numero_hijos < 2 AND tiene_dos_o_mas_hijos = 0)
    ),
    
    -- 2. Validar que si es madre primeriza, no tenga un número de hijos inconsistente (usualmente 1 si ya nació o 0 si está embarazada)
    CONSTRAINT chk_consistencia_primeriza CHECK (
        (es_madre_primeriza = 1 AND numero_hijos <= 1) OR 
        (es_madre_primeriza = 0 OR numero_hijos >= 0)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: recien_nacidos
-- Almacena la información de la sección D y E.
CREATE TABLE recien_nacidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    madre_id INT NOT NULL,
    
    -- 🔹 Sección D: Datos del recién nacido
    nombre_bebe VARCHAR(150) NOT NULL CONSTRAINT chk_nombre_bebe CHECK (char_length(TRIM(nombre_bebe)) >= 2),
    fecha_nacimiento DATE NOT NULL, -- La validación de fecha no futura se gestiona mejor a nivel de aplicación o con un CHECK en MySQL 8.0.16+
    peso_al_nacer DECIMAL(3,2) NOT NULL CONSTRAINT chk_peso CHECK (peso_al_nacer BETWEEN 0.5 AND 6.0),
    edad_gestacional INT NOT NULL CONSTRAINT chk_edad_gestacional CHECK (edad_gestacional BETWEEN 20 AND 45),
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
        (complicaciones_al_nacer = 1 AND especificacion_complicaciones IS NOT NULL AND char_length(trim(especificacion_complicaciones)) >= 2) OR 
        (complicaciones_al_nacer = 0 AND (especificacion_complicaciones IS NULL OR char_length(trim(especificacion_complicaciones)) = 0))
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices de búsqueda optimizada para campos principales
CREATE UNIQUE INDEX idx_madres_correo ON madres_cuidadores(correo_electronico);
CREATE INDEX idx_madres_telefono ON madres_cuidadores(telefono);
CREATE INDEX idx_recien_nacidos_madre ON recien_nacidos(madre_id);


-- ============================================================================
-- 2. TABLAS REQUERIDAS POR EL COMPONENTE DE LA APP (TRIAJE Y SEGUIMIENTO)
-- ============================================================================

-- Tabla: evaluaciones_riesgo_bebe
-- Registro de evaluación de signos de riesgo en el recién nacido.
CREATE TABLE evaluaciones_riesgo_bebe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bebe_id INT NOT NULL,
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
    puntuacion_total INT NOT NULL CONSTRAINT chk_total_riesgo CHECK (puntuacion_total BETWEEN 0 AND 29),
    
    -- Clasificación del riesgo: Bajo, Moderado, Alto
    nivel_riesgo VARCHAR(15) NOT NULL CONSTRAINT chk_nivel_riesgo CHECK (nivel_riesgo IN ('Bajo', 'Moderado', 'Alto')),
    
    CONSTRAINT fk_bebe_riesgo FOREIGN KEY (bebe_id) 
        REFERENCES recien_nacidos(id) 
        ON DELETE CASCADE,
        
    -- Validación de consistencia: la puntuación total debe ser la suma ponderada de las respuestas
    CONSTRAINT chk_consistencia_puntuacion CHECK (
        puntuacion_total = (
            (CASE WHEN convulsiones = 1 THEN 3 ELSE 0 END) +
            (CASE WHEN dificultad_respiratoria = 1 THEN 3 ELSE 0 END) +
            (CASE WHEN coloracion_azulada = 1 THEN 3 ELSE 0 END) +
            (CASE WHEN fiebre_hipotermia = 1 THEN 3 ELSE 0 END) +
            (CASE WHEN rechazo_alimentacion = 1 THEN 3 ELSE 0 END) +
            (CASE WHEN disminucion_conciencia = 1 THEN 3 ELSE 0 END) +
            (CASE WHEN vomitos_repetitivos = 1 THEN 2 ELSE 0 END) +
            (CASE WHEN ictericia_progresiva = 1 THEN 2 ELSE 0 END) +
            (CASE WHEN disminucion_actividad = 1 THEN 2 ELSE 0 END) +
            (CASE WHEN llanto_persistente = 1 THEN 2 ELSE 0 END) +
            (CASE WHEN alteraciones_sueno = 1 THEN 1 ELSE 0 END) +
            (CASE WHEN disminucion_apetito = 1 THEN 1 ELSE 0 END) +
            (CASE WHEN irritabilidad_ocasional = 1 THEN 1 ELSE 0 END)
        )
    ),
    
    -- Validación de consistencia: nivel de riesgo según puntuación
    CONSTRAINT chk_consistencia_nivel CHECK (
        (puntuacion_total BETWEEN 0 AND 2 AND nivel_riesgo = 'Bajo') OR
        (puntuacion_total BETWEEN 3 AND 5 AND nivel_riesgo = 'Moderado') OR
        (puntuacion_total >= 6 AND nivel_riesgo = 'Alto')
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: seguimiento_diario_neonato
-- Registro diario automatizado (durante 5 días) posterior a un triaje de riesgo.
CREATE TABLE seguimiento_diario_neonato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bebe_id INT NOT NULL,
    evaluacion_riesgo_id INT NOT NULL,
    dia_seguimiento INT NOT NULL CONSTRAINT chk_seg_dia CHECK (dia_seguimiento BETWEEN 1 AND 5),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: vacunacion_neonato
-- Control y seguimiento del esquema nacional de inmunización para el bebé.
CREATE TABLE vacunacion_neonato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bebe_id INT NOT NULL,
    nombre_vacuna VARCHAR(100) NOT NULL CONSTRAINT chk_vac_nombre CHECK (char_length(TRIM(nombre_vacuna)) >= 2),
    dosis VARCHAR(50) NOT NULL,
    fecha_programada DATE NOT NULL,
    fecha_aplicacion DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CONSTRAINT chk_vac_estado CHECK (estado IN ('Pendiente', 'Aplicada', 'Atrasada')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bebe_vacunacion FOREIGN KEY (bebe_id) 
        REFERENCES recien_nacidos(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: controles_nino_sano
-- Monitoreo de crecimiento y desarrollo del bebé (peso, talla y perímetro cefálico).
CREATE TABLE controles_nino_sano (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bebe_id INT NOT NULL,
    fecha_control DATE NOT NULL,
    peso_kg DECIMAL(4,2) NOT NULL CONSTRAINT chk_control_peso CHECK (peso_kg BETWEEN 1.00 AND 25.00),
    talla_cm DECIMAL(4,1) NOT NULL CONSTRAINT chk_control_talla CHECK (talla_cm BETWEEN 30.0 AND 120.0),
    perimetro_cefalico_cm DECIMAL(4,1) NOT NULL CONSTRAINT chk_control_pc CHECK (perimetro_cefalico_cm BETWEEN 25.0 AND 60.0),
    observaciones TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Programado' CONSTRAINT chk_control_estado CHECK (estado IN ('Programado', 'Realizado', 'Cancelado')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bebe_control FOREIGN KEY (bebe_id) 
        REFERENCES recien_nacidos(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar rendimiento de los módulos de la aplicación
CREATE INDEX idx_evaluaciones_riesgo_bebe_bebe ON evaluaciones_riesgo_bebe(bebe_id);
CREATE INDEX idx_seguimiento_diario_bebe ON seguimiento_diario_neonato(bebe_id);
CREATE INDEX idx_seguimiento_diario_triaje ON seguimiento_diario_neonato(evaluacion_riesgo_id);
CREATE INDEX idx_vacunacion_neonato_bebe ON vacunacion_neonato(bebe_id);
CREATE INDEX idx_controles_nino_sano_bebe ON controles_nino_sano(bebe_id);
