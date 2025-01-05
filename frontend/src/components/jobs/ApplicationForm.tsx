import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Job } from '../../types';

const applicationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  resumeUrl: z.string().min(1, 'Resume is required'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  job: Job;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ApplicationForm({ job, onSubmit, isSubmitting }: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
        <p className="text-sm text-gray-500">{job.companyName}</p>
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <Input
          id="fullName"
          {...register('fullName')}
          error={errors.fullName?.message}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700">
          Resume
        </label>
        <Input
          id="resumeUrl"
          type="file"
          accept=".pdf,.doc,.docx"
          {...register('resumeUrl')}
          error={errors.resumeUrl?.message}
          className="mt-1"
        />
        <p className="mt-1 text-sm text-gray-500">
          Accepted formats: PDF, DOC, DOCX (max 5MB)
        </p>
      </div>

      <div>
        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
          Cover Letter
        </label>
        <textarea
          id="coverLetter"
          {...register('coverLetter')}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.coverLetter && (
          <p className="mt-1 text-sm text-red-600">{errors.coverLetter.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </form>
  );
}