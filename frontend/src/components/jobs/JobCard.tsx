import React from 'react';
import { MapPin, Building2, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';
import type { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  showActions?: boolean;
}

export function JobCard({ job, onApply, showActions = true }: JobCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {showActions && (
        <div className="mt-6">
          <Button
            onClick={() => onApply?.(job.id)}
            className="w-full"
          >
            Apply Now
          </Button>
        </div>
      )}
    </div>
  );
}