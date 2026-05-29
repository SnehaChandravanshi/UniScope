'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchColleges } from '@/services/collegeService';
import { College } from '@/types';

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<College[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced autocomplete search
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await searchColleges(query);
        setSuggestions(results);
      } catch (err) {
        console.error(err);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/colleges');
    }
  };

  const handleSuggestionClick = (slug: string) => {
    router.push(`/college/${slug}`);
  };

  const quickTags = [
    { label: 'IIT Bombay', href: '/college/iit-bombay' },
    { label: 'IIM Ahmedabad', href: '/college/iim-ahmedabad' },
    { label: 'AIIMS Delhi', href: '/college/aiims-delhi' },
    { label: 'BITS Pilani', href: '/college/bits-pilani' },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-40">
      <form onSubmit={handleSearchSubmit} className="flex gap-2 p-1.5 bg-background border border-border/80 rounded-2xl shadow-xl shadow-primary/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
        <div className="relative flex-grow flex items-center pl-3.5">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            type="text"
            placeholder="Search by college name, city, courses..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full border-0 bg-transparent py-3 pl-2 pr-4 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70 text-sm"
          />
        </div>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 rounded-xl shrink-0"
        >
          Search
        </Button>
      </form>

      {/* Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-background border border-border rounded-xl shadow-2xl z-50 animate-in fade-in duration-200">
          <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 py-1.5">
            Suggested Colleges
          </p>
          <div className="space-y-1">
            {suggestions.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => handleSuggestionClick(col.slug)}
                className="w-full text-left flex items-center justify-between p-2.5 hover:bg-muted/70 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {col.name}
                    </p>
                    <div className="flex items-center text-[10px] text-muted-foreground/80 mt-0.5">
                      <MapPin className="h-3 w-3 mr-1 shrink-0" />
                      <span>{col.location}</span>
                    </div>
                  </div>
                </div>
                {col.ranking && (
                  <span className="text-[9px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border shrink-0">
                    {col.ranking}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Search Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
        <span className="text-muted-foreground">Popular:</span>
        {quickTags.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => router.push(tag.href)}
            className="px-3 py-1 rounded-full bg-background border border-border hover:border-primary/50 hover:text-primary transition-all shadow-sm"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}
export default HomeSearch;
