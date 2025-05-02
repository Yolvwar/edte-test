// src/data/testData.js

// Données de test pour les services
export const testServices = [
  { id: '1', name: 'Service RH' },
  { id: '2', name: 'Service Comptabilité' },
  { id: '3', name: 'Service Juridique' },
  { id: '4', name: 'Direction' }
];

// Données de test pour les processus
export const testProcesses = [
  {
    id: '1',
    name: 'Validation des factures',
    steps: [
      { id: '101', name: 'Vérification initiale', serviceId: '1' },
      { id: '102', name: 'Approbation comptable', serviceId: '2' },
      { id: '103', name: 'Validation finale', serviceId: '4' }
    ]
  },
  {
    id: '2',
    name: 'Recrutement',
    steps: [
      { id: '201', name: 'Demande initiale', serviceId: '1' },
      { id: '202', name: 'Analyse budgétaire', serviceId: '2' },
      { id: '203', name: 'Validation juridique', serviceId: '3' },
      { id: '204', name: 'Approbation finale', serviceId: '4' }
    ]
  },
  {
    id: '3',
    name: 'Approbation de contrat',
    steps: [
      { id: '301', name: 'Validation RH', serviceId: '1' },
      { id: '302', name: 'Analyse financière', serviceId: '2' },
      { id: '303', name: 'Validation juridique', serviceId: '3' }
    ]
  }
];

// Données de test pour les documents
export const testDocuments = [
  {
    id: '1',
    name: 'Facture Fournisseur XYZ',
    processId: '1',
    currentStepId: '101', // Étape associée au Service RH (id: '1')
    status: 'en cours',
    startDate: new Date(2025, 3, 25), // 25 avril 2025
    endDate: new Date(2025, 4, 10), // 10 mai 2025
    history: []
  },
  {
    id: '2',
    name: 'Demande de recrutement Developer',
    processId: '2',
    currentStepId: '201', // Étape associée au Service RH (id: '1')
    status: 'en cours',
    startDate: new Date(2025, 3, 20), // 20 avril 2025
    endDate: new Date(2025, 5, 15), // 15 juin 2025
    history: []
  },
  {
    id: '3',
    name: 'Contrat Client ABC',
    processId: '3',
    currentStepId: '301', // Étape associée au Service RH (id: '1')
    status: 'en cours',
    startDate: new Date(2025, 3, 28), // 28 avril 2025
    endDate: new Date(2025, 4, 28), // 28 mai 2025
    history: []
  },
  {
    id: '4',
    name: 'Facture Maintenance Annuelle',
    processId: '1',
    currentStepId: '102', // Étape associée au Service Comptabilité (id: '2')
    status: 'en cours',
    startDate: new Date(2025, 3, 15), // 15 avril 2025
    endDate: new Date(2025, 4, 5), // 5 mai 2025
    history: [
      {
        stepId: '101',
        serviceId: '1',
        validatedBy: 'Jean Dupont',
        date: new Date(2025, 3, 22),
        status: 'validé',
        comment: 'Facture vérifiée et conforme'
      }
    ]
  },
  {
    id: '5',
    name: 'Demande d\'augmentation',
    processId: '2',
    currentStepId: '203', // Étape associée au Service Juridique (id: '3')
    status: 'en cours',
    startDate: new Date(2025, 3, 10), // 10 avril 2025
    endDate: new Date(2025, 4, 30), // 30 mai 2025
    history: [
      {
        stepId: '201',
        serviceId: '1',
        validatedBy: 'Marie Martin',
        date: new Date(2025, 3, 15),
        status: 'validé',
        comment: 'Demande justifiée'
      },
      {
        stepId: '202',
        serviceId: '2',
        validatedBy: 'Pierre Durand',
        date: new Date(2025, 3, 20),
        status: 'validé',
        comment: 'Budget disponible'
      }
    ]
  }
];