import React, { useMemo } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Sliders } from 'lucide-react';
interface StackVisualizerProps {
  activeTab: 'spectral' | 'absorption' | 'generation' | 'ellipsometry';
}
const StackVisualizer: React.FC<StackVisualizerProps> = ({ activeTab }) => {
  const { layers, profile, profileWl, setProfileWl, startWl, endWl } = useSimulation();
  const getMaterialColor = (name: string) => {
    switch (name) {
      case 'Air': return 'rgba(224, 242, 254, 0.4)';
      case 'Silicon (Si)': return 'rgba(75, 85, 99, 0.4)';
      case 'Silica (SiO2)': return 'rgba(224, 242, 254, 0.6)';
      case 'Titania (TiO2)': return 'rgba(199, 210, 254, 0.7)';
      case 'Magnesium Fluoride (MgF2)': return 'rgba(167, 243, 208, 0.6)';
      case 'Gold (Au)': return 'rgba(251, 191, 36, 0.6)';
      case 'Silver (Ag)': return 'rgba(229, 231, 235, 0.9)';
      case 'Aluminum (Al)': return 'rgba(156, 163, 175, 0.5)';
      case 'Glass (BK7)': return 'rgba(243, 244, 246, 0.6)';
      case 'ITO': return 'rgba(147, 197, 253, 0.5)';
      default: return 'rgba(139, 92, 246, 0.4)';
    }
  };
  const activeLayersList = layers.slice(1, -1);
  const totalThickness = activeLayersList.reduce((acc, l) => acc + l.thickness, 0) || 1;
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
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 font-mono flex items-center gap-1.5">
          <Sliders size={16} /> Stack Structural Preview
        </h3>
        <p className="text-xs text-gray-500 font-mono uppercase leading-relaxed">
          Visualizing standing-wave E-field $|E|^2$ overlay in real-time.
        </p>
      </div>
      <div className="flex-1 my-6 relative bg-gray-50 border border-gray-200 rounded-xl overflow-hidden min-h-[350px]">
        <div className="absolute top-0 left-0 w-full h-[15%] border-b border-gray-200 flex items-center justify-center z-10 bg-white/50 backdrop-blur-sm px-2 text-center">
          <span className="text-[10px] font-mono text-gray-600 font-bold truncate">INCIDENT MEDIUM: {layers[0].name} (n={layers[0].n})</span>
        </div>
        <div className="absolute top-[15%] left-0 w-full h-[70%] flex flex-col justify-stretch p-3 md:p-5 gap-1.5 z-10 pointer-events-none">
          {activeLayersList.map((lay) => {
            const pct = totalThickness > 0 ? (lay.thickness / totalThickness) * 100 : 25;
            const c = getMaterialColor(lay.name);
            return (
              <div
                key={lay.id}
                className="w-full flex items-center justify-between px-3 border border-gray-300 rounded-lg shadow-sm overflow-hidden"
                style={{
                  flexGrow: pct,
                  flexBasis: 0,
                  minHeight: '24px',
                  backgroundColor: c
                }}
              >
                <span className="text-[10px] font-bold font-mono text-gray-800 truncate mr-2">{lay.name}</span>
                <span className="text-[9px] font-mono text-gray-700 font-bold whitespace-nowrap">{lay.thickness} nm</span>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[15%] border-t border-gray-200 flex items-center justify-center z-10 bg-white/50 backdrop-blur-sm px-2 text-center">
          <span className="text-[10px] font-mono text-gray-600 font-bold truncate">SUBSTRATE: {layers[layers.length - 1].name} (n={layers[layers.length - 1].n})</span>
        </div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-hidden" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="fieldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {profile.length > 0 && (
            <polyline
              fill="none"
              stroke="url(#fieldGrad)"
              strokeWidth="1.5"
              className="drop-shadow-[0_0_6px_rgba(37,99,235,0.4)]"
              points={profile.map((p, idx) => {
                const totalLength = profile.length || 1;
                const y = 15 + (idx / totalLength) * 70;
                const maxIntensity = Math.max(...profile.map(x => x.fieldIntensity)) || 1;
                const x = 15 + (p.fieldIntensity / maxIntensity) * 70;
                return `${x},${y}`;
              }).join(' ')}
            />
          )}
        </svg>
      </div>
      {activeTab === 'absorption' && (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-gray-500">SOURCE WAVE</span>
            <span className="text-[#111111]">{profileWl} nm</span>
          </div>
          <input
            type="range"
            min={startWl}
            max={endWl}
            value={profileWl}
            onChange={e => setProfileWl(Number(e.target.value))}
            className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#111111]"
          />
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-700">Integrated Absorption Ratio</h4>
            {layerStats.map(s => (
              <div key={s.name} className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-serif italic text-gray-600">{s.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${s.value}%` }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-red-600 w-10 text-right">{s.value.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default StackVisualizer;
