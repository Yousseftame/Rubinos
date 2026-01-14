import { type ReactNode } from 'react';

interface AlertCardProps {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  children?: ReactNode;
}

export const AlertCard = ({ type, title, message }: AlertCardProps) => {
  const styles = {
    success: {
      bg: '#f0fff4',
      text: '#22543d',
      border: '#38a169',
    },
    error: {
      bg: '#fff5f5',
      text: '#742a2a',
      border: '#e53e3e',
    },
    info: {
      bg: '#eff6ff',
      text: '#1e3a8a',
      border: '#3b82f6',
    },
  };

  const style = styles[type];

  return (
    <div
      className="mb-6 px-6 py-4 rounded-2xl shadow-md"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderLeft: `4px solid ${style.border}`,
      }}
    >
      <span className="font-head text-lg">{title}</span>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
};