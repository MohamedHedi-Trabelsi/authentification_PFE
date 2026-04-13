export default function ConfirmModal({
  isOpen,
  title = "Confirmer l'action",
  message = "Êtes-vous sûr ?",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <h3>{title}</h3>
        </div>

        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="secondary-btn auto-width-btn"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={danger ? "danger-soft-btn auto-width-btn" : "primary-btn auto-width-btn"}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}