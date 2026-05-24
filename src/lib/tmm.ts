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
const EPSILON = 2.220446049250313e-16;
export function re(x: any): number {
  if (typeof x === 'number') return x;
  if (x && typeof x.re === 'number') return x.re;
  return (math.re(x) as any);
}
export function im(x: any): number {
  if (typeof x === 'number') return 0;
  if (x && typeof x.im === 'number') return x.im;
  return (math.im(x) as any);
}
export function multiply2x2(A: any[][], B: any[][]): any[][] {
  return [
    [
      math.add(math.multiply(A[0][0], B[0][0]), math.multiply(A[0][1], B[1][0])),
      math.add(math.multiply(A[0][0], B[0][1]), math.multiply(A[0][1], B[1][1]))
    ],
    [
      math.add(math.multiply(A[1][0], B[0][0]), math.multiply(A[1][1], B[1][0])),
      math.add(math.multiply(A[1][0], B[0][1]), math.multiply(A[1][1], B[1][1]))
    ]
  ];
}
export function isForwardAngle(n: any, theta: any): boolean {
  const ncostheta = math.multiply(n, math.cos(theta)) as any;
  const imagPart = im(ncostheta);
  const realPart = re(ncostheta);
  if (Math.abs(imagPart) > 100 * EPSILON) {
    return imagPart > 0;
  } else {
    return realPart > 0;
  }
}
export function snell(n1: any, n2: any, theta1: any): any {
  const sinTheta2 = math.divide(math.multiply(n1, math.sin(theta1)), n2);
  const theta2 = math.asin(sinTheta2 as any) as any;
  if (isForwardAngle(n2, theta2)) {
    return theta2;
  } else {
    return math.subtract(Math.PI, theta2);
  }
}
export function listSnell(nList: any[], theta0: any): any[] {
  const angles: any[] = [];
  const n0SinTheta0 = math.multiply(nList[0], math.sin(theta0));
  for (let i = 0; i < nList.length; i++) {
    const sinTheta = math.divide(n0SinTheta0, nList[i]);
    const theta = math.asin(sinTheta as any) as any;
    angles.push(theta);
  }
  if (!isForwardAngle(nList[0], angles[0])) {
    angles[0] = math.subtract(Math.PI, angles[0]);
  }
  if (!isForwardAngle(nList[nList.length - 1], angles[angles.length - 1])) {
    angles[angles.length - 1] = math.subtract(Math.PI, angles[angles.length - 1]);
  }
  return angles;
}
export function interfaceR(pol: Polarization, ni: any, nf: any, thi: any, thf: any): any {
  const cosThi = math.cos(thi);
  const cosThf = math.cos(thf);
  if (pol === 's') {
    const num = math.subtract(math.multiply(ni, cosThi), math.multiply(nf, cosThf));
    const den = math.add(math.multiply(ni, cosThi), math.multiply(nf, cosThf));
    return math.divide(num, den);
  } else {
    const num = math.subtract(math.multiply(nf, cosThi), math.multiply(ni, cosThf));
    const den = math.add(math.multiply(nf, cosThi), math.multiply(ni, cosThf));
    return math.divide(num, den);
  }
}
export function interfaceT(pol: Polarization, ni: any, nf: any, thi: any, thf: any): any {
  const cosThi = math.cos(thi);
  const cosThf = math.cos(thf);
  if (pol === 's') {
    const num = math.multiply(2, math.multiply(ni, cosThi));
    const den = math.add(math.multiply(ni, cosThi), math.multiply(nf, cosThf));
    return math.divide(num, den);
  } else {
    const num = math.multiply(2, math.multiply(ni, cosThi));
    const den = math.add(math.multiply(nf, cosThi), math.multiply(ni, cosThf));
    return math.divide(num, den);
  }
}
export function RfromR(r: any): number {
  const absR = math.abs(r) as number;
  return absR * absR;
}
export function TfromT(pol: Polarization, t: any, ni: any, nf: any, thi: any, thf: any): number {
  const absT2 = RfromR(t);
  const cosThi = math.cos(thi);
  const cosThf = math.cos(thf);
  if (pol === 's') {
    const num = re(math.multiply(nf, cosThf));
    const den = re(math.multiply(ni, cosThi));
    return absT2 * (num / den);
  } else {
    const num = re(math.multiply(nf, math.conj(cosThf)));
    const den = re(math.multiply(ni, math.conj(cosThi)));
    return absT2 * (num / den);
  }
}
export function powerEnteringFromR(pol: Polarization, r: any, ni: any, thi: any): number {
  const cosThi = math.cos(thi);
  const conjR = math.conj(r);
  const term1 = math.add(1, conjR);
  const term2 = math.subtract(1, r);
  if (pol === 's') {
    const num = re(math.multiply(math.multiply(ni, cosThi), math.multiply(term1, term2)));
    const den = re(math.multiply(ni, cosThi));
    return num / den;
  } else {
    const conjCosThi = math.conj(cosThi);
    const num = re(math.multiply(math.multiply(ni, conjCosThi), math.multiply(math.add(1, r), math.subtract(1, conjR))));
    const den = re(math.multiply(ni, conjCosThi));
    return num / den;
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
export function cohTmm(pol: Polarization, nList: any[], dList: number[], th0: number, lamVac: number): CohTmmResult {
  const numLayers = nList.length;
  const complexNList = nList.map(n => typeof n === 'number' ? math.complex(n, 0) : n);
  const thetaList = listSnell(complexNList, math.complex(th0, 0));
  const kzList = complexNList.map((n, i) => 
    math.multiply(math.divide(math.multiply(2 * Math.PI, n), lamVac), math.cos(thetaList[i]))
  );
  const delta = kzList.map((kz, i) => math.multiply(kz, dList[i]) as any);
  for (let i = 1; i < numLayers - 1; i++) {
    if (im(delta[i]) > 35) {
      delta[i] = math.complex(re(delta[i]), 35);
    }
  }
  const tList: any[][] = Array(numLayers).fill(null).map(() => Array(numLayers).fill(math.complex(0, 0)));
  const rList: any[][] = Array(numLayers).fill(null).map(() => Array(numLayers).fill(math.complex(0, 0)));
  for (let i = 0; i < numLayers - 1; i++) {
    tList[i][i+1] = interfaceT(pol, complexNList[i], complexNList[i+1], thetaList[i], thetaList[i+1]);
    rList[i][i+1] = interfaceR(pol, complexNList[i], complexNList[i+1], thetaList[i], thetaList[i+1]);
  }
  const MList: any[][][] = Array(numLayers);
  for (let i = 1; i < numLayers - 1; i++) {
    const expNegPhase = math.exp(math.multiply(math.complex(0, -1), delta[i]) as any);
    const expPosPhase = math.exp(math.multiply(math.complex(0, 1), delta[i]) as any);
    const P = [
      [expNegPhase, math.complex(0, 0)],
      [math.complex(0, 0), expPosPhase]
    ];
    const L = [
      [math.complex(1, 0), rList[i][i+1]],
      [rList[i][i+1], math.complex(1, 0)]
    ];
    const PdotL = multiply2x2(P, L);
    const oneOverT = math.divide(1, tList[i][i+1]);
    MList[i] = [
      [math.multiply(oneOverT, PdotL[0][0]), math.multiply(oneOverT, PdotL[0][1])],
      [math.multiply(oneOverT, PdotL[1][0]), math.multiply(oneOverT, PdotL[1][1])]
    ];
  }
  let Mtilde = [
    [math.complex(1, 0), math.complex(0, 0)],
    [math.complex(0, 0), math.complex(1, 0)]
  ];
  for (let i = 1; i < numLayers - 1; i++) {
    Mtilde = multiply2x2(Mtilde, MList[i]);
  }
  const L01 = [
    [math.complex(1, 0), rList[0][1]],
    [rList[0][1], math.complex(1, 0)]
  ];
  const oneOverT01 = math.divide(1, tList[0][1]);
  const L01scaled = [
    [math.multiply(oneOverT01, L01[0][0]), math.multiply(oneOverT01, L01[0][1])],
    [math.multiply(oneOverT01, L01[1][0]), math.multiply(oneOverT01, L01[1][1])]
  ];
  Mtilde = multiply2x2(L01scaled, Mtilde);
  const r = math.divide(Mtilde[1][0], Mtilde[0][0]);
  const t = math.divide(1, Mtilde[0][0]);
  const vwList: any[][] = Array(numLayers);
  let vw = [[t], [math.complex(0, 0)]];
  vwList[numLayers - 1] = [vw[0][0], vw[1][0]];
  for (let i = numLayers - 2; i >= 1; i--) {
    vw = [
      [math.add(math.multiply(MList[i][0][0], vw[0][0]), math.multiply(MList[i][0][1], vw[1][0])) as any],
      [math.add(math.multiply(MList[i][1][0], vw[0][0]), math.multiply(MList[i][1][1], vw[1][0])) as any]
    ];
    vwList[i] = [vw[0][0], vw[1][0]];
  }
  const R = RfromR(r);
  const T = TfromT(pol, t, complexNList[0], complexNList[numLayers - 1], thetaList[0], thetaList[numLayers - 1]);
  const powerEntering = powerEnteringFromR(pol, r, complexNList[0], thetaList[0]);
  return { r, t, R, T, powerEntering, vwList, kzList, thetaList, pol, nList: complexNList, dList, th0, lamVac };
}
export function cohTmmReverse(pol: Polarization, nList: any[], dList: number[], th0: number, lamVac: number): CohTmmResult {
  const thetaF = snell(nList[0], nList[nList.length - 1], th0);
  const reversedNList = [...nList].reverse();
  const reversedDList = [...dList].reverse();
  return cohTmm(pol, reversedNList, reversedDList, re(thetaF), lamVac);
}
export function unpolarizedRT(nList: any[], dList: number[], th0: number, lamVac: number): { R: number, T: number } {
  const sData = cohTmm('s', nList, dList, th0, lamVac);
  const pData = cohTmm('p', nList, dList, th0, lamVac);
  return {
    R: (sData.R + pData.R) / 2,
    T: (sData.T + pData.T) / 2
  };
}
export function ellips(nList: any[], dList: number[], th0: number, lamVac: number): { psi: number, delta: number } {
  const sData = cohTmm('s', nList, dList, th0, lamVac);
  const pData = cohTmm('p', nList, dList, th0, lamVac);
  const ratio = math.divide(pData.r, sData.r) as any;
  const psi = Math.atan(math.abs(ratio) as any);
  let delta = math.arg(math.multiply(-1, ratio) as any) as any;
  if (delta < 0) delta += 2 * Math.PI;
  return { psi: psi * 180 / Math.PI, delta: delta * 180 / Math.PI };
}
export function findInStructure(dList: number[], distance: number): [number, number] {
  if (distance < 0) {
    return [-1, distance];
  }
  let remainingDistance = distance;
  let layer = 0;
  while (layer < dList.length && remainingDistance >= dList[layer]) {
    remainingDistance -= dList[layer];
    layer++;
  }
  return [layer, remainingDistance];
}
export function findInStructureWithInf(dList: number[], distance: number): [number, number] {
  if (distance < 0) {
    return [0, distance];
  }
  const middleDList = dList.slice(1, -1);
  const [layer, distanceInLayer] = findInStructure(middleDList, distance);
  return [layer + 1, distanceInLayer];
}
export function layerStarts(dList: number[]): number[] {
  const starts: number[] = Array(dList.length).fill(0);
  starts[0] = -Infinity;
  starts[1] = 0;
  for (let i = 2; i < dList.length; i++) {
    starts[i] = starts[i - 1] + dList[i - 1];
  }
  return starts;
}
export interface PositionResolvedResult {
  poyn: number;
  absor: number;
  Ex: any;
  Ey: any;
  Ez: any;
}
export function positionResolved(layer: number, distance: number, cohData: CohTmmResult): PositionResolvedResult {
  let v: any, w: any;
  if (layer > 0) {
    v = cohData.vwList[layer][0];
    w = cohData.vwList[layer][1];
  } else {
    v = math.complex(1, 0);
    w = cohData.r;
  }
  const kz = cohData.kzList[layer];
  const th = cohData.thetaList[layer];
  const n = cohData.nList[layer];
  const n0 = cohData.nList[0];
  const th0 = cohData.th0;
  const pol = cohData.pol;
  const Ef = math.multiply(v, math.exp(math.multiply(math.complex(0, 1), math.multiply(kz, distance)) as any)) as any;
  const Eb = math.multiply(w, math.exp(math.multiply(math.complex(0, -1), math.multiply(kz, distance)) as any)) as any;
  let poyn = 0;
  let absor = 0;
  const cosTh = math.cos(th);
  const nCosTh = math.multiply(n, cosTh);
  const n0CosTh0 = math.multiply(n0, math.cos(th0));
  if (pol === 's') {
    const EfPlusEb = math.add(Ef, Eb);
    const EfMinusEb = math.subtract(Ef, Eb);
    const num = re(math.multiply(math.multiply(nCosTh, math.conj(EfPlusEb)), EfMinusEb));
    const den = re(n0CosTh0);
    poyn = num / den;
    const numAbs = im(math.multiply(math.multiply(nCosTh, kz), RfromR(EfPlusEb)));
    absor = numAbs / den;
  } else { 
    const EfPlusEb = math.add(Ef, Eb);
    const EfMinusEb = math.subtract(Ef, Eb);
    const nConjCosTh = math.multiply(n, math.conj(cosTh));
    const n0ConjCosTh0 = math.multiply(n0, math.conj(math.cos(th0)));
    const num = re(math.multiply(math.multiply(nConjCosTh, EfPlusEb), math.conj(EfMinusEb)));
    const den = re(n0ConjCosTh0);
    poyn = num / den;
    const term1 = math.multiply(kz, RfromR(EfMinusEb));
    const term2 = math.multiply(math.conj(kz), RfromR(EfPlusEb));
    const numAbs = im(math.multiply(nConjCosTh, math.subtract(term1, term2)));
    absor = numAbs / den;
  }
  let Ex: any = 0;
  let Ey: any = 0;
  let Ez: any = 0;
  if (pol === 's') {
    Ex = math.complex(0, 0);
    Ey = math.add(Ef, Eb);
    Ez = math.complex(0, 0);
  } else {
    Ex = math.multiply(math.subtract(Ef, Eb), cosTh);
    Ey = math.complex(0, 0);
    Ez = math.multiply(math.add(math.multiply(-1, Ef), math.multiply(-1, Eb)), math.sin(th));
  }
  return { poyn, absor, Ex, Ey, Ez };
}
export function absorpInEachLayer(cohData: CohTmmResult): number[] {
  const numLayers = cohData.dList.length;
  const powerEnteringEachLayer = Array(numLayers).fill(0);
  powerEnteringEachLayer[0] = 1;
  powerEnteringEachLayer[1] = cohData.powerEntering;
  powerEnteringEachLayer[numLayers - 1] = cohData.T;
  for (let i = 2; i < numLayers - 1; i++) {
    powerEnteringEachLayer[i] = positionResolved(i, 0, cohData).poyn;
  }
  const finalAnswer = Array(numLayers).fill(0);
  for (let i = 0; i < numLayers - 1; i++) {
    finalAnswer[i] = powerEnteringEachLayer[i] - powerEnteringEachLayer[i + 1];
  }
  finalAnswer[numLayers - 1] = powerEnteringEachLayer[numLayers - 1];
  return finalAnswer;
}
export class AbsorptionAnalyticFn {
  A1: number = 0;
  A2: number = 0;
  A3: any = math.complex(0, 0);
  a1: number = 0;
  a3: number = 0;
  d: number = 0;
  fillIn(cohData: CohTmmResult, layer: number): AbsorptionAnalyticFn {
    const pol = cohData.pol;
    const v = cohData.vwList[layer][0];
    const w = cohData.vwList[layer][1];
    const kz = cohData.kzList[layer];
    const n = cohData.nList[layer];
    const n0 = cohData.nList[0];
    const th0 = cohData.th0;
    const th = cohData.thetaList[layer];
    this.d = cohData.dList[layer];
    this.a1 = 2 * im(kz);
    this.a3 = 2 * re(kz);
    const cosTh = math.cos(th);
    const n0CosTh0 = math.multiply(n0, math.cos(th0));
    if (pol === 's') {
      const temp = im(math.multiply(math.multiply(n, cosTh), kz)) / re(n0CosTh0);
      this.A1 = temp * RfromR(w);
      this.A2 = temp * RfromR(v);
      this.A3 = math.multiply(temp, math.multiply(v, math.conj(w)));
    } else { 
      const nCosConjTh = math.multiply(n, math.cos(math.conj(th)));
      const n0ConjCosTh0 = math.multiply(n0, math.conj(math.cos(th0)));
      const temp = (2 * im(kz) * re(nCosConjTh)) / re(n0ConjCosTh0);
      this.A1 = temp * RfromR(w);
      this.A2 = temp * RfromR(v);
      const a3Factor = (-2 * re(kz) * im(nCosConjTh)) / re(n0ConjCosTh0);
      this.A3 = math.multiply(math.multiply(v, math.conj(w)), a3Factor);
    }
    return this;
  }
  run(z: number): number {
    const term1 = this.A1 * Math.exp(this.a1 * z);
    const term2 = this.A2 * Math.exp(-this.a1 * z);
    const complexTerm = math.multiply(this.A3, math.exp(math.complex(0, this.a3 * z))) as any;
    const conjComplexTerm = math.conj(complexTerm) as any;
    return term1 + term2 + re(complexTerm) + re(conjComplexTerm);
  }
  flip(): AbsorptionAnalyticFn {
    const newA1 = this.A2 * Math.exp(-this.a1 * this.d);
    const newA2 = this.A1 * Math.exp(this.a1 * this.d);
    this.A1 = newA1;
    this.A2 = newA2;
    this.A3 = math.conj(math.multiply(this.A3, math.exp(math.complex(0, this.a3 * this.d))));
    return this;
  }
  scale(factor: number): AbsorptionAnalyticFn {
    this.A1 *= factor;
    this.A2 *= factor;
    this.A3 = math.multiply(this.A3, factor);
    return this;
  }
  add(b: AbsorptionAnalyticFn): AbsorptionAnalyticFn {
    if (Math.abs(this.a1 - b.a1) > 1e-9 || Math.abs(this.a3 - b.a3) > 1e-9) {
      throw new Error('Incompatible absorption analytical functions!');
    }
    this.A1 += b.A1;
    this.A2 += b.A2;
    this.A3 = math.add(this.A3, b.A3);
    return this;
  }
}
export interface GroupLayersResult {
  stackDList: number[][];
  stackNList: any[][];
  allFromInc: number[];
  incFromAll: number[];
  allFromStack: number[][];
  stackFromAll: (number[] | null)[];
  incFromStack: number[];
  stackFromInc: (number | null)[];
  numStacks: number;
  numIncLayers: number;
  numLayers: number;
}
export function incGroupLayers(nList: any[], dList: number[], cList: ('c' | 'i')[]): GroupLayersResult {
  if (dList[0] !== Infinity || dList[dList.length - 1] !== Infinity) {
    throw new Error('dList must start and end with Infinity!');
  }
  if (cList[0] !== 'i' || cList[cList.length - 1] !== 'i') {
    throw new Error('cList should start and end with "i"');
  }
  let incIndex = 0;
  let stackIndex = 0;
  const stackDList: number[][] = [];
  const stackNList: any[][] = [];
  const allFromInc: number[] = [];
  const incFromAll: number[] = [];
  const allFromStack: number[][] = [];
  const stackFromAll: (number[] | null)[] = [];
  const incFromStack: number[] = [];
  const stackFromInc: (number | null)[] = [];
  let stackInProgress = false;
  let ongoingStackDList: number[] = [];
  let ongoingStackNList: any[] = [];
  let withinStackIndex = 0;
  for (let alllayerIndex = 0; alllayerIndex < nList.length; alllayerIndex++) {
    if (cList[alllayerIndex] === 'c') {
      incFromAll.push(NaN);
      if (!stackInProgress) {
        stackInProgress = true;
        ongoingStackDList = [Infinity, dList[alllayerIndex]];
        ongoingStackNList = [nList[alllayerIndex - 1], nList[alllayerIndex]];
        stackFromAll.push([stackIndex, 1]);
        allFromStack.push([alllayerIndex - 1, alllayerIndex]);
        incFromStack.push(incIndex - 1);
        withinStackIndex = 1;
      } else {
        ongoingStackDList.push(dList[alllayerIndex]);
        ongoingStackNList.push(nList[alllayerIndex]);
        withinStackIndex++;
        stackFromAll.push([stackIndex, withinStackIndex]);
        allFromStack[allFromStack.length - 1].push(alllayerIndex);
      }
    } else if (cList[alllayerIndex] === 'i') {
      stackFromAll.push(null);
      incFromAll.push(incIndex);
      allFromInc.push(alllayerIndex);
      if (!stackInProgress) {
        stackFromInc.push(null);
      } else {
        stackInProgress = false;
        stackFromInc.push(stackIndex);
        ongoingStackDList.push(Infinity);
        stackDList.push(ongoingStackDList);
        ongoingStackNList.push(nList[alllayerIndex]);
        stackNList.push(ongoingStackNList);
        allFromStack[allFromStack.length - 1].push(alllayerIndex);
        stackIndex++;
      }
      incIndex++;
    }
  }
  return {
    stackDList,
    stackNList,
    allFromInc,
    incFromAll,
    allFromStack,
    stackFromAll,
    incFromStack,
    stackFromInc,
    numStacks: allFromStack.length,
    numIncLayers: allFromInc.length,
    numLayers: nList.length
  };
}
export interface IncTmmResult {
  R: number;
  T: number;
  A: number;
  VWList: number[][];
  cohTmmDataList: CohTmmResult[];
  cohTmmBdataList: CohTmmResult[];
  stackFBList: number[][];
  powerEnteringList: number[];
  stackDList: number[][];
  stackNList: any[][];
  allFromInc: number[];
  incFromAll: number[];
  allFromStack: number[][];
  stackFromAll: (number[] | null)[];
  incFromStack: number[];
  stackFromInc: (number | null)[];
  numStacks: number;
  numIncLayers: number;
  numLayers: number;
}
export function incTmm(pol: Polarization, nList: any[], dList: number[], cList: ('c' | 'i')[], th0: number, lamVac: number): IncTmmResult {
  const groupLayersData = incGroupLayers(nList, dList, cList);
  const numIncLayers = groupLayersData.numIncLayers;
  const numStacks = groupLayersData.numStacks;
  const stackNList = groupLayersData.stackNList;
  const stackDList = groupLayersData.stackDList;
  const allFromStack = groupLayersData.allFromStack;
  const allFromInc = groupLayersData.allFromInc;
  const stackFromInc = groupLayersData.stackFromInc;
  const incFromStack = groupLayersData.incFromStack;
  const complexNList = nList.map(n => typeof n === 'number' ? math.complex(n, 0) : n);
  const thetaList = listSnell(complexNList, math.complex(th0, 0));
  const cohTmmDataList: CohTmmResult[] = [];
  const cohTmmBdataList: CohTmmResult[] = [];
  for (let i = 0; i < numStacks; i++) {
    const incAngle = thetaList[allFromStack[i][0]];
    cohTmmDataList.push(cohTmm(pol, stackNList[i], stackDList[i], re(incAngle), lamVac));
    cohTmmBdataList.push(cohTmmReverse(pol, stackNList[i], stackDList[i], re(incAngle), lamVac));
  }
  const PList = Array(numIncLayers).fill(0);
  for (let incIndex = 1; incIndex < numIncLayers - 1; incIndex++) {
    const i = allFromInc[incIndex];
    const nc = math.multiply(complexNList[i], math.cos(thetaList[i]));
    PList[incIndex] = Math.exp(-4 * Math.PI * dList[i] * im(nc) / lamVac);
    if (PList[incIndex] < 1e-30) {
      PList[incIndex] = 1e-30;
    }
  }
  const TList = Array(numIncLayers).fill(null).map(() => Array(numIncLayers).fill(0));
  const RList = Array(numIncLayers).fill(null).map(() => Array(numIncLayers).fill(0));
  for (let incIndex = 0; incIndex < numIncLayers - 1; incIndex++) {
    const alllayerIndex = allFromInc[incIndex];
    const nextstackIndex = stackFromInc[incIndex + 1];
    if (nextstackIndex === null || nextstackIndex === undefined) { 
      RList[incIndex][incIndex + 1] = RfromR(interfaceR(pol, complexNList[alllayerIndex], complexNList[alllayerIndex + 1], thetaList[alllayerIndex], thetaList[alllayerIndex + 1]));
      TList[incIndex][incIndex + 1] = TfromT(pol, interfaceT(pol, complexNList[alllayerIndex], complexNList[alllayerIndex + 1], thetaList[alllayerIndex], thetaList[alllayerIndex + 1]), complexNList[alllayerIndex], complexNList[alllayerIndex + 1], thetaList[alllayerIndex], thetaList[alllayerIndex + 1]);
      RList[incIndex + 1][incIndex] = RfromR(interfaceR(pol, complexNList[alllayerIndex + 1], complexNList[alllayerIndex], thetaList[alllayerIndex + 1], thetaList[alllayerIndex]));
      TList[incIndex + 1][incIndex] = TfromT(pol, interfaceT(pol, complexNList[alllayerIndex + 1], complexNList[alllayerIndex], thetaList[alllayerIndex + 1], thetaList[alllayerIndex]), complexNList[alllayerIndex + 1], complexNList[alllayerIndex], thetaList[alllayerIndex + 1], thetaList[alllayerIndex]);
    } else { 
      RList[incIndex][incIndex + 1] = cohTmmDataList[nextstackIndex].R;
      TList[incIndex][incIndex + 1] = cohTmmDataList[nextstackIndex].T;
      RList[incIndex + 1][incIndex] = cohTmmBdataList[nextstackIndex].R;
      TList[incIndex + 1][incIndex] = cohTmmBdataList[nextstackIndex].T;
    }
  }
  const LList: any[] = [NaN];
  let Ltilde = [
    [1 / TList[0][1], -RList[1][0] / TList[0][1]],
    [RList[0][1] / TList[0][1], (TList[1][0] * TList[0][1] - RList[1][0] * RList[0][1]) / TList[0][1]]
  ];
  for (let i = 1; i < numIncLayers - 1; i++) {
    const P = PList[i];
    const L = [
      [(1 / P) * (1 / TList[i][i + 1]), (1 / P) * (-RList[i + 1][i] / TList[i][i + 1])],
      [P * (RList[i][i + 1] / TList[i][i + 1]), P * ((TList[i + 1][i] * TList[i][i + 1] - RList[i + 1][i] * RList[i][i + 1]) / TList[i][i + 1])]
    ];
    LList.push(L);
    Ltilde = multiply2x2(Ltilde, L);
  }
  const T = 1 / Ltilde[0][0];
  const R = Ltilde[1][0] / Ltilde[0][0];
  const VWList = Array(numIncLayers).fill(null).map(() => [0, 0]);
  VWList[0] = [NaN, NaN];
  let VW = [[T], [0]];
  VWList[numIncLayers - 1] = [VW[0][0], VW[1][0]];
  for (let i = numIncLayers - 2; i >= 1; i--) {
    VW = [
      [LList[i][0][0] * VW[0][0] + LList[i][0][1] * VW[1][0]],
      [LList[i][1][0] * VW[0][0] + LList[i][1][1] * VW[1][0]]
    ];
    VWList[i] = [VW[0][0], VW[1][0]];
  }
  const stackFBList: number[][] = [];
  for (let stackIndex = 0; stackIndex < incFromStack.length; stackIndex++) {
    const prevIncIndex = incFromStack[stackIndex];
    let F = 1;
    if (prevIncIndex > 0) {
      F = VWList[prevIncIndex][0] * PList[prevIncIndex];
    }
    const B = VWList[prevIncIndex + 1][1];
    stackFBList.push([F, B]);
  }
  const powerEnteringList = [1];
  for (let i = 1; i < numIncLayers; i++) {
    const prevStackIndex = stackFromInc[i];
    if (prevStackIndex === null || prevStackIndex === undefined) {
      if (i === 1) {
        powerEnteringList.push(TList[0][1] - VWList[1][1] * TList[1][0]);
      } else {
        powerEnteringList.push(VWList[i - 1][0] * PList[i - 1] * TList[i - 1][i] - VWList[i][1] * TList[i][i - 1]);
      }
    } else {
      powerEnteringList.push(
        stackFBList[prevStackIndex][0] * cohTmmDataList[prevStackIndex].T -
        stackFBList[prevStackIndex][1] * cohTmmBdataList[prevStackIndex].powerEntering
      );
    }
  }
  return {
    R,
    T,
    A: 1 - R - T,
    VWList,
    cohTmmDataList,
    cohTmmBdataList,
    stackFBList,
    powerEnteringList,
    ...groupLayersData
  };
}
export function incAbsorpInEachLayer(incData: IncTmmResult): number[] {
  const stackFromInc = incData.stackFromInc;
  const powerEnteringList = incData.powerEnteringList;
  const stackFBList = incData.stackFBList;
  const absorpList: number[] = [];
  for (let i = 0; i < powerEnteringList.length - 1; i++) {
    const nextStackIdx = stackFromInc[i + 1];
    if (nextStackIdx === null || nextStackIdx === undefined || isNaN(nextStackIdx)) {
      absorpList.push(powerEnteringList[i] - powerEnteringList[i + 1]);
    } else {
      const j = nextStackIdx;
      const cohData = incData.cohTmmDataList[j];
      const cohBdata = incData.cohTmmBdataList[j];
      const powerExiting = stackFBList[j][0] * cohData.powerEntering - stackFBList[j][1] * cohBdata.T;
      absorpList.push(powerEnteringList[i] - powerExiting);
      const fAbs = absorpInEachLayer(cohData).slice(1, -1);
      const bAbs = absorpInEachLayer(cohBdata).slice(1, -1).reverse();
      const stackAbs = fAbs.map((val, idx) => stackFBList[j][0] * val + stackFBList[j][1] * bAbs[idx]);
      absorpList.push(...stackAbs);
    }
  }
  absorpList.push(incData.T);
  return absorpList;
}
export function incFindAbsorpAnalyticFn(layer: number, incData: IncTmmResult): AbsorptionAnalyticFn {
  const j = incData.stackFromAll[layer];
  if (j === null || j === undefined) {
    throw new Error('layer must be coherent for this function!');
  }
  const [stackindex, withinstackindex] = j;
  const forwardfunc = new AbsorptionAnalyticFn();
  forwardfunc.fillIn(incData.cohTmmDataList[stackindex], withinstackindex);
  forwardfunc.scale(incData.stackFBList[stackindex][0]);
  const backfunc = new AbsorptionAnalyticFn();
  const stackLen = incData.cohTmmDataList[stackindex].nList.length;
  const revIndex = stackLen - 1 - withinstackindex;
  backfunc.fillIn(incData.cohTmmBdataList[stackindex], revIndex);
  backfunc.scale(incData.stackFBList[stackindex][1]);
  backfunc.flip();
  return forwardfunc.add(backfunc);
}
export const MATERIALS_DISPERSION: Record<string, { wavelength: number[], n: number[], k: number[] }> = {
  'Silicon (Si)': {
    wavelength: [300, 400, 500, 600, 700, 800, 900, 1000],
    n: [5.00, 5.57, 4.30, 3.95, 3.78, 3.69, 3.63, 3.59],
    k: [4.00, 0.387, 0.073, 0.025, 0.012, 0.006, 0.002, 0.0001]
  },
  'Silica (SiO2)': {
    wavelength: [300, 500, 700, 1000],
    n: [1.49, 1.46, 1.45, 1.45],
    k: [0, 0, 0, 0]
  },
  'Titania (TiO2)': {
    wavelength: [300, 400, 600, 800, 1000],
    n: [2.85, 2.65, 2.35, 2.25, 2.20],
    k: [0.10, 0.01, 0, 0, 0]
  },
  'Magnesium Fluoride (MgF2)': {
    wavelength: [300, 600, 1000],
    n: [1.39, 1.38, 1.37],
    k: [0, 0, 0]
  },
  'Gold (Au)': {
    wavelength: [300, 400, 500, 600, 700, 800, 1000],
    n: [1.50, 1.47, 0.84, 0.20, 0.13, 0.15, 0.22],
    k: [1.88, 1.95, 1.84, 3.20, 3.80, 4.80, 6.50]
  },
  'Silver (Ag)': {
    wavelength: [300, 400, 600, 800, 1000],
    n: [1.35, 0.05, 0.06, 0.09, 0.14],
    k: [0.96, 2.00, 4.00, 5.30, 6.90]
  },
  'Aluminum (Al)': {
    wavelength: [300, 450, 600, 800, 1000],
    n: [0.28, 0.62, 1.20, 2.00, 1.30],
    k: [3.40, 5.40, 7.00, 8.30, 9.60]
  },
  'Glass (BK7)': {
    wavelength: [300, 600, 1000],
    n: [1.53, 1.51, 1.50],
    k: [0, 0, 0]
  },
  'ITO': {
    wavelength: [300, 500, 800, 1000],
    n: [2.10, 1.90, 1.70, 1.50],
    k: [0.10, 0.01, 0.05, 0.15]
  }
};
export class TMMSimulator {
  static getInterpolatedNK(wavelength: number, layer: Layer): { n: number, k: number } {
    const disp = MATERIALS_DISPERSION[layer.name];
    if (!disp) {
      if (layer.spectralData && layer.spectralData.length > 0) {
        const data = [...layer.spectralData].sort((a, b) => a.wavelength - b.wavelength);
        let i = 0;
        while (i < data.length && data[i].wavelength < wavelength) i++;
        if (i === 0) return { n: data[0].n, k: data[0].k };
        if (i === data.length) return { n: data[data.length - 1].n, k: data[data.length - 1].k };
        const p1 = data[i - 1]; const p2 = data[i];
        const t = (wavelength - p1.wavelength) / (p2.wavelength - p1.wavelength);
        return { n: p1.n + t * (p2.n - p1.n), k: p1.k + t * (p2.k - p1.k) };
      }
      return { n: layer.n, k: layer.k };
    }
    const wl = disp.wavelength;
    let i = 0;
    while (i < wl.length && wl[i] < wavelength) i++;
    if (i === 0) return { n: disp.n[0], k: disp.k[0] };
    if (i === wl.length) return { n: disp.n[wl.length - 1], k: disp.k[wl.length - 1] };
    const t = (wavelength - wl[i - 1]) / (wl[i] - wl[i - 1]);
    const n = disp.n[i - 1] + t * (disp.n[i] - disp.n[i - 1]);
    const k = disp.k[i - 1] + t * (disp.k[i] - disp.k[i - 1]);
    return { n, k };
  }
  static calculate(wavelength: number, angleDeg: number, polarization: Polarization | 'unpolarized', layers: Layer[], nStart: number = 1.0, nEnd: number = 1.0): SimulationResult {
    const nList = [nStart, ...layers.map(l => { const { n, k } = this.getInterpolatedNK(wavelength, l); return math.complex(n, k); }), nEnd];
    const dList = [Infinity, ...layers.map(l => l.thickness), Infinity];
    const cList: ('c' | 'i')[] = ['i', ...layers.map(l => l.isThick || l.forceIncoherent ? 'i' as const : 'c' as const), 'i'];
    const angleRad = (angleDeg * Math.PI) / 180;
    if (!cList.slice(1, -1).includes('i')) {
      if (polarization === 'unpolarized') {
        const resS = cohTmm('s', nList, dList, angleRad, wavelength);
        const resP = cohTmm('p', nList, dList, angleRad, wavelength);
        const R = (resS.R + resP.R) / 2;
        const T = (resS.T + resP.T) / 2;
        return { wavelength, R, T, A: 1 - R - T };
      } else {
        const res = cohTmm(polarization, nList, dList, angleRad, wavelength);
        return { wavelength, R: res.R, T: res.T, A: 1 - res.R - res.T };
      }
    }
    if (polarization === 'unpolarized') {
      const resS = incTmm('s', nList, dList, cList, angleRad, wavelength);
      const resP = incTmm('p', nList, dList, cList, angleRad, wavelength);
      const R = (resS.R + resP.R) / 2;
      const T = (resS.T + resP.T) / 2;
      return { wavelength, R, T, A: 1 - R - T };
    }
    const res = incTmm(polarization, nList, dList, cList, angleRad, wavelength);
    return { wavelength, R: res.R, T: res.T, A: res.A };
  }
  static calculateWavenumber(wavenumber: number, angleDeg: number, polarization: Polarization | 'unpolarized', layers: Layer[], nStart: number = 1.0, nEnd: number = 1.0): SimulationResult {
    const wavelength = 1e7 / wavenumber;
    return this.calculate(wavelength, angleDeg, polarization, layers, nStart, nEnd);
  }
  static calculateEllipsometry(wavelength: number, angleDeg: number, layers: Layer[], nStart: number = 1.0, nEnd: number = 1.0): { psi: number, delta: number } {
    const nList = [nStart, ...layers.map(l => { const { n, k } = this.getInterpolatedNK(wavelength, l); return math.complex(n, k); }), nEnd];
    const dList = [Infinity, ...layers.map(l => l.thickness), Infinity];
    const angleRad = (angleDeg * Math.PI) / 180;
    return ellips(nList, dList, angleRad, wavelength);
  }
  static calculateAbsorptionProfile(wavelength: number, angleDeg: number, polarization: Polarization, layers: Layer[], nStart: number = 1.0, nEnd: number = 1.0, resolution: number = 100): AbsorptionProfilePoint[] {
    const nList = [nStart, ...layers.map(l => { const { n, k } = this.getInterpolatedNK(wavelength, l); return math.complex(n, k); }), nEnd];
    const dList = [Infinity, ...layers.map(l => l.thickness), Infinity];
    const cList: ('c' | 'i')[] = ['i', ...layers.map(l => l.isThick || l.forceIncoherent ? 'i' as const : 'c' as const), 'i'];
    const angleRad = (angleDeg * Math.PI) / 180;
    const profile: AbsorptionProfilePoint[] = [];
    let currentZ = 0;
    const totalActiveThickness = layers.reduce((acc, l) => acc + l.thickness, 0) || 1;
    if (!cList.slice(1, -1).includes('i')) {
      const cohData = cohTmm(polarization, nList, dList, angleRad, wavelength);
      for (let i = 1; i < nList.length - 1; i++) {
        const layer = layers[i - 1];
        const layerThickness = layer.thickness;
        const steps = Math.max(10, Math.round((layerThickness / totalActiveThickness) * resolution));
        const absorpFn = new AbsorptionAnalyticFn();
        absorpFn.fillIn(cohData, i);
        const nc = math.multiply(cohData.nList[i], math.cos(cohData.thetaList[i]));
        const alpha = (4 * Math.PI * im(nc)) / wavelength;
        for (let s = 0; s <= steps; s++) {
          const zInLayer = (s / steps) * layerThickness;
          const absRate = absorpFn.run(zInLayer);
          const intensity = alpha > 0 ? absRate / alpha : RfromR(cohData.vwList[i][0]);
          profile.push({
            z: currentZ + zInLayer,
            absorption: absRate,
            fieldIntensity: intensity,
            layerName: layer.name
          });
        }
        currentZ += layerThickness;
      }
      return profile;
    }
    const incData = incTmm(polarization, nList, dList, cList, angleRad, wavelength);
    const complexNList = nList.map(n => typeof n === 'number' ? math.complex(n, 0) : n);
    const thetaList = listSnell(complexNList, math.complex(angleRad, 0));
    for (let i = 1; i < nList.length - 1; i++) {
      const layer = layers[i - 1];
      const layerThickness = layer.thickness;
      const steps = Math.max(10, Math.round((layerThickness / totalActiveThickness) * resolution));
      const ncVal = math.multiply(complexNList[i], math.cos(thetaList[i]));
      const alpha = (4 * Math.PI * im(ncVal)) / wavelength;
      if (cList[i] === 'c') {
        const absorpFn = incFindAbsorpAnalyticFn(i, incData);
        for (let s = 0; s <= steps; s++) {
          const zInLayer = (s / steps) * layerThickness;
          const absRate = absorpFn.run(zInLayer);
          const intensity = alpha > 0 ? absRate / alpha : 1.0;
          profile.push({
            z: currentZ + zInLayer,
            absorption: absRate,
            fieldIntensity: intensity,
            layerName: layer.name
          });
        }
      } else {
        const incIndex = incData.incFromAll[i];
        const V = incData.VWList[incIndex][0];
        const W = incData.VWList[incIndex][1];
        for (let s = 0; s <= steps; s++) {
          const zInLayer = (s / steps) * layerThickness;
          const decayV = V * Math.exp(-alpha * zInLayer);
          const decayW = W * Math.exp(-alpha * (layerThickness - zInLayer));
          const absRate = alpha * (decayV + decayW);
          const intensity = decayV + decayW;
          profile.push({
            z: currentZ + zInLayer,
            absorption: absRate,
            fieldIntensity: intensity,
            layerName: layer.name
          });
        }
      }
      currentZ += layerThickness;
    }
    return profile;
  }
  static calculateGenerationProfile(angleDeg: number, polarization: Polarization | 'unpolarized', layers: Layer[], nStart: number = 1.0, nEnd: number = 1.0): AbsorptionProfilePoint[] {
    const wavelengths = Object.keys(AM15G_SPECTRUM).map(Number).sort((a, b) => a - b);
    let totalGeneration: AbsorptionProfilePoint[] = [];
    const h = 6.62607015e-34;
    const c = 299792458;
    wavelengths.forEach((wl, idx) => {
      const irradiance = AM15G_SPECTRUM[wl];
      const photonFlux = (irradiance * (wl * 1e-9)) / (h * c);
      const profile = this.calculateAbsorptionProfile(wl, angleDeg, polarization === 'unpolarized' ? 's' : polarization, layers, nStart, nEnd);
      if (idx === 0) {
        totalGeneration = profile.map(p => ({
          ...p,
          absorption: p.absorption * photonFlux * 1e3
        }));
      } else {
        const step = wl - wavelengths[idx - 1];
        profile.forEach((p, i) => {
          if (totalGeneration[i]) {
            totalGeneration[i].absorption += p.absorption * photonFlux * step * 1e3;
          }
        });
      }
    });
    return totalGeneration;
  }
}
export class ColorUtils {
  private static xFit(w: number) { 
    return 1.056 * Math.exp(-0.5 * Math.pow((w - 599.8) / 37.9, 2)) + 
           0.362 * Math.exp(-0.5 * Math.pow((w - 442.0) / 16.0, 2)) - 
           0.065 * Math.exp(-0.5 * Math.pow((w - 501.1) / 20.4, 2)); 
  }
  private static yFit(w: number) { 
    return 0.821 * Math.exp(-0.5 * Math.pow((w - 568.8) / 46.9, 2)) + 
           0.286 * Math.exp(-0.5 * Math.pow((w - 530.9) / 16.3, 2)); 
  }
  private static zFit(w: number) { 
    return 1.217 * Math.exp(-0.5 * Math.pow((w - 437.0) / 11.8, 2)) + 
           0.681 * Math.exp(-0.5 * Math.pow((w - 459.0) / 26.0, 2)); 
  }
  static spectrumToRGB(results: SimulationResult[]): string {
    let X = 0, Y = 0, Z = 0; 
    let norm = 0;
    results.forEach(r => { 
      if (r.wavelength >= 380 && r.wavelength <= 780) {
        const x = this.xFit(r.wavelength); 
        const y = this.yFit(r.wavelength); 
        const z = this.zFit(r.wavelength);
        const d65 = AM15G_SPECTRUM[Math.round(r.wavelength)] || 1.0;
        X += r.R * x * d65; 
        Y += r.R * y * d65; 
        Z += r.R * z * d65; 
        norm += y * d65;
      }
    });
    if (norm === 0) return '#000000';
    X /= norm; Y /= norm; Z /= norm;
    let r = X * 3.2406 + Y * -1.5372 + Z * -0.4986; 
    let g = X * -0.9689 + Y * 1.8758 + Z * 0.0415; 
    let b = X * 0.0557 + Y * -0.2040 + Z * 1.0570;
    const gamma = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    r = Math.max(0, Math.min(1, gamma(r))); 
    g = Math.max(0, Math.min(1, gamma(g))); 
    b = Math.max(0, Math.min(1, gamma(b)));
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  }
}
export const MATERIALS: Record<string, { n: number, k: number }> = {
  'Custom': { n: 1.5, k: 0 }, 
  'Air': { n: 1.0, k: 0 }, 
  'Glass (BK7)': { n: 1.51, k: 0 }, 
  'Silicon (Si)': { n: 3.42, k: 0.01 },
  'Silica (SiO2)': { n: 1.45, k: 0 }, 
  'Titania (TiO2)': { n: 2.4, k: 0 }, 
  'Magnesium Fluoride (MgF2)': { n: 1.38, k: 0 },
  'Gold (Au)': { n: 0.2, k: 3.5 }, 
  'Silver (Ag)': { n: 0.05, k: 4.0 }, 
  'Aluminum (Al)': { n: 1.2, k: 7.0 }, 
  'ITO': { n: 1.9, k: 0.01 },
};
export const AM15G_SPECTRUM: Record<number, number> = {
  280: 0.0, 300: 0.0005, 320: 0.2, 340: 0.4, 360: 0.5, 380: 0.6, 
  400: 1.0, 420: 1.2, 440: 1.4, 460: 1.6, 480: 1.7, 500: 1.8,
  520: 1.8, 540: 1.8, 560: 1.7, 580: 1.7, 600: 1.6, 620: 1.6,
  640: 1.5, 660: 1.5, 680: 1.4, 700: 1.4, 750: 1.2, 800: 1.1,
  850: 1.0, 900: 0.8, 950: 0.5, 1000: 0.7, 1050: 0.6, 1100: 0.5,
  1200: 0.3, 1300: 0.2, 1400: 0.05, 1500: 0.15, 1600: 0.1, 
};
