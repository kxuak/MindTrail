import type { StudySpace } from '../types';

const spaces: StudySpace[] = [
  {
    id: '1',
    name: 'Biblioteca Pública do Ceará',
    type: 'library',
    address: 'Av. Presidente Castelo Branco, 255 – Moura Brasil, Fortaleza',
    hours: 'Seg–Sex: 8h–18h | Sáb: 8h–14h',
    rating: 4.5,
    lat: -3.7172,
    lng: -38.5434,
    description: 'Ampla biblioteca com acervo diversificado, salas de leitura silenciosa e wi-fi gratuito.',
  },
  {
    id: '2',
    name: 'Café Academia',
    type: 'cafe',
    address: 'R. dos Tabajaras, 540 – Meireles, Fortaleza',
    hours: 'Seg–Sex: 7h–22h | Sáb–Dom: 8h–21h',
    rating: 4.7,
    lat: -3.7243,
    lng: -38.4992,
    description: 'Café aconchegante com mesas espaçosas, tomadas em abundância e café especial.',
  },
  {
    id: '3',
    name: 'Coworking HUB Fortaleza',
    type: 'coworking',
    address: 'Av. Santos Dumont, 2130 – Aldeota, Fortaleza',
    hours: '24h (membros) | Seg–Sex: 8h–20h (avulso)',
    rating: 4.8,
    lat: -3.7389,
    lng: -38.5071,
    description: 'Espaço moderno com salas privativas, internet fibra gigabit e comunidade ativa de devs.',
  },
  {
    id: '4',
    name: 'Sala de Estudos UFC',
    type: 'study_room',
    address: 'Campus do Pici – Bloco 910, Fortaleza',
    hours: 'Seg–Sáb: 7h–22h',
    rating: 4.3,
    lat: -3.7477,
    lng: -38.5758,
    description: 'Salas climatizadas abertas à comunidade universitária com acesso à rede acadêmica.',
  },
  {
    id: '5',
    name: 'Biblioteca do SESC Iparana',
    type: 'library',
    address: 'Av. Monsenhor Tabosa, 90 – Centro, Caucaia',
    hours: 'Ter–Dom: 9h–17h',
    rating: 4.2,
    lat: -3.7325,
    lng: -38.6301,
    description: 'Biblioteca de fácil acesso com seção de tecnologia e periódicos digitais.',
  },
  {
    id: '6',
    name: 'Café do Povo Cowork',
    type: 'coworking',
    address: 'R. Pereira Valente, 820 – Meireles, Fortaleza',
    hours: 'Seg–Sex: 8h–21h | Sáb: 9h–18h',
    rating: 4.6,
    lat: -3.726,
    lng: -38.5051,
    description: 'Ambiente criativo com cadeiras ergonômicas, impressora e boa curadoria de música.',
  },
];

export const studySpaceService = {
  async getAll(): Promise<StudySpace[]> {
    return new Promise((resolve) => setTimeout(() => resolve(spaces), 300));
  },

  async getById(id: string): Promise<StudySpace | undefined> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(spaces.find((s) => s.id === id)), 100)
    );
  },
};
