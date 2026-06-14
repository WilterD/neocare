import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Profile.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/evaluacion.png";
import educacionImage from "../../assets/educacion.png";
import historialImage from "../../assets/h.png";
import perfilImage from "../../assets/perfil.png";

import userImage from "../../assets/AVATAR.png";
import seguridadImage from "../../assets/InformacionSegura.png";

const sidebarItems = [
  {
    image: inicioImage,
    label: "Inicio",
    path: "/inicio",
  },
  {
    image: evaluacionImage,
    label: "Evaluación",
    path: "/evaluacion",
  },
  {
    image: educacionImage,
    label: "Educación",
    path: "/educacion",
  },
  {
    image: historialImage,
    label: "Historial",
    path: "/historial",
  },
  {
    image: perfilImage,
    label: "Perfil",
    path: "/perfil",
  },
];

const Profile = () => {
  const location = useLocation();

  const [usuario, setUsuario] = useState(location.state?.user || null);

  const [profileData, setProfileData] = useState({
    fullName: "Elimar García",
    age: "28",
    phone: "+58 412 1234567",
    email: "elimar@email.com",
    relation: "Madre",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("neocareUser");

      if (storedUser && !usuario) {
        const parsedUser = JSON.parse(storedUser);
        setUsuario(parsedUser);

        setProfileData((currentData) => ({
          ...currentData,
          fullName:
            parsedUser?.nombreCompleto ||
            parsedUser?.nombre ||
            currentData.fullName,
          age: parsedUser?.edad || currentData.age,
          phone: parsedUser?.telefono || currentData.phone,
          email: parsedUser?.email || parsedUser?.correo || currentData.email,
          relation: parsedUser?.relacion || currentData.relation,
        }));
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  }, [usuario]);

  const userName = useMemo(() => {
    return (
      profileData.fullName ||
      usuario?.nombreCompleto ||
      usuario?.nombre ||
      "Elimar García"
    );
  }, [profileData.fullName, usuario]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setProfileMessage("");
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setPasswordMessage("");
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword((currentState) => ({
      ...currentState,
      [fieldName]: !currentState[fieldName],
    }));
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();

    const updatedUser = {
      ...(usuario || {}),
      nombreCompleto: profileData.fullName,
      nombre: profileData.fullName,
      edad: profileData.age,
      telefono: profileData.phone,
      email: profileData.email,
      correo: profileData.email,
      relacion: profileData.relation,
    };

    localStorage.setItem("neocareUser", JSON.stringify(updatedUser));
    setUsuario(updatedUser);
    setProfileMessage("Datos personales actualizados correctamente.");
  };

  const handleCancelProfile = () => {
    setProfileData({
      fullName: usuario?.nombreCompleto || usuario?.nombre || "Elimar García",
      age: usuario?.edad || "28",
      phone: usuario?.telefono || "+58 412 1234567",
      email: usuario?.email || usuario?.correo || "elimar@email.com",
      relation: usuario?.relacion || "Madre",
    });

    setProfileMessage("");
  };

  const handleUpdatePassword = (event) => {
    event.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordMessage("Completa todos los campos de contraseña.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordMessage("Contraseña actualizada correctamente.");
  };

  return (
    <main className="profile-page-wrapper">
      <Header2 user={usuario} />

      <section className="profile-desktop">
        <aside className="profile-sidebar">
          <nav className="profile-sidebar-nav">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/inicio"}
                className={({ isActive }) =>
                  isActive
                    ? "profile-sidebar-item active"
                    : "profile-sidebar-item"
                }
              >
                <span className="profile-sidebar-icon-box">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="profile-sidebar-icon"
                  />
                </span>

                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="profile-main-panel">
          <header className="profile-title-row">
            <h1>Mi perfil</h1>
            <p>
              Consulta y actualiza tus datos personales y de acceso a NeoCare.
            </p>
          </header>

          <section className="profile-summary-card">
            <div className="profile-avatar-box">
              <img
                src={userImage}
                alt="Usuario registrado"
                className="profile-avatar-image"
              />
            </div>

            <div className="profile-summary-name">
              <h2>{userName}</h2>
              <p>Madre o cuidadora registrada</p>
            </div>

            <div className="profile-summary-divider" />

            <article className="profile-summary-item">
              <span className="profile-summary-icon">✉</span>

              <div>
                <h3>Correo electrónico</h3>
                <p>{profileData.email}</p>
              </div>
            </article>

            <div className="profile-summary-divider" />

            <article className="profile-summary-item">
              <span className="profile-summary-icon">☎</span>

              <div>
                <h3>Teléfono</h3>
                <p>{profileData.phone}</p>
              </div>
            </article>

            <div className="profile-summary-divider" />

            <article className="profile-summary-item">
              <span className="profile-summary-icon">●</span>

              <div>
                <h3>Relación con el recién nacido</h3>
                <p>{profileData.relation}</p>
              </div>
            </article>
          </section>

          <section className="profile-content-grid">
            <form className="profile-form-card" onSubmit={handleSaveProfile}>
              <div className="profile-card-heading">
                <span className="profile-card-icon">♙</span>

                <div>
                  <h2>Datos personales</h2>
                  <p>
                    Mantén actualizada tu información de contacto para acceder
                    correctamente a la plataforma.
                  </p>
                </div>
              </div>

              <div className="profile-form-grid">
                <label className="profile-field">
                  <span>Nombre completo</span>

                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                  />
                </label>

                <label className="profile-field">
                  <span>Edad</span>

                  <input
                    type="number"
                    name="age"
                    value={profileData.age}
                    onChange={handleProfileChange}
                  />
                </label>

                <label className="profile-field">
                  <span>Teléfono</span>

                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </label>

                <label className="profile-field">
                  <span>Correo electrónico</span>

                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </label>

                <label className="profile-field">
                  <span>Relación con el recién nacido</span>

                  <select
                    name="relation"
                    value={profileData.relation}
                    onChange={handleProfileChange}
                  >
                    <option value="Madre">Madre</option>
                    <option value="Padre">Padre</option>
                    <option value="Cuidadora">Cuidadora</option>
                    <option value="Cuidador">Cuidador</option>
                    <option value="Familiar">Familiar</option>
                  </select>
                </label>
              </div>

              {profileMessage && (
                <p className="profile-success-message">{profileMessage}</p>
              )}

              <div className="profile-button-row">
                <button type="submit" className="profile-save-button">
                  <span>▣</span>
                  Guardar cambios
                </button>

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancelProfile}
                >
                  Cancelar
                </button>
              </div>
            </form>

            <form
              className="profile-form-card password"
              onSubmit={handleUpdatePassword}
            >
              <div className="profile-card-heading">
                <span className="profile-card-icon">▣</span>

                <div>
                  <h2>Cambiar contraseña</h2>
                  <p>Actualiza tu contraseña para mantener segura tu cuenta.</p>
                </div>
              </div>

              <div className="profile-password-grid">
                <label className="profile-field password-field">
                  <span>Contraseña actual</span>

                  <div className="profile-password-input">
                    <input
                      type={showPassword.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      placeholder="Ingresa tu contraseña actual"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("currentPassword")
                      }
                      aria-label="Mostrar contraseña actual"
                    >
                      ◉
                    </button>
                  </div>
                </label>

                <label className="profile-field password-field">
                  <span>Nueva contraseña</span>

                  <div className="profile-password-input">
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Ingresa tu nueva contraseña"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />

                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      aria-label="Mostrar nueva contraseña"
                    >
                      ◉
                    </button>
                  </div>
                </label>

                <label className="profile-field password-field">
                  <span>Confirmar nueva contraseña</span>

                  <div className="profile-password-input">
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Repite tu nueva contraseña"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      aria-label="Mostrar confirmación de contraseña"
                    >
                      ◉
                    </button>
                  </div>
                </label>
              </div>

              <p className="profile-password-note">
                ⓘ La nueva contraseña debe tener al menos 8 caracteres.
              </p>

              {passwordMessage && (
                <p className="profile-success-message password-message">
                  {passwordMessage}
                </p>
              )}

              <button type="submit" className="profile-password-button">
                <span>▣</span>
                Actualizar contraseña
              </button>
            </form>
          </section>

          <section className="profile-security-card">
            <div className="profile-security-image-box">
              <img
                src={seguridadImage}
                alt="Seguridad de la información"
                className="profile-security-image"
              />
            </div>

            <div>
              <h2>Seguridad de la información</h2>

              <p>
                NeoCare protege tus datos personales y utiliza la información
                registrada únicamente para apoyar el seguimiento neonatal dentro
                de la plataforma.
              </p>
            </div>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Profile;