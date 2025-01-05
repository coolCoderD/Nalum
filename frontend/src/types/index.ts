export type UserRole = 'candidate' | 'recruiter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
}

export interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  locationType?: 'remote' | 'hybrid' | 'onsite';
  description: string;
  requirements?: string[];
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  deadline: string;
  createdAt: string;
  recruiterId: string;
  status: 'active' | 'closed';
  postedBy: string;
  jobLocationType: 'remote' | 'hybrid' | 'onsite';
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  resumeUrl: string;
  coverLetter: string;
  appliedAt: string;
}