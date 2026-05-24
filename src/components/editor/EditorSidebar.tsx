import React from 'react';
import { useSimulation, PRESETS } from '../../context/SimulationContext';
import { Zap, BookOpen, X } from 'lucide-react';
import GlobalParameters from './GlobalParameters';
import LayerStack from './LayerStack';
interface EditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
const EditorSidebar: React.FC<EditorSidebarProps> = ({ isOpen, onClose }) => {
  const { activePreset, applyPreset } = useSimulation();
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed md:relative top-0 left-0 z-40 h-screen shrink-0
        bg-white/95 md:bg-white/90 backdrop-blur-xl transition-all duration-300 ease-in-out
        ${isOpen ? 'w-full sm:w-[430px] translate-x-0 border-r border-gray-200 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)] opacity-100' : 'w-full sm:w-[430px] md:w-0 -translate-x-full md:translate-x-0 border-r md:border-none border-gray-200 md:opacity-0 overflow-hidden shadow-none'}
      `}>
        <div className="w-full sm:w-[430px] h-full flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#111111] rounded-xl shadow-md overflow-hidden shrink-0">
              <img src="/assets/icons/logo.webp" alt="Marzia Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight font-serif italic text-[#111111]">Marzia</h1>
              <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-mono mt-0.5 font-bold">Optics Engine v2.0</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#111111] transition-colors" title="Close Sidebar">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <BookOpen size={16} />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-mono">Select Design Preset</h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <select
                title="Simulation Presets"
                value={activePreset}
                onChange={e => applyPreset(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl text-sm focus:border-gray-400 focus:bg-white outline-none cursor-pointer text-[#111111] font-mono shadow-sm transition-all"
              >
                <option value="Custom">Custom Multilayer Stack</option>
                {PRESETS.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
              {activePreset !== 'Custom' && (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-[11px] text-gray-600 leading-relaxed font-mono">
                  {PRESETS.find(p => p.name === activePreset)?.description}
                </div>
              )}
            </div>
          </section>
          <GlobalParameters />
          <LayerStack />
        </div>
        </div>
      </aside>
    </>
  );
};
export default EditorSidebar;
