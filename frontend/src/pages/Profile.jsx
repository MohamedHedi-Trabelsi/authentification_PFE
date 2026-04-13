import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  getProfile,
  updateProfile,
  setCurrentUser,
} from "../services/authService";
import { useToast } from "../context/ToastContext";

export default function Profile() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    password: "",
  });

  const [profile, setProfile] = useState(currentUser || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        if (!data?.message) {
          setProfile(data);
          setFormData((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
          }));
        } else {
          showToast(data.message, "error");
        }
      } catch (error) {
        showToast("Erreur lors du chargement du profil.", "error");
      }
    };

    loadProfile();
  }, [showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (formData.name.trim() === "") {
      showToast("Le nom est obligatoire.", "error");
      return false;
    }

    if (formData.name.trim().length < 3) {
      showToast("Le nom doit contenir au moins 3 caractères.", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() === "") {
      showToast("L'email est obligatoire.", "error");
      return false;
    }

    if (!emailRegex.test(formData.email.trim())) {
      showToast("Veuillez entrer un email valide.", "error");
      return false;
    }

    if (formData.password && formData.password.length < 8) {
      showToast(
        "Le mot de passe doit contenir au moins 8 caractères.",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const data = await updateProfile(formData);

      if (data?.user) {
        setCurrentUser(data.user);
        setProfile(data.user);
        showToast(data.message || "Profil mis à jour.", "success");

        setFormData((prev) => ({
          ...prev,
          password: "",
        }));
      } else {
        showToast(data?.message || "Erreur lors de la mise à jour.", "error");
      }
    } catch (error) {
      showToast("Erreur serveur.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page company-theme-bg">
      <div className="dashboard-card profile-card premium-card">
        <div className="profile-topbar">
          <div>
            <p className="section-kicker">WIC MIC</p>
            <h2>Gestion du profil</h2>
            <p className="section-subtitle">
              Mettez à jour vos informations personnelles en toute sécurité.
            </p>
          </div>

          <button
            className="secondary-btn auto-width-btn"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Retour
          </button>
        </div>

        <div className="modern-info-box">
          <div className="mini-stat">
            <span className="mini-stat-label">Nom actuel</span>
            <strong className="mini-stat-value">{profile?.name}</strong>
          </div>

          <div className="mini-stat">
            <span className="mini-stat-label">Email actuel</span>
            <strong className="mini-stat-value">{profile?.email}</strong>
          </div>

          <div className="mini-stat">
            <span className="mini-stat-label">Rôle</span>
            <strong className="mini-stat-value">{profile?.role}</strong>
          </div>

          <div className="mini-stat">
            <span className="mini-stat-label">Statut</span>
            <strong className="mini-stat-value">{profile?.status}</strong>
          </div>
        </div>

        <form className="profile-form improved-profile-form" onSubmit={handleSubmit} noValidate>
          <div className="profile-grid">
            <div className="input-group">
              <label htmlFor="name">Nom complet</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Entrez votre nom complet"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Adresse email</label>
              <input
                id="email"
                type="text"
                name="email"
                placeholder="exemple@wicmic.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="profile-full-width input-group">
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Laisser vide pour conserver l'ancien mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
              <small className="input-help">
                Utilisez au moins 8 caractères pour renforcer la sécurité.
              </small>
            </div>
          </div>

          <div className="button-row profile-actions">
            <button
              className="primary-btn auto-width-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Mise à jour..." : "Enregistrer les modifications"}
            </button>

            <button
              className="secondary-btn auto-width-btn"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}