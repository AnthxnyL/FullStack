// Un composant simple pour afficher un message de succès
import React from "react";

interface SuccessMessageProps {
  message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  if (!message) return null;
  return (
    <div
      className="mb-4 p-3 rounded text-sm font-medium bg-green-100 text-green-700 border border-green-300"
      role="status"
    >
      {message}
    </div>
  );
}
