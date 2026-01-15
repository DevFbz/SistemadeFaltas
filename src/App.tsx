// import { Box, BarChart3, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import React from 'react';
import { Routes,Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashBoard from './pages/Dashboard.tsx';
// function App() {
//   return (
//     //   <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
//     //   {/* NAVBAR */}
//     //   <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
//     //     <div className="flex items-center gap-2 font-black text-2xl text-blue-400 tracking-tighter">
//     //       <Box size={32} strokeWidth={3} />
//     //       <span>PHARMALOG</span>
//     //     </div>
//     //     <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-500 transition-all cursor-pointer shadow-lg shadow-blue-900/20">
//     //       Acessar Sistema
//     //     </button>
//     //   </nav>

//     //   {/* HERO SECTION */}
//     //   <header className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
//     //     <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8 tracking-tight">
//     //       Gestão de Faltas <br />
//     //       <span className="text-blue-400">Sem Complicação.</span>
//     //     </h1>
        
//     //     <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
//     //       Monitoramento em tempo real de ocorrências rj01 e rj07 para as rotas 868, 900 e 750.
//     //     </p>

//     //     <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
//     //       <button className="group bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 cursor-pointer">
//     //         Entrar no Painel
//     //         <ArrowRight size={20} />
//     //       </button>
//     //     </div>
//     //   </header>

//     //   {/* FEATURES SECTION */}
//     //   <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
//     //     <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:border-blue-500/50 transition-all">
//     //       <BarChart3 className="text-blue-400 mb-6" size={32} />
//     //       <h3 className="text-xl font-bold mb-3 text-white">Analytics</h3>
//     //       <p className="text-slate-400 leading-relaxed">Dados consolidados das faltas por região e categoria.</p>
//     //     </div>

//     //     <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:border-green-500/50 transition-all">
//     //       <Truck className="text-green-400 mb-6" size={32} />
//     //       <h3 className="text-xl font-bold mb-3 text-white">Logística</h3>
//     //       <p className="text-slate-400 leading-relaxed">Controle total sobre o desempenho das rotas principais.</p>
//     //     </div>

//     //     <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:border-purple-500/50 transition-all">
//     //       <ShieldCheck className="text-purple-400 mb-6" size={32} />
//     //       <h3 className="text-xl font-bold mb-3 text-white">Segurança</h3>
//     //       <p className="text-slate-400 leading-relaxed">Separação rigorosa entre medicamentos e perfumaria.</p>
//     //     </div>
//     //   </section>
//     // </div>
//   )
// }

const App: React.FC = () =>{
  return(
    <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashBoard />} />
      
    </Routes>
  );
}

export default App
