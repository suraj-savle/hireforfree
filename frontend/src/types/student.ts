export interface Experience {
  company: string;
  position: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
}

export interface Certification {
  certificationName: string;
  organization: string;
  mode?: string;
  description?: string;
  certificationLink?: string;
  issueDate?: string;
  expirationDate?: string | null;
}

export interface StudentProfile {
  id?: string;

  firstName?: string;
  lastName?: string;

  email?: string;

  phone?: string;
  address?: string;

  headline?: string;
  bio?: string;

  imageUrl?: string;
  resumeUrl?: string;

  linkedin?: string;
  github?: string;
  portfolioUrl?: string;

  searchStatus?: "ACTIVE" | "INACTIVE" | string;

  skills?: string[];

  experience?: Experience[];
  education?: Education[];
  certifications?: Certification[];

  createdAt?: string;
  updatedAt?: string;
}