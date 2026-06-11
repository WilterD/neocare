import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { query } from "../db.js";

const findOrCreateOAuthUser = async (profile) => {
  const email = profile.emails?.[0]?.value?.toLowerCase();
  const providerId = profile.id;
  const nombre = profile.displayName || "Usuario Google";

  const oauthRes = await query(
    "SELECT madre_id FROM oauth_cuentas WHERE provider = $1 AND provider_id = $2",
    ["google", providerId]
  );
  if (oauthRes.rows[0]) {
    return oauthRes.rows[0].madre_id;
  }

  if (email) {
    const madreRes = await query("SELECT id FROM madres_cuidadores WHERE correo_electronico = $1", [email]);
    if (madreRes.rows[0]) {
      await query(
        "INSERT INTO oauth_cuentas (madre_id, provider, provider_id) VALUES ($1, $2, $3)",
        [madreRes.rows[0].id, "google", providerId]
      );
      return madreRes.rows[0].id;
    }
  }

  const insertRes = await query(
    `INSERT INTO madres_cuidadores (
      nombre, edad, telefono, correo_electronico, contrasena_hash, numero_identificacion,
      nivel_educacion, zona_residencia, acceso_centro_salud, situacion_economica,
      relacion_bebe, numero_hijos, tiene_dos_o_mas_hijos, es_madre_sola,
      tiene_apoyo_familiar, apoyo_principal, es_madre_primeriza, aceptacion_terminos, oauth_only
    ) VALUES ($1,25,'0000000000',$2,'','OAUTH-GOOGLE','Medio','Urbana',1,'Media','Madre',1,0,0,1,'Familiar',1,1,1)
    RETURNING id`,
    [nombre, email || `google_${providerId}@oauth.local`]
  );

  const madreId = insertRes.rows[0]?.id;
  await query(
    "INSERT INTO oauth_cuentas (madre_id, provider, provider_id) VALUES ($1, $2, $3)",
    [madreId, "google", providerId]
  );
  return madreId;
};

export const configurePassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google OAuth no configurado (faltan GOOGLE_CLIENT_ID/SECRET).");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const madreId = await findOrCreateOAuthUser(profile);
          done(null, { madreId, correo: profile.emails?.[0]?.value });
        } catch (err) {
          done(err);
        }
      }
    )
  );
};

export const signTokenForMadre = async (madreId) => {
  const res = await query("SELECT id, correo_electronico, nombre FROM madres_cuidadores WHERE id = $1", [madreId]);
  const m = res.rows[0];
  const token = jwt.sign(
    { id: m.id, correo: m.correo_electronico },
    process.env.JWT_SECRET || "neocare_secret_key",
    { expiresIn: "7d" }
  );
  return { token, usuario: { id: m.id, nombre: m.nombre, correo: m.correo_electronico } };
};
