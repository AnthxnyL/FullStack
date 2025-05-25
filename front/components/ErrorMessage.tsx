// Un composant simple pour afficher un message d'erreur ou de succès
import React from "react";

interface ErrorMessageProps {
  message: string;
  type?: "error" | "success";
}

export default function ErrorMessage({ message, type = "error" }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <div
      className={`mb-4 p-3 rounded text-sm font-medium ${
        type === "success"
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-red-100 text-red-700 border border-red-300"
      }`}
      role={type === "error" ? "alert" : undefined}
    >
      {message}
    </div>
  );
}
