import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-screen bg-[#F9FAFB] overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">

        {/* Top Navbar */}
        <AdminNavbar />

        {/* Page Content (tables scroll here) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-8 py-6 min-w-0">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
