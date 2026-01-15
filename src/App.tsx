// import { Box, BarChart3, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import React from 'react';
import { Routes,Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashBoard from './pages/DashBoard.tsx';

const App: React.FC = () =>{
  return(
    <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashBoard />} />
      
    </Routes>
  );
}

export default App
