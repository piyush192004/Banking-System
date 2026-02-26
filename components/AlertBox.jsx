"use client";

import { useState } from "react";

export default function AlertBox({ message, type = "info", onClose }) {
  if (!message) return null;

  const bgColor =
    type === "success"
      ? "bg-green-100"
      : type === "error"
      ? "bg-red-100"
      : "bg-blue-100";
  const textColor =
    type === "success"
      ? "text-green-800"
      : type === "error"
      ? "text-red-800"
      : "text-blue-800";
  const borderColor =
    type === "success"
      ? "border-green-400"
      : type === "error"
      ? "border-red-400"
      : "border-blue-400";

  return (
    <div
      className={`${bgColor} ${textColor} ${borderColor} border-l-4 p-4 mb-4 rounded`}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg leading-none opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
