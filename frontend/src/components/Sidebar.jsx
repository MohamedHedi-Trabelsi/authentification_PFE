import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";

export default function Sidebar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-logo-mark">
            <span className="mark-blue"></span>
            <span className="mark-green"></span>
            <span className="mark-light"></span>
          </div>
          <div>
            <h2>WIC MIC</h2>
            <p>Workspace</p>
          </div>
        </div>

        <div className="sidebar-user-box">
          <span className="sidebar-user-role">{user.role}</span>
          <strong>{user.name}</strong>
          <small>{user.email}</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={isActive("/dashboard") ? "sidebar-link active" : "sidebar-link"}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        {user.role === "Manager" && (
          <button
            className={isActive("/users") ? "sidebar-link active" : "sidebar-link"}
            onClick={() => navigate("/users")}
          >
            Gestion utilisateurs
          </button>
        )}

        <button
          className={isActive("/profile") ? "sidebar-link active" : "sidebar-link"}
          onClick={() => navigate("/profile")}
        >
          Gestion profil
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-toggle" onClick={toggleDarkMode}>
          {darkMode ? "Mode clair" : "Mode sombre"}
        </button>

        <button className="sidebar-logout" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}