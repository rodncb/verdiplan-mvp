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

export const inventory = [
  { id: 1, clientId: 1, areaId: 1, species: 'Ipê Amarelo', quantity: 12, status: 'bom', updatedAt: '12/11/2025', observations: 'Podas recentes' },
  { id: 2, clientId: 1, areaId: 5, species: 'Jabuticabeira', quantity: 8, status: 'regular', updatedAt: '14/11/2025' },
  { id: 3, clientId: 2, areaId: 19, species: 'Palmeira', quantity: 20, status: 'bom', updatedAt: '15/11/2025' },
  { id: 4, clientId: 2, areaId: 24, species: 'Hortaliças', quantity: 35, status: 'ruim', updatedAt: '16/11/2025', observations: 'Precisam de adubação' }
];

export const users = [
  { id: 1, name: 'Murillo', email: 'murillo@verdiplan.com.br', role: 'Admin', active: true },
  { id: 2, name: 'João', email: 'joao@verdiplan.com.br', role: 'Gestor', active: true },
  { id: 3, name: 'Maria', email: 'maria@verdiplan.com.br', role: 'Operacional', active: true },
  { id: 4, name: 'Pedro', email: 'pedro@verdiplan.com.br', role: 'Operador', active: true }
];

export const reports = [
  { id: 1, type: 'daily', period: '12/11/2025', client: 'TerrasAlpha Resende 1', createdAt: '12/11/2025', status: 'enviado' },
  { id: 2, type: 'weekly', period: '04/11/2025 - 10/11/2025', client: 'Todos', createdAt: '11/11/2025', status: 'pendente' },
  { id: 3, type: 'monthly', period: 'Novembro/2025', client: 'TerrasAlpha Resende 2', createdAt: '10/11/2025', status: 'pendente' }
];
