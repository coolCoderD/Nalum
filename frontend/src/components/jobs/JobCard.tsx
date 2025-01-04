import React from 'react';
import { MapPin, Building2, Calendar, DollarSign, Trash } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';
import type { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';


interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onJobDelete?: () => void;
  showActions?: boolean;
}



export function JobCard({ job, onApply,  onJobDelete, showActions = true }: JobCardProps) {
  const {user,serverUrl}=useAuth();
  console.log(job);
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
  
  console.log(job);
  return (
    <div className="rounded-lg border relative border-gray-200 bg-white p-6 shadow-sm">

<Trash 
  onClick={() => deleteJob(job._id)}
  className="mr-1 absolute cursor-pointer right-3 hover:text-secondaryRed top-4 h-5 w-5" 

/>

      <div className="flex justify-between">
    
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <Building2 className="mr-1 h-4 w-4" />
            {job.companyName}
          </div>
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
            onClick={() => onApply?.(job.id)}
            className="w-full"
          >
            Apply Now
          </Button>
        </div>
      ):(
        <div className="mt-6">
          <Button
            
            className="w-full"
          >
            Update Job
          </Button>
        </div>
      )
    }
    </div>
  );
}