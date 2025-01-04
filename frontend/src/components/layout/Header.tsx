import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  console.log(user?.id)

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Alumni Jobs</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
<Link
  to={user.role === 'candidate' ? '/dashboard' : '/recruiter'}
  className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-all duration-200 ease-in-out p-2 rounded-md hover:bg-gray-200"
>

  <span className="text-md font-medium">
    {user.role === 'candidate' 
      ? `Welcome back 🏡, ${user.name}! Ready to find your next opportunity?` 
      : `Hello 👋, ${user.name}! Ready to post some exciting jobs?`}
  </span>
</Link>


                <Button onClick={logout} variant="secondary">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary">Sign Up</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}