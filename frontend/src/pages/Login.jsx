import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const roles = [
    "Manager",
    "Responsable de production",
    "Analyste décisionnel",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
      role: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.email.trim() === "") {
      newErrors.email = "L'email est obligatoire.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Veuillez entrer un email valide.";
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Le mot de passe est obligatoire.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (formData.role === "") {
      newErrors.role = "Veuillez choisir un rôle.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((value) => value !== "");
    if (hasErrors) {
      showToast("Veuillez corriger les champs du formulaire.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });

      if (response?.token) {
        showToast("Connexion réussie.", "success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 600);
      } else {
        showToast(response?.message || "Erreur de connexion.", "error");
      }
    } catch (error) {
      showToast("Erreur serveur. Réessayez plus tard.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      password: "",
      role: "",
    });

    setErrors({
      email: "",
      password: "",
      role: "",
    });
  };

  return (
    <div className="auth-screen wicmic-login-bg">
      <div className="login-shell">
        <div className="login-brand-panel">
          <p className="section-kicker">WIC MIC</p>
          <h1>Espace d’authentification</h1>
          <p className="login-brand-text">
            Plateforme de gestion des accès utilisateurs, profils et validation
            des comptes.
          </p>

          <div className="company-brand-line">
            <span className="brand-dot brand-blue"></span>
            <span className="brand-dot brand-green"></span>
            <span className="brand-dot brand-light"></span>
            <span className="brand-name">WIC MIC Workspace</span>
          </div>
        </div>

        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="login-card-header">
            <h2>Connexion</h2>
            <p>Accédez à votre espace sécurisé.</p>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              name="email"
              placeholder="nom.prenom@wicmic.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Minimum 8 caractères"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="field-error">{errors.password}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="role">Type d'utilisateur</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Choisir un rôle</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && <p className="field-error">{errors.role}</p>}
          </div>

          <div className="login-links-row">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>

          <div className="button-row">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Annuler
            </button>
          </div>

          <p className="bottom-text">
            Pas encore de compte ? <Link to="/register">Créer un compte</Link>
          </p>
        </form>
      </div>
    </div>
  );
}