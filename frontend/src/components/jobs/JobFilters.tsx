import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';

interface JobFiltersProps {
  onFilterChange: (filters: JobFilters) => void;
}

export interface JobFilters {
  search: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
}

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [filters, setFilters] = React.useState<JobFilters>({
    search: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4  rounded-lg border border-gray-200 bg-white p-4">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          name="search"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={handleChange}
          className="pl-10"
        />
                <Input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

{/* <Input
  name="salaryMin"
  type="text"
  placeholder="Min Salary"
  value={filters.salaryMin}
  onChange={(e) => handleChange(e, /^[0-9]*$/)}
/>

<Input
  name="salaryMax"
  type="text"
  placeholder="Max Salary"
  value={filters.salaryMax}
  onChange={(e) => handleChange(e, /^[0-9]*$/)}
/> */}

      </div>
    </div>
  );
}