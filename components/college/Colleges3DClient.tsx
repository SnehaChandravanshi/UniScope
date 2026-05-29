'use client';

import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { CollegeCard } from '@/components/college/CollegeCard';
import { FilterSidebar } from '@/components/college/FilterSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Grid3X3, SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { College } from '@/types';

interface Colleges3DClientProps {
  colleges: College[];
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  activeSort: 'rating' | 'fees' | 'placement';
  activeOrder: 'asc' | 'desc';
  filterParams: Record<string, string>;
}

export function Colleges3DClient({
  colleges,
  total,
  currentPage,
  limit,
  totalPages,
  activeSort,
  activeOrder,
  filterParams,
}: Colleges3DClientProps) {
  const isAuroraMode = useStore((state) => state.isAuroraMode);

  // Build sort link on the client side
  const getSortLink = (sortBy: 'rating' | 'fees' | 'placement') => {
    const params = new URLSearchParams(filterParams);
    let targetOrder = 'desc';
    if (activeSort === sortBy) {
      targetOrder = activeOrder === 'desc' ? 'asc' : 'desc';
    } else if (sortBy === 'fees') {
      targetOrder = 'asc';
    }
    params.set('sortBy', sortBy);
    params.set('sortOrder', targetOrder);
    params.delete('page');
    return `/colleges?${params.toString()}`;
  };

  // Build page link on the client side
  const getPageLink = (pageNumber: number) => {
    const params = new URLSearchParams(filterParams);
    params.set('page', String(pageNumber));
    return `/colleges?${params.toString()}`;
  };

  return (
    <div className="mx-auto w-full px-4 sm:px-8 lg:px-12 py-10">
      {/* 1. Header Details */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-6 mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isAuroraMode ? 'text-white' : 'text-foreground'}`}>
            Explore Colleges
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed font-semibold">
            Showing {colleges.length > 0 ? (currentPage - 1) * limit + 1 : 0} - {Math.min(currentPage * limit, total)} of {total} institutions matching filters
          </p>
        </div>

        {/* Sorting controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-bold mr-1">Sort by:</span>
          
          <Link href={getSortLink('rating')}>
            <Button 
              variant={activeSort === 'rating' ? 'default' : 'outline'} 
              size="sm"
              className={`rounded-xl font-bold text-xs py-1 px-3 h-8 transition-all cursor-pointer ${
                isAuroraMode && activeSort !== 'rating' ? 'border-white/10 text-slate-350 hover:bg-white/10' : ''
              }`}
            >
              Rating {activeSort === 'rating' && (activeOrder === 'desc' ? '▼' : '▲')}
            </Button>
          </Link>

          <Link href={getSortLink('fees')}>
            <Button 
              variant={activeSort === 'fees' ? 'default' : 'outline'} 
              size="sm"
              className={`rounded-xl font-bold text-xs py-1 px-3 h-8 transition-all cursor-pointer ${
                isAuroraMode && activeSort !== 'fees' ? 'border-white/10 text-slate-350 hover:bg-white/10' : ''
              }`}
            >
              Fees {activeSort === 'fees' && (activeOrder === 'desc' ? '▼' : '▲')}
            </Button>
          </Link>

          <Link href={getSortLink('placement')}>
            <Button 
              variant={activeSort === 'placement' ? 'default' : 'outline'} 
              size="sm"
              className={`rounded-xl font-bold text-xs py-1 px-3 h-8 transition-all cursor-pointer ${
                isAuroraMode && activeSort !== 'placement' ? 'border-white/10 text-slate-350 hover:bg-white/10' : ''
              }`}
            >
              Placements {activeSort === 'placement' && (activeOrder === 'desc' ? '▼' : '▲')}
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Main Listing Container */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Desktop Sticky Filter Sidebar */}
        <aside className={`hidden lg:block lg:col-span-1 self-start sticky top-24 ${
          isAuroraMode ? 'bg-slate-900/40 p-4 border border-white/5 rounded-3xl backdrop-blur-md shadow-lg shadow-black/10' : ''
        }`}>
          <FilterSidebar />
        </aside>

        {/* Right Column: Listing Grid */}
        <section className="lg:col-span-4 space-y-8 flex flex-col">
          {/* Mobile Filter Button */}
          <div className={`flex lg:hidden justify-between items-center p-3 rounded-2xl border ${
            isAuroraMode ? 'bg-slate-900/40 border-white/10' : 'bg-muted/30 border-border/50'
          }`}>
            <span className="text-xs font-semibold text-muted-foreground">Adjust filters</span>
            <Dialog>
              <DialogTrigger render={
                <Button size="sm" variant="outline" className={`rounded-xl gap-2 h-8 text-xs font-bold shadow-sm cursor-pointer ${
                  isAuroraMode ? 'border-white/10 hover:bg-white/10 hover:text-white' : ''
                }`} />
              }>
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Show Filters</span>
              </DialogTrigger>
              <DialogContent className="max-w-[340px] p-0 overflow-hidden border-0 rounded-2xl bg-card">
                <FilterSidebar />
              </DialogContent>
            </Dialog>
          </div>

          {/* Cards Grid */}
          {colleges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {colleges.map((college) => (
                <div key={college.id} className="h-full">
                  <div className={`h-full rounded-3xl transition-all duration-300 ${
                    isAuroraMode 
                      ? 'aurora-glow-card' 
                      : 'hover:shadow-md hover:-translate-y-1'
                  }`}>
                    <CollegeCard college={college} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className={`flex flex-col items-center justify-center py-20 px-4 border border-dashed rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-8 shadow-inner ${
              isAuroraMode ? 'bg-slate-900/20 border-white/10 text-white' : 'bg-card border-border'
            }`}>
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                <Grid3X3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">No Colleges Found</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We couldn&apos;t find any colleges matching your selected filters. Try adjusting your search keyword, changing the fee sliders, or picking a different stream.
              </p>
              <Link href="/colleges">
                <Button className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl mt-2 cursor-pointer">
                  Reset All Filters
                </Button>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/40 pt-6 mt-auto">
              <Link href={currentPage > 1 ? getPageLink(currentPage - 1) : '#'}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage <= 1}
                  className={`rounded-xl font-bold gap-1 shadow-sm disabled:opacity-50 cursor-pointer ${
                    isAuroraMode ? 'border-white/10 hover:bg-white/10 hover:text-white bg-slate-900/30' : ''
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              </Link>

              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNum = index + 1;
                  const active = pageNum === currentPage;
                  return (
                    <Link key={pageNum} href={getPageLink(pageNum)}>
                      <Button
                        variant={active ? 'default' : 'ghost'}
                        size="icon"
                        className={`h-8 w-8 rounded-lg text-xs font-bold cursor-pointer ${
                          active 
                            ? 'bg-primary text-primary-foreground' 
                            : isAuroraMode 
                              ? 'text-slate-400 hover:bg-white/10 hover:text-white' 
                              : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {pageNum}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              <Link href={currentPage < totalPages ? getPageLink(currentPage + 1) : '#'}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage >= totalPages}
                  className={`rounded-xl font-bold gap-1 shadow-sm disabled:opacity-50 cursor-pointer ${
                    isAuroraMode ? 'border-white/10 hover:bg-white/10 hover:text-white bg-slate-900/30' : ''
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
export default Colleges3DClient;
