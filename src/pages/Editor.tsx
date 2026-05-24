import React, { useState } from 'react';
import { SimulationProvider } from '../context/SimulationContext';
import EditorSidebar from '../components/editor/EditorSidebar';
import MainDashboard from '../components/editor/MainDashboard';
const EditorContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111111] selection:bg-[#111111] selection:text-white flex font-sans overflow-x-hidden antialiased">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
      <EditorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MainDashboard onOpenSidebar={() => setIsSidebarOpen(true)} isSidebarOpen={isSidebarOpen} />
    </div>
  );
};
const Editor: React.FC = () => {
  return (
    <SimulationProvider>
      <EditorContent />
    </SimulationProvider>
  );
};
export default Editor;
