import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Le nom doit contenir au moins 3 caractères." });
    }

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Email invalide." });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      });
    }

    if (role === "Manager") {
      return res.status(400).json({
        message: "Impossible de créer un compte manager.",
      });
    }

    const userExists = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (userExists) {
      return res.status(400).json({
        message: "Utilisateur déjà existant.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
      status: "pending",
      isApproved: false,
    });

    res.status(201).json({
      message:
        "Compte créé avec succès. En attente de validation par le manager.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires." });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: "Rôle incorrect." });
    }

    if (!user.isApproved) {
      return res.status(403).json({
        message: "Votre compte est en attente de validation par le manager.",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Connexion réussie.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Email invalide." });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "Aucun compte trouvé avec cet email.",
      });
    }

    return res.status(200).json({
      message: "Demande de réinitialisation prise en compte.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
};