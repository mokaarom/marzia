import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Layer,
  SimulationResult,
  TMMSimulator,
  SpectralPoint,
  MATERIALS,
  ColorUtils,
  Polarization,
  AbsorptionProfilePoint
} from '../lib/tmm';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
  Layers,
  LineChart as ChartIcon,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  Maximize2,
  Minimize2,
  RefreshCw,
  Eye,
  Activity,
  Box,
  Save,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_LAYERS: Layer[] = [
  { id: '1', name: 'Air', thickness: 0, n: 1.0, k: 0, isThick: true },
  { id: '2', name: 'ITO', thickness: 100, n: 1.9, k: 0.01, isThick: false },
  { id: '3', name: 'Active Layer', thickness: 200, n: 1.7, k: 0.2, isThick: false },
  { id: '4', name: 'Aluminum', thickness: 100, n: 1.2, k: 7.0, isThick: false },
];

const Editor: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>(INITIAL_LAYERS);
  const [startWl, setStartWl] = useState(300);
  const [endWl, setEndWl] = useState(1000);
  const [stepWl, setStepWl] = useState(5);
  const [angle, setAngle] = useState(0);
  const [polarization, setPolarization] = useState<Polarization | 'unpolarized'>('unpolarized');
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [profile, setProfile] = useState<AbsorptionProfilePoint[]>([]);
  const [generationProfile, setGenerationProfile] = useState<AbsorptionProfilePoint[]>([]);
  const [activeTab, setActiveTab] = useState<'spectral' | 'absorption' | 'generation' | 'ellipsometry'>('spectral');
  const darkMode = false;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileWl, setProfileWl] = useState(550);

  const chartRef = useRef<HTMLDivElement>(null);

  const simulate = () => {
    const newResults: SimulationResult[] = [];
    const middleLayers = layers.slice(1, -1);
    const nStart = layers[0].n;
    const nEnd = layers[layers.length - 1].n;

    for (let wl = startWl; wl <= endWl; wl += stepWl) {
      const res = TMMSimulator.calculate(wl, angle, polarization, middleLayers, nStart, nEnd);
      newResults.push(res);
    }
    setResults(newResults);

    const prof = TMMSimulator.calculateAbsorptionProfile(profileWl, angle, polarization === 'unpolarized' ? 's' : polarization, middleLayers, nStart, nEnd);
    setProfile(prof);

    const genProf = TMMSimulator.calculateGenerationProfile(angle, polarization, middleLayers, nStart, nEnd);
    setGenerationProfile(genProf);
  };

  useEffect(() => {
    simulate();
  }, [layers, startWl, endWl, stepWl, angle, polarization, profileWl]);

  const addLayer = () => {
    const newLayer: Layer = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Layer',
      thickness: 50,
      n: 1.5,
      k: 0,
      isThick: false
    };
    const newLayers = [...layers];
    newLayers.splice(layers.length - 1, 0, newLayer);
    setLayers(newLayers);
  };

  const removeLayer = (index: number) => {
    if (index === 0 || index === layers.length - 1) return;
    const newLayers = layers.filter((_, i) => i !== index);
    setLayers(newLayers);
  };

  const updateLayer = (index: number, updates: Partial<Layer>) => {
    const newLayers = [...layers];
    newLayers[index] = { ...newLayers[index], ...updates };
    setLayers(newLayers);
  };

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    if (index === 0 || index === layers.length - 1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex <= 0 || newIndex >= layers.length - 1) return;
    const newLayers = [...layers];
    const temp = newLayers[index];
    newLayers[index] = newLayers[newIndex];
    newLayers[newIndex] = temp;
    setLayers(newLayers);
  };

  const surfaceColor = useMemo(() => ColorUtils.spectrumToRGB(results), [results]);

  const ellipsometryData = useMemo(() => {
    const middleLayers = layers.slice(1, -1);
    const nStart = layers[0].n;
    const nEnd = layers[layers.length - 1].n;
    return results.map(r => {
      const { psi, delta } = TMMSimulator.calculateEllipsometry(r.wavelength, angle, middleLayers, nStart, nEnd);
      return { wavelength: r.wavelength, psi, delta };
    });
  }, [results, layers, angle]);

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Wavelength (nm),R,T,A\n";
    results.forEach(r => {
      csvContent += `${r.wavelength},${r.R},${r.T},${r.A}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "marzia_simulation_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const layerStats = useMemo(() => {
    if (profile.length === 0) return [];
    const stats: Record<string, number> = {};
    profile.forEach(p => {
      stats[p.layerName] = (stats[p.layerName] || 0) + p.absorption;
    });
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    return Object.entries(stats).map(([name, val]) => ({ name, value: total > 0 ? (val / total) * 100 : 0 }));
  }, [profile]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0A0A0A] text-[#E4E3E0] selection:bg-[#E4E3E0] selection:text-[#0A0A0A]' : 'bg-[#E4E3E0] text-[#141414] selection:bg-[#141414] selection:text-[#E4E3E0]'} flex font-sans transition-colors duration-500`}>
      {}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 420 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className={`border-r ${darkMode ? 'border-[#E4E3E0]/10 bg-[#0A0A0A]' : 'border-[#141414]/10 bg-white/40'} backdrop-blur-3xl overflow-hidden flex flex-col relative z-20`}
      >
        <div className={`p-8 border-b ${darkMode ? 'border-[#E4E3E0]/10' : 'border-[#141414]/10'} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 flex items-center justify-center shadow-2xl ${darkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} rounded-none overflow-hidden border`}>
              <img src="/assets/icons/logo.webp" alt="Marzia Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-serif italic tracking-tight">Marzia</h1>
              <p className={`text-[10px] ${darkMode ? 'opacity-40' : 'opacity-60'} uppercase tracking-[0.2em] font-mono mt-0.5`}>Spectral Engine v2.0</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            title="Collapse Sidebar"
            className={`p-2 transition-all ${darkMode ? 'text-[#E4E3E0]/60 hover:text-white' : 'text-[#141414]/60 hover:text-black'}`}
          >
            <PanelLeftClose size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          {}
          <section>
            <div className={`flex items-center gap-3 mb-6 ${darkMode ? 'text-[#E4E3E0]/40' : 'text-[#141414]/40'}`}>
              <Settings size={14} />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] font-mono">Global Parameters</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-[#E4E3E0]/40' : 'text-[#141414]/40'}`}>Range Start (nm)</label>
                <input
                  type="number"
                  title="Wavelength Range Start"
                  value={startWl}
                  onChange={e => setStartWl(Number(e.target.value))}
                  className={`w-full bg-transparent border-b ${darkMode ? 'border-[#E4E3E0]/20' : 'border-[#141414]/20'} py-2 text-sm focus:border-indigo-500 outline-none font-mono`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-[#E4E3E0]/40' : 'text-[#141414]/40'}`}>Range End (nm)</label>
                <input
                  type="number"
                  title="Wavelength Range End"
                  value={endWl}
                  onChange={e => setEndWl(Number(e.target.value))}
                  className={`w-full bg-transparent border-b ${darkMode ? 'border-[#E4E3E0]/20' : 'border-[#141414]/20'} py-2 text-sm focus:border-indigo-500 outline-none font-mono`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-[#E4E3E0]/40' : 'text-[#141414]/40'}`}>θi Angle (°)</label>
                <input
                  type="number"
                  title="Incident Angle"
                  value={angle}
                  onChange={e => setAngle(Number(e.target.value))}
                  className={`w-full bg-transparent border-b ${darkMode ? 'border-[#E4E3E0]/20' : 'border-[#141414]/20'} py-2 text-sm focus:border-indigo-500 outline-none font-mono text-indigo-500 font-bold`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-[#E4E3E0]/40' : 'text-[#141414]/40'}`}>Polarization</label>
                <select
                  title="Polarization Mode"
                  value={polarization}
                  onChange={e => setPolarization(e.target.value as any)}
                  className={`w-full bg-transparent border-b ${darkMode ? 'border-[#E4E3E0]/20' : 'border-[#141414]/20'} py-2 text-sm focus:border-indigo-500 outline-none font-mono cursor-pointer`}
                >
                  <option value="unpolarized">Unpolarized</option>
                  <option value="s">s (TE)</option>
                  <option value="p">p (TM)</option>
                </select>
              </div>
            </div>
          </section>

          {}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className={`flex items-center gap-3 ${darkMode ? 'text-[#E4E3E0]/40' : 'text-[#141414]/40'}`}>
                <Layers size={14} />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] font-mono">Structural Stack</h2>
              </div>
              <button
                onClick={addLayer}
                title="Add New Layer"
                className={`flex items-center gap-2 ${darkMode ? 'bg-[#E4E3E0] text-[#141414]' : 'bg-[#141414] text-[#E4E3E0]'} text-[10px] font-bold px-4 py-2 rounded-none transition-all hover:scale-[1.02] active:scale-[0.98] tracking-widest uppercase`}
              >
                <Plus size={14} /> Add Layer
              </button>
            </div>

            <div className="space-y-1">
              {layers.map((layer, idx) => (
                <motion.div
                  layout
                  key={layer.id}
                  className={`p-6 border-l-2 transition-all ${darkMode
                      ? 'bg-white/[0.03] border-[#E4E3E0]/10 hover:border-indigo-500'
                      : 'bg-white border-[#141414]/10 hover:border-indigo-500 shadow-sm'
                    } group relative`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-mono font-bold w-4 h-4 flex items-center justify-center border ${darkMode ? 'border-[#E4E3E0]/20' : 'border-[#141414]/20'}`}>
                        {idx}
                      </span>
                      <input
                        className="bg-transparent font-serif italic text-lg focus:outline-none w-48 border-b border-transparent focus:border-indigo-500 transition-all"
                        value={layer.name}
                        title="Layer Name"
                        onChange={e => updateLayer(idx, { name: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {idx > 0 && idx < layers.length - 1 && (
                        <>
                          <button onClick={() => moveLayer(idx, 'up')} title="Move Up" className={`p-1 ${darkMode ? 'hover:text-[#E4E3E0]' : 'hover:text-black'} transition-colors`}><ArrowUp size={14} /></button>
                          <button onClick={() => moveLayer(idx, 'down')} title="Move Down" className={`p-1 ${darkMode ? 'hover:text-[#E4E3E0]' : 'hover:text-black'} transition-colors`}><ArrowDown size={14} /></button>
                          <button onClick={() => removeLayer(idx)} title="Delete Layer" className="p-1 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className={`text-[9px] font-mono font-bold uppercase tracking-widest ${darkMode ? 'text-[#E4E3E0]/30' : 'text-[#141414]/40'}`}>Thickness (nm)</label>
                      <input
                        type="number"
                        title={`${layer.name} Thickness`}
                        disabled={idx === 0 || idx === layers.length - 1}
                        value={idx === 0 || idx === layers.length - 1 ? 0 : layer.thickness}
                        onChange={e => updateLayer(idx, { thickness: Number(e.target.value) })}
                        className={`w-full bg-transparent py-1 text-sm focus:outline-none font-mono ${idx === 0 || idx === layers.length - 1 ? 'opacity-20' : ''}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[9px] font-mono font-bold uppercase tracking-widest ${darkMode ? 'text-[#E4E3E0]/30' : 'text-[#141414]/40'}`}>Material</label>
                      <select
                        title="Select Material"
                        value={Object.keys(MATERIALS).find(k => MATERIALS[k].n === layer.n && MATERIALS[k].k === layer.k) || 'Custom'}
                        onChange={e => {
                          const mat = MATERIALS[e.target.value];
                          if (mat) {
                            updateLayer(idx, { name: e.target.value, n: mat.n, k: mat.k });
                          }
                        }}
                        className="w-full bg-transparent py-1 text-sm focus:outline-none font-mono cursor-pointer"
                      >
                        <option value="Custom">Custom</option>
                        {Object.keys(MATERIALS).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[9px] font-mono font-bold uppercase tracking-widest ${darkMode ? 'text-[#E4E3E0]/30' : 'text-[#141414]/40'}`}>Index (n)</label>
                      <input
                        type="number"
                        title={`${layer.name} Index n`}
                        step="0.01"
                        value={layer.n}
                        onChange={e => updateLayer(idx, { n: Number(e.target.value) })}
                        className="w-full bg-transparent py-1 text-sm focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[9px] font-mono font-bold uppercase tracking-widest ${darkMode ? 'text-[#E4E3E0]/30' : 'text-[#141414]/40'}`}>Extinction (k)</label>
                      <input
                        type="number"
                        title={`${layer.name} Index k`}
                        step="0.001"
                        value={layer.k}
                        onChange={e => updateLayer(idx, { k: Number(e.target.value) })}
                        className="w-full bg-transparent py-1 text-sm focus:outline-none font-mono text-rose-500"
                      />
                    </div>
                  </div>

                  {idx > 0 && idx < layers.length - 1 && (
                    <div className="mt-4 flex items-center gap-2">
                      <input
                        type="checkbox"
                        title="Is Thick Layer"
                        id={`thick-${layer.id}`}
                        className="w-3 h-3 rounded-none accent-black"
                        checked={layer.isThick}
                        onChange={e => updateLayer(idx, { isThick: e.target.checked })}
                      />
                      <label htmlFor={`thick-${layer.id}`} className={`text-[9px] font-mono font-bold uppercase tracking-widest cursor-pointer ${darkMode ? 'text-[#E4E3E0]/30' : 'text-[#141414]/40'}`}>Treat as semi-infinite</label>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </motion.aside>

      {}
      <main className="flex-1 flex flex-col p-12 overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-32 h-32 border-r border-t mt-12 mr-12 ${darkMode ? 'border-[#E4E3E0]/10' : 'border-[#141414]/10'} pointer-events-none`} />

        {}
        <header className="flex items-center justify-between mb-12 relative z-10">
          <div className="flex items-center gap-10">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                title="Expand Sidebar"
                className={`p-2 border ${darkMode ? 'border-[#E4E3E0]/20 text-[#E4E3E0]/60 hover:text-white hover:bg-white/5' : 'border-[#141414]/20 text-[#141414]/60 hover:text-black hover:bg-black/5'} transition-all`}
              >
                <PanelLeftOpen size={20} strokeWidth={1.5} />
              </button>
            )}
            <nav className="flex gap-10">
              {[
                { id: 'spectral', label: 'Spectral Response', icon: ChartIcon },
                { id: 'absorption', label: 'Layer Absorption', icon: Activity },
                { id: 'generation', label: 'Solar Generation', icon: Box },
                { id: 'ellipsometry', label: 'Ellipsometry', icon: Eye },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative pb-2 text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all ${activeTab === tab.id
                      ? (darkMode ? 'text-white' : 'text-black')
                      : (darkMode ? 'text-[#E4E3E0]/30 hover:text-[#E4E3E0]' : 'text-[#141414]/30 hover:text-[#141414]')
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[8px] font-mono font-bold uppercase tracking-widest ${darkMode ? 'text-[#E4E3E0]/30' : 'text-[#141414]/30'}`}>Structural Rendering</span>
              <div
                className={`w-16 h-8 border ${darkMode ? 'border-[#E4E3E0]/20' : 'border-[#141414]/20'} shadow-sm`}
                style={{ backgroundColor: surfaceColor }}
                title="Perceived structural color under normal incidence"
              />
            </div>
            <button
              onClick={exportCSV}
              title="Export Spectral Data to CSV"
              className={`flex items-center gap-3 border ${darkMode ? 'border-[#E4E3E0]/20 hover:bg-[#E4E3E0]/5' : 'border-[#141414]/20 hover:bg-[#141414]/5'} px-6 py-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-all`}
            >
              <FileDown size={14} /> Export Data
            </button>
          </div>
        </header>

        {}
        <div className="flex-1 flex flex-col gap-10" ref={chartRef}>
          <div className={`flex-1 ${darkMode ? 'bg-white/[0.02] border-[#E4E3E0]/10' : 'bg-white border-[#141414]/10'} border p-10 relative overflow-hidden shadow-2xl`}>
            {}
            <div className={`absolute -right-20 -bottom-20 w-80 h-80 rounded-full border ${darkMode ? 'border-[#E4E3E0]/5' : 'border-[#141414]/5'} pointer-events-none`} />

            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'spectral' ? (
                <LineChart data={results} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#E4E3E010" : "#14141410"} vertical={false} />
                  <XAxis
                    dataKey="wavelength"
                    stroke={darkMode ? "#E4E3E060" : "#14141460"}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontStyle: 'normal', fontWeight: 'bold' }}
                  />
                  <YAxis
                    stroke={darkMode ? "#E4E3E060" : "#14141460"}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 1]}
                    tickFormatter={val => `${(val * 100).toFixed(0)}%`}
                    tick={{ fontStyle: 'normal', fontWeight: 'bold' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: darkMode ? '#141414' : '#fff', border: `1px solid ${darkMode ? '#E4E3E020' : '#14141420'}`, borderRadius: '0' }}
                    itemStyle={{ fontSize: '10px', fontStyle: 'italic', fontFamily: 'serif' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'mono', color: darkMode ? '#E4E3E060' : '#14141460' }}
                  />
                  <Legend verticalAlign="top" height={48} iconType="rect" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  <Line type="monotone" dataKey="R" stroke={darkMode ? "#fff" : "#141414"} strokeWidth={2} dot={false} name="Reflectance" isAnimationActive={false} />
                  <Line type="monotone" dataKey="T" stroke="#6366f1" strokeWidth={2} dot={false} name="Transmittance" isAnimationActive={false} />
                  <Line type="monotone" dataKey="A" stroke="#f43f5e" strokeWidth={2} dot={false} name="Absorbance" isAnimationActive={false} />
                </LineChart>
              ) : activeTab === 'absorption' ? (
                <AreaChart data={profile} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#E4E3E010" : "#14141410"} vertical={false} />
                  <XAxis
                    dataKey="z"
                    stroke={darkMode ? "#E4E3E060" : "#14141460"}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontStyle: 'normal', fontWeight: 'bold' }}
                  />
                  <YAxis yId="left" stroke="#f43f5e" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis yId="right" orientation="right" stroke="#6366f1" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#141414' : '#fff', border: 'none', borderRadius: '0' }} />
                  <Legend verticalAlign="top" height={48} iconType="rect" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  <Area yId="left" type="stepAfter" dataKey="absorption" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} name="Absorption Rate" isAnimationActive={false} />
                  <Area yId="right" type="monotone" dataKey="fieldIntensity" stroke="#6366f1" fill="#6366f1" fillOpacity={0.05} name="Field Intensity |E|²" isAnimationActive={false} />
                </AreaChart>
              ) : activeTab === 'generation' ? (
                <AreaChart data={generationProfile} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#E4E3E010" : "#14141410"} vertical={false} />
                  <XAxis dataKey="z" stroke={darkMode ? "#E4E3E060" : "#14141460"} fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#fbbf24" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#141414' : '#fff', border: 'none', borderRadius: '0' }} />
                  <Area type="monotone" dataKey="absorption" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.2} name="Photogenerated Carriers G(z)" isAnimationActive={false} />
                </AreaChart>
              ) : (
                <LineChart data={ellipsometryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#E4E3E010" : "#14141410"} vertical={false} />
                  <XAxis dataKey="wavelength" stroke={darkMode ? "#E4E3E060" : "#14141460"} fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis yId="left" stroke="#8b5cf6" fontSize={10} axisLine={false} tickLine={false} unit="°" />
                  <YAxis yId="right" orientation="right" stroke="#ec4899" fontSize={10} axisLine={false} tickLine={false} unit="°" />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#141414' : '#fff', border: 'none', borderRadius: '0' }} />
                  <Legend verticalAlign="top" height={48} iconType="rect" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  <Line yId="left" type="monotone" dataKey="psi" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Psi (ψ)" isAnimationActive={false} />
                  <Line yId="right" type="monotone" dataKey="delta" stroke="#ec4899" strokeWidth={2} dot={false} name="Delta (Δ)" isAnimationActive={false} />
                </LineChart>
              )}
            </ResponsiveContainer>

            {}
            {activeTab === 'absorption' && (
              <div className={`absolute top-24 right-16 ${darkMode ? 'bg-[#141414]/90 border-[#E4E3E0]/10' : 'bg-white/90 border-[#141414]/10'} border p-8 shadow-2xl space-y-6 min-w-[280px] backdrop-blur-md`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${darkMode ? 'text-[#E4E3E0]/40' : 'text-[#141414]/40'}`}>Source WL</span>
                    <span className="text-sm font-serif italic text-indigo-500">{profileWl} nm</span>
                  </div>
                  <input
                    type="range"
                    min={startWl}
                    max={endWl}
                    title="Profile Wavelength Selector"
                    value={profileWl}
                    onChange={e => setProfileWl(Number(e.target.value))}
                    className={`w-full h-0.5 ${darkMode ? 'bg-[#E4E3E0]/10' : 'bg-[#141414]/10'} accent-indigo-500 appearance-none`}
                  />
                </div>
                <div className={`pt-6 border-t ${darkMode ? 'border-[#E4E3E0]/10' : 'border-[#141414]/10'}`}>
                  <h4 className={`text-[9px] font-mono font-bold uppercase tracking-[0.2em] mb-4 ${darkMode ? 'text-[#E4E3E0]/30' : 'text-[#141414]/30'}`}>Absorption Metric</h4>
                  {layerStats.map(s => (
                    <div key={s.name} className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-[11px] font-serif italic">{s.name}</span>
                      <div className="flex items-center gap-3">
                        <div className={`w-16 h-1 ${darkMode ? 'bg-[#E4E3E0]/5' : 'bg-[#141414]/5'}`}>
                          <div className="h-full bg-rose-500" style={{ width: `${s.value}%` }} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-rose-500 w-10 text-right">{s.value.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {}
          <div className="flex gap-12 px-2">
            <div className="flex flex-col gap-2">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-[#E4E3E0]/30' : 'text-[#141414]/30'}`}>Spectral Integration</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif italic">{(results.reduce((acc, r) => acc + (1 - r.R), 0) / (results.length || 1) * 100).toFixed(1)}</span>
                <span className="text-xs font-mono font-bold opacity-30">% Avg ABSORP</span>
              </div>
            </div>

            <div className={`w-0.5 h-12 ${darkMode ? 'bg-[#E4E3E0]/10' : 'bg-[#141414]/10'}`} />

            <div className="flex flex-col gap-2">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-[#E4E3E0]/30' : 'text-[#141414]/30'}`}>Ellipsometric Phase</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif italic">{(ellipsometryData.length > 0 ? ellipsometryData[Math.floor(ellipsometryData.length / 2)].psi.toFixed(2) : 0)}</span>
                <span className="text-xs font-mono font-bold opacity-30">° ψ CENTER</span>
              </div>
            </div>

            <div className={`w-0.5 h-12 ${darkMode ? 'bg-[#E4E3E0]/10' : 'bg-[#141414]/10'}`} />

            <div className="flex flex-col gap-2">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-[#E4E3E0]/30' : 'text-[#141414]/30'}`}>Carrier Flux</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif italic">{(generationProfile.reduce((acc, p) => acc + p.absorption, 0) / 1e18).toFixed(2)}</span>
                <span className="text-xs font-mono font-bold opacity-30">×10¹⁸ cm⁻³ s⁻¹</span>
              </div>
            </div>

            <div className="flex-1" />

            <button
              onClick={simulate}
              title="Force Simulation Recalculation"
              className={`flex items-center justify-center w-12 h-12 border ${darkMode ? 'border-[#E4E3E0]/20 hover:bg-white text-white hover:text-black' : 'border-[#141414]/20 hover:bg-black text-black hover:text-white'} transition-all`}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
