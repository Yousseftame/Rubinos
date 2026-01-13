import { Outlet } from 'react-router-dom';
import ScrollToTop from '../../components/shared/ScrollToTop';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/navbar/Navbar';

const MasterLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop />
       <Navbar />
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer />
    </div>
  );
};

export default MasterLayout;