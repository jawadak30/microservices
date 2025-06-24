// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar5 from '../components/ui/Navbar5';

// import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ width: '100%' }}>
      <Navbar5 />
      <main className="flex-grow p-4">
        <Outlet /> {/* Changes based on the route */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
