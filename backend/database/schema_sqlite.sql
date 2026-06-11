CREATE TABLE IF NOT EXISTS madres_cuidadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    edad INTEGER NOT NULL,
    telefono TEXT NOT NULL,
    correo_electronico TEXT NOT NULL UNIQUE,
    contrasena_hash TEXT,
    numero_identificacion TEXT NOT NULL,
    nivel_educacion TEXT NOT NULL,
    zona_residencia TEXT NOT NULL,
    acceso_centro_salud INTEGER NOT NULL,
    situacion_economica TEXT NOT NULL,
    relacion_bebe TEXT NOT NULL,
    numero_hijos INTEGER NOT NULL,
    tiene_dos_o_mas_hijos INTEGER NOT NULL,
    es_madre_sola INTEGER NOT NULL,
    tiene_apoyo_familiar INTEGER NOT NULL,
    apoyo_principal TEXT NOT NULL,
    es_madre_primeriza INTEGER NOT NULL,
    aceptacion_terminos INTEGER NOT NULL DEFAULT 1,
    oauth_only INTEGER NOT NULL DEFAULT 0,
    ultimo_checkin_emocional TEXT,
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recien_nacidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    madre_id INTEGER NOT NULL,
    nombre_bebe TEXT NOT NULL,
    fecha_nacimiento TEXT NOT NULL,
    peso_al_nacer REAL NOT NULL,
    edad_gestacional INTEGER NOT NULL,
    sexo TEXT NOT NULL,
    tipo_parto TEXT NOT NULL,
    complicaciones_al_nacer INTEGER NOT NULL,
    especificacion_complicaciones TEXT,
    hospitalizacion_neonatal INTEGER NOT NULL,
    motivo_hospitalizacion TEXT,
    duracion_hospitalizacion TEXT,
    requirio_cuidados_especiales TEXT,
    tipo_cuidado_recibido TEXT,
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS evaluaciones_riesgo_registro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    madre_id INTEGER NOT NULL,
    bebe_id INTEGER NOT NULL,
    fecha_evaluacion TEXT DEFAULT CURRENT_TIMESTAMP,
    puntaje_materno INTEGER NOT NULL,
    clasificacion_materna TEXT NOT NULL,
    puntaje_neonatal INTEGER NOT NULL,
    clasificacion_neonatal TEXT NOT NULL,
    clasificacion_final TEXT NOT NULL,
    recomendacion_seguimiento TEXT NOT NULL,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE,
    FOREIGN KEY (bebe_id) REFERENCES recien_nacidos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS biblioteca_educativa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    tema TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    recomendacion TEXT NOT NULL,
    nivel_alerta TEXT NOT NULL,
    url_recurso TEXT,
    fuente_referencia TEXT,
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacto_mensajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL,
    telefono TEXT,
    asunto TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS oauth_cuentas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    madre_id INTEGER NOT NULL,
    provider TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_id),
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    madre_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expira_en TEXT NOT NULL,
    usado INTEGER NOT NULL DEFAULT 0,
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bitacora_emocional (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    madre_id INTEGER NOT NULL,
    fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
    nivel_animo INTEGER NOT NULL,
    nivel_ansiedad INTEGER NOT NULL,
    nivel_cansancio INTEGER NOT NULL,
    puntaje_simple INTEGER,
    nota_diaria TEXT,
    sintomas_fisicos TEXT,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS evaluaciones_epds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    madre_id INTEGER NOT NULL,
    fecha_evaluacion TEXT DEFAULT CURRENT_TIMESTAMP,
    p1 INTEGER NOT NULL, p2 INTEGER NOT NULL, p3 INTEGER NOT NULL, p4 INTEGER NOT NULL,
    p5 INTEGER NOT NULL, p6 INTEGER NOT NULL, p7 INTEGER NOT NULL, p8 INTEGER NOT NULL,
    p9 INTEGER NOT NULL, p10 INTEGER NOT NULL,
    puntuacion_total INTEGER NOT NULL,
    clasificacion TEXT NOT NULL,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS evaluaciones_riesgo_bebe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bebe_id INTEGER NOT NULL,
    madre_id INTEGER NOT NULL,
    fecha_evaluacion TEXT DEFAULT CURRENT_TIMESTAMP,
    convulsiones INTEGER NOT NULL DEFAULT 0,
    dificultad_respiratoria INTEGER NOT NULL DEFAULT 0,
    coloracion_azulada INTEGER NOT NULL DEFAULT 0,
    fiebre_hipotermia INTEGER NOT NULL DEFAULT 0,
    rechazo_alimentacion INTEGER NOT NULL DEFAULT 0,
    disminucion_conciencia INTEGER NOT NULL DEFAULT 0,
    vomitos_repetitivos INTEGER NOT NULL DEFAULT 0,
    ictericia_progresiva INTEGER NOT NULL DEFAULT 0,
    disminucion_actividad INTEGER NOT NULL DEFAULT 0,
    llanto_persistente INTEGER NOT NULL DEFAULT 0,
    alteraciones_sueno INTEGER NOT NULL DEFAULT 0,
    disminucion_apetito INTEGER NOT NULL DEFAULT 0,
    irritabilidad_ocasional INTEGER NOT NULL DEFAULT 0,
    puntuacion_total INTEGER NOT NULL,
    nivel_riesgo TEXT NOT NULL,
    FOREIGN KEY (bebe_id) REFERENCES recien_nacidos(id) ON DELETE CASCADE,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bitacora_cuidado_bebe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bebe_id INTEGER NOT NULL,
    madre_id INTEGER NOT NULL,
    fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
    tipo_registro TEXT NOT NULL,
    detalles TEXT NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (bebe_id) REFERENCES recien_nacidos(id) ON DELETE CASCADE,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seguimiento_diario_neonato (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bebe_id INTEGER NOT NULL,
    madre_id INTEGER NOT NULL,
    evaluacion_riesgo_id INTEGER NOT NULL,
    dia_seguimiento INTEGER NOT NULL,
    fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
    alimentacion_normal TEXT NOT NULL,
    alimentacion_rechazo TEXT NOT NULL,
    temperatura_fiebre TEXT NOT NULL,
    temperatura_frio TEXT NOT NULL,
    actividad_normal TEXT NOT NULL,
    actividad_letargo TEXT NOT NULL,
    respiracion_normal TEXT NOT NULL,
    respiracion_dificultad TEXT NOT NULL,
    piel_normal TEXT NOT NULL,
    piel_alteracion TEXT NOT NULL,
    eliminacion_panales TEXT NOT NULL,
    eliminacion_deposiciones TEXT NOT NULL,
    llanto_normal TEXT NOT NULL,
    llanto_alteracion TEXT NOT NULL,
    alarma_convulsiones TEXT NOT NULL,
    alarma_vomito TEXT NOT NULL,
    alarma_empeoramiento TEXT NOT NULL,
    resultado_evolucion TEXT NOT NULL,
    UNIQUE(evaluacion_riesgo_id, dia_seguimiento),
    FOREIGN KEY (bebe_id) REFERENCES recien_nacidos(id) ON DELETE CASCADE,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluacion_riesgo_id) REFERENCES evaluaciones_riesgo_bebe(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vacunacion_neonato (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bebe_id INTEGER NOT NULL,
    nombre_vacuna TEXT NOT NULL,
    dosis TEXT NOT NULL,
    fecha_programada TEXT NOT NULL,
    fecha_aplicacion TEXT,
    estado TEXT NOT NULL DEFAULT 'Pendiente',
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bebe_id) REFERENCES recien_nacidos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS controles_nino_sano (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bebe_id INTEGER NOT NULL,
    madre_id INTEGER NOT NULL,
    fecha_control TEXT NOT NULL,
    peso_kg REAL NOT NULL,
    talla_cm REAL NOT NULL,
    perimetro_cefalico_cm REAL NOT NULL,
    observaciones TEXT,
    estado TEXT NOT NULL DEFAULT 'Realizado',
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bebe_id) REFERENCES recien_nacidos(id) ON DELETE CASCADE,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notificaciones_alertas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    madre_id INTEGER NOT NULL,
    bebe_id INTEGER,
    tipo_alerta TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio TEXT DEFAULT CURRENT_TIMESTAMP,
    leido INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE,
    FOREIGN KEY (bebe_id) REFERENCES recien_nacidos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS testimonios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    contenido TEXT NOT NULL,
    etapa TEXT NOT NULL,
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS datos_clinicos_historial (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bebe_id INTEGER NOT NULL,
    madre_id INTEGER NOT NULL,
    tipo_parto TEXT NOT NULL,
    complicaciones_nacer INTEGER NOT NULL,
    especificacion_complicaciones TEXT,
    hospitalizacion_neonatal INTEGER NOT NULL,
    motivo_hospitalizacion TEXT,
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bebe_id) REFERENCES recien_nacidos(id) ON DELETE CASCADE,
    FOREIGN KEY (madre_id) REFERENCES madres_cuidadores(id) ON DELETE CASCADE
);
