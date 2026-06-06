import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Layers, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { MATERIALS } from '../../lib/tmm';
const LayerStack: React.FC = () => {
  const { layers, addLayer, removeLayer, updateLayer, moveLayer } = useSimulation();
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <Layers size={16} />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-mono">Structural Stack</h2>
        </div>
        <button
          onClick={addLayer}
          className="flex items-center gap-1.5 bg-[#111111] hover:bg-gray-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm tracking-widest uppercase transition-all"
        >
          <Plus size={12} /> Add Layer
        </button>
      </div>
      <div className="space-y-3">
        {layers.map((layer, idx) => (
          <div
            key={layer.id}
            className="bg-white border border-gray-200 hover:border-gray-400 rounded-xl p-4 transition-all relative group shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold w-5 h-5 flex items-center justify-center border border-gray-200 text-gray-500 bg-gray-50 rounded-md">
                  {idx}
                </span>
                {idx === 0 ? (
                  <span className="font-serif italic text-sm text-gray-500">Incident Medium</span>
                ) : idx === layers.length - 1 ? (
                  <span className="font-serif italic text-sm text-gray-500">Substrate / Back Reflector</span>
                ) : (
                  <input
                    className="bg-transparent font-serif italic text-sm text-[#111111] focus:outline-none w-36 border-b border-transparent focus:border-gray-400 transition-all"
                    value={layer.name}
                    title="Layer Name"
                    onChange={e => updateLayer(idx, { name: e.target.value })}
                  />
                )}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {idx > 0 && idx < layers.length - 1 && (
                  <>
                    <button onClick={() => moveLayer(idx, 'up')} className="p-1 text-gray-400 hover:text-[#111111] transition-colors" title="Move Up"><ArrowUp size={12} /></button>
                    <button onClick={() => moveLayer(idx, 'down')} className="p-1 text-gray-400 hover:text-[#111111] transition-colors" title="Move Down"><ArrowDown size={12} /></button>
                    <button onClick={() => removeLayer(idx)} className="p-1 text-red-500 hover:text-red-600 transition-colors" title="Delete Layer"><Trash2 size={12} /></button>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {idx > 0 && idx < layers.length - 1 && (
                <div className="col-span-2 space-y-1">
                  <div className="flex justify-between text-[9px] font-mono font-bold text-gray-400">
                    <span>THICKNESS</span>
                    <span className="text-[#111111]">{layer.thickness} nm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="2000"
                    value={layer.thickness}
                    onChange={e => updateLayer(idx, { thickness: Number(e.target.value) })}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#111111]"
                  />
                </div>
              )}
              <div className="space-y-1 col-span-2">
                <label className="text-[9px] font-mono font-bold text-gray-400">MATERIAL PRESET</label>
                <select
                  title="Material Preset Selection"
                  value={MATERIALS[layer.name] ? layer.name : 'Custom'}
                  onChange={e => {
                    const matName = e.target.value;
                    const mat = MATERIALS[matName];
                    if (matName === 'Custom') {
                      updateLayer(idx, { name: 'Custom' });
                    } else if (mat) {
                      updateLayer(idx, { name: matName, n: mat.n, k: mat.k });
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 py-1.5 px-3 rounded-lg text-xs outline-none cursor-pointer font-mono text-[#111111] transition-colors focus:border-gray-400"
                >
                  <option value="Custom">Custom / Static</option>
                  {Object.keys(MATERIALS).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-gray-400">REFRACTIVE INDEX (n)</label>
                <input
                  type="number"
                  title="Refractive index n"
                  step="0.01"
                  min="0"
                  value={layer.n}
                  onChange={e => updateLayer(idx, { n: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 py-1 px-2 rounded text-xs outline-none font-mono text-[#2563EB] focus:border-gray-400 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-gray-400">EXTINCTION COEFF (k)</label>
                <input
                  type="number"
                  title="Extinction coefficient k"
                  step="0.001"
                  min="0"
                  value={layer.k}
                  onChange={e => updateLayer(idx, { k: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 py-1 px-2 rounded text-xs outline-none font-mono text-[#DC2626] focus:border-gray-400 transition-colors"
                />
              </div>
            </div>
            {idx > 0 && idx < layers.length - 1 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <label htmlFor={`thick-${layer.id}`} className="text-[9px] font-mono font-bold text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">TREAT AS SEMI-INFINITE</label>
                <input
                  type="checkbox"
                  title="Semi-infinite thick layer checkbox"
                  id={`thick-${layer.id}`}
                  className="w-3.5 h-3.5 rounded border-gray-300 accent-[#111111] cursor-pointer"
                  checked={layer.isThick}
                  onChange={e => updateLayer(idx, { isThick: e.target.checked })}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
export default LayerStack;
