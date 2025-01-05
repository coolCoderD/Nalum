import React from 'react';
import { MapPin, Building2, Calendar, DollarSign, Trash } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';
import type { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';


interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onJobDelete?: () => void;
  onJobUpdate?: () => void;
  showActions?: boolean;
}



export function JobCard({ job, onApply,  onJobDelete, onJobUpdate, showActions = true }: JobCardProps) {
  const[isModalOpen, setIsModalOpen]=React.useState(false);
  const {user,serverUrl}=useAuth();
  // console.log(job);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [applied, setApplied] = React.useState(false);

    const [formData, setFormData] = React.useState({
      title: job.title,
      location: job.location,
      skills: job.skills.join(', '),
      minSalary: String(job.salaryMax),
      maxSalary: String(job.salaryMin),
      description: job.description,
      deadline: new Date(job.deadline).toISOString().slice(0, 10),
      jobLocationType: job.jobLocationType
    });
  
  const deleteJob = async (jobId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    
    if (!confirmDelete) {
      return; // Exit if the user cancels
    }
  
    try {
      console.log("Deleting job...");
      await axios.delete(`${serverUrl}/api/jobs/${jobId}`);
      console.log("Job deleted successfully");
      if (onJobDelete) {
        onJobDelete();
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete the job. Please try again."); // Optional error alert
    }
  };



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
  const handleUpdateJob = () => {
    if (!validateForm()) return;
    setLoading(true);
    const jobData = {
      recruiterId: user?.id,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      salaryRange: `${formData.minSalary} - ${formData.maxSalary}`,
      deadline: new Date(formData.deadline).toISOString(),
      jobLocationType: formData.jobLocationType,
    };

    console.log(jobData);
    axios.put(`${serverUrl}/api/jobs/${job._id}`, jobData)
      .then(response => {

        // console.log('Job updated successfully:', response.data);
        if (onJobUpdate) {
          onJobUpdate();
        }
        setLoading(false);
        setIsModalOpen(false);
      })
      .catch(error => {
        console.error('Error updating job:', error);
        setLoading(false);
      })
  }

  const handleCloseJob=(jobId)=>{
    setLoading(true);
    try{
      axios.patch(`${serverUrl}/api/jobs/${jobId}/close`)
      .then(response => {
        // console.log('Job closed successfully:', response.data);
        if (onJobUpdate) {
          onJobUpdate();
        }
        setLoading(false);
       
      })
      .catch(error => {
        console.error('Error closing job:', error);
        setLoading(false);
      })
    }catch(error){
      console.error('Error closing job:', error);
      setLoading(false);
      if (error instanceof Error) {
        alert(error.message);
    }
    }
  }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
 
  return (
    <div className="rounded-lg border relative border-gray-200 bg-white p-6 shadow-sm">
      {
        !showActions && (
          <Trash 
  onClick={() => deleteJob(job._id)}
  className="mr-1  absolute cursor-pointer right-3 hover:text-secondaryRed top-2 h-5 w-5" 

/>
        )
      }

      <div className="flex justify-between">
    
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <Building2 className="mr-1 h-4 w-4" />
            {job.companyName}
          </div>
        </div>
        <div className="flex items-center text-gray-500">
       
       <span
          
           className="rounded-full bg-secondaryRed px-3 py-1 text-xs font-medium text-light"
         >
           {job.jobLocationType}
         </span>
       
    </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center text-gray-500">
          <MapPin className="mr-1 h-4 w-4" />
          {job.location} 
        </div>
        <div className="flex items-center text-gray-500">
         
          {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
        </div>
        <div className="flex items-center text-gray-500">
          <Calendar className="mr-1 h-4 w-4" />
          Deadline: {new Date(job.deadline).toLocaleDateString()}
        </div>

      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-secondaryRed px-3 py-1 text-xs font-medium text-light"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>


      {showActions? (
        <div className="mt-6">
        <Button
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setApplied(true); // Mark as applied
            }, 3000); // Simulate 3-second delay
          }}
          disabled={loading || applied}
          className="w-full"
        >
          {loading ? 'Applying...' : applied ? 'Applied' : 'Apply Now'}
        </Button>
        </div>
      ):(
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button
            onClick={()=> setIsModalOpen(true)}
            className=""

          >
            Update Job
          </Button>
          {
            job.status === 'closed' ? (
              <Button 
              onClick={() => deleteJob(job._id)}
              variant='outline'>
                Delete Job
              </Button>
            ):(
              <Button 
              onClick={() => handleCloseJob(job._id)}
              variant='outline'>
                Close Job
              </Button>
            )
          }
        </div>
      )
    }
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
    title='Update Job'
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
    {errors.salaryRange && <p className="text-red-500 mt-2">{errors.salaryRange}</p>}
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
          <Button onClick={handleUpdateJob}
          disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Job'}
          </Button>
        </div>
      </div>
      </Modal>
    </div>
  );
}