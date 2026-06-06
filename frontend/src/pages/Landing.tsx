import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Layers, Zap, Globe, Github, BookOpen, Settings, Activity, FileDown, ArrowDown, Eye } from 'lucide-react';
import { SimulationProvider, useSimulation } from '../context/SimulationContext';
import SimulationCharts from '../components/editor/SimulationCharts';
import StackVisualizer from '../components/editor/StackVisualizer';
function LiveShowcase() {
  const { applyPreset } = useSimulation();
  React.useEffect(() => {
    applyPreset('Anti-Reflection Coating (Visible)');
  }, [applyPreset]);
  return (
    <div className="flex flex-col h-full gap-4 opacity-90 select-none pointer-events-none">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Simulation Preview</h3>
        <span className="px-2 py-1 bg-green-100 text-green-700 font-mono text-[8px] uppercase tracking-widest font-bold rounded-md">Real-Time</span>
      </div>
      <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-100 p-4 relative overflow-hidden flex flex-col">
        <SimulationCharts activeTab="spectral" />
      </div>
      <div className="h-48 bg-gray-50 rounded-2xl border border-gray-100 p-4 relative overflow-hidden flex flex-col">
        <StackVisualizer activeTab="spectral" />
      </div>
    </div>
  );
}
function PresetLoader({ presetName, children }: { presetName: string, children: React.ReactNode }) {
  const { applyPreset } = useSimulation();
  React.useEffect(() => {
    applyPreset(presetName);
  }, [applyPreset, presetName]);
  return <>{children}</>;
}
function MetricsShowcase() {
  const { surfaceColor } = useSimulation();
  return (
    <div className="flex flex-col h-full gap-4 opacity-90 select-none pointer-events-none">
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm gap-4">
        <h3 className="font-serif italic text-xl">Perceived Structural Color</h3>
        <div
          className="w-32 h-32 rounded-full shadow-inner border-4 border-gray-100 transition-colors duration-500"
          style={{ backgroundColor: surfaceColor }}
        />
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">{surfaceColor}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center">
          <span className="font-mono text-[10px] uppercase text-gray-400 font-bold mb-1 tracking-widest text-center">Avg Absorption</span>
          <span className="font-mono text-xl font-bold text-[#111111]">62.4%</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center">
          <span className="font-mono text-[10px] uppercase text-gray-400 font-bold mb-1 tracking-widest text-center">Generation Flux</span>
          <span className="font-mono text-xl font-bold text-[#111111]">12.8 <span className="text-[10px]">mA/cm²</span></span>
        </div>
      </div>
    </div>
  );
}
export default function Landing() {
  const scrollToManual = () => {
    document.getElementById('manual-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#111111] selection:text-white overflow-x-hidden">
      <nav className="border-b border-gray-200 p-6 flex justify-between items-center relative z-10 bg-white/80 backdrop-blur-md sticky top-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-[#111111] rounded-xl shadow-sm overflow-hidden shrink-0">
            <img src="/assets/icons/logo.webp" alt="Marzia Logo" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-2xl font-serif italic tracking-tight">Marzia</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mt-0.5 font-bold">Optics Engine v2.0</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-6 items-center"
        >
          <button onClick={scrollToManual} className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-[#111111] transition-colors uppercase font-bold tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Manual</span>
          </button>
          <a href="https://github.com/mokaarom/marzia" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-[#111111] transition-colors uppercase font-bold tracking-widest">
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <Link to="/editor" className="flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-sm">
            <span className="font-mono text-xs uppercase tracking-wider font-bold">Launch App</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </nav>
      <main className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto z-10 min-h-[85vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="inline-block border border-gray-200 bg-gray-50 px-4 py-1.5 mb-8 rounded-full">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-gray-600">Version 2.0 • Now with Spectral Data</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-serif italic tracking-tight leading-[0.9] mb-8">
              Design the <br />
              <span className="text-gray-400">Unseen.</span>
            </h2>
            <p className="text-lg md:text-xl font-sans text-gray-600 max-w-lg mb-12 leading-relaxed">
              Marzia is an advanced web-based Transfer Matrix Method (TMM) engine for simulating thin-film optics, solar cells, and custom multilayer structures.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/editor" className="flex items-center justify-center gap-3 bg-[#111111] text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all shadow-md text-lg group w-full md:w-auto">
                <span className="font-serif italic">Start Simulating</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={scrollToManual} className="flex items-center justify-center gap-3 bg-white text-[#111111] border border-gray-200 px-8 py-4 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-lg group w-full md:w-auto">
                <span className="font-serif italic">Read Manual</span>
                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative h-[600px] hidden lg:block"
          >
            <div className="absolute inset-0 border border-gray-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] rounded-3xl p-6 flex flex-col overflow-hidden">
              <SimulationProvider>
                <LiveShowcase />
              </SimulationProvider>
            </div>
          </motion.div>
        </div>
      </main>
      <section className="bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 py-24 border-b border-gray-100">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200 text-[#111111] mb-6">
                <Layers size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic text-[#111111] leading-tight">Advanced Multilayer Construction</h2>
              <div className="w-16 h-1 bg-[#111111] rounded-full"></div>
              <p className="text-lg text-gray-600 leading-relaxed font-sans">
                Build arbitrary optical stacks with ultimate precision. Marzia allows you to intuitively stack thin films, assign custom thicknesses, and utilize complex dispersive optical constants (n, k) for robust materials like Silicon, Silicon Dioxide, or Silver.
              </p>
              <ul className="space-y-3 font-mono text-xs text-gray-500 font-bold uppercase tracking-wide mt-8">
                <li className="flex gap-3 items-center"><ChevronRight size={14} className="text-[#111111]" /> Arbitrary number of layers</li>
                <li className="flex gap-3 items-center"><ChevronRight size={14} className="text-[#111111]" /> Complex Dispersive Materials</li>
                <li className="flex gap-3 items-center"><ChevronRight size={14} className="text-[#111111]" /> Live Structural Preview</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full h-[450px] bg-gray-50 rounded-3xl border border-gray-200 shadow-sm p-6 overflow-hidden relative pointer-events-none select-none"
            >
              <SimulationProvider>
                <PresetLoader presetName="Distributed Bragg Reflector (DBR)">
                  <StackVisualizer activeTab="spectral" />
                </PresetLoader>
              </SimulationProvider>
            </motion.div>
          </div>
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20 py-24 border-b border-gray-100">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200 text-[#111111] mb-6">
                <Activity size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic text-[#111111] leading-tight">Comprehensive Spectral Analysis</h2>
              <div className="w-16 h-1 bg-[#111111] rounded-full"></div>
              <p className="text-lg text-gray-600 leading-relaxed font-sans">
                Experience instantaneous recalculation of rigorous optics equations. As you adjust a layer's thickness or the incident angle, Marzia instantly solves the Transfer Matrix across the entire wavelength domain, rendering beautiful curves for Reflectance, Transmittance, and Absorbance.
              </p>
              <ul className="space-y-3 font-mono text-xs text-gray-500 font-bold uppercase tracking-wide mt-8">
                <li className="flex gap-3 items-center"><ChevronRight size={14} className="text-[#111111]" /> R, T, A Spectral Mapping</li>
                <li className="flex gap-3 items-center"><ChevronRight size={14} className="text-[#111111]" /> Electric Field Standing Waves</li>
                <li className="flex gap-3 items-center"><ChevronRight size={14} className="text-[#111111]" /> AM1.5G Generation Profiles</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full h-[450px] bg-gray-50 rounded-3xl border border-gray-200 shadow-sm p-6 overflow-hidden relative pointer-events-none select-none flex flex-col"
            >
              <SimulationProvider>
                <PresetLoader presetName="Silicon Solar Cell (Simplified)">
                  <SimulationCharts activeTab="spectral" />
                </PresetLoader>
              </SimulationProvider>
            </motion.div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 py-24 border-b border-gray-100 last:border-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200 text-[#111111] mb-6">
                <Eye size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic text-[#111111] leading-tight">Structural Color & KPIs</h2>
              <div className="w-16 h-1 bg-[#111111] rounded-full"></div>
              <p className="text-lg text-gray-600 leading-relaxed font-sans">
                Predict the visual appearance of your thin films before manufacturing. Marzia integrates the reflection spectrum against the standard D65 daylight illuminant to simulate the perceived human-eye color, outputting precise HEX and RGB values alongside critical efficiency KPIs.
              </p>
              <ul className="space-y-3 font-mono text-xs text-gray-500 font-bold uppercase tracking-wide mt-8">
                <li className="flex gap-3 items-center"><ChevronRight size={14} className="text-[#111111]" /> D65 Color Integration</li>
                <li className="flex gap-3 items-center"><ChevronRight size={14} className="text-[#111111]" /> Live KPI Footprints</li>
                <li className="flex gap-3 items-center"><ChevronRight size={14} className="text-[#111111]" /> CSV Raw Data Exports</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full h-[450px] bg-gray-50 rounded-3xl border border-gray-200 shadow-sm p-6 overflow-hidden relative pointer-events-none select-none"
            >
              <SimulationProvider>
                <PresetLoader presetName="Distributed Bragg Reflector (DBR)">
                  <MetricsShowcase />
                </PresetLoader>
              </SimulationProvider>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="border-t border-gray-200 bg-white relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-serif italic mb-6">The Theory Behind Marzia</h2>
            <div className="w-16 h-1 bg-[#111111] rounded-full mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed font-sans mb-6">
              Marzia is powered by the <strong>Transfer Matrix Method (TMM)</strong>, a robust mathematical formalism used in optics to analyze the propagation of electromagnetic waves through a layered (stratified) medium.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-sans mb-12">
              By representing each layer as a characteristic 2x2 matrix, the method elegantly computes how light is reflected and transmitted at each interface, accounting for multiple internal reflections and wave interference. The total behavior of a multilayer stack is simply the product of the matrices of its constituent layers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:bg-white transition-colors">
              <h3 className="text-xl font-serif italic mb-3">Anti-Reflection Coatings</h3>
              <p className="font-mono text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-wide">
                Minimize reflection losses in lenses and solar cells by designing destructive interference for reflected waves.
              </p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:bg-white transition-colors">
              <h3 className="text-xl font-serif italic mb-3">Bragg Reflectors (DBR)</h3>
              <p className="font-mono text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-wide">
                Create highly reflective mirrors by alternating high and low refractive index materials in periodic stacks.
              </p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:bg-white transition-colors">
              <h3 className="text-xl font-serif italic mb-3">Thin-Film Solar Cells</h3>
              <p className="font-mono text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-wide">
                Calculate the spatial absorption map A(z) inside active layers to estimate maximum short-circuit current (J_sc).
              </p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:bg-white transition-colors">
              <h3 className="text-xl font-serif italic mb-3">Structural Color</h3>
              <p className="font-mono text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-wide">
                Simulate vibrant, iridescent colors produced strictly by optical interference rather than chemical pigmentation.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="manual-section" className="border-t border-gray-200 relative z-10 px-6 py-24 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-serif italic mb-6">User Manual</h2>
            <p className="text-lg text-gray-500 font-mono tracking-widest uppercase font-bold">Quick Start Guide for Marzia v2.0</p>
          </div>
          <div className="space-y-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 text-[#111111]">
                  <Settings size={24} />
                </div>
                <h3 className="text-2xl font-serif italic">1. Global Parameters</h3>
              </div>
              <p className="text-gray-600 mb-6 font-sans leading-relaxed">
                The left sidebar contains the primary configuration for the incoming light source. Adjust these parameters to set up the boundary conditions for the simulation.
              </p>
              <ul className="space-y-4 font-mono text-xs text-gray-500 font-bold uppercase tracking-wide">
                <li className="flex gap-3"><span className="text-[#111111]">•</span> <strong>Wavelength Range:</strong> Define the spectral window (in nanometers) to evaluate. For solar applications, 300nm - 1200nm is typical.</li>
                <li className="flex gap-3"><span className="text-[#111111]">•</span> <strong>Angle of Incidence:</strong> Set the angle (in degrees) of the incoming light relative to the surface normal (0°).</li>
                <li className="flex gap-3"><span className="text-[#111111]">•</span> <strong>Polarization:</strong> Choose between TE (s-polarized), TM (p-polarized), or Unpolarized light.</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 text-[#111111]">
                  <Layers size={24} />
                </div>
                <h3 className="text-2xl font-serif italic">2. Layer Stack Construction</h3>
              </div>
              <p className="text-gray-600 mb-6 font-sans leading-relaxed">
                Build your structure layer by layer from the top down. The first layer is the <strong>Incident Medium</strong> (where the light originates, e.g., Air) and the last is the <strong>Substrate</strong>.
              </p>
              <ul className="space-y-4 font-mono text-xs text-gray-500 font-bold uppercase tracking-wide">
                <li className="flex gap-3"><span className="text-[#111111]">•</span> <strong>Thickness:</strong> Define physical layer thickness in nanometers.</li>
                <li className="flex gap-3"><span className="text-[#111111]">•</span> <strong>Optical Constants:</strong> Assign Refractive Index (n) and Extinction Coefficient (k).</li>
                <li className="flex gap-3"><span className="text-[#111111]">•</span> <strong>Semi-Infinite Flag:</strong> Check this for the Incident Medium and Substrate to indicate they are bulk materials without returning boundaries.</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 text-[#111111]">
                  <Activity size={24} />
                </div>
                <h3 className="text-2xl font-serif italic">3. Visualizing Results</h3>
              </div>
              <p className="text-gray-600 mb-6 font-sans leading-relaxed">
                The main dashboard provides four distinct tabs to analyze the TMM output in real-time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="font-serif italic text-lg mb-2 text-[#111111]">Spectral Curves</h4>
                  <p className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">Plots Reflectance (R), Transmittance (T), and Absorbance (A) over the defined wavelength spectrum.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="font-serif italic text-lg mb-2 text-[#111111]">Field & Absorption</h4>
                  <p className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">Displays the normalized Electric Field intensity (|E|²) and local absorption (A) across depth z.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="font-serif italic text-lg mb-2 text-[#111111]">Generation Profile</h4>
                  <p className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">Calculates electron-hole pair generation rate per unit volume under AM1.5G solar illumination.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="font-serif italic text-lg mb-2 text-[#111111]">Ellipsometry</h4>
                  <p className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">Extracts standard ellipsometric parameters Ψ and Δ from reflection amplitude ratios.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 text-[#111111]">
                  <FileDown size={24} />
                </div>
                <h3 className="text-2xl font-serif italic">4. Data Export & Metrics</h3>
              </div>
              <p className="text-gray-600 mb-6 font-sans leading-relaxed">
                Look to the <strong>Metrics Footer</strong> at the bottom of the editor for quick insights and data extraction.
              </p>
              <ul className="space-y-4 font-mono text-xs text-gray-500 font-bold uppercase tracking-wide">
                <li className="flex gap-3"><span className="text-[#111111]">—</span> <strong>Key Performance Indicators:</strong> Instantly read the Average Absorption, Central Ellipsometric Phase, and Total Generation Flux.</li>
                <li className="flex gap-3"><span className="text-[#111111]">—</span> <strong>Reflected Color:</strong> View the simulated integrated structural color of your stack as perceived under standard D65 daylight.</li>
                <li className="flex gap-3"><span className="text-[#111111]">—</span> <strong>Export CSV:</strong> Download the raw wavelength, reflectance, transmittance, and ellipsometry data for use in OriginLab, MATLAB, or Python.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-gray-200 bg-white relative z-10 px-6 py-12 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 bg-[#111111] rounded-xl overflow-hidden shadow-sm flex items-center justify-center mb-2">
          <img src="/assets/icons/logo.webp" alt="Marzia Logo" className="w-full h-full object-cover" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-gray-400">
          Built by <a href="https://tech.nuvic.org" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-[#111111] transition-colors">Noor Technologies</a>
        </p>
      </footer>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-center items-center opacity-[0.02]">
        <div className="w-[150vw] h-[150vw] rounded-full border-[1px] border-[#111111] animate-[spin_120s_linear_infinite]" />
        <div className="absolute w-[100vw] h-[100vw] rounded-full border-[1px] border-[#111111] animate-[spin_90s_linear_infinite_reverse]" />
        <div className="absolute w-[50vw] h-[50vw] rounded-full border-[1px] border-[#111111] animate-[spin_60s_linear_infinite]" />
      </div>
    </div>
  );
}
