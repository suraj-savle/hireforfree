export interface JobCompanyProfile {
  companyName?: string;
  logo?: string;
}

export interface JobCreatedBy {
  companyProfile?: JobCompanyProfile | null;
}

export interface Application {
  id: string;
  status: string;
  createdAt: string;
  updatedAt?: string;

  student: {
    id: string;
    email: string;
    studentProfile?: {
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
      headline?: string;
      resumeUrl?: string;
      skills?: string[];
      phone?: string;
      address?: string;
      bio?: string;
      linkedin?: string;
      github?: string;
      portfolioUrl?: string;
      experience?: Array<{
        company: string;
        position: string;
        description?: string;
        startDate: string;
        endDate?: string;
      }>;
      education?: Array<{
        institution: string;
        degree: string;
        fieldOfStudy: string;
        startYear: number;
        endYear?: number;
      }>;
      certifications?: Array<{
        certificationName: string;
        organization: string;
        mode?: string;
        description?: string;
        certificationLink?: string;
        issueDate?: string;
        expirationDate?: string | null;
      }>;
    };
  };

  job: {
    id: string;
    title: string;
    location?: string;
    jobType?: string;

    // 🔥 FIX: make optional consistent everywhere
    workMode?: string;

    salaryMin?: number;
    salaryMax?: number;
    description?: string;

    // 🔥 optional backend join (this is what you were missing)
    createdBy?: {
      companyProfile?: {
        companyName?: string;
        logo?: string;
      };
    };
  };
}

export interface Job {
  id: string;
  title: string;
  location?: string;
  jobType?: string;
  workMode?: string;

  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;

  experienceLevel?: string;
  skills?: string[];

  createdBy?: {
    id: string;
    companyProfile?: {
      companyName?: string;
      logoUrl?: string;
    };
  };
}

export interface ApplicationsResponse {
  applications: Application[];
}

export interface StudentApplicationsResponse {
  applications: Application[];
}