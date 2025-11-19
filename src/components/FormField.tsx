import React from 'react';

export default function FormField({
  label, children
}: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm mb-1">{label}</span>
      {children}
    </label>
  );
}
