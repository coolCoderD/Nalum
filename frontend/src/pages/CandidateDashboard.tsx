import React, { useEffect } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters, type JobFilters as JobFiltersType } from '../components/jobs/JobFilters';
import type { Job } from '../types';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export function CandidateDashboard() {
  const [jobs, setJobs] = React.useState<Job[]>([]); // Default to an empty array
  const [jobsBackend, setJobsBackend] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { serverUrl } = useAuth();

  useEffect(() => {
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
    fetchJobs();
  }, [serverUrl]);

  console.log(jobsBackend);

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
        };
      });

      setJobs(parsedJobs);
    }
  }, [jobsBackend]);

  const handleFilterChange = (filters: JobFiltersType) => {
    // Filtering logic
    const filtered = jobsBackend.filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.recruiter.companyName.toLowerCase().includes(filters.search.toLowerCase());
      const matchesLocation =
        !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesSalary =
        (!filters.salaryMin || job.salaryMin >= parseInt(filters.salaryMin)) &&
        (!filters.salaryMax || job.salaryMax <= parseInt(filters.salaryMax));
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
        <h2 className="text-lg font-semibold cursor-pointer text-gray-900">Filters</h2>
        <JobFilters onFilterChange={handleFilterChange} />
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  return (
    <DashboardLayout sidebar={sidebar}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Available Positions</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <JobCard key={job._id} job={job} onApply={handleApply} />
            ))
          ) : (
            <p className="text-center text-gray-600">No jobs available.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
