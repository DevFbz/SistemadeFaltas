import React, { useState } from 'react';
import { 
  LayoutDashboard, Box, Truck, BarChart2, 
  Settings, Bell, Search, Plus, 
  X, Calendar, Layers, MapPin, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Interface para o tipo de Falta
interface Falta {
  id: number;
  rota: string;
  grupoRemessa: string;
  dataFaturamento: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados para navegação e dados
  const [activeTab, setActiveTab] = useState<'overview' | 'faltas'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faltas, setFaltas] = useState<Falta[]>([
    { id: 1, rota: '868', grupoRemessa: 'G1 / R01', dataFaturamento: '2023-10-25' }
  ]);

  // Estado do Formulário
  const [newFalta, setNewFalta] = useState({ rota: '', grupoRemessa: '', dataFaturamento: '' });

  const handleAddFalta = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now();
    setFaltas([...faltas, { id, ...newFalta }]);
    setNewFalta({ rota: '', grupoRemessa: '', dataFaturamento: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans md:grid md:grid-cols-[240px_1fr] md:grid-rows-[64px_1fr]">
      
      {/* MODAL DE ADICIONAR FALTA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white italic">Nova Falta</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddFalta} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">Rota</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-blue-500" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: 868" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all"
                    value={newFalta.rota}
                    onChange={(e) => setNewFalta({...newFalta, rota: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">Grupo / Remessa</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-3.5 text-blue-500" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: G1 / R07" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all"
                    value={newFalta.grupoRemessa}
                    onChange={(e) => setNewFalta({...newFalta, grupoRemessa: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">Data de Faturamento</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 text-blue-500" size={18} />
                  <input 
                    required
                    type="date" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-slate-300"
                    value={newFalta.dataFaturamento}
                    onChange={(e) => setNewFalta({...newFalta, dataFaturamento: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-4">
                Confirmar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="col-start-2 row-start-1 border-b border-slate-800/60 px-8 flex items-center justify-between">
        <h2 className="font-bold text-slate-500 uppercase text-xs tracking-[0.3em]">Operação Ativa</h2>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/10"></div>
      </header>

      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col row-span-2 border-r border-slate-800/60 bg-[#020617] p-6">
        <div className="text-blue-500 font-black text-2xl mb-12 flex items-center gap-2">
          <Box size={32} />
          <span className="text-white">PHARMA<span className="text-blue-500">LOG</span></span>
        </div>

        <nav className="space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <NavItem 
            icon={<AlertTriangle size={20}/>} 
            label="Faltas" 
            active={activeTab === 'faltas'} 
            onClick={() => setActiveTab('faltas')} 
          />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="p-8 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]">
        
        {activeTab === 'overview' ? (
          <div>
            <h1 className="text-4xl font-black text-white mb-8">Visão Geral</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total de Faltas</p>
                <p className="text-4xl font-black text-white mt-2">{faltas.length}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Gerenciar Faltas</h1>
                <p className="text-slate-500 mt-1">Listagem de ocorrências por Rota e Remessa.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus size={20} /> Adicionar Falta
              </button>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800/30 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-5">Rota</th>
                    <th className="px-8 py-5">Grupo / Remessa</th>
                    <th className="px-8 py-5">Data Faturamento</th>
                    <th className="px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {faltas.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="px-8 py-6 font-black text-white tracking-tighter text-lg">#{f.rota}</td>
                      <td className="px-8 py-6 text-slate-400 font-medium">{f.grupoRemessa}</td>
                      <td className="px-8 py-6 text-slate-500 text-sm italic">{f.dataFaturamento}</td>
                      <td className="px-8 py-6 text-right">
                        <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase inline-flex items-center gap-1.5">
                          <CheckCircle2 size={12} /> Registrado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {faltas.length === 0 && (
                <div className="p-20 text-center text-slate-600 font-medium">Nenhuma falta cadastrada.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Componentes auxiliares
const NavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}>
    {icon} {label}
  </button>
);

const AlertTriangle = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

export default Dashboard;