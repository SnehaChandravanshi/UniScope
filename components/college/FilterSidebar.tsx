'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Award, IndianRupee, Settings2, Sparkles, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LOCATIONS = [
  { value: 'all', label: 'All Locations' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'New Delhi', label: 'New Delhi' },
  { value: 'Chennai', label: 'Chennai' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Hyderabad', label: 'Hyderabad' },
  { value: 'Vellore', label: 'Vellore' },
  { value: 'Trichy', label: 'Trichy' },
  { value: 'Ahmedabad', label: 'Ahmedabad' },
  { value: 'Pilani', label: 'Pilani' }
];

const STREAM_COURSES = [
  { value: 'all', label: 'All Streams' },
  { value: 'cse', label: 'Engineering (B.Tech / B.E.)' },
  { value: 'pgp', label: 'Management (MBA / PGP)' },
  { value: 'mbbs', label: 'Medical (MBBS)' }
];

interface FilterSidebarProps {
  onCloseMobile?: () => void;
}

export function FilterSidebar({ onCloseMobile }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state synced with URL searchParams
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'all');
  const [courseType, setCourseType] = useState(searchParams.get('courseType') || 'all');
  const [maxFees, setMaxFees] = useState(Number(searchParams.get('maxFees')) || 1500000);
  const [rating, setRating] = useState(Number(searchParams.get('rating')) || 0);
  const [ownershipType, setOwnershipType] = useState(searchParams.get('ownershipType') || 'all');

  // Synchronize state when URL changes (e.g. from Clear Filters)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setLocation(searchParams.get('location') || 'all');
    setCourseType(searchParams.get('courseType') || 'all');
    setMaxFees(Number(searchParams.get('maxFees')) || 1500000);
    setRating(Number(searchParams.get('rating')) || 0);
    setOwnershipType(searchParams.get('ownershipType') || 'all');
  }, [searchParams]);

  // Apply filters by replacing query parameters
  const applyFilters = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set page back to 1 when changing filters
    params.set('page', '1');

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === 'all' || val === 0 || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });

    router.replace(`/colleges?${params.toString()}`);
  };

  // Debounced search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== (searchParams.get('search') || '')) {
        applyFilters({ search });
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleClearFilters = () => {
    setSearch('');
    setLocation('all');
    setCourseType('all');
    setMaxFees(1500000);
    setRating(0);
    setOwnershipType('all');
    router.replace('/colleges');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="space-y-6 p-5 bg-card border border-border/60 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-foreground font-extrabold text-lg sm:text-xl">
          <Settings2 className="h-6 w-6 text-primary" />
          <span>Filters</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
          className="text-base text-muted-foreground hover:text-primary p-0 h-auto hover:bg-transparent font-semibold"
        >
          Clear All
        </Button>
      </div>

      <hr className="border-border/50" />

      {/* 1. Keyword Search */}
      <div className="space-y-2">
        <Label htmlFor="sidebar-search" className="text-base font-bold text-foreground">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <input
            id="sidebar-search"
            type="text"
            placeholder="E.g. IIT Bombay..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-base sm:text-lg focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* 2. Stream/Category */}
      <div className="space-y-2">
        <Label className="text-base font-bold text-foreground">Course Stream</Label>
        <Select 
          value={courseType} 
          onValueChange={(val) => {
            setCourseType(val || 'all');
            applyFilters({ courseType: val || 'all' });
          }}
        >
          <SelectTrigger className="rounded-xl border-border bg-background focus:ring-1 focus:ring-primary/20 text-base sm:text-lg py-5">
            <SelectValue placeholder="Select Stream" />
          </SelectTrigger>
          <SelectContent>
            {STREAM_COURSES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 3. Location */}
      <div className="space-y-2">
        <Label className="text-base font-bold text-foreground">Location</Label>
        <Select 
          value={location} 
          onValueChange={(val) => {
            setLocation(val || 'all');
            applyFilters({ location: val || 'all' });
          }}
        >
          <SelectTrigger className="rounded-xl border-border bg-background focus:ring-1 focus:ring-primary/20 text-base sm:text-lg py-5">
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map((loc) => (
              <SelectItem key={loc.value} value={loc.value}>
                {loc.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 4. Maximum Fees Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-base">
          <Label className="font-bold text-foreground">Max Annual Fees</Label>
          <span className="font-extrabold text-primary bg-primary/5 px-2.5 py-0.5 rounded-md text-sm sm:text-base">
            ₹{(maxFees / 100000).toFixed(1)}L
          </span>
        </div>
        <Slider
          min={5000}
          max={1500000}
          step={10000}
          value={[maxFees]}
          onValueChange={(vals) => {
            const val = Array.isArray(vals) ? vals[0] : vals;
            setMaxFees(val);
          }}
          onValueCommitted={(vals) => {
            const val = Array.isArray(vals) ? vals[0] : vals;
            applyFilters({ maxFees: val });
          }}
          className="py-1.5 cursor-pointer"
        />
        <div className="flex justify-between text-sm text-muted-foreground font-medium">
          <span>₹5,000</span>
          <span>₹15 Lakh</span>
        </div>
      </div>

      {/* 5. Minimum Rating */}
      <div className="space-y-2">
        <Label className="text-base font-bold text-foreground">Minimum Rating</Label>
        <div className="flex gap-1.5">
          {[3, 4, 4.5, 4.8].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() => {
                const nextRating = rating === stars ? 0 : stars;
                setRating(nextRating);
                applyFilters({ rating: nextRating });
              }}
              className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${
                rating === stars
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-background border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              ★ {stars === 3 ? '3.0+' : stars === 4 ? '4.0+' : stars.toFixed(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Ownership Type */}
      <div className="space-y-2">
        <Label className="text-base font-bold text-foreground">Ownership Type</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {['all', 'Public', 'Private'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setOwnershipType(type);
                applyFilters({ ownershipType: type });
              }}
              className={`py-2 rounded-xl border text-sm font-bold transition-all capitalize ${
                ownershipType === type
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-background border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      </div>

      {onCloseMobile && (
        <Button 
          onClick={onCloseMobile} 
          className="w-full mt-4 bg-primary text-primary-foreground font-semibold rounded-xl"
        >
          Show Colleges
        </Button>
      )}
    </div>
  );
}
export default FilterSidebar;
