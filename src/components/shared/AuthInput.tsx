import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  rightIcon?: React.ReactNode;
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  rightIcon
}) => {
  return (
    <div className="relative">
      <label 
        data-aos="fade-right"
        htmlFor={id} 
        className="block text-sm font-serif font-medium mb-2 tracking-wide"
        style={{ color: '#5a7a82' }}
      >
        {label}
      </label>
      <div className="relative">
        <Icon 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
          style={{ color: '#6b7c7e' }}
          strokeWidth={1.5}
        />
        <input
          required={required}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 border-2 font-serif text-base transition-all duration-300 focus:outline-none focus:border-opacity-100"
          style={{ 
            backgroundColor: '#f5f1ed',
            borderColor: '#b8aea0',
            color: '#3d5055'
          }}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthInput;