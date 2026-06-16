export const JobCategoryValues = {
  SOFTWARE_DEVELOPMENT: 'SOFTWARE_DEVELOPMENT',
  DESIGN: 'DESIGN',
  MARKETING: 'MARKETING',
  SALES: 'SALES',
  HR: 'HR',
  FINANCE: 'FINANCE',
  DATA_SCIENCE: 'DATA_SCIENCE',
  DEVOPS: 'DEVOPS',
  CYBER_SECURITY: 'CYBER_SECURITY',
  PRODUCT_MANAGEMENT: 'PRODUCT_MANAGEMENT',
  OTHER: 'OTHER',
} as const;

export type JobCategoryValue =
  (typeof JobCategoryValues)[keyof typeof JobCategoryValues];

export const JobTypeValues = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  INTERNSHIP: 'INTERNSHIP',
  CONTRACT: 'CONTRACT',
  FREELANCE: 'FREELANCE',
} as const;

export type JobTypeValue = (typeof JobTypeValues)[keyof typeof JobTypeValues];

export const WorkModeValues = {
  REMOTE: 'REMOTE',
  ONSITE: 'ONSITE',
  HYBRID: 'HYBRID',
} as const;

export type WorkModeValue =
  (typeof WorkModeValues)[keyof typeof WorkModeValues];

export const ExperienceLevelValues = {
  FRESHER: 'FRESHER',
  JUNIOR: 'JUNIOR',
  MID_LEVEL: 'MID_LEVEL',
  SENIOR: 'SENIOR',
  LEAD: 'LEAD',
} as const;

export type ExperienceLevelValue =
  (typeof ExperienceLevelValues)[keyof typeof ExperienceLevelValues];

export const JobStatusValues = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
} as const;

export type JobStatusValue =
  (typeof JobStatusValues)[keyof typeof JobStatusValues];
