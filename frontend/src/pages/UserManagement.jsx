import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  getAllUsers,
  createUserByManager,
  updateUserByManager,
  deleteUserByManager,
  approveUser,
  rejectUser,
} from "../services/authService";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";

export default function UserManagement() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Responsable de production",
    password: "",
    status: "pending",
  });

  const [editingId, setEditingId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        showToast(data?.message || "Erreur lors du chargement.", "error");
      }
    } catch (error) {
      showToast("Erreur serveur lors du chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== "Manager") {
      navigate("/dashboard");
      return;
    }

    loadUsers();
  }, [currentUser, navigate]);

  const stats = useMemo(() => {
    const total = users.length;
    const approved = users.filter((u) => u.status === "approved").length;
    const pending = users.filter((u) => u.status === "pending").length;
    const rejected = users.filter((u) => u.status === "rejected").length;

    return { total, approved, pending, rejected };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        roleFilter === "all" ? true : user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ? true : user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "Responsable de production",
      password: "",
      status: "pending",
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
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

    if (!editingId && formData.password.trim() === "") {
      showToast("Le mot de passe est obligatoire.", "error");
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

    if (!validateForm()) return;

    try {
      let data;

      if (editingId) {
        data = await updateUserByManager(editingId, formData);
      } else {
        data = await createUserByManager(formData);
      }

      showToast(
        data?.message ||
          (editingId
            ? "Utilisateur modifié avec succès."
            : "Utilisateur ajouté avec succès."),
        "success"
      );

      resetForm();
      loadUsers();
    } catch (error) {
      showToast("Erreur serveur.", "error");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "Responsable de production",
      password: "",
      status: user.status || "pending",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Mode modification activé.", "info");
  };

  const openDeleteModal = (user) => {
    setSelectedUserId(user._id);
    setSelectedUserName(user.name);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserName("");
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;

    const data = await deleteUserByManager(selectedUserId);
    showToast(data?.message || "Utilisateur supprimé.", "success");
    closeDeleteModal();
    loadUsers();
  };

  const handleApprove = async (id) => {
    const data = await approveUser(id);
    showToast(data?.message || "Utilisateur approuvé.", "success");
    loadUsers();
  };

  const handleReject = async (id) => {
    const data = await rejectUser(id);
    showToast(data?.message || "Utilisateur refusé.", "info");
    loadUsers();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card user-management-card">
        <div className="page-header">
          <h2>Gestion des utilisateurs</h2>
          <button
            className="secondary-btn auto-width-btn"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Retour au dashboard
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-total">
            <span className="stat-label">Total</span>
            <strong className="stat-value">{stats.total}</strong>
          </div>

          <div className="stat-card stat-approved">
            <span className="stat-label">Approuvés</span>
            <strong className="stat-value">{stats.approved}</strong>
          </div>

          <div className="stat-card stat-pending">
            <span className="stat-label">En attente</span>
            <strong className="stat-value">{stats.pending}</strong>
          </div>

          <div className="stat-card stat-rejected">
            <span className="stat-label">Refusés</span>
            <strong className="stat-value">{stats.rejected}</strong>
          </div>
        </div>

        <form className="manager-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div>
              <label>Nom</label>
              <input
                type="text"
                name="name"
                placeholder="Nom complet"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="text"
                name="email"
                placeholder="email@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Rôle</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Responsable de production">
                  Responsable de production
                </option>
                <option value="Analyste décisionnel">
                  Analyste décisionnel
                </option>
              </select>
            </div>

            <div>
              <label>Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Refusé</option>
              </select>
            </div>

            <div className="full-width">
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder={
                  editingId
                    ? "Laisser vide pour ne pas changer"
                    : "Minimum 8 caractères"
                }
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="button-row manager-actions">
            <button className="primary-btn auto-width-btn" type="submit">
              {editingId ? "Mettre à jour" : "Ajouter"}
            </button>

            {editingId && (
              <button
                className="secondary-btn auto-width-btn"
                type="button"
                onClick={resetForm}
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        <div className="filters-bar">
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les rôles</option>
            <option value="Responsable de production">
              Responsable de production
            </option>
            <option value="Analyste décisionnel">
              Analyste décisionnel
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Refusé</option>
          </select>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <p>Chargement...</p>
          ) : filteredUsers.length === 0 ? (
            <p>Aucun utilisateur trouvé.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Validation</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status-badge status-${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.isApproved ? "Oui" : "Non"}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="table-btn edit-btn"
                          type="button"
                          onClick={() => handleEdit(user)}
                        >
                          Modifier
                        </button>

                        <button
                          className="table-btn delete-btn"
                          type="button"
                          onClick={() => openDeleteModal(user)}
                        >
                          Supprimer
                        </button>

                        {user.status !== "approved" && (
                          <button
                            className="table-btn approve-btn"
                            type="button"
                            onClick={() => handleApprove(user._id)}
                          >
                            Approuver
                          </button>
                        )}

                        {user.status !== "rejected" && (
                          <button
                            className="table-btn reject-btn"
                            type="button"
                            onClick={() => handleReject(user._id)}
                          >
                            Refuser
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Supprimer l'utilisateur"
          message={`Voulez-vous vraiment supprimer le compte de ${selectedUserName} ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
          danger
        />
      </div>
    </div>
  );
}