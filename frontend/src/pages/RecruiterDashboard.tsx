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
    minSalary: '',
    maxSalary: '',
    description: '',
    deadline: '',
    jobLocationType: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const fetchJobs=async ()=>{
    try{
      const response=await axios.get(`${serverUrl}/api/jobs/recruiter/${user?.id}`);
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
  // console.log(jobsBackend)
  const parseSalaryRange = (salaryRange: string) => {
    const [min, max] = salaryRange.split(' - ').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10));
    return { salaryMin: min, salaryMax: max };

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
      jobLocationType: job.jobLocationType.toLowerCase() as 'remote' | 'hybrid' | 'onsite'
    };
  });;
  
  // Example usage or rendering
  const jobs = paresedJobs.filter(job => job.status === activeTab);
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



  const validateForm = () => {
    const newErrors: Record<string, string> = {};
  
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required.';
    } else if (!isNaN(Number(formData.title))) {
      newErrors.title = 'Job title must not be a number.';
    }
  
    if (!formData.description.trim()) newErrors.description = 'Job description is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
  
    if (!formData.skills.trim()) {
      newErrors.skills = 'At least one skill is required.';
    } else if (!/^[a-zA-Z\s]+(,[a-zA-Z\s]+)*$/.test(formData.skills)) {
      newErrors.skills = 'Skills must be comma-separated words.';
    }
  
    if (!formData.minSalary.trim() || !formData.maxSalary.trim()) {
      newErrors.salaryRange = 'Both minimum and maximum salary are required.';
    } else if (isNaN(Number(formData.minSalary)) || isNaN(Number(formData.maxSalary))) {
      newErrors.salaryRange = 'Both minimum and maximum salary must be valid numbers.';
    }
  
    const currentDate = new Date().setHours(0, 0, 0, 0); // Current date without time
    const deadlineDate = new Date(formData.deadline).getTime();
  
    if (!formData.deadline.trim()) {
      newErrors.deadline = 'Valid application deadline is required.';
    } else if (isNaN(deadlineDate)) {
      newErrors.deadline = 'Application deadline must be a valid date.';
    } else if (deadlineDate < currentDate) {
      newErrors.deadline = 'Application deadline cannot be in the past.';
    }
  
    if (!formData.jobLocationType.trim()) {
      newErrors.jobLocationType = 'Job location type is required.';
    }
  
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => setErrors({}), 3000); // Clear errors after 3 seconds
    }
  
    return Object.keys(newErrors).length === 0;
  };
  


  const handlePostJob = async () => {
    if (!validateForm()) return;
  
    const jobData = {
      recruiterId: user.id,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      salaryRange: `${formData.minSalary} - ${formData.maxSalary}`,
      deadline: new Date(formData.deadline).toISOString(),
      jobLocationType: formData.jobLocationType,
    };
  
    // console.log('Posting job with data:', jobData);
    setLoading(true);
  
    try {
      const response = await axios.post(`${serverUrl}/api/jobs`, jobData, {
        headers: { 'Content-Type': 'application/json' },
      });
      // console.log('Job posted:', response.data);
      setIsModalOpen(false); // Close modal on success
      setLoading(false);
      setFormData({
        title: '',
        location: '',
        skills: '',
        minSalary: '',
        maxSalary: '',
        description: '',
        deadline: '',
        jobLocationType: '',
      });
      fetchJobs(); // Refresh job listings
    } catch (error) {
      console.error('Error posting job:', error);
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
  <DashboardLayout>
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
  title='Post a new job'
  size='lg'
  >
  <div className="p-6 space-y-4">
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
    {errors.title && <p className="text-red-500 mt-2">{errors.title}</p>}
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
      required
      className="w-full p-2 border border-gray-300 rounded"
    />
    {errors.location && <p className="text-red-500 mt-2">{errors.location}</p>}
  </div>
  <div>
  <label htmlFor="locationType" className="block text-sm font-medium text-gray-700">
  Location Type
</label>
<select
  id="locationType"
  name="jobLocationType"
  value={formData.jobLocationType}
  onChange={handleInputChange}
  className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primaryRed focus:border-transparent rounded"
>
  <option value="" disabled hidden>Select Location Type</option>
  <option value="remote">Remote</option>
  <option value="hybrid">Hybrid</option>
  <option value="onsite">On-site</option>
</select>

          {errors.jobLocationType && <p className="text-red-500 mt-2">{errors.jobLocationType}</p>}
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
    {errors.skills && <p className="text-red-500 mt-2">{errors.skills}</p>}
  </div>

<div className='grid grid-cols-2 gap-5'>
  <div className="mb-4">
      <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700">
        Minimum Salary
      </label>
      <Input
        id="minSalary"
        name="minSalary"
        placeholder="Minimum Salary (e.g., 70000)"
        value={formData.minSalary}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700">
        Maximum Salary
      </label>
      <Input
        id="maxSalary"
        name="maxSalary"
        placeholder="Maximum Salary (e.g., 100000)"
        value={formData.maxSalary}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>
  
    </div>
    {errors.salaryRange && <p className="text-red-500  ">{errors.salaryRange}</p>}


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
    {errors.description && <p className="text-red-500 mt-2">{errors.description}</p>}
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
    {errors.deadline && <p className="text-red-500 mt-2">{errors.deadline}</p>}
  </div>

  <div className="flex justify-end space-x-2">
    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handlePostJob}
    disabled={loading}
    >
      {loading ? 'Posting...' : 'Post Job'}
    </Button>
  </div>
</div>

        </Modal>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
          <Button onClick={() => setIsModalOpen(true)}>
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
  {jobs.length > 0 ? (
    jobs.map((job) => (
      <JobCard
        key={job._id}
        job={job}
        onJobDelete={fetchJobs}
        onJobUpdate={fetchJobs}
        showActions={false}
      />
    ))
  ) : (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900">No Jobs Found</h1>
    </div>
  )}
</div>

      </div>
    </DashboardLayout>
  );
}