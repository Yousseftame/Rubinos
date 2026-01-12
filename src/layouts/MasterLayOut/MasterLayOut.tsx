import { type ReactNode } from 'react';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import { Outlet } from 'react-router-dom';


const MasterLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer />
    </div>
  );
};

export default MasterLayout;