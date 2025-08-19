"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}

export default function CustomDropdown({
  label,
  options,
  value,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSelect = (option: string) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <div className="mb-5">
      <label className="block text-[15px] font-medium mb-1 text-[#0f0f0f]">
        {label}
      </label>

      <button
        type="button"
        className="w-full bg-white rounded-[15px] px-3 py-4 flex justify-between items-center focus:outline-none"
        onClick={toggleDropdown}
      >
        <span className="text-base text-black">{value}</span>
        {open ? (
          <ChevronUp size={20} color="#000" />
        ) : (
          <ChevronDown size={20} color="#000" />
        )}
      </button>

      {open && (
        <div className="mt-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className="w-full border border-[#e0e0e0] rounded-lg p-3 mt-1 bg-[#f9f9f9] text-left hover:bg-gray-100 focus:outline-none"
              onClick={() => handleSelect(option)}
            >
              <span className="text-base text-black">{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
