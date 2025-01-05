import React, { useEffect } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters, type JobFilters as JobFiltersType } from '../components/jobs/JobFilters';
import type { Job } from '../types';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Frown } from 'lucide-react';

export function CandidateDashboard() {
  const [jobs, setJobs] = React.useState<Job[]>([]); // Default to an empty array
  const [jobsBackend, setJobsBackend] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { serverUrl } = useAuth();
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/jobs`);
      setJobsBackend(response.data.jobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [serverUrl]);

  

  useEffect(() => {
    if (jobsBackend.length > 0) {
      const parseSalaryRange = (salaryRange: string) => {
        const [min, max] = salaryRange.split(' - ').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10));
        return { salaryMin: min, salaryMax: max };
      };

      const parsedJobs: Job[] = jobsBackend.map(job => {
        const { salaryMin, salaryMax } = parseSalaryRange(job.salaryRange);
        return {
          _id: job._id,
          title: job.title,
          companyName: `${job.recruiter.companyName}`,
          location: job.location,
          description: job.description,
          skills: job.skills,
          salaryMin,
          salaryMax,
          deadline: job.deadline,
          createdAt: job.createdAt,
          recruiterId: job.postedBy,
          postedBy: job.postedBy,
          status: job.status.toLowerCase() as 'active' | 'closed',
          jobLocationType: job.jobLocationType.toLowerCase() as 'remote' | 'hybrid' | 'onsite'
        };
      });

      setJobs(parsedJobs);
    }
  }, [jobsBackend]);

  const handleFilterChange = (filters: JobFiltersType) => {
    if (!filters.search && !filters.location && !filters.salaryMin && !filters.salaryMax) {
      
      fetchJobs(); // Reset to all jobs if no filters are applied
      return;
    }
    const filtered = jobs.filter(job => {
      const matchesSearch =
        !filters.search ||  // Show all jobs if the search is empty
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.companyName.toLowerCase().includes(filters.search.toLowerCase());
  
      const matchesLocation =
        !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
  
      const matchesSalary =
        (!filters.salaryMin || job.salaryMin >= parseInt(filters.salaryMin, 10)) &&
        (!filters.salaryMax || job.salaryMax <= parseInt(filters.salaryMax, 10));
  
      return matchesSearch && matchesLocation && matchesSalary;
    });
  
    setJobs(filtered);
  };
  
  

  const handleApply = async (jobId: string) => {
    // Implement job application logic
    console.log('Applying to job:', jobId);
  };

  const sidebar = (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold cursor-pointer  text-gray-900">Filters</h2>
        <JobFilters onFilterChange={handleFilterChange} />
      </div>
    </div>
  );

  if (loading) {
    return (
<div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="text-center text-gray-700">
    <div className="flex justify-center items-center gap-2 mb-4">
      <div className="w-4 h-4 rounded-full bg-primaryRed animate-bounce"></div>
      <div
        className="w-4 h-4 rounded-full bg-primaryRed animate-bounce [animation-delay:-0.3s]"
      ></div>
      <div
        className="w-4 h-4 rounded-full bg-primaryRed animate-bounce [animation-delay:-0.5s]"
      ></div>
    </div>
    <h1 className="text-2xl font-semibold">Fetching Data</h1>
  </div>
</div>

)
  }


  return (
<DashboardLayout sidebar={sidebar}>
  <div className="space-y-4 relative  flex flex-col justify-center items-center ">
    <h1 className="text-2xl font-bold text-gray-900">Available Positions</h1>
    <div className=''>
    <div className="grid gap-6 md:grid-cols-2">
      {jobs.length > 0 ? (
        jobs.map(job => (
          <JobCard key={job._id} job={job} onApply={handleApply} />
        ))
      ) : (
        <div className="bg-red-900 absolute inset-0 top-24 ">
          <div className="flex flex-col items-center space-y-4 text-gray-600">
            <Briefcase className="h-16 w-16 text-primaryRed" />
            <h2 className="text-lg font-semibold">No Jobs Available</h2>
            <p className="text-center text-sm">
              Check back later
            </p>
          </div>
        </div>
      )}
    </div>
    </div>
  </div>
</DashboardLayout>

  );
}
