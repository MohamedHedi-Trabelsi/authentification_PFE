import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

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

  const [message, setMessage] = useState("");

  const roles = [
    "Responsable de production",
    "Manager",
    "Analyste décisionnel",
  ];


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      newErrors.email = "Email invalide.";
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Le mot de passe est obligatoire.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (!formData.role) {
      newErrors.role = "Veuillez choisir votre rôle.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((value) => value === "");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    try {
      const response = await loginUser(formData);

      if (response.token) {
      
        navigate("/dashboard");
      } else {
        // ❌ erreur backend
        setMessage(response.message || "Erreur de connexion");
      }
    } catch (error) {
      setMessage("Erreur serveur. Réessayez plus tard.");
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

    setMessage("");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Connexion</h2>

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="nom.prenom@gmail.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>Mot de passe</label>
        <input
          type="password"
          name="password"
          placeholder="Minimum 8 caractères"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Type d'utilisateur</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="">Choisir un rôle</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && <p className="error">{errors.role}</p>}

        <div className="top-link">
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
        </div>

        {message && <p className="info">{message}</p>}

        <div className="button-row">
          <button type="submit" className="primary-btn">
            Se connecter
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={handleCancel}
          >
            Annuler
          </button>
        </div>

        <p className="bottom-text">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
}