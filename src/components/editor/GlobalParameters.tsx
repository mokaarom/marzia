import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Settings } from 'lucide-react';
const GlobalParameters: React.FC = () => {
  const {
    scanType, setScanType, setActivePreset,
    startWl, setStartWl, endWl, setEndWl,
    angle, setAngle,
    sourceWavelength, setSourceWavelength,
    startAngle, setStartAngle, endAngle, setEndAngle,
    polarization, setPolarization
  } = useSimulation();
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <Settings size={16} />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-mono">Global Parameters</h2>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => { setScanType('wavelength'); setActivePreset('Custom'); }}
            className={`text-[10px] font-mono font-bold px-3 py-1.5 uppercase transition-all rounded ${scanType === 'wavelength' ? 'bg-white text-[#111111] shadow-sm border border-gray-200' : 'text-gray-500 hover:text-[#111111] border border-transparent'}`}
          >
            Wavelength
          </button>
          <button
            onClick={() => { setScanType('angle'); setActivePreset('Custom'); }}
            className={`text-[10px] font-mono font-bold px-3 py-1.5 uppercase transition-all rounded ${scanType === 'angle' ? 'bg-white text-[#111111] shadow-sm border border-gray-200' : 'text-gray-500 hover:text-[#111111] border border-transparent'}`}
          >
            Angle
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {scanType === 'wavelength' ? (
          <>
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">Start (nm)</label>
              <input
                type="number"
                title="Wavelength range start"
                value={startWl}
                onChange={e => setStartWl(Number(e.target.value))}
                className="w-full bg-transparent text-sm focus:outline-none font-mono font-bold text-[#111111] border-b border-transparent focus:border-gray-400 py-1 transition-colors"
              />
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">End (nm)</label>
              <input
                type="number"
                title="Wavelength range end"
                value={endWl}
                onChange={e => setEndWl(Number(e.target.value))}
                className="w-full bg-transparent text-sm focus:outline-none font-mono font-bold text-[#111111] border-b border-transparent focus:border-gray-400 py-1 transition-colors"
              />
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-1 col-span-2">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">Incident Angle θi (°)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="85"
                  value={angle}
                  onChange={e => setAngle(Number(e.target.value))}
                  className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#111111]"
                />
                <input
                  type="number"
                  title="Incident Angle"
                  value={angle}
                  onChange={e => setAngle(Number(e.target.value))}
                  className="w-16 bg-transparent text-right text-sm focus:outline-none font-mono font-bold text-[#111111]"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-1 col-span-2">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">Source Wavelength (nm)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="300"
                  max="1200"
                  value={sourceWavelength}
                  onChange={e => setSourceWavelength(Number(e.target.value))}
                  className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#111111]"
                />
                <input
                  type="number"
                  title="Source Wavelength"
                  value={sourceWavelength}
                  onChange={e => setSourceWavelength(Number(e.target.value))}
                  className="w-16 bg-transparent text-right text-sm focus:outline-none font-mono font-bold text-[#111111]"
                />
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">Start Angle (°)</label>
              <input
                type="number"
                title="Angle range start"
                value={startAngle}
                onChange={e => setStartAngle(Number(e.target.value))}
                className="w-full bg-transparent text-sm focus:outline-none font-mono font-bold text-[#111111] border-b border-transparent focus:border-gray-400 py-1 transition-colors"
              />
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">End Angle (°)</label>
              <input
                type="number"
                title="Angle range end"
                value={endAngle}
                onChange={e => setEndAngle(Number(e.target.value))}
                className="w-full bg-transparent text-sm focus:outline-none font-mono font-bold text-[#111111] border-b border-transparent focus:border-gray-400 py-1 transition-colors"
              />
            </div>
          </>
        )}
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-1 col-span-2">
          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">Polarization Mode</label>
          <select
            title="Polarization mode"
            value={polarization}
            onChange={e => setPolarization(e.target.value as any)}
            className="w-full bg-transparent py-1 text-sm focus:outline-none font-mono text-[#111111] cursor-pointer"
          >
            <option value="unpolarized">Unpolarized (s + p average)</option>
            <option value="s">s-polarized (TE)</option>
            <option value="p">p-polarized (TM)</option>
          </select>
        </div>
      </div>
    </section>
  );
};
export default GlobalParameters;
