import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Building2, Briefcase, Users, Globe, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  return (
    <div className="space-y-32 pb-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Connect{' '}
            <span className="relative whitespace-nowrap text-primaryRed">
              <span className="relative">Alumni Talent</span>
            </span>{' '}
            with Dream Opportunities
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            Your gateway to exclusive job opportunities and top talent.
            Join our community of successful professionals and leading companies.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link to="/register?role=candidate">
              <Button size="lg" className="group">
                <UserCircle className="hidden md:block mr-2 h-5 w-5" />
                Join as Candidate
              </Button>
            </Link>
            <Link to="/register?role=recruiter">
              <Button size="lg" variant="outline" className="group">
                <Building2  className="hidden md:block mr-2 h-5 w-5" />
                Join as Recruiter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to connect with the right opportunities or find the perfect candidate.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 ">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-4 left-4">
                  <span className="inline-flex rounded-lg bg-primaryRed p-4 text-white shadow-lg">
                    {feature.icon}
                  </span>
                </div>
                <div className="pt-4">
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    name: 'Exclusive Opportunities',
    description: 'Access jobs specifically posted for alumni, with higher success rates and better cultural fit.',
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    name: 'Verified Network',
    description: 'Connect with a trusted network of alumni professionals and verified employers.',
    icon: <Users className="h-6 w-6" />,
  },
  {
    name: 'Global Reach',
    description: 'Find opportunities worldwide with companies that value your education.',
    icon: <Globe className="h-6 w-6" />,
  },
  {
    name: 'Quick Application',
    description: 'Apply to multiple positions with your stored profile and track applications easily.',
    icon: <Clock className="h-6 w-6" />,
  },
];