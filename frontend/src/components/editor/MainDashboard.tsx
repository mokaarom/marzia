import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { FileDown, Menu, LineChart as ChartIcon, Activity, Box, Eye, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import SimulationCharts from './SimulationCharts';
import StackVisualizer from './StackVisualizer';
import MetricsFooter from './MetricsFooter';
interface MainDashboardProps {
  onOpenSidebar: () => void;
  isSidebarOpen: boolean;
}
const MainDashboard: React.FC<MainDashboardProps> = ({ onOpenSidebar, isSidebarOpen }) => {
  const { surfaceColor, exportCSV } = useSimulation();
  const [activeTab, setActiveTab] = useState<'spectral' | 'absorption' | 'generation' | 'ellipsometry'>('spectral');
  return (
    <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto h-screen relative z-10 custom-scrollbar bg-transparent">
      <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4 w-full xl:w-auto">
          {!isSidebarOpen && (
            <button 
              onClick={onOpenSidebar}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:text-[#111111] shadow-sm shrink-0"
              title="Open Sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          <div className="md:hidden relative flex-1">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full appearance-none bg-white border border-gray-200 py-2.5 px-3 pr-8 rounded-lg text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest focus:border-gray-400 outline-none cursor-pointer text-[#111111] shadow-sm transition-all truncate"
            >
              {[
                { id: 'spectral', label: 'Spectral Curves' },
                { id: 'absorption', label: 'Field & Absorption' },
                { id: 'generation', label: 'Generation Profile' },
                { id: 'ellipsometry', label: 'Ellipsometry' },
              ].map(tab => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <nav className="hidden md:flex gap-8 overflow-x-auto custom-scrollbar w-auto pb-0">
            {[
              { id: 'spectral', label: 'Spectral Curves', icon: ChartIcon },
              { id: 'absorption', label: 'Field & Absorption', icon: Activity },
              { id: 'generation', label: 'Solar Generation Profile', icon: Box },
              { id: 'ellipsometry', label: 'Ellipsometry Parameters', icon: Eye },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative pb-2 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-[#111111]' : 'text-gray-400 hover:text-[#111111]'}`}
              >
                <tab.icon size={14} className="hidden sm:block" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-[3px] bg-[#111111] rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-6 items-stretch shrink-0 pb-4">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 font-mono mb-4 md:mb-6 shrink-0">Simulation Plotting</h3>
          <SimulationCharts activeTab={activeTab} />
        </div>
        <StackVisualizer activeTab={activeTab} />
      </div>
      <MetricsFooter />
    </main>
  );
};
export default MainDashboard;
