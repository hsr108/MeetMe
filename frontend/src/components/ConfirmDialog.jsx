import { useEffect } from "react";
import { createPortal } from "react-dom";
import "../styles/confirmDialog.css";

// Modal yes/no prompt. Rendered into <body> so a parent with backdrop-filter or transform
// (like the navbar) cannot trap the fixed overlay. Escape or a click outside cancels.
function ConfirmDialog({ isOpen, title, message, confirmLabel, onConfirm, onCancel, isBusy }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="confirm-actions">
          <button type="button" className="confirm-cancel" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button type="button" className="confirm-ok" onClick={onConfirm} disabled={isBusy}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmDialog;
