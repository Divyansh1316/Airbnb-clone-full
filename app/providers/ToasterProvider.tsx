"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        className: "font-medium shadow-lg",
        style: {
          background: "var(--toast-surface)",
          color: "var(--toast-text)",
          border: "1px solid var(--toast-border)",
        },
      }}
    />
  );
};

export default ToasterProvider;
