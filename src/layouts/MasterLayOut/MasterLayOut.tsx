
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ScrollToTop from '../../components/shared/ScrollToTop';


const MasterLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop/>
      <Navbar />
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer />
    </div>
  );
};

export default MasterLayout;