import React, { useEffect, useState } from "react";
import { LogOut, X } from "lucide-react";

export function LogoutConfirmModal({ isOpen, onClose, onConfirm, user }) {
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [isConfirmHovered, setIsConfirmHovered] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(15, 23, 42, 0.35)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid="logout-confirm-modal"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "350px",
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.08)",
          padding: "1.25rem",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
          animation: "scaleIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
          boxSizing: "border-box",
        }}
      >
        {/* Subtle Close Icon */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          data-testid="logout-cancel-x"
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "26px",
            height: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isCloseHovered ? "#f1f5f9" : "transparent",
            border: "none",
            outline: "none",
            borderRadius: "6px",
            color: isCloseHovered ? "#334155" : "#94a3b8",
            cursor: "pointer",
            padding: 0,
            transition: "all 0.12s ease",
          }}
        >
          <X size={15} />
        </button>

        {/* Content */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", paddingRight: "1rem" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LogOut size={16} />
          </div>

          <div style={{ flex: 1 }}>
            <h3
              id="logout-dialog-title"
              style={{
                margin: 0,
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#0f172a",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}
            >
              Sign out of Legal AI?
            </h3>
            <p
              style={{
                margin: "0.25rem 0 0 0",
                fontSize: "0.8rem",
                color: "#64748b",
                lineHeight: 1.45,
              }}
            >
              You will be redirected to the homepage. Any unsaved changes in active sessions will be closed.
            </p>
          </div>
        </div>

        {/* Buttons Row */}
        <div
          style={{
            marginTop: "1.15rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            data-testid="logout-cancel-btn"
            onMouseEnter={() => setIsCancelHovered(true)}
            onMouseLeave={() => setIsCancelHovered(false)}
            style={{
              padding: "0.45rem 0.85rem",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: isCancelHovered ? "#0f172a" : "#475569",
              backgroundColor: isCancelHovered ? "#f1f5f9" : "#ffffff",
              border: "1px solid #cbd5e1",
              outline: "none",
              borderRadius: "7px",
              cursor: "pointer",
              transition: "all 0.12s ease",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            data-testid="logout-confirm-btn"
            onMouseEnter={() => setIsConfirmHovered(true)}
            onMouseLeave={() => setIsConfirmHovered(false)}
            style={{
              padding: "0.45rem 0.95rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: isConfirmHovered ? "#1e293b" : "#0f172a",
              border: "none",
              outline: "none",
              borderRadius: "7px",
              cursor: "pointer",
              transition: "all 0.12s ease",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmModal;
