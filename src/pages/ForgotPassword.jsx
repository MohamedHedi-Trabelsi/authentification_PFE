import { useState } from "react";
import { Link } from "react-router-dom";
import { getRegisteredUser } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "") {
      setError("L'email est obligatoire.");
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Veuillez entrer un email valide.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    const savedUser = getRegisteredUser();

    if (!savedUser) {
      setMessage("Aucun compte enregistré.");
      return;
    }

    if (savedUser.email !== email.trim().toLowerCase()) {
      setMessage("Aucun compte trouvé avec cet email.");
      return;
    }

    setMessage("Un lien de réinitialisation serait envoyé à cet email.");
    setEmail("");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Mot de passe oublié</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
        {message && <p className="info">{message}</p>}

        <button type="submit" className="primary-btn">
          Envoyer
        </button>

        <p className="bottom-text">
          <Link to="/login">Retour à la connexion</Link>
        </p>
      </form>
    </div>
  );
}