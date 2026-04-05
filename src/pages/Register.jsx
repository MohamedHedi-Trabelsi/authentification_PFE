import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveRegisteredUser, getRegisteredUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

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
      name: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.name.trim().length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères.";
    }

    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Veuillez entrer un email valide.";
    }

    if (!formData.role) {
      newErrors.role = "Veuillez choisir un rôle.";
    }

    if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Veuillez confirmer votre mot de passe.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        "Les mots de passe ne correspondent pas.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((value) => value === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    const existingUser = getRegisteredUser();

    if (
      existingUser &&
      existingUser.email.toLowerCase() === formData.email.trim().toLowerCase()
    ) {
      setMessage("Un compte avec cet email existe déjà.");
      return;
    }

    saveRegisteredUser({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      password: formData.password,
    });

    setMessage("Compte créé avec succès.");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Créer un compte</h2>

        <label>Nom complet</label>
        <input
          type="text"
          name="name"
          placeholder="Entrez votre nom"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="nom.prenom@gmail.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

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

        <label>Mot de passe</label>
        <input
          type="password"
          name="password"
          placeholder="Minimum 8 caractères"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Confirmer le mot de passe</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmez le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        {message && <p className="info">{message}</p>}

        <button type="submit" className="primary-btn">
          Créer un compte
        </button>

        <p className="bottom-text">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}