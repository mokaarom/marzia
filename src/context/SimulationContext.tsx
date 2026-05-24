import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Layer,
  SimulationResult,
  TMMSimulator,
  Polarization,
  AbsorptionProfilePoint,
  ColorUtils,
  MATERIALS
} from '../lib/tmm';
export interface Preset {
  name: string;
  description: string;
  scanType: 'wavelength' | 'angle';
  startWl: number;
  endWl: number;
  stepWl: number;
  sourceWavelength: number;
  startAngle: number;
  endAngle: number;
  stepAngle: number;
  angle: number;
  polarization: Polarization | 'unpolarized';
  layers: Layer[];
}
export const PRESETS: Preset[] = [
  {
    name: '1/4-Wave Bragg Reflector (DBR)',
    description: 'Alternating high/low refractive index dielectric mirror (TiO2 & SiO2) centered at 600 nm, producing a 99%+ reflection stop band.',
    scanType: 'wavelength',
    startWl: 400,
    endWl: 800,
    stepWl: 5,
    sourceWavelength: 600,
    startAngle: 0,
    endAngle: 85,
    stepAngle: 0.5,
    angle: 0,
    polarization: 'unpolarized',
    layers: [
      { id: '1', name: 'Air', thickness: 0, n: 1.0, k: 0, isThick: true },
      { id: '2', name: 'Titania (TiO2)', thickness: 62.5, n: 2.4, k: 0, isThick: false },
      { id: '3', name: 'Silica (SiO2)', thickness: 103.4, n: 1.45, k: 0, isThick: false },
      { id: '4', name: 'Titania (TiO2)', thickness: 62.5, n: 2.4, k: 0, isThick: false },
      { id: '5', name: 'Silica (SiO2)', thickness: 103.4, n: 1.45, k: 0, isThick: false },
      { id: '6', name: 'Titania (TiO2)', thickness: 62.5, n: 2.4, k: 0, isThick: false },
      { id: '7', name: 'Silica (SiO2)', thickness: 103.4, n: 1.45, k: 0, isThick: false },
      { id: '8', name: 'Titania (TiO2)', thickness: 62.5, n: 2.4, k: 0, isThick: false },
      { id: '9', name: 'Silica (SiO2)', thickness: 103.4, n: 1.45, k: 0, isThick: false },
      { id: '10', name: 'Titania (TiO2)', thickness: 62.5, n: 2.4, k: 0, isThick: false },
      { id: '11', name: 'Glass (BK7)', thickness: 0, n: 1.51, k: 0, isThick: true }
    ]
  },
  {
    name: 'Silicon Solar Cell with ARC',
    description: 'Silicon photovoltaic cell with a Magnesium Fluoride (MgF2) anti-reflective coating to maximize solar photogeneration.',
    scanType: 'wavelength',
    startWl: 300,
    endWl: 1000,
    stepWl: 10,
    sourceWavelength: 550,
    startAngle: 0,
    endAngle: 80,
    stepAngle: 1,
    angle: 0,
    polarization: 'unpolarized',
    layers: [
      { id: '1', name: 'Air', thickness: 0, n: 1.0, k: 0, isThick: true },
      { id: '2', name: 'Magnesium Fluoride (MgF2)', thickness: 95, n: 1.38, k: 0, isThick: false },
      { id: '3', name: 'Silicon (Si)', thickness: 350, n: 3.42, k: 0.01, isThick: false },
      { id: '4', name: 'Aluminum (Al)', thickness: 0, n: 1.2, k: 7.0, isThick: true }
    ]
  },
  {
    name: 'Surface Plasmon Resonance (SPR) Sensor',
    description: 'Kretschmann plasmonic filter showing a sharp, deep reflection dip around 43.5° under p-polarized light at 633 nm.',
    scanType: 'angle',
    startWl: 400,
    endWl: 800,
    stepWl: 5,
    sourceWavelength: 633,
    startAngle: 30,
    endAngle: 60,
    stepAngle: 0.2,
    angle: 43.5,
    polarization: 'p',
    layers: [
      { id: '1', name: 'Glass (BK7)', thickness: 0, n: 1.517, k: 0, isThick: true },
      { id: '2', name: 'Gold (Au)', thickness: 50, n: 0.13, k: 3.162, isThick: false },
      { id: '3', name: 'Air', thickness: 0, n: 1.0, k: 0, isThick: true }
    ]
  },
  {
    name: 'Single-Layer Anti-Reflection Coating',
    description: 'A 1/4-wavelength thin-film designed to cancel reflective waves at 550 nm.',
    scanType: 'wavelength',
    startWl: 350,
    endWl: 850,
    stepWl: 5,
    sourceWavelength: 550,
    startAngle: 0,
    endAngle: 85,
    stepAngle: 1,
    angle: 0,
    polarization: 'unpolarized',
    layers: [
      { id: '1', name: 'Air', thickness: 0, n: 1.0, k: 0, isThick: true },
      { id: '2', name: 'Magnesium Fluoride (MgF2)', thickness: 100, n: 1.38, k: 0, isThick: false },
      { id: '3', name: 'Silicon (Si)', thickness: 0, n: 3.42, k: 0.01, isThick: true }
    ]
  }
];
export const INITIAL_LAYERS: Layer[] = [
  { id: '1', name: 'Air', thickness: 0, n: 1.0, k: 0, isThick: true },
  { id: '2', name: 'Magnesium Fluoride (MgF2)', thickness: 100, n: 1.38, k: 0, isThick: false },
  { id: '3', name: 'Silicon (Si)', thickness: 250, n: 3.42, k: 0.01, isThick: false },
  { id: '4', name: 'Aluminum (Al)', thickness: 0, n: 1.2, k: 7.0, isThick: true },
];
interface SimulationContextType {
  layers: Layer[];
  scanType: 'wavelength' | 'angle';
  startWl: number;
  endWl: number;
  stepWl: number;
  angle: number;
  sourceWavelength: number;
  startAngle: number;
  endAngle: number;
  stepAngle: number;
  polarization: Polarization | 'unpolarized';
  results: SimulationResult[];
  profile: AbsorptionProfilePoint[];
  generationProfile: AbsorptionProfilePoint[];
  profileWl: number;
  activePreset: string;
  surfaceColor: string;
  ellipsometryData: { wavelength: number; psi: number; delta: number }[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setScanType: React.Dispatch<React.SetStateAction<'wavelength' | 'angle'>>;
  setStartWl: React.Dispatch<React.SetStateAction<number>>;
  setEndWl: React.Dispatch<React.SetStateAction<number>>;
  setStepWl: React.Dispatch<React.SetStateAction<number>>;
  setAngle: React.Dispatch<React.SetStateAction<number>>;
  setSourceWavelength: React.Dispatch<React.SetStateAction<number>>;
  setStartAngle: React.Dispatch<React.SetStateAction<number>>;
  setEndAngle: React.Dispatch<React.SetStateAction<number>>;
  setStepAngle: React.Dispatch<React.SetStateAction<number>>;
  setPolarization: React.Dispatch<React.SetStateAction<Polarization | 'unpolarized'>>;
  setProfileWl: React.Dispatch<React.SetStateAction<number>>;
  setActivePreset: React.Dispatch<React.SetStateAction<string>>;
  simulate: () => void;
  applyPreset: (presetName: string) => void;
  addLayer: () => void;
  removeLayer: (index: number) => void;
  updateLayer: (index: number, updates: Partial<Layer>) => void;
  moveLayer: (index: number, direction: 'up' | 'down') => void;
  exportCSV: () => void;
}
const SimulationContext = createContext<SimulationContextType | undefined>(undefined);
export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layers, setLayers] = useState<Layer[]>(INITIAL_LAYERS);
  const [scanType, setScanType] = useState<'wavelength' | 'angle'>('wavelength');
  const [startWl, setStartWl] = useState(300);
  const [endWl, setEndWl] = useState(1000);
  const [stepWl, setStepWl] = useState(5);
  const [angle, setAngle] = useState(0);
  const [sourceWavelength, setSourceWavelength] = useState(633);
  const [startAngle, setStartAngle] = useState(0);
  const [endAngle, setEndAngle] = useState(90);
  const [stepAngle, setStepAngle] = useState(0.5);
  const [polarization, setPolarization] = useState<Polarization | 'unpolarized'>('unpolarized');
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [profile, setProfile] = useState<AbsorptionProfilePoint[]>([]);
  const [generationProfile, setGenerationProfile] = useState<AbsorptionProfilePoint[]>([]);
  const [profileWl, setProfileWl] = useState(550);
  const [activePreset, setActivePreset] = useState<string>('Custom');
  const simulate = useCallback(() => {
    const newResults: SimulationResult[] = [];
    const middleLayers = layers.slice(1, -1);
    const nStart = layers[0].n;
    const nEnd = layers[layers.length - 1].n;
    if (scanType === 'wavelength') {
      for (let wl = startWl; wl <= endWl; wl += stepWl) {
        const res = TMMSimulator.calculate(wl, angle, polarization, middleLayers, nStart, nEnd);
        newResults.push(res);
      }
      setResults(newResults);
      const prof = TMMSimulator.calculateAbsorptionProfile(profileWl, angle, polarization === 'unpolarized' ? 's' : polarization, middleLayers, nStart, nEnd);
      setProfile(prof);
      const genProf = TMMSimulator.calculateGenerationProfile(angle, polarization, middleLayers, nStart, nEnd);
      setGenerationProfile(genProf);
    } else {
      for (let a = startAngle; a <= endAngle; a += stepAngle) {
        const res = TMMSimulator.calculate(sourceWavelength, a, polarization, middleLayers, nStart, nEnd);
        newResults.push({
          wavelength: a,
          R: res.R,
          T: res.T,
          A: res.A
        });
      }
      setResults(newResults);
      const prof = TMMSimulator.calculateAbsorptionProfile(sourceWavelength, angle, polarization === 'unpolarized' ? 's' : polarization, middleLayers, nStart, nEnd);
      setProfile(prof);
      const genProf = TMMSimulator.calculateGenerationProfile(angle, polarization, middleLayers, nStart, nEnd);
      setGenerationProfile(genProf);
    }
  }, [layers, scanType, startWl, endWl, stepWl, angle, sourceWavelength, startAngle, endAngle, stepAngle, polarization, profileWl]);
  useEffect(() => {
    simulate();
  }, [simulate]);
  const applyPreset = (presetName: string) => {
    const pr = PRESETS.find(p => p.name === presetName);
    if (!pr) return;
    setActivePreset(presetName);
    setScanType(pr.scanType);
    setStartWl(pr.startWl);
    setEndWl(pr.endWl);
    setStepWl(pr.stepWl);
    setSourceWavelength(pr.sourceWavelength);
    setStartAngle(pr.startAngle);
    setEndAngle(pr.endAngle);
    setStepAngle(pr.stepAngle);
    setAngle(pr.angle);
    setPolarization(pr.polarization);
    setLayers(pr.layers);
  };
  const addLayer = () => {
    const newLayer: Layer = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'Custom',
      thickness: 50,
      n: 1.5,
      k: 0,
      isThick: false
    };
    const newLayers = [...layers];
    newLayers.splice(layers.length - 1, 0, newLayer);
    setLayers(newLayers);
    setActivePreset('Custom');
  };
  const removeLayer = (index: number) => {
    if (index === 0 || index === layers.length - 1) return;
    const newLayers = layers.filter((_, i) => i !== index);
    setLayers(newLayers);
    setActivePreset('Custom');
  };
  const updateLayer = (index: number, updates: Partial<Layer>) => {
    const newLayers = [...layers];
    newLayers[index] = { ...newLayers[index], ...updates };
    setLayers(newLayers);
    setActivePreset('Custom');
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
    setActivePreset('Custom');
  };
  const surfaceColor = useMemo(() => {
    if (scanType === 'angle') {
      const middleLayers = layers.slice(1, -1);
      const testRes: SimulationResult[] = [];
      for (let wl = 380; wl <= 780; wl += 10) {
        testRes.push(TMMSimulator.calculate(wl, 0, 'unpolarized', middleLayers, layers[0].n, layers[layers.length - 1].n));
      }
      return ColorUtils.spectrumToRGB(testRes);
    }
    return ColorUtils.spectrumToRGB(results);
  }, [results, layers, scanType]);
  const ellipsometryData = useMemo(() => {
    const middleLayers = layers.slice(1, -1);
    const nStart = layers[0].n;
    const nEnd = layers[layers.length - 1].n;
    if (scanType === 'wavelength') {
      return results.map(r => {
        const { psi, delta } = TMMSimulator.calculateEllipsometry(r.wavelength, angle, middleLayers, nStart, nEnd);
        return { wavelength: r.wavelength, psi, delta };
      });
    } else {
      return results.map(r => {
        const { psi, delta } = TMMSimulator.calculateEllipsometry(sourceWavelength, r.wavelength, middleLayers, nStart, nEnd);
        return { wavelength: r.wavelength, psi, delta };
      });
    }
  }, [results, layers, angle, scanType, sourceWavelength]);
  const exportCSV = () => {
    const labelX = scanType === 'wavelength' ? "Wavelength (nm)" : "Angle (deg)";
    let csvContent = `data:text/csv;charset=utf-8,${labelX},R,T,A\n`;
    results.forEach(r => {
      csvContent += `${r.wavelength},${r.R},${r.T},${r.A}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `marzia_${scanType}_scan_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const value = {
    layers, scanType, startWl, endWl, stepWl, angle, sourceWavelength,
    startAngle, endAngle, stepAngle, polarization, results, profile,
    generationProfile, profileWl, activePreset, surfaceColor, ellipsometryData,
    setLayers, setScanType, setStartWl, setEndWl, setStepWl, setAngle,
    setSourceWavelength, setStartAngle, setEndAngle, setStepAngle,
    setPolarization, setProfileWl, setActivePreset,
    simulate, applyPreset, addLayer, removeLayer, updateLayer, moveLayer, exportCSV
  };
  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};
