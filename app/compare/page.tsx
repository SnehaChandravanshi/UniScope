'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { 
  GitCompare, 
  Plus, 
  X, 
  Star, 
  MapPin, 
  Landmark, 
  TrendingUp, 
  IndianRupee, 
  Copy, 
  Check, 
  Trophy, 
  Building2, 
  HelpCircle,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getCollegeBySlug, searchColleges } from '@/services/collegeService';
import { College } from '@/types';
import { formatINR, formatLPA } from '@/lib/utils';

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Zustand state link
  const compareColleges = useStore((state) => state.compareColleges);
  const isAuroraMode = useStore((state) => state.isAuroraMode);
  const addToCompare = useStore((state) => state.addToCompare);
  const removeFromCompare = useStore((state) => state.removeFromCompare);
  const clearCompare = useStore((state) => state.clearCompare);

  // Selector modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync URL query parameters on mount (e.g., shareable link: ?colleges=iit-bombay,iit-delhi)
  useEffect(() => {
    const collegesParam = searchParams.get('colleges');
    if (collegesParam) {
      const slugs = collegesParam.split(',');
      const fetchInitialColleges = async () => {
        clearCompare();
        for (const slug of slugs) {
          const col = await getCollegeBySlug(slug.trim());
          if (col) {
            addToCompare(col);
          }
        }
      };
      fetchInitialColleges();
    }
  }, [searchParams]);

  // Synchronize Zustand state back to URL parameters
  const updateUrlParams = (updatedList: College[]) => {
    const params = new URLSearchParams();
    if (updatedList.length > 0) {
      const slugs = updatedList.map((c) => c.slug).join(',');
      params.set('colleges', slugs);
    }
    router.replace(`/compare?${params.toString()}`);
  };

  // Search trigger inside modal
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      const results = await searchColleges(searchQuery);
      setSearchResults(results);
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectCollege = (college: College) => {
    addToCompare(college);
    setModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    
    // Update URL query parameters
    const currentList = [...compareColleges];
    if (!currentList.some((c) => c.id === college.id)) {
      if (currentList.length >= 3) {
        currentList.shift();
      }
      currentList.push(college);
    }
    updateUrlParams(currentList);
  };

  const handleRemoveCollege = (id: string) => {
    removeFromCompare(id);
    const updated = compareColleges.filter((c) => c.id !== id);
    updateUrlParams(updated);
  };

  const handleShareClick = () => {
    if (compareColleges.length === 0) return;
    const slugs = compareColleges.map((c) => c.slug).join(',');
    const url = `${window.location.origin}/compare?colleges=${slugs}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Calculations for highlighting best value
  const getBestValues = () => {
    if (compareColleges.length < 2) return {};

    let lowestFee = Infinity;
    let highestRating = -Infinity;
    let highestAvgPackage = -Infinity;
    let highestPlacementRate = -Infinity;

    compareColleges.forEach((col) => {
      if (col.fees < lowestFee) lowestFee = col.fees;
      if (col.rating > highestRating) highestRating = col.rating;
      if (col.placementStats.averagePackage > highestAvgPackage) highestAvgPackage = col.placementStats.averagePackage;
      if (col.placementStats.placementPercentage > highestPlacementRate) highestPlacementRate = col.placementStats.placementPercentage;
    });

    return { lowestFee, highestRating, highestAvgPackage, highestPlacementRate };
  };

  const bestValues = getBestValues();

  // Create columns list
  const slots = Array.from({ length: 3 });

  return (
    <div className="mx-auto w-full px-4 sm:px-8 lg:px-12 py-10 space-y-10">
      {/* 1. Header Details */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border/40 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-2">
            <GitCompare className="h-8 w-8 text-primary" />
            <span>College Comparison Tool</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-1.5 leading-relaxed font-medium">
            Select 2 to 3 colleges to compare tuition costs, placement records, ratings, and course selections side-by-side.
          </p>
        </div>

        {compareColleges.length > 0 && (
          <Button 
            onClick={handleShareClick}
            variant="outline" 
            className="rounded-xl font-bold gap-2 shrink-0 h-10 text-sm"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Link Copied!' : 'Share Comparison'}</span>
          </Button>
        )}
      </div>

      {/* 2. College Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {slots.map((_, index) => {
          const college = compareColleges[index];

          if (college) {
            return (
              <div 
                key={college.id}
                className={`border p-5 rounded-2xl relative group flex flex-col justify-between h-44 transition-all duration-300 ${
                  isAuroraMode 
                    ? 'bg-slate-900/60 border-white/5 shadow-lg shadow-black/10 hover:border-primary/40 hover:-translate-y-1' 
                    : 'bg-card border-border shadow-sm hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <button
                  onClick={() => handleRemoveCollege(college.id)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors border border-border/40 z-20 cursor-pointer"
                  aria-label="Remove college"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={college.image}
                    alt={college.name}
                    className="h-16 w-16 object-cover rounded-xl bg-muted border shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/college-fallback.png';
                    }}
                  />
                  <div className="min-w-0 flex-grow pr-4">
                    <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {college.name}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1 shrink-0 text-primary" />
                      <span className="truncate">{college.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-5 pt-3 border-t border-border/30 text-sm">
                  <span className="text-muted-foreground font-semibold">★ {college.rating.toFixed(1)}</span>
                  <span className="font-bold text-primary">{formatINR(college.fees)} / yr</span>
                </div>
              </div>
            );
          }

          return (
            <Dialog 
              key={index} 
              open={modalOpen && activeSlot === index}
              onOpenChange={(open) => {
                setModalOpen(open);
                if (open) {
                  setActiveSlot(index);
                  setSearchQuery('');
                  setSearchResults([]);
                } else {
                  setActiveSlot(null);
                }
              }}
            >
              <DialogTrigger render={
                <button className={`flex flex-col items-center justify-center border border-dashed hover:border-primary/50 bg-muted/20 hover:bg-primary/5 h-44 rounded-2xl text-center p-6 group transition-all cursor-pointer ${
                  isAuroraMode ? 'border-white/10 hover:bg-white/5' : 'border-border/80'
                }`} />
              }>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border shadow-sm group-hover:scale-105 transition-transform text-muted-foreground group-hover:text-primary">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-sm sm:text-base font-bold text-muted-foreground group-hover:text-primary mt-3 transition-colors">
                  Add College to Compare
                </span>
              </DialogTrigger>
              <DialogContent className="max-w-[420px] p-5 rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold">Search & Add College</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Type college name, e.g. IIT Bombay..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((col) => (
                        <button
                          key={col.id}
                          onClick={() => handleSelectCollege(col)}
                          className="w-full text-left flex items-center p-2 hover:bg-muted rounded-xl transition-colors gap-3"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={col.image}
                            alt={col.name}
                            className="h-10 w-10 object-cover rounded-lg bg-muted border shrink-0"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/college-fallback.png';
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground line-clamp-1">{col.name}</p>
                            <p className="text-[10px] text-muted-foreground">{col.location}</p>
                          </div>
                        </button>
                      ))
                    ) : searchQuery.trim().length >= 2 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No colleges match your query.</p>
                    ) : (
                      <p className="text-xs text-muted-foreground/80 text-center py-4">Type to start searching colleges.</p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>

      {/* 3. Comparison Table */}
      {compareColleges.length >= 1 ? (
        <div className={`transition-all duration-300 border rounded-3xl overflow-hidden ${
          isAuroraMode 
            ? 'bg-slate-900/40 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md' 
            : 'bg-card border-border/80 shadow-xl'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm min-w-[700px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  <th className="p-4 w-1/4">Parameters</th>
                  {compareColleges.map((col) => (
                    <th key={col.id} className="p-4 w-1/4 font-extrabold text-foreground">
                      {col.name.split(',')[0]}
                    </th>
                  ))}
                  {Array.from({ length: 3 - compareColleges.length }).map((_, i) => (
                    <th key={i} className="p-4 w-1/4 text-muted-foreground/40 italic font-normal">
                      Empty Slot
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {/* 1. Location */}
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-semibold text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>Location</span>
                  </td>
                  {compareColleges.map((col) => (
                    <td key={col.id} className="p-4 text-foreground">
                      {col.location}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareColleges.length }).map((_, i) => (
                    <td key={i} className="p-4 text-muted-foreground/30 font-light">-</td>
                  ))}
                </tr>

                {/* 2. Ownership Type */}
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Landmark className="h-4 w-4 text-primary shrink-0" />
                    <span>Ownership</span>
                  </td>
                  {compareColleges.map((col) => (
                    <td key={col.id} className="p-4 text-foreground">
                      {col.ownershipType}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareColleges.length }).map((_, i) => (
                    <td key={i} className="p-4 text-muted-foreground/30 font-light">-</td>
                  ))}
                </tr>

                {/* 3. Rating */}
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary shrink-0" />
                    <span>Student Rating</span>
                  </td>
                  {compareColleges.map((col) => {
                    const isBest = bestValues.highestRating === col.rating;
                    return (
                      <td 
                        key={col.id} 
                        className={`p-4 font-semibold ${
                          isBest && compareColleges.length >= 2
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10' 
                            : 'text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span>★ {col.rating.toFixed(1)}</span>
                          {isBest && compareColleges.length >= 2 && (
                            <Trophy className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - compareColleges.length }).map((_, i) => (
                    <td key={i} className="p-4 text-muted-foreground/30 font-light">-</td>
                  ))}
                </tr>

                {/* 4. Average Annual Fees */}
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-semibold text-muted-foreground flex items-center gap-1.5">
                    <IndianRupee className="h-4 w-4 text-primary shrink-0" />
                    <span>Annual Fees</span>
                  </td>
                  {compareColleges.map((col) => {
                    const isBest = bestValues.lowestFee === col.fees;
                    return (
                      <td 
                        key={col.id} 
                        className={`p-4 font-semibold ${
                          isBest && compareColleges.length >= 2
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10' 
                            : 'text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span>{formatINR(col.fees)}</span>
                          {isBest && compareColleges.length >= 2 && (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded ml-1">
                              Best Value
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - compareColleges.length }).map((_, i) => (
                    <td key={i} className="p-4 text-muted-foreground/30 font-light">-</td>
                  ))}
                </tr>

                {/* 5. Placements (Average Package) */}
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-semibold text-muted-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                    <span>Avg Salary (LPA)</span>
                  </td>
                  {compareColleges.map((col) => {
                    const isBest = bestValues.highestAvgPackage === col.placementStats.averagePackage;
                    return (
                      <td 
                        key={col.id} 
                        className={`p-4 font-semibold ${
                          isBest && compareColleges.length >= 2
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10' 
                            : 'text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span>{formatLPA(col.placementStats.averagePackage)}</span>
                          {isBest && compareColleges.length >= 2 && (
                            <Trophy className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - compareColleges.length }).map((_, i) => (
                    <td key={i} className="p-4 text-muted-foreground/30 font-light">-</td>
                  ))}
                </tr>

                {/* 6. Placement Rate */}
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Placement Rate</span>
                  </td>
                  {compareColleges.map((col) => {
                    const isBest = bestValues.highestPlacementRate === col.placementStats.placementPercentage;
                    return (
                      <td 
                        key={col.id} 
                        className={`p-4 font-semibold ${
                          isBest && compareColleges.length >= 2
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10' 
                            : 'text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span>{col.placementStats.placementPercentage}%</span>
                          {isBest && compareColleges.length >= 2 && (
                            <Trophy className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - compareColleges.length }).map((_, i) => (
                    <td key={i} className="p-4 text-muted-foreground/30 font-light">-</td>
                  ))}
                </tr>

                {/* 7. Courses offered */}
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-semibold text-muted-foreground flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>Featured Courses</span>
                  </td>
                  {compareColleges.map((col) => (
                    <td key={col.id} className="p-4 text-xs font-medium text-muted-foreground leading-relaxed">
                      <ul className="list-disc pl-4 space-y-1">
                        {col.courses && col.courses.map((crs) => (
                          <li key={crs.id} className="text-foreground">
                            {crs.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareColleges.length }).map((_, i) => (
                    <td key={i} className="p-4 text-muted-foreground/30 font-light">-</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty comparison placeholder */
        <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-border rounded-2xl max-w-xl mx-auto bg-card shadow-inner space-y-5">
          <div className="h-18 w-18 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center">
            <GitCompare className="h-9 w-9" />
          </div>
          <h3 className="text-2xl font-black text-foreground">Select Colleges to Start</h3>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
            Click the slots above to search and select colleges. We will immediately build a side-by-side dashboard highlighting the best options.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-sm text-muted-foreground animate-pulse font-semibold">Loading Compare Dashboard...</span>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
