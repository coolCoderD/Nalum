import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/Button';
import { JobCard } from '../components/jobs/JobCard';
import type { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { set } from 'date-fns';

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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    location: '',
    skills: '',
    salaryRange: '',
    description: '',
    deadline: '',
  });
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

  useEffect(()=>{
    fetchJobs();
  },[]);
  console.log(jobsBackend)
  const parseSalaryRange = (salaryRange: string) => {
    const [min, max] = salaryRange.split(' - ').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10));
    return { salaryMin: min, salaryMax: max };
    const [loading, setLoading] = React.useState(true);
  };
  const paresedJobs: Job[] = jobsBackend.map(job => {
    const { salaryMin, salaryMax } = parseSalaryRange(job.salaryRange);
    return {
      _id: job._id, // Include the _id property
      title: job.title,
      companyName: `${job.recruiter.companyName}`, // Replace or fetch dynamically if available.
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

  const handlePostJob = async () => {
    const jobData = {
      recruiterId: user.id,  // Assuming user ID is stored in localStorage or context
      title: formData.title,
      description: formData.description,
      location: formData.location,
      skills: formData.skills.split(',').map(skill => skill.trim()),  // Convert comma-separated string to an array
      salaryRange: formData.salaryRange,
      deadline: new Date(formData.deadline).toISOString(),  // Convert date to ISO string
    };
    console.log('Posting job with data:', jobData);
    setLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/jobs`, jobData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Job posted:', response.data);
      setIsModalOpen(false);  // Close the modal on success
      setLoading(false);
      setFormData({
        title: '',
        location: '',
        skills: '',
        salaryRange: '',
        description: '',
        deadline: '',
      })
      fetchJobs();  
    } catch (error) {
      console.error('Error posting job:', error);
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>


        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 space-y-4">
  <h2 className="text-xl font-semibold">Post a New Job</h2>

  <div className="mb-4">
    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
      Job Title
    </label>
    <Input
      id="title"
      name="title"
      placeholder="Job Title"
      value={formData.title}
      onChange={handleInputChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
      Location
    </label>
    <Input
      id="location"
      name="location"
      placeholder="Location"
      value={formData.location}
      onChange={handleInputChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
      Skills
    </label>
    <Input
      id="skills"
      name="skills"
      placeholder="Skills (comma-separated)"
      value={formData.skills}
      onChange={handleInputChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700">
      Salary Range
    </label>
    <Input
      id="salaryRange"
      name="salaryRange"
      placeholder="Salary Range (e.g., 70,000 - 100,000 USD)"
      value={formData.salaryRange}
      onChange={handleInputChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
      Job Description
    </label>
    <textarea
      id="description"
      name="description"
      placeholder="Job Description"
      value={formData.description}
      onChange={handleInputChange}
      className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primaryRed focus:border-transparent rounded"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
      Deadline
    </label>
    <input
      id="deadline"
      name="deadline"
      type="date"
      value={formData.deadline}
      onChange={handleInputChange}
      className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primaryRed focus:border-transparent rounded"
    />
  </div>

  <div className="flex justify-end space-x-2">
    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handlePostJob}>
      {loading ? 'Posting...' : 'Post Job'}
    </Button>
  </div>
</div>

        </Modal>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`
                border-b-2 py-4 px-1 text-sm font-medium
                ${activeTab === 'active'
                  ? 'border-primaryRed text-secondaryRed'
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
                  ? 'border-primaryRed text-secondaryRed'
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
              onJobDelete={fetchJobs}
              showActions={false}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}