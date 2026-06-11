import swaggerUi from "swagger-ui-express";

const spec = {
  openapi: "3.0.0",
  info: {
    title: "NeoCare API",
    version: "1.0.0",
    description: "API para seguimiento neonatal y salud materna",
  },
  servers: [{ url: "http://localhost:4000/api" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  paths: {
    "/registro": { post: { summary: "Registrar madre y bebé", tags: ["Registro"] } },
    "/login": { post: { summary: "Iniciar sesión", tags: ["Auth"] } },
    "/auth/google": { get: { summary: "OAuth Google", tags: ["Auth"] } },
    "/auth/forgot-password": { post: { summary: "Solicitar reset", tags: ["Auth"] } },
    "/perfil/me": {
      get: { summary: "Mi perfil", tags: ["Perfil"], security: [{ bearerAuth: [] }] },
      put: { summary: "Actualizar perfil", tags: ["Perfil"], security: [{ bearerAuth: [] }] },
    },
    "/bebes": {
      get: { summary: "Mis bebés", tags: ["Bebés"], security: [{ bearerAuth: [] }] },
      post: { summary: "Registrar bebé", tags: ["Bebés"], security: [{ bearerAuth: [] }] },
    },
    "/evaluaciones": { get: { summary: "Mis evaluaciones", tags: ["Evaluaciones"], security: [{ bearerAuth: [] }] } },
    "/contenido-educativo": { get: { summary: "Contenido educativo", tags: ["Educación"] } },
    "/triaje": { post: { summary: "Triaje por signos", tags: ["Clínico"], security: [{ bearerAuth: [] }] } },
    "/seguimiento": { post: { summary: "Seguimiento día", tags: ["Clínico"], security: [{ bearerAuth: [] }] } },
    "/diario-emocional": { post: { summary: "Check-in emocional", tags: ["Emocional"], security: [{ bearerAuth: [] }] } },
    "/epds": { post: { summary: "Evaluación EPDS", tags: ["Emocional"], security: [{ bearerAuth: [] }] } },
    "/testimonios": { get: { summary: "Testimonios públicos", tags: ["Mama Plena"] } },
    "/notificaciones": { get: { summary: "Mis alertas", tags: ["Notificaciones"], security: [{ bearerAuth: [] }] } },
    "/contacto": { post: { summary: "Enviar mensaje", tags: ["Contacto"] } },
  },
};

export const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec));
};
