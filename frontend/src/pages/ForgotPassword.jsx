import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import { useToast } from "../context/ToastContext";

export default function ForgotPassword() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "") {
      setError("L'email est obligatoire.");
      showToast("L'email est obligatoire.", "error");
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Veuillez entrer un email valide.");
      showToast("Veuillez entrer un email valide.", "error");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await forgotPassword(email.trim().toLowerCase());
      showToast(response.message || "Demande envoyée.", "success");
      setEmail("");
    } catch (error) {
      showToast("Erreur serveur.", "error");
    }
  };

  return (
    <div className="auth-screen wicmic-login-bg">
      <div className="login-shell">
        <div className="login-brand-panel">
          <p className="section-kicker">WIC MIC</p>
          <h1>Mot de passe oublié</h1>
          <p className="login-brand-text">
            Saisissez votre adresse email pour lancer la procédure de
            réinitialisation.
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
            <h2>Réinitialisation</h2>
            <p>Entrez votre email pour continuer.</p>
          </div>

          <div className="input-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              type="text"
              placeholder="exemple@wicmic.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
            {error && <p className="field-error">{error}</p>}
          </div>

          <div className="button-row">
            <button type="submit" className="primary-btn">
              Envoyer
            </button>
          </div>

          <p className="bottom-text">
            <Link to="/login">Retour à la connexion</Link>
          </p>
        </form>
      </div>
    </div>
  );
}