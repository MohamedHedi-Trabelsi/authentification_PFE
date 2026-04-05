import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h2>Dashboard</h2>
        <p>
          <strong>Nom :</strong> {user?.name}
        </p>
        <p>
          <strong>Email :</strong> {user?.email}
        </p>
        <p>
          <strong>Rôle :</strong> {user?.role}
        </p>

        <button className="primary-btn" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}