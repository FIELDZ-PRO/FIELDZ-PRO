import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

type FullscreenModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const FullscreenModal: React.FC<FullscreenModalProps> = ({ onClose, children }) => {
  const elRef = useRef(document.createElement("div"));

  useEffect(() => {
    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) {
      console.error("❌ #modal-root non trouvé !");
      return;
    }

    const el = elRef.current;
    el.setAttribute("style", "position: fixed; inset: 0; z-index: 9999; background: white; overflow-y: auto; display: flex; justify-content: center; align-items: start; padding: 3rem 1rem;");
    modalRoot.appendChild(el);
    document.body.style.overflow = "hidden";

    return () => {
      modalRoot.removeChild(el);
      document.body.style.overflow = "auto";
    };
  }, []);

  const content = (
    <div style={{
      position: "relative",
      width: "100%",
      maxWidth: "768px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      padding: "2rem",
    }}>
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          fontSize: "1.5rem",
          color: "#555",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
      {children}
    </div>
  );

  return ReactDOM.createPortal(content, elRef.current);
};

export default FullscreenModal;
