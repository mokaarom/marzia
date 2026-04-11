import * as math from 'mathjs';

export type Polarization = 's' | 'p';

export interface SpectralPoint {
  wavelength: number;
  n: number;
  k: number;
}

export interface Layer {
  id: string;
  name: string;
  thickness: number; 
  n: number; 
  k: number; 
  isThick: boolean; 
  forceIncoherent?: boolean; 
  bandwidth?: number; 
  spectralData?: SpectralPoint[];
  
  bandgap?: number; 
  affinity?: number; 
  dopingType?: 'n' | 'p' | 'i';
  dopingConc?: number; 
  mobilityN?: number; 
  mobilityP?: number; 
}

export interface SimulationResult {
  wavelength: number;
  R: number;
  T: number;
  A: number;
  r?: any;
  t?: any;
  psi?: number;
  delta?: number;
}

export interface AbsorptionProfilePoint {
  z: number; 
  absorption: number; 
  fieldIntensity: number; 
  layerName: string;
}

export function make2x2Matrix<T>(a: T, b: T, c: T, d: T): T[][] {
  return [[a, b], [c, d]];
}

export function isForwardAngle(n: any, theta: any): boolean {
  const nc = math.multiply(n, math.cos(theta)) as any;
  if (Math.abs(nc.im) > 1e-10) {
    return nc.im > 0;
  } else {
    return nc.re > 0;
  }
}

export function snell(n1: any, n2: any, theta1: any): any {
  const sinTheta2 = math.divide(math.multiply(n1, math.sin(theta1)), n2) as any;
  let theta2 = math.asin(sinTheta2) as any;
  if (!isForwardAngle(n2, theta2)) {
    theta2 = math.subtract(Math.PI, theta2) as any;
  }
  return theta2;
}

export function listSnell(nList: any[], theta0: any): any[] {
  const thetaList: any[] = [theta0];
  for (let i = 1; i < nList.length; i++) {
    thetaList.push(snell(nList[i - 1], nList[i], thetaList[i - 1]));
  }
  return thetaList;
}

export function interfaceR(pol: Polarization, ni: any, nf: any, thi: any, thf: any): any {
  const cosi = math.cos(thi);
  const cosf = math.cos(thf);
  if (pol === 's') {
    const num = math.subtract(math.multiply(ni, cosi), math.multiply(nf, cosf));
    const den = math.add(math.multiply(ni, cosi), math.multiply(nf, cosf));
    return math.divide(num, den);
  } else {
    const num = math.subtract(math.multiply(nf, cosi), math.multiply(ni, cosf));
    const den = math.add(math.multiply(nf, cosi), math.multiply(ni, cosf));
    return math.divide(num, den);
  }
}

export function interfaceT(pol: Polarization, ni: any, nf: any, thi: any, thf: any): any {
  const cosi = math.cos(thi);
  const cosf = math.cos(thf);
  if (pol === 's') {
    const num = math.multiply(2, math.multiply(ni, cosi));
    const den = math.add(math.multiply(ni, cosi), math.multiply(nf, cosf));
    return math.divide(num, den);
  } else {
    const num = math.multiply(2, math.multiply(ni, cosi));
    const den = math.add(math.multiply(nf, cosi), math.multiply(ni, cosf));
    return math.divide(num, den);
  }
}

export function RfromR(r: any): number {
  return Math.pow(math.abs(r) as any, 2);
}

export function TfromT(pol: Polarization, t: any, ni: any, nf: any, thi: any, thf: any): number {
  const cosi = math.cos(thi);
  const cosf = math.cos(thf);
  const term1 = Math.pow(math.abs(t) as any, 2);
  let term2: number;
  if (pol === 's') {
    term2 = (math.multiply(nf, cosf) as any).re / (math.multiply(ni, cosi) as any).re;
  } else {
    const nfcosf = math.multiply(nf, math.conj(cosf)) as any;
    const nicosi = math.multiply(ni, math.conj(cosi)) as any;
    term2 = nfcosf.re / nicosi.re;
  }
  return term1 * term2;
}

export class AbsorptionAnalyticFn {
  A1: number = 0;
  A2: number = 0;
  A3: any = math.complex(0, 0);
  a1: number = 0;
  a3: number = 0;
  d: number = 0;

  fillIn(cohData: CohTmmResult, layerIdx: number) {
    const pol = cohData.pol;
    const v = cohData.vwList[layerIdx][0];
    const w = cohData.vwList[layerIdx][1];
    const kz = cohData.kzList[layerIdx];
    const n = cohData.nList[layerIdx];
    const th = cohData.thetaList[layerIdx];
    this.d = cohData.dList[layerIdx];
    this.a1 = 2 * (kz as any).im;
    this.a3 = 2 * (kz as any).re;

    if (pol === 's') {
      const alpha = (4 * Math.PI * (math.multiply(n, math.cos(th)) as any).im) / cohData.lamVac;
      this.A1 = alpha * Math.pow(math.abs(v) as any, 2);
      this.A2 = alpha * Math.pow(math.abs(w) as any, 2);
      this.A3 = math.multiply(2 * alpha, math.multiply(v, math.conj(w)));
    } else {
      const alpha = (4 * Math.PI * (math.multiply(n, math.conj(math.cos(th))) as any).im) / cohData.lamVac;
      const absCos2 = Math.pow(math.abs(math.cos(th)) as any, 2);
      const absSin2 = Math.pow(math.abs(math.sin(th)) as any, 2);
      this.A1 = alpha * Math.pow(math.abs(v) as any, 2) * (absCos2 + absSin2);
      this.A2 = alpha * Math.pow(math.abs(w) as any, 2) * (absCos2 + absSin2);
      this.A3 = math.multiply(2 * alpha, math.multiply(math.multiply(v, math.conj(w)), math.subtract(absSin2, absCos2) as any));
    }
  }

  run(z: number): number {
    const term1 = this.A1 * Math.exp(-this.a1 * z);
    const term2 = this.A2 * Math.exp(this.a1 * z);
    const term3 = math.multiply(this.A3, math.exp(math.complex(0, this.a3 * z) as any)) as any;
    return term1 + term2 + 2 * (term3.re);
  }

  scale(factor: number) {
    this.A1 *= factor;
    this.A2 *= factor;
    this.A3 = math.multiply(this.A3, factor);
  }

  flip() {
    const oldA1 = this.A1;
    this.A1 = this.A2 * Math.exp(this.a1 * this.d);
    this.A2 = oldA1 * Math.exp(-this.a1 * this.d);
    this.A3 = math.conj(math.multiply(this.A3, math.exp(math.complex(0, this.a3 * this.d) as any)));
  }
}

export interface CohTmmResult {
  r: any;
  t: any;
  R: number;
  T: number;
  powerEntering: number;
  vwList: any[][];
  kzList: any[];
  thetaList: any[];
  pol: Polarization;
  nList: any[];
  dList: number[];
  th0: number;
  lamVac: number;
}

export class TMMSimulator {
  static getInterpolatedNK(wavelength: number, layer: Layer): { n: number, k: number } {
    if (!layer.spectralData || layer.spectralData.length === 0) {
      return { n: layer.n, k: layer.k };
    }
    const data = [...layer.spectralData].sort((a, b) => a.wavelength - b.wavelength);
    let i = 0;
    while (i < data.length && data[i].wavelength < wavelength) i++;
    if (i === 0) return { n: data[0].n, k: data[0].k };
    if (i === data.length) return { n: data[data.length - 1].n, k: data[data.length - 1].k };
    const p1 = data[i - 1]; const p2 = data[i];
    const t = (wavelength - p1.wavelength) / (p2.wavelength - p1.wavelength);
    return { n: p1.n + t * (p2.n - p1.n), k: p1.k + t * (p2.k - p1.k) };
  }

  static cohTmm(pol: Polarization, nList: any[], dList: number[], th0: number, lamVac: number): CohTmmResult {
    const complexNList = nList.map(n => typeof n === 'number' ? math.complex(n, 0) : n);
    const thetaList = listSnell(complexNList, math.complex(th0, 0));
    const kzList = complexNList.map((n, i) => math.multiply(math.divide(math.multiply(2 * Math.PI, n), lamVac), math.cos(thetaList[i])));
    let M = [[math.complex(1, 0), math.complex(0, 0)], [math.complex(0, 0), math.complex(1, 0)]];
    const numLayers = complexNList.length;
    for (let i = 0; i < numLayers - 1; i++) {
        const r = interfaceR(pol, complexNList[i], complexNList[i+1], thetaList[i], thetaList[i+1]);
        const t = interfaceT(pol, complexNList[i], complexNList[i+1], thetaList[i], thetaList[i+1]);
        const L = [[math.divide(1, t), math.divide(r, t)], [math.divide(r, t), math.divide(1, t)]];
        M = math.multiply(M, L) as any;
        if (i < numLayers - 2) {
            const phase = math.multiply(kzList[i+1], dList[i+1]) as any;
            let stabPhase = phase;
            if (phase.im > 35) stabPhase = math.complex(phase.re, 35);
            const P = [[math.exp(math.multiply(math.complex(0, -1), stabPhase) as any) as any, 0], [0, math.exp(math.multiply(math.complex(0, 1), stabPhase) as any) as any]];
            M = math.multiply(M, P) as any;
        }
    }
    const r = math.divide(M[1][0], M[0][0]);
    const t = math.divide(1, M[0][0]);
    const R = RfromR(r);
    const T = TfromT(pol, t, complexNList[0], complexNList[numLayers - 1], thetaList[0], thetaList[numLayers - 1]);
    const vwList: any[][] = new Array(numLayers);
    vwList[numLayers - 1] = [t, math.complex(0, 0)];
    for (let i = numLayers - 2; i >= 0; i--) {
        const ni = complexNList[i]; const nf = complexNList[i+1];
        const thi = thetaList[i]; const thf = thetaList[i+1];
        const ri = interfaceR(pol, ni, nf, thi, thf);
        const ti = interfaceT(pol, ni, nf, thi, thf);
        const nextV = vwList[i+1][0]; const nextW = vwList[i+1][1];
        const vInt = math.divide(math.add(nextV, math.multiply(ri, nextW)), ti);
        const wInt = math.divide(math.add(math.multiply(ri, nextV), nextW), ti);
        if (i === 0) { vwList[i] = [vInt, wInt]; } else {
            const phase = math.multiply(kzList[i], dList[i]) as any;
            vwList[i] = [math.multiply(vInt, math.exp(math.multiply(math.complex(0, -1), phase) as any)), math.multiply(wInt, math.exp(math.multiply(math.complex(0, 1), phase) as any))];
        }
    }
    return { r, t, R, T, powerEntering: 1 - R, vwList, kzList, thetaList, pol, nList: complexNList, dList, th0, lamVac };
  }

  static incTmm(pol: Polarization | 'unpolarized', nList: any[], dList: number[], cList: ('c' | 'i')[], th0: number, lamVac: number): SimulationResult {
    if (pol === 'unpolarized') {
        const resS = this.incTmm('s', nList, dList, cList, th0, lamVac);
        const resP = this.incTmm('p', nList, dList, cList, th0, lamVac);
        return { wavelength: lamVac, R: (resS.R + resP.R) / 2, T: (resS.T + resP.T) / 2, A: (resS.A + resP.A) / 2 };
    }
    const complexNList = nList.map(n => typeof n === 'number' ? math.complex(n, 0) : n);
    const thetaList = listSnell(complexNList, math.complex(th0, 0));
    const numLayers = nList.length;
    let L_net = [[1, 0], [0, 1]];
    let i = 0;
    while (i < numLayers - 1) {
        if (cList[i] === 'i' && cList[i+1] === 'i') {
            const R_int = RfromR(interfaceR(pol, complexNList[i], complexNList[i+1], thetaList[i], thetaList[i+1]));
            const T_int = TfromT(pol, interfaceT(pol, complexNList[i], complexNList[i+1], thetaList[i], thetaList[i+1]), complexNList[i], complexNList[i+1], thetaList[i], thetaList[i+1]);
            const T_mat = [[1/T_int, -R_int/T_int], [R_int/T_int, (T_int*T_int - R_int*R_int)/T_int]] as any[][];
            L_net = math.multiply(L_net, T_mat) as any;
            i++;
        } else if (cList[i] === 'i' && cList[i+1] === 'c') {
            let j = i + 1;
            while (j < numLayers && cList[j] === 'c') j++;
            const stack_n = complexNList.slice(i, j + 1);
            const stack_d = [Infinity, ...dList.slice(i + 1, j), Infinity];
            const cohResFront = this.cohTmm(pol, stack_n, stack_d, (thetaList[i] as any).re, lamVac);
            const rev_n = [...stack_n].reverse(); const rev_d = [...stack_d].reverse();
            const cohResBack = this.cohTmm(pol, rev_n, rev_d, (thetaList[j] as any).re, lamVac);
            const Rf = cohResFront.R; const Tf = cohResFront.T;
            const Rb = cohResBack.R; const Tb = cohResBack.T;
            const T_mat = [[1/Tf, -Rb/Tf], [Rf/Tf, (Tf*Tb - Rf*Rb)/Tf]] as any[][];
            L_net = math.multiply(L_net, T_mat) as any;
            i = j;
        } else { i++; }
        if (i < numLayers - 1 && cList[i] === 'i') {
            const alpha = (4 * Math.PI * (math.multiply(complexNList[i], math.cos(thetaList[i])) as any).im) / lamVac;
            const P = Math.exp(-alpha * dList[i]);
            const P_mat = [[1/P, 0], [0, P]] as any[][];
            L_net = math.multiply(L_net, P_mat) as any;
        }
    }
    const netR = L_net[1][0] / L_net[0][0]; const netT = 1 / L_net[0][0];
    return { wavelength: lamVac, R: netR, T: netT, A: 1 - netR - netT };
  }

  static calculate(wavelength: number, angleDeg: number, polarization: Polarization | 'unpolarized', layers: Layer[], nStart: number = 1.0, nEnd: number = 1.0): SimulationResult {
    const nList = [nStart, ...layers.map(l => { const { n, k } = this.getInterpolatedNK(wavelength, l); return math.complex(n, k); }), nEnd];
    const dList = [Infinity, ...layers.map(l => l.thickness), Infinity];
    const cList: ('c' | 'i')[] = ['i', ...layers.map(l => l.isThick || l.forceIncoherent ? 'i' as const : 'c' as const), 'i'];
    const angleRad = (angleDeg * Math.PI) / 180;
    if (!cList.slice(1, -1).includes('i')) {
        if (polarization === 'unpolarized') {
            const resS = this.cohTmm('s', nList, dList, angleRad, wavelength);
            const resP = this.cohTmm('p', nList, dList, angleRad, wavelength);
            return { wavelength, R: (resS.R + resP.R) / 2, T: (resS.T + resP.T) / 2, A: (resS.A + resP.A) / 2 };
        } else {
            const res = this.cohTmm(polarization, nList, dList, angleRad, wavelength);
            return { wavelength, R: res.R, T: res.T, A: 1 - res.R - res.T };
        }
    }
    return this.incTmm(polarization, nList, dList, cList, angleRad, wavelength);
  }

  static calculateWavenumber(wavenumber: number, angleDeg: number, polarization: Polarization | 'unpolarized', layers: Layer[], nStart: number = 1.0, nEnd: number = 1.0): SimulationResult {
    const wavelength = 1e7 / wavenumber; return this.calculate(wavelength, angleDeg, polarization, layers, nStart, nEnd);
  }

  static calculateEllipsometry(wavelength: number, angleDeg: number, layers: Layer[], nStart: number = 1.0, nEnd: number = 1.0): { psi: number, delta: number } {
    const nList = [nStart, ...layers.map(l => { const { n, k } = this.getInterpolatedNK(wavelength, l); return math.complex(n, k); }), nEnd];
    const dList = [Infinity, ...layers.map(l => l.thickness), Infinity];
    const angleRad = (angleDeg * Math.PI) / 180;
    const resS = this.cohTmm('s', nList, dList, angleRad, wavelength);
    const resP = this.cohTmm('p', nList, dList, angleRad, wavelength);
    const rho = math.divide(resP.r, resS.r) as any;
    const psi = Math.atan(math.abs(rho) as any);
    let delta = math.arg(rho); if (delta < 0) delta += 2 * Math.PI;
    return { psi: (psi * 180) / Math.PI, delta: (delta * 180) / Math.PI };
  }

  static calculateAbsorptionProfile(wavelength: number, angleDeg: number, polarization: Polarization, layers: Layer[], nStart: number = 1.0, nEnd: number = 1.0, resolution: number = 100): AbsorptionProfilePoint[] {
    const nList = [nStart, ...layers.map(l => { const { n, k } = this.getInterpolatedNK(wavelength, l); return math.complex(n, k); }), nEnd];
    const dList = [Infinity, ...layers.map(l => l.thickness), Infinity];
    const angleRad = (angleDeg * Math.PI) / 180;
    const cohData = this.cohTmm(polarization, nList, dList, angleRad, wavelength);
    const profile: AbsorptionProfilePoint[] = [];
    let currentZ = 0;
    for (let i = 1; i < nList.length - 1; i++) {
        const layer = layers[i - 1]; const layerThickness = layer.thickness;
        const steps = Math.max(1, Math.round((layerThickness / (layers.reduce((acc, l) => acc + l.thickness, 0) || 1)) * resolution));
        const absorpFn = new AbsorptionAnalyticFn(); absorpFn.fillIn(cohData, i);
        for (let s = 0; s <= steps; s++) {
            const zInLayer = (s / steps) * layerThickness;
            const absRate = absorpFn.run(zInLayer);
            const alpha = (4 * Math.PI * (math.multiply(cohData.nList[i], math.cos(cohData.thetaList[i])) as any).im) / wavelength;
            const intensity = absRate / (alpha || 1);
            profile.push({ z: currentZ + zInLayer, absorption: absRate, fieldIntensity: intensity, layerName: layer.name });
        }
        currentZ += layerThickness;
    }
    return profile;
  }

  static calculateGenerationProfile(angleDeg: number, polarization: Polarization | 'unpolarized', layers: Layer[], nStart: number = 1.0, nEnd: number = 1.0): AbsorptionProfilePoint[] {
    const wavelengths = Object.keys(AM15G_SPECTRUM).map(Number).sort((a, b) => a - b);
    let totalGeneration: AbsorptionProfilePoint[] = [];
    wavelengths.forEach((wl, idx) => {
      const irradiance = AM15G_SPECTRUM[wl]; const photonFlux = (irradiance * wl * 1e-9) / (6.626e-34 * 2.998e8);
      const profile = this.calculateAbsorptionProfile(wl, angleDeg, polarization === 'unpolarized' ? 's' : polarization, layers, nStart, nEnd);
      if (idx === 0) { totalGeneration = profile.map(p => ({ ...p, absorption: p.absorption * photonFlux })); } else {
        const step = wl - wavelengths[idx-1];
        profile.forEach((p, i) => { if (totalGeneration[i]) { totalGeneration[i].absorption += p.absorption * photonFlux * step; } });
      }
    });
    return totalGeneration;
  }
}

export class ColorUtils {
  private static xFit(w: number) { return 1.056 * Math.exp(-0.5 * Math.pow((w - 599.8) / 37.9, 2)) + 0.362 * Math.exp(-0.5 * Math.pow((w - 442.0) / 16.0, 2)) - 0.065 * Math.exp(-0.5 * Math.pow((w - 501.1) / 20.4, 2)); }
  private static yFit(w: number) { return 0.821 * Math.exp(-0.5 * Math.pow((w - 568.8) / 46.9, 2)) + 0.286 * Math.exp(-0.5 * Math.pow((w - 530.9) / 16.3, 2)); }
  private static zFit(w: number) { return 1.217 * Math.exp(-0.5 * Math.pow((w - 437.0) / 11.8, 2)) + 0.681 * Math.exp(-0.5 * Math.pow((w - 459.0) / 26.0, 2)); }
  static spectrumToRGB(results: SimulationResult[]): string {
    let X = 0, Y = 0, Z = 0; let norm = 0;
    results.forEach(r => { if (r.wavelength >= 380 && r.wavelength <= 780) {
        const x = this.xFit(r.wavelength); const y = this.yFit(r.wavelength); const z = this.zFit(r.wavelength);
        X += r.R * x; Y += r.R * y; Z += r.R * z; norm += y;
      }
    });
    if (norm === 0) return '#000000';
    X /= norm; Y /= norm; Z /= norm;
    let r = X * 3.2406 + Y * -1.5372 + Z * -0.4986; let g = X * -0.9689 + Y * 1.8758 + Z * 0.0415; let b = X * 0.0557 + Y * -0.2040 + Z * 1.0570;
    const gamma = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    r = Math.max(0, Math.min(1, gamma(r))); g = Math.max(0, Math.min(1, gamma(g))); b = Math.max(0, Math.min(1, gamma(b)));
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  }
}

export const MATERIALS: Record<string, { n: number, k: number }> = {
  'Custom': { n: 1.5, k: 0 }, 'Air': { n: 1.0, k: 0 }, 'Glass (BK7)': { n: 1.51, k: 0 }, 'Silicon (Si)': { n: 3.42, k: 0.01 },
  'Silica (SiO2)': { n: 1.45, k: 0 }, 'Titania (TiO2)': { n: 2.4, k: 0 }, 'Magnesium Fluoride (MgF2)': { n: 1.38, k: 0 },
  'Gold (Au)': { n: 0.2, k: 3.5 }, 'Silver (Ag)': { n: 0.05, k: 4.0 }, 'Aluminum (Al)': { n: 1.2, k: 7.0 }, 'ITO': { n: 1.9, k: 0.01 },
};

export const AM15G_SPECTRUM: Record<number, number> = {
  280: 0.0, 300: 0.0005, 320: 0.2, 340: 0.4, 360: 0.5, 380: 0.6, 
  400: 1.0, 420: 1.2, 440: 1.4, 460: 1.6, 480: 1.7, 500: 1.8,
  520: 1.8, 540: 1.8, 560: 1.7, 580: 1.7, 600: 1.6, 620: 1.6,
  640: 1.5, 660: 1.5, 680: 1.4, 700: 1.4, 750: 1.2, 800: 1.1,
  850: 1.0, 900: 0.8, 950: 0.5, 1000: 0.7, 1050: 0.6, 1100: 0.5,
  1200: 0.3, 1300: 0.2, 1400: 0.05, 1500: 0.15, 1600: 0.1, 
};
