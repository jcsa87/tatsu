import { X } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({
  isOpen,
  onClose,
  side = "left",
  title,
  children,
}) {
  // Determinamos las clases dinámicas
  const sidebarClasses = `sidebar ${side} ${isOpen ? "open" : "closed"}`;
  const backdropClasses = `sidebar-backdrop ${isOpen ? "visible" : ""}`;

  return (
    <>
      {/* Fondo oscuro */}
      <div className={backdropClasses} onClick={onClose} aria-hidden="true" />

      {/* Panel Lateral */}
      <aside className={sidebarClasses} aria-label={`${title} Panel`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{title}</h2>
          <button
            onClick={onClose}
            className="close-btn"
            aria-label="Close panel"
          >
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-content">{children}</div>
      </aside>
    </>
  );
}
