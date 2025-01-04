import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import axios from 'axios';

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  companyName: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get('role') || 'candidate') as UserRole;
  const { login,serverUrl } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    const dataWithRole = {
      ...data,
      role,
    };
    console.log(dataWithRole);
  
    try {
      const res = await axios.post(
        `${serverUrl}/api/users/create`,
        dataWithRole,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const user = res.data;
  
      // Check if the user already exists
      if (res.data.message === 'User already exists') {
        alert('User already exists. Please log in.');
        navigate('/login');
        return;
      }
  
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(user));
  
      // Use the login context to store the user data
      login({
        id: user.user._id, // use the actual id returned from the server if available
        name: dataWithRole.name,
        email: dataWithRole.email,
        role: dataWithRole.role,
        companyName: dataWithRole.companyName,
      });
  
      navigate(role === 'candidate' ? '/dashboard' : '/recruiter');
    } catch (error) {
      console.error('Registration failed:', error);
  
      // Show an error message to the user
      alert('Registration failed. Please try again.');
    }
  };
  
  

  

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Join as a {role} to {role === 'candidate' ? 'find your next opportunity' : 'post jobs'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              error={errors.name?.message}
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters with 1 uppercase letter and 1 number
            </p>
          </div>

          {role === 'recruiter' && (
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <Input
                id="companyName"
                type="text"
                {...register('companyName')}
                error={errors.companyName?.message}
                className="mt-1"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  );
}