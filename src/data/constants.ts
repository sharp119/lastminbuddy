import { Frequency, TopicGroup } from '../types';

/**
 * Demo dataset. In the MVP this is hand-curated for one subject so the app is
 * fully usable offline. Phase 3 of the roadmap replaces this with output from
 * the dynamic analysis pipeline (upload papers -> extract -> cluster -> rank).
 */
export const SUBJECT_META = {
  name: 'Engineering Physics',
  paperCount: 5,
};

export const UNIT_DESCRIPTIONS: Record<number, string> = {
  1: 'Thermodynamics: laws, processes, entropy, and heat engines.',
  2: 'Kinetic theory and the statistical behaviour of gases.',
  3: 'Oscillations and waves: damping, resonance, and superposition.',
  4: 'Modern physics: black-body radiation and the photoelectric effect.',
};

export const ANALYZED_DATA: TopicGroup[] = [
  // ---- Unit 1 ----
  {
    id: 'u1-entropy',
    title: 'Thermodynamics & Entropy',
    unit: 1,
    description:
      'Laws of thermodynamics, reversible vs irreversible processes, and entropy. The single most examined cluster.',
    frequency: Frequency.VERY_HIGH,
    count: 15,
    variants: [
      { paper: 'Jan 2024', text: 'State the second law of thermodynamics and discuss the limitations of the first law.', marks: '6 Marks' },
      { paper: 'Jan 2024', text: 'Prove that the entropy of an ideal gas remains constant in a reversible process but increases in an irreversible one.', marks: '6 Marks' },
      { paper: 'March 2023', text: 'Define entropy. Explain entropy change in reversible and irreversible processes.', marks: '10 Marks' },
      { paper: 'Previous Year', text: 'What is thermal equilibrium? Explain with an example.', marks: '3 Marks' },
    ],
  },
  {
    id: 'u1-first-law',
    title: 'First Law & Thermodynamic Processes',
    unit: 1,
    description: 'First law, internal energy, and adiabatic/isothermal/isobaric processes.',
    frequency: Frequency.HIGH,
    count: 9,
    variants: [
      { paper: 'March 2023', text: 'Explain the adiabatic process using the first law of thermodynamics.', marks: '4 Marks' },
      { paper: 'Jan 2024', text: 'State the first law and show that heat and work are path functions but their difference is a point function.', marks: '4 Marks' },
      { paper: 'Previous Year', text: 'Define thermodynamic variables and their types with examples.', marks: '5 Marks' },
    ],
  },
  {
    id: 'u1-carnot',
    title: 'Carnot Engine & Efficiency',
    unit: 1,
    description: 'Carnot cycle, efficiency, work done, and the coefficient of performance.',
    frequency: Frequency.MEDIUM,
    count: 4,
    variants: [
      { paper: 'Jan 2024', text: "Prove that the efficiency of a Carnot engine depends only on the two temperatures between which it operates.", marks: '6 Marks' },
      { paper: 'March 2023', text: 'Calculate the efficiency of a Carnot engine working between 500 K and 300 K.', marks: '3 Marks' },
    ],
  },
  // ---- Unit 2 ----
  {
    id: 'u2-kinetic',
    title: 'Kinetic Theory of Gases',
    unit: 2,
    description: 'Pressure of an ideal gas, RMS speed, and the equipartition of energy.',
    frequency: Frequency.HIGH,
    count: 8,
    variants: [
      { paper: 'Jan 2024', text: 'Derive an expression for the pressure exerted by an ideal gas on the basis of kinetic theory.', marks: '6 Marks' },
      { paper: 'March 2023', text: 'State and explain the law of equipartition of energy.', marks: '4 Marks' },
    ],
  },
  {
    id: 'u2-maxwell',
    title: 'Maxwell–Boltzmann Distribution',
    unit: 2,
    description: 'Speed distribution of gas molecules; most probable, mean, and RMS speeds.',
    frequency: Frequency.MEDIUM,
    count: 5,
    variants: [
      { paper: 'Previous Year', text: 'Sketch the Maxwell–Boltzmann speed distribution and explain how it changes with temperature.', marks: '5 Marks' },
      { paper: 'March 2023', text: 'Define most probable, average, and RMS speeds and state their ratio.', marks: '3 Marks' },
    ],
  },
  // ---- Unit 3 ----
  {
    id: 'u3-damped',
    title: 'Damped & Forced Oscillations',
    unit: 3,
    description: 'Damping regimes, resonance, quality factor, and the equation of motion.',
    frequency: Frequency.VERY_HIGH,
    count: 12,
    variants: [
      { paper: 'Jan 2024', text: 'Set up and solve the differential equation of a damped harmonic oscillator. Discuss under-, over-, and critical damping.', marks: '8 Marks' },
      { paper: 'March 2023', text: 'Explain resonance in a forced oscillator and define the quality factor.', marks: '5 Marks' },
      { paper: 'Previous Year', text: 'Define logarithmic decrement.', marks: '2 Marks' },
    ],
  },
  {
    id: 'u3-waves',
    title: 'Wave Equation & Superposition',
    unit: 3,
    description: 'One-dimensional wave equation, standing waves, and beats.',
    frequency: Frequency.MEDIUM,
    count: 6,
    variants: [
      { paper: 'March 2023', text: 'Derive the one-dimensional wave equation for a stretched string.', marks: '6 Marks' },
      { paper: 'Previous Year', text: 'Explain the formation of beats and derive the beat frequency.', marks: '4 Marks' },
    ],
  },
  // ---- Unit 4 ----
  {
    id: 'u4-blackbody',
    title: "Black-Body Radiation & Planck's Law",
    unit: 4,
    description: "Spectral distribution, Wien's law, Rayleigh–Jeans law, and Planck's hypothesis.",
    frequency: Frequency.HIGH,
    count: 7,
    variants: [
      { paper: 'Jan 2024', text: "State Planck's radiation law and show how it reduces to Wien's and Rayleigh–Jeans laws in the appropriate limits.", marks: '6 Marks' },
      { paper: 'March 2023', text: 'Explain the ultraviolet catastrophe.', marks: '3 Marks' },
    ],
  },
  {
    id: 'u4-photoelectric',
    title: 'Photoelectric Effect',
    unit: 4,
    description: "Einstein's photoelectric equation, work function, and stopping potential.",
    frequency: Frequency.MEDIUM,
    count: 5,
    variants: [
      { paper: 'Previous Year', text: "State and explain Einstein's photoelectric equation.", marks: '4 Marks' },
      { paper: 'March 2023', text: 'Define work function and threshold frequency.', marks: '2 Marks' },
    ],
  },
];

/** Topics named in the syllabus that have NOT appeared in the analyzed papers. */
export const SYLLABUS_MISSING_TOPICS: Record<number, string[]> = {
  1: ['Joule–Thomson effect and inversion temperature', 'Clausius–Clapeyron equation'],
  2: ['Mean free path and transport phenomena (viscosity, diffusion)'],
  3: ['Coupled oscillators and normal modes', 'Group velocity vs phase velocity'],
  4: ['Compton effect', 'de Broglie hypothesis and matter waves'],
};
