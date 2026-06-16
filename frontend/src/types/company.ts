export interface Company {
  id: string;
  companyName: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";

  verificationDoc?: string;

  description?: string;
  industry?: string;
  companySize?: string;
  ownerName?: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  logoUrl?: string;
  rejectionReason?: string;
  createdAt?: string;
  user: {
    email: string;
  };
}

export interface CompaniesResponse {
  companies: Company[];
}
