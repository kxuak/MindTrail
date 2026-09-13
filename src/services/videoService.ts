import type { Video } from '../types';

export const SUBJECTS = [
  { id: 'all', label: 'Todas', emoji: '🎯', color: '#7c3aed' },
  { id: 'matematica', label: 'Matemática', emoji: '📐', color: '#f59e0b' },
  { id: 'portugues', label: 'Português', emoji: '📖', color: '#ef4444' },
  { id: 'ingles', label: 'Inglês', emoji: '🌎', color: '#06b6d4' },
  { id: 'historia', label: 'História', emoji: '🏛️', color: '#8b5cf6' },
  { id: 'geografia', label: 'Geografia', emoji: '🗺️', color: '#10b981' },
  { id: 'ciencias', label: 'Ciências', emoji: '🔬', color: '#f97316' },
  { id: 'programacao', label: 'Programação', emoji: '💻', color: '#3b82f6' },
] as const;

export type SubjectId = (typeof SUBJECTS)[number]['id'];

const videos: Video[] = [
  // Matemática
  {
    id: 'm1', videoId: 'LwCRRUa8yTU', title: 'Álgebra Linear para Iniciantes',
    description: 'Fundamentos de álgebra linear: vetores, matrizes e sistemas de equações.',
    category: 'Álgebra', subject: 'matematica', order: 1, durationMin: 45,
  },
  {
    id: 'm2', videoId: 'WUvTyaaNkzM', title: 'Cálculo — Derivadas do Zero',
    description: 'Derivadas, regras de derivação e aplicações práticas no dia a dia.',
    category: 'Cálculo', subject: 'matematica', order: 2, durationMin: 60,
  },
  // Português
  {
    id: 'p1', videoId: 'rfscVS0vtbw', title: 'Redação ENEM — Estrutura Completa',
    description: 'Como estruturar uma redação nota 1000 no ENEM: introdução, desenvolvimento e conclusão.',
    category: 'Redação', subject: 'portugues', order: 1, durationMin: 30,
  },
  {
    id: 'p2', videoId: 'W6NZfCO5SIk', title: 'Análise Sintática — Simplificada',
    description: 'Sujeito, predicado, objeto direto e indireto explicados de forma clara.',
    category: 'Gramática', subject: 'portugues', order: 2, durationMin: 25,
  },
  // Inglês
  {
    id: 'i1', videoId: 'SqcY0GlETPk', title: 'English for Beginners — Complete Course',
    description: 'Vocabulário essencial, gramática básica e pronúncia para iniciantes.',
    category: 'Básico', subject: 'ingles', order: 1, durationMin: 90,
  },
  {
    id: 'i2', videoId: 'x48WpTiYMDM', title: 'Phrasal Verbs Most Used',
    description: 'Os 50 phrasal verbs mais usados no inglês cotidiano com exemplos.',
    category: 'Vocabulário', subject: 'ingles', order: 2, durationMin: 20,
  },
  // História
  {
    id: 'h1', videoId: 'pTFZFxd5uri', title: 'Segunda Guerra Mundial — Resumo Completo',
    description: 'Causas, desenvolvimento e consequências da Segunda Guerra Mundial.',
    category: 'História Geral', subject: 'historia', order: 1, durationMin: 40,
  },
  {
    id: 'h2', videoId: 'yfoY53QXEnI', title: 'Revolução Industrial — Brasil e Mundo',
    description: 'A Revolução Industrial e seus impactos no Brasil e no mundo contemporâneo.',
    category: 'História', subject: 'historia', order: 2, durationMin: 35,
  },
  // Geografia
  {
    id: 'g1', videoId: 'Oe421EPjeBE', title: 'Geopolítica Mundial — Resumo',
    description: 'Os grandes blocos econômicos, conflitos geopolíticos e relações internacionais.',
    category: 'Geopolítica', subject: 'geografia', order: 1, durationMin: 50,
  },
  {
    id: 'g2', videoId: 'BwuLxPH8IDs', title: 'Clima e Biomas Brasileiros',
    description: 'Os 6 biomas do Brasil, características climáticas e biodiversidade.',
    category: 'Climatologia', subject: 'geografia', order: 2, durationMin: 28,
  },
  // Ciências
  {
    id: 'c1', videoId: 'rfscVS0vtbw', title: 'Física Quântica para Leigos',
    description: 'Os princípios fundamentais da física quântica explicados de forma acessível.',
    category: 'Física', subject: 'ciencias', order: 1, durationMin: 55,
  },
  {
    id: 'c2', videoId: 'W6NZfCO5SIk', title: 'Genética e DNA — Fundamentos',
    description: 'Como funciona o DNA, hereditariedade e as leis de Mendel.',
    category: 'Biologia', subject: 'ciencias', order: 2, durationMin: 38,
  },
  // Programação
  {
    id: 'pr1', videoId: 'rfscVS0vtbw', title: 'Python — Curso Completo para Iniciantes',
    description: 'Variáveis, loops, funções e estruturas de dados em Python do zero.',
    category: 'Python', subject: 'programacao', order: 1, durationMin: 270,
  },
  {
    id: 'pr2', videoId: 'W6NZfCO5SIk', title: 'JavaScript — Fundamentos ES6+',
    description: 'JavaScript moderno: arrow functions, promises, async/await e DOM.',
    category: 'JavaScript', subject: 'programacao', order: 2, durationMin: 180,
  },
];

export const videoService = {
  async getAll(subject?: SubjectId): Promise<Video[]> {
    return new Promise((resolve) => {
      const result = subject && subject !== 'all'
        ? videos.filter((v) => v.subject === subject)
        : videos;
      setTimeout(() => resolve(result), 300);
    });
  },

  async getById(id: string): Promise<Video | undefined> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(videos.find((v) => v.id === id)), 100)
    );
  },
};
