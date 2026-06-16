export interface CompanyProfile {
  companyName: string;
  logoUrl?: string;
}

export interface JobCreator {
  companyProfile?: CompanyProfile;
}

export interface Job {
  id: string;

  title: string;
  description: string;

  category: string;
  location: string;

  jobType: string;
  workMode: string;

  vacancies: number;

  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;

  experienceLevel?: string;
  experienceYears?: number;

  applicationDeadline?: string | null;

  skills?: string[];
  requirements?: string[];
  benefits?: string[];

  status: string;

  createdAt: string;
  updatedAt?: string;

  createdBy?: {
    companyProfile?: CompanyProfile;
  };
}

export interface JobsResponse {
  message?: string;
  jobs?: Job[];
}

export interface SingleJobResponse {
  message: string;
  job: Job;
}
