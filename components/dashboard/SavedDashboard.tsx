'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { 
  Bookmark, 
  GitCompare, 
  Trash2, 
  ExternalLink, 
  Star, 
  MapPin, 
  Landmark, 
  FolderHeart, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { mockColleges } from '@/lib/mockData';
import { College } from '@/types';
import { CollegeCard } from '@/components/college/CollegeCard';

interface SavedComparisonItem {
  id: string;
  userId: string;
  collegeIds: string[];
}

export function SavedDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'colleges' | 'comparisons'>('colleges');
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync Zustand saved ids
  const setSavedCollegeIds = useStore((state) => state.setSavedCollegeIds);
  const isAuroraMode = useStore((state) => state.isAuroraMode);

  const fetchSavedItems = async () => {
    try {
      const res = await fetch('/api/saved');
      if (res.ok) {
        const data = await res.json();
        setSavedColleges(data.savedColleges || []);
        setSavedComparisons(data.savedComparisons || []);
        
        // Sync local cache in Zustand store
        const ids = (data.savedColleges || []).map((c: College) => c.id);
        setSavedCollegeIds(ids);
      }
    } catch (err) {
      console.error("Error fetching saved items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const handleRemoveCollege = async (collegeId: string) => {
    // Optimistic update
    setSavedColleges(savedColleges.filter((c) => c.id !== collegeId));
    try {
      await fetch(`/api/saved?id=${collegeId}`, { method: 'DELETE' });
      fetchSavedItems(); // Refresh just in case
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveComparison = async (comparisonId: string) => {
    setSavedComparisons(savedComparisons.filter((c) => c.id !== comparisonId));
    try {
      await fetch(`/api/saved?comparisonId=${comparisonId}`, { method: 'DELETE' });
      fetchSavedItems();
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to map comparison IDs to college objects for rendering previews
  const getComparisonCollegesObj = (ids: string[]) => {
    if (!ids || !Array.isArray(ids)) return [];
    return ids.map(id => mockColleges.find(c => c.id === id)).filter(Boolean) as College[];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground font-semibold">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Tab Controllers */}
      <div className={`flex border-b ${isAuroraMode ? 'border-white/5' : 'border-border'}`}>
        <button
          onClick={() => setActiveTab('colleges')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'colleges'
              ? 'border-primary text-primary'
              : isAuroraMode
                ? 'border-transparent text-slate-400 hover:text-white'
                : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bookmark className="h-4.5 w-4.5" />
          <span>Saved Colleges ({savedColleges.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('comparisons')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'comparisons'
              ? 'border-primary text-primary'
              : isAuroraMode
                ? 'border-transparent text-slate-400 hover:text-white'
                : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <GitCompare className="h-4.5 w-4.5" />
          <span>Saved Comparisons ({savedComparisons.length})</span>
        </button>
      </div>

      {/* 2. Colleges Tab Content */}
      {activeTab === 'colleges' && (
        savedColleges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {savedColleges.map((college) => (
              <div key={college.id} className={`relative group rounded-3xl transition-all duration-300 ${
                isAuroraMode ? 'aurora-glow-card' : 'hover:shadow-md hover:-translate-y-1'
              }`}>
                <CollegeCard college={college} />
                {/* Specific Dashboard Delete Button Overlay */}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveCollege(college.id)}
                  className="absolute bottom-5 left-5 z-25 rounded-xl font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove Bookmark</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className={`flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-2xl text-center space-y-4 max-w-sm mx-auto shadow-inner ${
            isAuroraMode ? 'bg-slate-900/20 border-white/10 text-white' : 'bg-card border-border/80'
          }`}>
            <div className="h-12 w-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center">
              <Bookmark className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Bookmarked Colleges</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              Explore our directories, filters, and college cards, and click the heart icon to save colleges here.
            </p>
            <Link href="/colleges">
              <Button size="sm" className="bg-primary text-primary-foreground font-semibold rounded-xl mt-1 cursor-pointer">
                Explore Directory
              </Button>
            </Link>
          </div>
        )
      )}

      {/* 3. Comparisons Tab Content */}
      {activeTab === 'comparisons' && (
        savedComparisons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {savedComparisons.map((comp) => {
              const compColleges = getComparisonCollegesObj(comp.collegeIds);
              const comparisonUrl = `/compare?colleges=${compColleges.map(c => c.slug).join(',')}`;
              
              return (
                <Card 
                  key={comp.id}
                  className={`p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between border ${
                    isAuroraMode 
                      ? 'bg-slate-900/60 border-white/5 shadow-lg shadow-black/10 hover:border-primary/45 hover:-translate-y-1 backdrop-blur-md' 
                      : 'bg-card border-border/80 shadow-sm hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                        isAuroraMode ? 'bg-primary/20 text-indigo-300' : 'bg-primary/10 text-primary'
                      }`}>
                        {compColleges.length} Colleges Compared
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveComparison(comp.id)}
                        className={`h-8 w-8 rounded-lg text-muted-foreground transition-colors border cursor-pointer ${
                          isAuroraMode ? 'border-white/5 hover:bg-destructive/10 hover:text-destructive' : 'border-border/40 hover:bg-destructive/10 hover:text-destructive'
                        }`}
                        aria-label="Delete comparison"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Previews of colleges */}
                    <div className="space-y-3 mt-4">
                      {compColleges.map((c) => (
                        <div key={c.id} className="flex items-center space-x-3 text-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={c.image}
                            alt={c.name}
                            className="h-8 w-8 object-cover rounded-lg bg-muted border shrink-0"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/college-fallback.png';
                            }}
                          />
                          <div className="min-w-0 flex-grow">
                            <span className="font-bold text-xs text-foreground block truncate">{c.name}</span>
                            <span className="text-[9px] text-muted-foreground flex items-center mt-0.5">
                              <MapPin className="h-2.5 w-2.5 mr-0.5 text-primary" /> {c.location}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <CardFooter className="p-0 pt-5 mt-5 border-t border-border/30 flex justify-end">
                    <Link href={comparisonUrl}>
                      <Button size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl gap-1">
                        <span>Launch Compare Grid</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className={`flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-2xl text-center space-y-4 max-w-sm mx-auto shadow-inner ${
            isAuroraMode ? 'bg-slate-900/20 border-white/10 text-white' : 'bg-card border-border/80'
          }`}>
            <div className="h-12 w-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center">
              <GitCompare className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Saved Comparisons</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              Use the comparison dashboard, select colleges, and save your comparison views for future access.
            </p>
            <Link href="/compare">
              <Button size="sm" className="bg-primary text-primary-foreground font-semibold rounded-xl mt-1 cursor-pointer">
                Open Compare Tool
              </Button>
            </Link>
          </div>
        )
      )}
    </div>
  );
}
export default SavedDashboard;
