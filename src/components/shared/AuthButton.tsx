import React from 'react';

interface AuthButtonProps {
  text: string;
  isLoading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ 
  text, 
  isLoading = false,
  onClick,
  type = 'submit',
  disabled = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full py-4  text-sm font-medium tracking-widest transition-all hover:opacity-85 duration-300"
      style={{ 
        backgroundColor: '#3A5F58',
        color: '#f5f1ed'
      }}
      disabled={isLoading || disabled}
    >
      {isLoading ? "Loading..." : text}
    </button>
  );
};

export default AuthButton;