import {  User } from 'lucide-react';
import { useAuth } from '../../store/AuthContext/AuthContext';

const AdminNavbar = () => {
  const { user } = useAuth();
  const adminName = user?.displayName || 'Admin';


  return (
    <header
    
      className="w-full h-20 flex items-center justify-between px-10 border-b"
      style={{
        backgroundColor: '#F9FAFB',
        borderColor: 'rgba(215, 205, 193, 0.4)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Left - Welcome */}
      <div className="flex flex-col">
        <span
          className="text-sm tracking-wide"
          style={{
            color: '#3D5257',
            fontFamily: 'Cinzel, serif',
            opacity: 0.75,
          }}
        >
          Good to see you again

        </span>

        <span
          className="text-lg font-semibold tracking-wide"
          style={{
            color: '#3D5257',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {adminName}
        </span>
      </div>

      {/* Right - Profile */}
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: '#D7CDC1',
            color: '#3D5257',
          }}
        >
          <User size={18} />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
