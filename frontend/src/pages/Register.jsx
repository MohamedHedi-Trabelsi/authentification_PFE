import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const roles = [
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
      name: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.name.trim() === "") {
      newErrors.name = "Le nom est obligatoire.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères.";
    }

    if (formData.email.trim() === "") {
      newErrors.email = "L'email est obligatoire.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Veuillez entrer un email valide.";
    }

    if (formData.role === "") {
      newErrors.role = "Veuillez choisir un rôle.";
    }

    if (formData.password === "") {
      newErrors.password = "Le mot de passe est obligatoire.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (formData.confirmPassword === "") {
      newErrors.confirmPassword =
        "Veuillez confirmer votre mot de passe.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        "Les mots de passe ne correspondent pas.";
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
      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        password: formData.password,
      });

      if (response?.user || response?._id || response?.email) {
        showToast(
          "Compte créé avec succès. En attente de validation par le manager.",
          "success",
          4000
        );

        setFormData({
          name: "",
          email: "",
          role: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showToast(response?.message || "Erreur lors de l'inscription.", "error");
      }
    } catch (error) {
      showToast("Erreur serveur. Réessayez plus tard.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({
      name: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="auth-screen wicmic-login-bg">
      <div className="login-shell">
        <div className="login-brand-panel">
          <p className="section-kicker">WIC MIC</p>
          <h1>Créer un compte</h1>
          <p className="login-brand-text">
            Enregistrez un nouvel utilisateur dans l’espace sécurisé WIC MIC.
            Après inscription, le compte devra être validé par le manager avant
            activation.
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
            <h2>Inscription</h2>
            <p>Complétez les informations pour créer un compte.</p>
          </div>

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
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="email">Adresse email</label>
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
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="button-row">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Création..." : "Créer un compte"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={handleReset}
              disabled={loading}
            >
              Réinitialiser
            </button>
          </div>

          <p className="bottom-text">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}