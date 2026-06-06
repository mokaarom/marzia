import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { RefreshCw, FileDown } from 'lucide-react';
const MetricsFooter: React.FC = () => {
  const { results, ellipsometryData, generationProfile, simulate, surfaceColor, exportCSV } = useSimulation();
  return (
    <footer className="mt-4 mb-4 flex flex-col md:flex-row flex-wrap xl:flex-nowrap items-start md:items-center justify-between gap-6 bg-white border border-gray-200 p-4 md:p-6 rounded-2xl shadow-sm relative shrink-0 w-full">
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">Integrated Absorption</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-serif italic text-[#111111]">
            {(results.reduce((acc, r) => acc + (1 - r.R), 0) / (results.length || 1) * 100).toFixed(1)}
          </span>
          <span className="text-[10px] font-mono font-bold text-gray-500">% AVG ABSORP</span>
        </div>
      </div>
      <div className="hidden xl:block w-px bg-gray-200 h-10 self-center" />
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">Central Ellipsometric Phase</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-serif italic text-[#111111]">
            {(ellipsometryData.length > 0 ? ellipsometryData[Math.floor(ellipsometryData.length / 2)].psi.toFixed(2) : 0)}
          </span>
          <span className="text-[10px] font-mono font-bold text-gray-500">° ψ CENTER</span>
        </div>
      </div>
      <div className="hidden xl:block w-px bg-gray-200 h-10 self-center" />
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">Carrier Generation Flux</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-serif italic text-[#D97706]">
            {(generationProfile.reduce((acc, p) => acc + p.absorption, 0) / 1e18).toFixed(2)}
          </span>
          <span className="text-[10px] font-mono font-bold text-gray-500">× 10¹⁸ cm⁻³ s⁻¹</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-start md:justify-end items-center gap-3 w-full md:w-auto xl:flex-1 mt-2 md:mt-0">
        <div className="flex items-center gap-2 md:gap-3 bg-gray-50 border border-gray-200 px-3 md:px-4 py-2 rounded-xl shadow-sm shrink-0 overflow-hidden h-10 md:h-12">
          <span className="text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap">REFLECTED COLOR</span>
          <div
            className="shrink-0 w-8 md:w-10 h-5 md:h-6 rounded-md border border-gray-200 shadow-inner"
            style={{ backgroundColor: surfaceColor }}
            title="Integrated structural color under normal incidence (D65 daylight)"
          />
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 bg-[#111111] border border-[#111111] hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow-sm shrink-0 h-10 md:h-12"
        >
          <FileDown size={14} /> <span className="hidden sm:inline">Export</span> CSV
        </button>
        <button
          onClick={simulate}
          className="flex items-center justify-center w-12 h-10 md:h-12 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-400 hover:bg-white text-[#111111] transition-all shadow-sm shrink-0"
          title="Force Recalculation"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </footer>
  );
};
export default MetricsFooter;
