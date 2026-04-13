import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="dashboard-page company-theme-bg">
      <div className="dashboard-card company-dashboard premium-card">
        <div className="company-hero">
          <div>
            <p className="section-kicker">WIC MIC</p>
            <h2>Tableau de bord</h2>
            <p className="section-subtitle">
              Bienvenue dans votre espace de gestion des accès, des profils et
              des comptes utilisateurs.
            </p>

            <div className="company-brand-line">
              <span className="brand-dot brand-blue"></span>
              <span className="brand-dot brand-green"></span>
              <span className="brand-dot brand-light"></span>
              <span className="brand-name">WIC MIC Workspace</span>
            </div>
          </div>

          <div className="hero-badge">
            <span className="hero-badge-label">Connecté en tant que</span>
            <strong>{user?.role}</strong>
          </div>
        </div>

        <div className="company-about-box">
          <h3>À propos de WIC MIC</h3>
          <p>
            WIC MIC est une structure orientée vers la gestion, le pilotage et
            l’organisation des processus métiers. Cet espace permet de mieux
            contrôler les accès utilisateurs, sécuriser les comptes et faciliter
            l’administration interne.
          </p>
        </div>

        <div className="dashboard-summary-grid">
          <div className="summary-card">
            <span className="summary-label">Nom</span>
            <strong className="summary-value">{user?.name}</strong>
          </div>

          <div className="summary-card">
            <span className="summary-label">Email</span>
            <strong className="summary-value">{user?.email}</strong>
          </div>

          <div className="summary-card">
            <span className="summary-label">Rôle</span>
            <strong className="summary-value">{user?.role}</strong>
          </div>
        </div>

        <div className="dashboard-info-panel">
          <h3>Votre espace</h3>
          <p>
            {user?.role === "Manager"
              ? "Vous disposez d’un accès d’administration complet pour gérer les comptes utilisateurs et superviser la plateforme."
              : "Vous disposez d’un accès personnel pour consulter et mettre à jour votre profil en toute sécurité."}
          </p>

          <div className="dashboard-tags">
            <span className="dashboard-tag">Accès sécurisé</span>
            <span className="dashboard-tag">Gestion centralisée</span>
            <span className="dashboard-tag">
              {user?.role === "Manager" ? "Administration" : "Espace utilisateur"}
            </span>
          </div>

          <div className="button-row" style={{ marginTop: "18px" }}>
            <button
              className="secondary-btn auto-width-btn"
              type="button"
              onClick={() => navigate("/profile")}
            >
              Ouvrir mon profil
            </button>

            <button
              className="danger-soft-btn auto-width-btn"
              type="button"
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}