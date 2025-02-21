"use client";

import { FaChevronDown } from "react-icons/fa"; // Ok ikonu için
import "./selectComponent.scss";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[];
}

export default function SelectComponent({ options, ...props }: SelectProps) {
  return (
    <div className="selectWrapper">
      <select {...props}>
        <option value="" disabled>
          Select a category
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FaChevronDown className="dropdownIcon" />
    </div>
  );
}
