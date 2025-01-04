import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/Button';
import { JobCard } from '../components/jobs/JobCard';
import type { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Mock data - replace with API calls
// const MOCK_JOBS: Job[] = [
//   {
//     id: '1',
//     title: 'Senior Frontend Developer',
//     companyName: 'Tech Corp',
//     location: 'San Francisco, CA',
//     locationType: 'hybrid',
//     description: 'Looking for an experienced frontend developer...',
//     requirements: ['5+ years experience', 'React expertise'],
//     skills: ['React', 'TypeScript', 'Tailwind CSS'],
//     salaryMin: 120000,
//     salaryMax: 180000,
//     deadline: '2024-04-01',
//     createdAt: '2024-03-01',
//     recruiterId: '1',
//     status: 'active',
//   },
//   // Add more mock jobs...
// ];

export function RecruiterDashboard() {
  const [activeTab, setActiveTab] = React.useState<'active' | 'closed'>('active');
  const [jobsBackend, setJobsBackend] = React.useState<Job[]>([]);
  const {serverUrl}=useAuth();
  const [loading, setLoading] = React.useState(true);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;


  useEffect(()=>{
    const fetchJobs=async ()=>{
      try{
        const response=await axios.get(`${serverUrl}/api/jobs/${user?.id}`);
        setJobsBackend(response.data.jobs);
        setLoading(false);
      }catch(error){
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    }
    fetchJobs();
  },[]);
  console.log(jobsBackend)
  const parseSalaryRange = (salaryRange: string) => {
    const [min, max] = salaryRange.split(' - ').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10));
    return { salaryMin: min, salaryMax: max };
  };
  const paresedJobs: Job[] = jobsBackend.map(job => {
    const { salaryMin, salaryMax } = parseSalaryRange(job.salaryRange);
    return {
      _id: job._id, // Include the _id property
      title: job.title,
      companyName: `${user.companyName}`, // Replace or fetch dynamically if available.
      location: job.location,
      description: job.description,
      skills: job.skills,
      salaryMin,
      salaryMax,
      deadline: job.deadline,
      createdAt: job.createdAt,
      recruiterId: job.postedBy, // Include the postedBy property
      postedBy: job.postedBy, // Include the postedBy property
      status: job.status.toLowerCase() as 'active' | 'closed',
    };
  });;
  
  // Example usage or rendering
  const jobs = paresedJobs.filter(job => job.status === activeTab);
  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`
                border-b-2 py-4 px-1 text-sm font-medium
                ${activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
              `}
            >
              Active Jobs
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`
                border-b-2 py-4 px-1 text-sm font-medium
                ${activeTab === 'closed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
              `}
            >
              Closed Jobs
            </button>
          </nav>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              showActions={false}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}