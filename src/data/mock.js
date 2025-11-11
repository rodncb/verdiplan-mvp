export const clients = [
  { id: 1, name: 'TerrasAlpha Resende 1' },
  { id: 2, name: 'TerrasAlpha Resende 2' }
];

export const areas = [
  // Resende 1 (15 áreas)
  { id: 1, clientId: 1, name: 'Clube 1' },
  { id: 2, clientId: 1, name: 'Comercial' },
  { id: 3, clientId: 1, name: 'PORTARIA/ADM' },
  { id: 4, clientId: 1, name: 'PRAÇA KIDS' },
  { id: 5, clientId: 1, name: 'BOSQUE 1' },
  { id: 6, clientId: 1, name: 'Bosque 2' },
  { id: 7, clientId: 1, name: 'Bosque 3' },
  { id: 8, clientId: 1, name: 'Bosque 4' },
  { id: 9, clientId: 1, name: 'Elevatória 1' },
  { id: 10, clientId: 1, name: 'Elevatória 2' },
  { id: 11, clientId: 1, name: 'Praça Boa Forma' },
  { id: 12, clientId: 1, name: 'Booster' },
  { id: 13, clientId: 1, name: 'Caixa de agua' },
  { id: 14, clientId: 1, name: 'Praça Diversão' },
  { id: 15, clientId: 1, name: 'Praça Bela Vista' },

  // Resende 2 (11 áreas)
  { id: 16, clientId: 2, name: 'Clube 2' },
  { id: 17, clientId: 2, name: 'Rotatória de entrada' },
  { id: 18, clientId: 2, name: 'Bosque Jabuticabas' },
  { id: 19, clientId: 2, name: 'Praça das Palmeiras' },
  { id: 20, clientId: 2, name: 'Booster' },
  { id: 21, clientId: 2, name: 'Caixa de agua' },
  { id: 22, clientId: 2, name: 'ETE' },
  { id: 23, clientId: 2, name: 'Praça das Hortaliças' },
  { id: 24, clientId: 2, name: 'Praça Street' },
  { id: 25, clientId: 2, name: 'Praça Caminhada' },
  { id: 26, clientId: 2, name: 'Mirante' }
];

export const services = [
  { id: 1, name: 'Roçada' },
  { id: 2, name: 'Poda' },
  { id: 3, name: 'Rega' },
  { id: 4, name: 'Adubação' },
  { id: 5, name: 'Limpeza' },
  { id: 6, name: 'Coroamento' },
  { id: 7, name: 'Manutenção' },
  { id: 8, name: 'Plantio' }
];

export const mockTasks = [
  {
    id: 1,
    client: 'TerrasAlpha Resende 1',
    area: 'Clube 1',
    service: 'Roçada',
    date: '10/11/2025',
    time: '14:30',
    observations: 'Área limpa conforme solicitado',
    photos: 3,
    status: 'Concluída'
  },
  {
    id: 2,
    client: 'TerrasAlpha Resende 2',
    area: 'Praça das Palmeiras',
    service: 'Poda',
    date: '10/11/2025',
    time: '16:00',
    observations: 'Poda realizada nas palmeiras maiores',
    photos: 5,
    status: 'Concluída'
  },
  {
    id: 3,
    client: 'TerrasAlpha Resende 1',
    area: 'BOSQUE 1',
    service: 'Limpeza',
    date: '11/11/2025',
    time: '09:00',
    observations: 'Limpeza geral do bosque',
    photos: 4,
    status: 'Concluída'
  }
];
