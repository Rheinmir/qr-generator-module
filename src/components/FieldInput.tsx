import React from 'react';
import { XCircle } from 'lucide-react';
import type { Field } from '../types';

interface FieldInputProps {
  field: Field;
  onUpdate: (id: number, key: keyof Field, value: string) => void;
  onRemove: (id: number) => void;
}

export const FieldInput: React.FC<FieldInputProps> = ({ field, onUpdate, onRemove }) => {
  return (
    <div className="group flex items-center gap-3 animate-in fade-in duration-300">
      <div className="flex-1 flex items-center bg-[#F5F5F7] rounded-xl px-3 py-2.5 border border-transparent focus-within:bg-white focus-within:border-black transition-all shadow-sm overflow-hidden">
        <input
          type="text"
          className="w-20 md:w-24 text-[10px] font-bold text-black bg-transparent outline-none uppercase tracking-tighter border-r border-gray-200 mr-3 pr-2 flex-shrink-0"
          value={field.key}
          onChange={(e) => onUpdate(field.id, 'key', e.target.value)}
          placeholder="KEY"
        />
        <input
          type="text"
          className="flex-1 min-w-0 text-sm bg-transparent outline-none text-gray-700 font-medium"
          value={field.value}
          onChange={(e) => onUpdate(field.id, 'value', e.target.value)}
          placeholder="Nhập nội dung..."
        />
      </div>
      <button
        onClick={() => onRemove(field.id)}
        className="text-gray-300 hover:text-red-500 transition-colors p-2 flex-shrink-0"
        title="Remove field"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};
