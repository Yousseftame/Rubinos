import { type InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: 'mail' | 'lock' | 'user';
  error?: string;
  showPasswordToggle?: boolean;
}

export const AuthInput = ({
  label,
  icon,
  error,
  showPasswordToggle = false,
  type = 'text',
  ...props
}: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  const getIcon = () => {
    switch (icon) {
      case 'mail':
        return <Mail className="w-5 h-5" strokeWidth={1.5} />;
      case 'lock':
        return <Lock className="w-5 h-5" strokeWidth={1.5} />;
      case 'user':
        return <User className="w-5 h-5" strokeWidth={1.5} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <label
        data-aos="fade-right"
        className="block text-sm font-serif font-medium mb-2 tracking-wide"
        style={{ color: '#5a7a82' }}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: '#6b7c7e' }}
          >
            {getIcon()}
          </div>
        )}
        <input
          type={inputType}
          className={`w-full py-3.5 border-2 font-serif text-base transition-all duration-300 focus:outline-none ${
            icon ? 'pl-12' : 'pl-4'
          } ${showPasswordToggle ? 'pr-12' : 'pr-4'} ${error ? 'border-red-500' : ''}`}
          style={{
            backgroundColor: '#f5f1ed',
            borderColor: error ? '#e53e3e' : '#b8aea0',
            color: '#3d5055',
          }}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" style={{ color: '#6b7c7e' }} strokeWidth={1.5} />
            ) : (
              <Eye className="w-5 h-5" style={{ color: '#6b7c7e' }} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};