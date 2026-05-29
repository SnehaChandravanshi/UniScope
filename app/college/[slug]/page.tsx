import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollegeBySlug } from '@/services/collegeService';
import { CollegeDetailTabs } from '@/components/college/CollegeDetailTabs';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  MapPin, 
  Landmark, 
  ArrowLeft, 
  TrendingUp, 
  Award, 
  Percent, 
  Bookmark,
  Building2,
  CalendarCheck2
} from 'lucide-react';
import { formatINR, formatLPA } from '@/lib/utils';
import { Card } from '@/components/ui/card';


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const college = await getCollegeBySlug(slug);
  
  if (!college) {
    return {
      title: 'College Not Found | UniScope',
    };
  }

  return {
    title: `${college.name} - Fees, Placements, Reviews | UniScope`,
    description: `Learn more about ${college.name} in ${college.location}. Check course lists, fee structures, highest packages, average placement records, and reviews.`,
  };
}

export default async function CollegeDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const college = await getCollegeBySlug(slug);

  if (!college) {
    notFound();
  }

  return (
    <div className="w-full">
      {/* 1. cover image banner */}
      <div className="relative h-64 sm:h-96 bg-muted overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Navigation back and details */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <div>
            <Link href="/colleges">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-xl font-semibold gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Directory</span>
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/95 text-primary-foreground text-xs font-semibold px-3 py-1">
                <Award className="h-3.5 w-3.5" />
                <span>{college.ranking || 'Top Rated'}</span>
              </span>
              {college.accreditation && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 border border-white/15">
                  <span>{college.accreditation}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {college.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-indigo-100 font-medium">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-primary shrink-0" />
                <span>{college.location}</span>
              </div>
              <div className="flex items-center">
                <Landmark className="h-4 w-4 mr-1 text-primary shrink-0" />
                <span>{college.ownershipType} University</span>
              </div>
              <div className="flex items-center gap-0.5 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="font-bold text-white ml-0.5">{college.rating.toFixed(1)}</span>
                <span>/ 5.0 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Page Grid */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Tab contents */}
          <div className="lg:col-span-3">
            <CollegeDetailTabs college={college} />
          </div>

          {/* Right Column: Sticky Quick Actions Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-bold text-lg text-foreground mb-4">Admissions & Info</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-primary" /> Fees (Avg)
                    </span>
                    <span className="font-bold text-foreground">{formatINR(college.fees)} / yr</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-primary" /> Avg Package
                    </span>
                    <span className="font-bold text-foreground">{formatLPA(college.placementStats.averagePackage)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Percent className="h-4 w-4 text-primary" /> Placement Rate
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{college.placementStats.placementPercentage}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-5 rounded-xl flex items-center gap-2">
                    <CalendarCheck2 className="h-4.5 w-4.5" />
                    <span>Apply for Admission</span>
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center">
                    Clicking applies through the common counseling portal. No application fees required for demo session.
                  </p>
                </div>
              </Card>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
