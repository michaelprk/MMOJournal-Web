import React, { useEffect, useRef } from "react";

type ModalVariant = "success" | "error" | "info";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
  variant?: ModalVariant;
};

export default function Modal({ isOpen, title, children, onClose, variant = "info" }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    // Initial focus on close button
    const t = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);
    // body class for modal-open
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(t);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const accentClasses =
    variant === "success"
      ? "border-yellow-400 text-yellow-300"
      : variant === "error"
      ? "border-red-500 text-red-300"
      : "border-gray-500 text-white";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div
        className="relative z-[1001] w-[90%] max-w-md rounded-2xl border p-6 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(40, 40, 40, 0.95))",
        }}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md border border-white/20 px-2 py-1 text-sm text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          ×
        </button>

        <h3 id="modal-title" className={`mb-3 text-xl font-bold ${accentClasses}`}>
          {title}
        </h3>
        {children && (
          <div className="text-sm text-white/90">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}


