import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
interface SimulationChartsProps {
  activeTab: 'spectral' | 'absorption' | 'generation' | 'ellipsometry';
}
const SimulationCharts: React.FC<SimulationChartsProps> = ({ activeTab }) => {
  const { results, profile, generationProfile, ellipsometryData, scanType } = useSimulation();
  return (
    <div className="flex-1 min-h-[300px] lg:min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        {activeTab === 'spectral' ? (
          <LineChart data={results} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.05)" vertical={false} />
            <XAxis
              dataKey="wavelength"
              stroke="rgba(17,17,17,0.4)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              label={{ value: scanType === 'wavelength' ? 'Wavelength (nm)' : 'Angle of Incidence θi (°)', position: 'insideBottom', offset: -5, fill: 'rgba(17,17,17,0.4)', fontSize: 10, fontFamily: 'monospace' }}
            />
            <YAxis
              stroke="rgba(17,17,17,0.4)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 1]}
              tickFormatter={val => `${(val * 100).toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(17,17,17,0.1)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ fontSize: '12px', color: '#111111' }}
              labelStyle={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace', color: '#6B7280' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace' }} />
            <Line type="monotone" dataKey="R" stroke="#111111" strokeWidth={2.5} dot={false} name="Reflectance" isAnimationActive={false} />
            <Line type="monotone" dataKey="T" stroke="#2563EB" strokeWidth={2.5} dot={false} name="Transmittance" isAnimationActive={false} />
            <Line type="monotone" dataKey="A" stroke="#DC2626" strokeWidth={2.5} dot={false} name="Absorbance" isAnimationActive={false} />
          </LineChart>
        ) : activeTab === 'absorption' ? (
          <AreaChart data={profile} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.05)" vertical={false} />
            <XAxis
              dataKey="z"
              stroke="rgba(17,17,17,0.4)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Stack Coordinate depth z (nm)', position: 'insideBottom', offset: -5, fill: 'rgba(17,17,17,0.4)', fontSize: 10, fontFamily: 'monospace' }}
            />
            <YAxis yId="left" stroke="#DC2626" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis yId="right" orientation="right" stroke="#2563EB" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(17,17,17,0.1)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace' }} />
            <Area yId="left" type="monotone" dataKey="absorption" stroke="#DC2626" fill="#DC2626" fillOpacity={0.15} name="Absorbed Rate A(z)" isAnimationActive={false} />
            <Area yId="right" type="monotone" dataKey="fieldIntensity" stroke="#2563EB" fill="#2563EB" fillOpacity={0.08} name="Field Intensity |E|²" isAnimationActive={false} />
          </AreaChart>
        ) : activeTab === 'generation' ? (
          <AreaChart data={generationProfile} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.05)" vertical={false} />
            <XAxis
              dataKey="z"
              stroke="rgba(17,17,17,0.4)"
              fontSize={10}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Stack Coordinate depth z (nm)', position: 'insideBottom', offset: -5, fill: 'rgba(17,17,17,0.4)', fontSize: 10, fontFamily: 'monospace' }}
            />
            <YAxis stroke="#D97706" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(17,17,17,0.1)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            <Area type="monotone" dataKey="absorption" stroke="#D97706" fill="#D97706" fillOpacity={0.2} name="Photogenerated Carriers G(z) (cm⁻³ s⁻¹)" isAnimationActive={false} />
          </AreaChart>
        ) : (
          <LineChart data={ellipsometryData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.05)" vertical={false} />
            <XAxis
              dataKey="wavelength"
              stroke="rgba(17,17,17,0.4)"
              fontSize={10}
              axisLine={false}
              tickLine={false}
              label={{ value: scanType === 'wavelength' ? 'Wavelength (nm)' : 'Angle of Incidence θi (°)', position: 'insideBottom', offset: -5, fill: 'rgba(17,17,17,0.4)', fontSize: 10, fontFamily: 'monospace' }}
            />
            <YAxis yId="left" stroke="#7C3AED" fontSize={10} axisLine={false} tickLine={false} unit="°" />
            <YAxis yId="right" orientation="right" stroke="#DB2777" fontSize={10} axisLine={false} tickLine={false} unit="°" />
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(17,17,17,0.1)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace' }} />
            <Line yId="left" type="monotone" dataKey="psi" stroke="#7C3AED" strokeWidth={2} dot={false} name="Psi (ψ)" isAnimationActive={false} />
            <Line yId="right" type="monotone" dataKey="delta" stroke="#DB2777" strokeWidth={2} dot={false} name="Delta (Δ)" isAnimationActive={false} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
export default SimulationCharts;
