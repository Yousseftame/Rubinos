import React, { useState } from 'react';
import { 
  Dashboard,
  MenuBook,
  CalendarMonth,
  Image,
  Mail,
  Settings,
  Logout
} from '@mui/icons-material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const navigate = useNavigate();


 const menuItems = [
  { id: 'categories', label: 'Categories', icon: Dashboard, path: '/admin/categories' },
  { id: 'menu', label: 'Menu Management', icon: MenuBook, path: '/admin/menu' },
  { id: 'gallery', label: 'Gallery', icon: Image, path: '/admin/gallery' },
  { id: 'contact', label: 'Messages', icon: Mail, path: '/admin/contact' },
  { id: 'section', label: 'Sections', icon: Settings, path: '/admin/section' },
];


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        className={`text-stone-50 transition-all duration-400 ease-in-out relative ${
          collapsed ? 'w-20' : 'w-72'
        }`}
        style={{
          backgroundColor: '#3D5257'
        }}
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center justify-center px-6 border-b border-[#D7CDC1]/10">
          {!collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <img src='/Rubino’s.png' alt='Rubinos' className="h-22 object-contain" />
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              <span className="text-5xl font-serif text-[#D7CDC1]">R</span>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-4 space-y-1 overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  navigate(item.path);
                }
                }
                className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-4 px-5'} py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#D7CDC1]/15' 
                    : 'hover:bg-[#D7CDC1]/5'
                }`}
              >
                {/* Active Indicator */}
                {isActive && !collapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#D7CDC1] rounded-r"></div>
                )}
                
                <Icon 
                  className={`transition-colors duration-200 flex-shrink-0 ${
                    isActive 
                      ? 'text-[#D7CDC1]' 
                      : 'text-[#D7CDC1]/50 group-hover:text-[#D7CDC1]/80'
                  }`} 
                  style={{ fontSize: '20px' }}
                />
                {!collapsed && (
                  <span 
                    className={`text-[19px] tracking-wide transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis  ${
                      isActive ? 'text-[#D7CDC1] font-bold' : 'text-[#D7CDC1]/60 group-hover:text-[#D7CDC1]/90'
                    }`}
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#D7CDC1]/10 overflow-hidden">
          <div className="px-4 py-4">
            <button
              className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-4 px-5'} py-3 rounded-lg hover:bg-[#D7CDC1]/5 transition-all duration-200 group`}
            >
              <Logout 
                className={`transition-colors duration-200 flex-shrink-0 text-[#D7CDC1]/50 group-hover:text-red-400/80`} 
                style={{ fontSize: '20px' }}
              />
              {!collapsed && (
                <span 
                  className="text-[15px] tracking-wide text-[#D7CDC1]/60 group-hover:text-red-400/90 transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-28 bg-[#3D5257] border border-[#D7CDC1]/20 rounded-full p-1.5 text-[#D7CDC1]/60 hover:text-[#D7CDC1] hover:border-[#D7CDC1]/40 transition-all duration-200 shadow-lg"
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      
    </div>
  );
};

export default Sidebar;