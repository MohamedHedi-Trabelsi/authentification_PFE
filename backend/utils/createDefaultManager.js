import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const createDefaultManager = async () => {
  try {
    const existingManager = await User.findOne({ role: "Manager" });

    if (!existingManager) {
      const hashedPassword = await bcrypt.hash("manager123", 10);

      await User.create({
        name: "Manager Principal",
        email: "manager@admin.com",
        password: hashedPassword,
        role: "Manager",
        status: "approved",
        isApproved: true,
      });

      console.log("Manager par défaut créé : manager@admin.com / manager123");
    } else {
      console.log("Manager déjà existant");
    }
  } catch (error) {
    console.error("Erreur création manager :", error.message);
  }
};