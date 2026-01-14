import { type ButtonHTMLAttributes } from 'react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export const AuthButton = ({
  isLoading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  ...props
}: AuthButtonProps) => {
  return (
    <button
      className="w-full py-4 font-serif text-sm font-medium tracking-widest transition-all hover:opacity-85 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: '#3d5055',
        color: '#f5f1ed',
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};
