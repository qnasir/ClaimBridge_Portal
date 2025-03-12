
import { User, Claim, Document } from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'patient-1',
    name: 'John Smith',
    email: 'patient@example.com',
    role: 'patient',
  },
  {
    id: 'insurer-1',
    name: 'Sarah Johnson',
    email: 'insurer@example.com',
    role: 'insurer',
  },
];

// Mock Documents
const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Medical Receipt.pdf',
    url: 'https://source.unsplash.com/random/800x600/?document',
    type: 'application/pdf',
    uploadDate: '2023-05-15T10:30:00Z',
  },
  {
    id: 'doc-2',
    name: 'Lab Results.pdf',
    url: 'https://source.unsplash.com/random/800x600/?medical',
    type: 'application/pdf',
    uploadDate: '2023-06-20T14:15:00Z',
  },
  {
    id: 'doc-3',
    name: 'Prescription.jpg',
    url: 'https://source.unsplash.com/random/800x600/?prescription',
    type: 'image/jpeg',
    uploadDate: '2023-07-05T09:45:00Z',
  },
];

// Mock Claims
export const mockClaims: Claim[] = [
  {
    id: 'claim-1',
    patientId: 'patient-1',
    patientName: 'John Smith',
    patientEmail: 'patient@example.com',
    amount: 1250.00,
    description: 'Emergency room visit due to high fever and dehydration',
    status: 'approved',
    submissionDate: '2023-05-15T10:30:00Z',
    approvedAmount: 1200.00,
    reviewedBy: 'insurer-1',
    comments: 'Approved with minor deduction for non-covered items',
    documents: [mockDocuments[0]],
  },
  {
    id: 'claim-2',
    patientId: 'patient-1',
    patientName: 'John Smith',
    patientEmail: 'patient@example.com',
    amount: 450.00,
    description: 'Specialist consultation for chronic back pain',
    status: 'pending',
    submissionDate: '2023-06-20T14:15:00Z',
    documents: [mockDocuments[1]],
  },
  {
    id: 'claim-3',
    patientId: 'patient-1',
    patientName: 'John Smith',
    patientEmail: 'patient@example.com',
    amount: 75.00,
    description: 'Prescription medication for allergies',
    status: 'rejected',
    submissionDate: '2023-07-05T09:45:00Z',
    reviewedBy: 'insurer-1',
    comments: 'Medication not covered under current plan',
    documents: [mockDocuments[2]],
  },
  {
    id: 'claim-4',
    patientId: 'patient-1',
    patientName: 'John Smith',
    patientEmail: 'patient@example.com',
    amount: 2500.00,
    description: 'MRI scan for diagnostic purposes',
    status: 'pending',
    submissionDate: '2023-08-10T11:00:00Z',
    documents: [],
  },
];

// Local storage helpers
export const setCurrentUser = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const clearCurrentUser = () => {
  localStorage.removeItem('currentUser');
};

// Claim management helpers
export const getClaims = (): Claim[] => {
  const claims = localStorage.getItem('claims');
  return claims ? JSON.parse(claims) : mockClaims;
};

export const saveClaims = (claims: Claim[]) => {
  localStorage.setItem('claims', JSON.stringify(claims));
};

export const addClaim = (claim: Omit<Claim, 'id' | 'submissionDate'> & { documents: Document[] }): Claim => {
  const claims = getClaims();
  const newClaim: Claim = {
    ...claim,
    id: `claim-${Date.now()}`,
    submissionDate: new Date().toISOString(),
    status: 'pending',
  };
  
  const updatedClaims = [...claims, newClaim];
  saveClaims(updatedClaims);
  return newClaim;
};

export const updateClaim = (updatedClaim: Claim): Claim => {
  const claims = getClaims();
  const updatedClaims = claims.map(claim => 
    claim.id === updatedClaim.id ? updatedClaim : claim
  );
  saveClaims(updatedClaims);
  return updatedClaim;
};
