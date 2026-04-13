export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} WIC MIC - Plateforme de gestion</p>
        <div className="footer-links">
          <span>Version 1.0</span>
          <span>•</span>
          <span>Authentification & sécurité</span>
        </div>
      </div>
    </footer>
  );
}