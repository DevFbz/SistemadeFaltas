import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Box, Truck, BarChart2, 
  Settings, Bell, Search, Filter, 
  ChevronRight, ArrowLeft, Package, AlertTriangle,
  Plus, X, Calendar, Layers, MapPin, Download, Database, Trash2, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Interfaces ---
interface Falta {
  id: string;
  rota: string;
  grupoRemessa: string;
  dataFaturamento: string;
  dataFalta: string;
  volume: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState<'faltas' | 'dashboard' | 'relatorios'>('faltas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faltas, setFaltas] = useState<Falta[]>(() => {
    const saved = localStorage.getItem('@Pharmalog:faltas');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    rota: '', grupoRemessa: '', dataFaturamento: '', dataFalta: '', volume: ''
  });

  // --- PERSISTÊNCIA ---
  useEffect(() => {
    localStorage.setItem('@Pharmalog:faltas', JSON.stringify(faltas));
  }, [faltas]);

  // --- LÓGICA DE MANIPULAÇÃO ---
  const handleAddFalta = (e: React.FormEvent) => {
    e.preventDefault();
    const nova: Falta = {
      id: Math.random().toString(36).substr(2, 9),
      rota: formData.rota, // Padrão solicitado: xxx_xxx
      grupoRemessa: formData.grupoRemessa,
      dataFaturamento: formData.dataFaturamento,
      dataFalta: formData.dataFalta,
      volume: String(formData.volume)
    };
    setFaltas([nova, ...faltas]); // Adiciona no topo da lista
    setIsModalOpen(false);
    setFormData({ rota: '', grupoRemessa: '', dataFaturamento: '', dataFalta: '', volume: '' });
  };

  const deletarFalta = (id: string) => {
    if(window.confirm("Deseja realmente remover este registro?")) {
      setFaltas(faltas.filter(f => f.id !== id));
    }
  };

  // --- DADOS PARA DASHBOARD ---
  const chartData = useMemo(() => {
    const map = faltas.reduce((acc: any, curr) => {
      acc[curr.rota] = (acc[curr.rota] || 0) + curr.volume;
      return acc;
    }, {});
    return Object.keys(map).map(key => ({ name: key, total: map[key] }));
  }, [faltas]);

  // --- EXPORTAÇÕES ---
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Relatório de Faltas - Pharmalog", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [['Rota', 'Grupo/Remessa', 'Faturamento', 'Data Falta', 'Vol']],
      body: faltas.map(f => [f.rota, f.grupoRemessa, f.dataFaturamento, f.dataFalta, f.volume]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });
    doc.save(`faltas_pharmalog_${new Date().toLocaleDateString()}.pdf`);
  };

  const exportarJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(faltas, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "backup_faltas.json");
    dl.click();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30
      md:grid md:grid-cols-[240px_1fr] md:grid-rows-[64px_1fr]">
      
      {/* MODAL ADICIONAR FALTA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-10 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
            <h2 className="text-3xl font-black text-white mb-2 italic">Registrar Falta</h2>
            <p className="text-slate-500 text-sm mb-8">Preencha os dados da ocorrência operacional.</p>
            
            <form onSubmit={handleAddFalta} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-2 ml-1 tracking-widest">Identificação da Rota</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-blue-500" size={16} />
                  <input required type="text" placeholder="Ex: 868_201" className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-mono text-white" value={formData.rota} onChange={e => setFormData({...formData, rota: e.target.value})} />
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-2 ml-1 tracking-widest">Grupo / Remessa</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-3.5 text-blue-500" size={16} />
                  <input required type="text" placeholder="G1 / R01" className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-white" value={formData.grupoRemessa} onChange={e => setFormData({...formData, grupoRemessa: e.target.value})} />
                </div>
              </div>

              <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block ml-1 tracking-widest">Faturamento</label>
                <input required type="date" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 outline-none focus:border-blue-500 text-white" value={formData.dataFaturamento} onChange={e => setFormData({...formData, dataFaturamento: e.target.value})} />
              </div>
              
              <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block ml-1 tracking-widest">Data da Falta</label>
                <input required type="date" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 outline-none focus:border-blue-500 text-white" value={formData.dataFalta} onChange={e => setFormData({...formData, dataFalta: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block ml-1 tracking-widest">Volume</label>
                <input required type="number" placeholder="0" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 outline-none focus:border-blue-500 text-white" value={formData.volume} onChange={e => setFormData({...formData, volume: e.target.value})} />
              </div>

              <button className="col-span-2 bg-blue-600 py-4 rounded-2xl font-black text-white mt-4 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]">
                REGISTRAR NO SISTEMA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 1. HEADER */}
      <header className="col-start-2 row-start-1 bg-[#020617]/50 backdrop-blur-xl border-b border-slate-800/60 px-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 px-4 py-1.5 rounded-full w-96">
          <Search size={18} className="text-slate-500" />
          <input type="text" placeholder="Filtrar por rota ou remessa..." className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder:text-slate-600"/>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-none tracking-tight">Operador Master</p>
              <p className="text-[10px] text-blue-500 mt-1 uppercase font-black tracking-tighter italic">Online • JSON Active</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white border border-white/10 shadow-lg shadow-blue-500/20">OM</div>
          </div>
        </div>
      </header>

      {/* 2. SIDEBAR */}
      <aside className="hidden md:flex flex-col row-span-2 border-r border-slate-800/60 bg-[#020617] p-6">
        <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 px-2 cursor-pointer" onClick={() => navigate('/')}>
          <Box size={32} strokeWidth={2.5} />
          <span className="tracking-tighter text-white italic">PHARMA<span className="text-blue-500">LOG</span></span>
        </div>
        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">Logística</p>
          <NavItem icon={<LayoutDashboard size={20}/>} label="Faltas" active={activeTab === 'faltas'} onClick={() => setActiveTab('faltas')} />
          <NavItem icon={<BarChart2 size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<FileText size={20}/>} label="Relatórios" active={activeTab === 'relatorios'} onClick={() => setActiveTab('relatorios')} />
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-800/60">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-all rounded-xl text-sm font-bold hover:bg-red-500/5 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Sair
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT */}
      <main className="p-8 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]">
        
        {/* VIEW: FALTAS (Layout Tabela) */}
        {activeTab === 'faltas' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight italic">Gestão de Faltas</h1>
                <p className="text-slate-500 mt-1 font-medium">Monitoramento de ocorrências rj01/rj07.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={exportarPDF} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer">
                  <Download size={18} /> PDF
                </button>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-blue-600/20 transition-all cursor-pointer">
                  <Plus size={20} /> Adicionar Registro
                </button>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/30 border-b border-slate-700/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Rota (ID)</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Grupo/Remessa</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Faturamento</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Data Falta</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] text-center">Volume</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {faltas.map((f) => (
                    <tr key={f.id} className="group hover:bg-blue-600/[0.03] transition-colors">
                      <td className="px-8 py-5">
                        <span className="font-mono font-black text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-lg border border-blue-400/20">
                          {f.rota}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-200 uppercase">{f.grupoRemessa}</td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500">{f.dataFaturamento}</td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500 italic">{f.dataFalta}</td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-white font-black text-lg">{f.volume}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => deletarFalta(f.id)} className="p-2 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {faltas.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-slate-600 italic">
                  <Package size={48} className="mb-4 opacity-10" />
                  <p>Nenhuma ocorrência registrada no banco local.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-4xl font-black text-white italic tracking-tight">Analytics Operacional</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-3 text-white">
                  <div className="p-2 bg-blue-500/10 rounded-lg"><BarChart2 className="text-blue-500" size={18}/></div>
                  Volume por Rota (Padrão XXX_XXX)
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight="bold" />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                      <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem]">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-3 text-white">
                  <div className="p-2 bg-indigo-500/10 rounded-lg"><Truck className="text-indigo-500" size={18}/></div>
                  Linha de Ocorrências
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer>
                    <LineChart data={faltas.map(f => ({ d: f.dataFalta, v: f.volume })).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="d" hide />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: RELATORIOS */}
        {activeTab === 'relatorios' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-[3.5rem] text-center max-w-lg shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Database size={120} /></div>
              <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-blue-500/20 text-blue-500">
                <Database size={40} />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Backup & Exportação</h2>
              <p className="text-slate-500 mb-10 italic px-4">Os dados abaixo são extraídos do banco de dados local do seu navegador (JSON).</p>
              
              <div className="space-y-4">
                <button onClick={exportarPDF} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-blue-600/20">
                  <Download size={20} /> GERAR RELATÓRIO PDF
                </button>
                <button onClick={exportarJSON} className="w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-black text-slate-300 transition-all flex items-center justify-center gap-3 cursor-pointer border border-slate-700">
                  <Database size={20} /> DOWNLOAD BACKUP JSON
                </button>
                <button 
                  onClick={() => { if(window.confirm("CUIDADO: Isso apagará TODOS os dados!")) setFaltas([]) }} 
                  className="mt-6 text-[10px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-[0.3em] transition-colors cursor-pointer"
                >
                  Limpar Base de Dados
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- SUBCOMPONENTE NAV ---
const NavItem = ({ icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
      active 
      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
      : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
    }`}
  >
    {icon} {label}
  </button>
);

export default Dashboard;