export type UserRole = 'patient' | 'insurer';

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export type Claim = {
    id:string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    amount: number;
    description: string;
    status: ClaimStatus;
    submissionDate: string;
    approvedAmount?: number;
    reviewedBy?: string;
    comments?: string;
    documents: Document[];
};

export type Document = {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadDate: string;
};