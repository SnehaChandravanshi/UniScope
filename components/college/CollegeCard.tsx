'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Heart, GitCompare, Star, MapPin, Landmark, ArrowRight, TrendingUp } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatINR, formatLPA } from '@/lib/utils';
import { College } from '@/types';

interface CollegeCardProps {
  college: College;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Zustand store links
  const compareColleges = useStore((state) => state.compareColleges);
  const addToCompare = useStore((state) => state.addToCompare);
  const removeFromCompare = useStore((state) => state.removeFromCompare);
  
  const savedCollegeIds = useStore((state) => state.savedCollegeIds);
  const toggleSavedCollegeIdLocal = useStore((state) => state.toggleSavedCollegeIdLocal);

  const isCompared = compareColleges.some((c) => c.id === college.id);
  const isSaved = savedCollegeIds.includes(college.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCompared) {
      removeFromCompare(college.id);
    } else {
      addToCompare(college);
    }
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }

    // Toggle local state optimistically
    toggleSavedCollegeIdLocal(college.id);

    try {
      if (isSaved) {
        await fetch(`/api/saved?id=${college.id}`, { method: 'DELETE' });
      } else {
        await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'college', collegeId: college.id }),
        });
      }
    } catch (err) {
      console.error("Error saving/removing college:", err);
    }
  };

  // Extract first 2 courses
  const topCourses = college.courses?.slice(0, 2) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
      {/* College Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-muted shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={college.image}
          alt={college.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/college-fallback.png';
          }}
        />
        
        {/* Gradients and Top Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-base font-bold text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{college.rating.toFixed(1)}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-base font-semibold text-white">
            <Landmark className="h-3 w-3" />
            <span>{college.ownershipType}</span>
          </span>
        </div>

        {/* Action icons on image */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSaveClick}
            className={`h-9 w-9 rounded-xl backdrop-blur-md border border-white/10 transition-colors ${
              isSaved 
                ? 'bg-rose-500 text-white hover:bg-rose-600' 
                : 'bg-black/60 text-white hover:bg-black/80'
            }`}
            aria-label="Save College"
          >
            <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCompareClick}
            className={`h-9 w-9 rounded-xl backdrop-blur-md border border-white/10 transition-colors ${
              isCompared 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-black/60 text-white hover:bg-black/80'
            }`}
            aria-label="Compare College"
          >
            <GitCompare className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* Placement statistics preview */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between text-white">
          {college.ranking && (
            <span className="text-xs font-semibold tracking-wide bg-primary/90 px-2 py-0.5 rounded-md">
              {college.ranking}
            </span>
          )}
        </div>
      </div>

      {/* College Info Section */}
      <CardHeader className="p-5 pb-3 flex-grow">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/college/${college.slug}`} className="hover:text-primary transition-colors">
            <h3 className="font-bold text-xl sm:text-2xl leading-tight tracking-tight text-foreground line-clamp-2">
              {college.name}
            </h3>
          </Link>
        </div>
        <div className="flex items-center text-base text-muted-foreground mt-1.5">
          <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-primary/70" />
          <span className="line-clamp-1">{college.location}</span>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-0 flex-shrink-0">
        <hr className="border-border/50 mb-3.5" />

        {/* Highlight Placement Block */}
        <div className="grid grid-cols-2 gap-2 bg-muted/40 p-2.5 rounded-xl border border-border/30 mb-3 text-base">
          <div>
            <span className="text-sm text-muted-foreground block">Avg Package</span>
            <span className="font-extrabold text-foreground flex items-center gap-1 mt-0.5 text-base sm:text-lg">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              {formatLPA(college.placementStats.averagePackage)}
            </span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block">Placement Rate</span>
            <span className="font-extrabold text-foreground block mt-0.5 text-base sm:text-lg">
              {college.placementStats.placementPercentage}%
            </span>
          </div>
        </div>

        {/* Top Courses Offered */}
        {topCourses.length > 0 && (
          <div className="space-y-1.5 mb-4">
            <span className="text-sm text-muted-foreground block">Top Courses</span>
            <div className="flex flex-wrap gap-1.5">
              {topCourses.map((crs) => (
                <span 
                  key={crs.id} 
                  className="inline-block text-xs sm:text-sm font-semibold bg-secondary text-secondary-foreground border border-secondary-foreground/10 px-2.5 py-0.5 rounded-md truncate max-w-[150px]"
                >
                  {crs.name.split(' ').slice(0, 3).join(' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Pricing and Details Redirect */}
      <CardFooter className="p-5 pt-0 mt-auto shrink-0 flex items-center justify-between border-t border-border/30 bg-muted/10">
        <div className="pt-3">
          <span className="text-sm text-muted-foreground block leading-none">Average Fees</span>
          <span className="text-lg sm:text-xl font-extrabold text-foreground leading-tight">
            {formatINR(college.fees)}<span className="text-sm font-normal text-muted-foreground">/yr</span>
          </span>
        </div>
        <Link href={`/college/${college.slug}`} className="pt-3">
          <Button size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 rounded-xl group/btn flex items-center gap-1 text-sm sm:text-base">
            <span>Details</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
      </Card>
    </motion.div>
  );
}
export default CollegeCard;
