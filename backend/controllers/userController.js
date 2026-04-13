import bcrypt from "bcryptjs";
import User from "../models/User.js";

// PROFIL
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (name) {
      if (name.trim().length < 3) {
        return res.status(400).json({
          message: "Le nom doit contenir au moins 3 caractères.",
        });
      }
      user.name = name.trim();
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: "Email invalide." });
      }

      const existingUser = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Cet email est déjà utilisé.",
        });
      }

      user.email = email.trim().toLowerCase();
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          message: "Le mot de passe doit contenir au moins 8 caractères.",
        });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès.",
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
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

// MANAGER - TOUS LES UTILISATEURS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Manager" } })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

// MANAGER - UTILISATEURS EN ATTENTE
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: "Manager" },
      status: "pending",
      isApproved: false,
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

// MANAGER - AJOUTER UN UTILISATEUR
export const createUserByManager = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    if (role === "Manager") {
      return res.status(400).json({ message: "Impossible de créer un autre manager." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.trim().length < 3) {
      return res.status(400).json({ message: "Le nom doit contenir au moins 3 caractères." });
    }

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Email invalide." });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      });
    }

    const userExists = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (userExists) {
      return res.status(400).json({ message: "Utilisateur déjà existant." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const finalStatus =
      status === "approved" || status === "rejected" ? status : "pending";

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
      status: finalStatus,
      isApproved: finalStatus === "approved",
    });

    res.status(201).json({
      message: "Utilisateur ajouté avec succès.",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

// MANAGER - MODIFIER UN UTILISATEUR
export const updateUserByManager = async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (user.role === "Manager") {
      return res.status(403).json({ message: "Modification du manager interdite." });
    }

    if (name) {
      if (name.trim().length < 3) {
        return res.status(400).json({
          message: "Le nom doit contenir au moins 3 caractères.",
        });
      }
      user.name = name.trim();
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: "Email invalide." });
      }

      const existingUser = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Cet email est déjà utilisé.",
        });
      }

      user.email = email.trim().toLowerCase();
    }

    if (role) {
      if (role === "Manager") {
        return res.status(400).json({ message: "Impossible d'attribuer le rôle Manager." });
      }
      user.role = role;
    }

    if (status) {
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Statut invalide." });
      }

      user.status = status;
      user.isApproved = status === "approved";
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          message: "Le mot de passe doit contenir au moins 8 caractères.",
        });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès.",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

// MANAGER - SUPPRIMER
export const deleteUserByManager = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (user.role === "Manager") {
      return res.status(403).json({ message: "Suppression du manager interdite." });
    }

    await user.deleteOne();

    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

// MANAGER - APPROUVER
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    user.status = "approved";
    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: "Utilisateur approuvé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

// MANAGER - REFUSER
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    user.status = "rejected";
    user.isApproved = false;
    await user.save();

    res.status(200).json({ message: "Utilisateur refusé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};