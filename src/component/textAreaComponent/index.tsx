import React from 'react';

//style
import './textAreaComponent.scss';

interface TextAreaProps {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextAreaComponent({ name, placeholder, value, onChange }: TextAreaProps) {
  return (
    <div className="textAreaComponent">
      <textarea 
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}
