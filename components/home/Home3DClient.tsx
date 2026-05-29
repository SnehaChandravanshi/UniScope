'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitCompare, 
  GraduationCap, 
  ArrowRight, 
  Building2, 
  TrendingUp, 
  Percent, 
  Users, 
  Quote, 
  Award,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollegeCard } from '@/components/college/CollegeCard';
import { HomeSearch } from '@/components/home/HomeSearch';
import { College } from '@/types';
import { useStore } from '@/store/useStore';

interface Home3DClientProps {
  featuredColleges: College[];
}

function PremiumGlowCard({ children, className = '', onClick, active }: { children: React.ReactNode; className?: string; onClick?: () => void; active: boolean }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl transition-all duration-300 ${
        active 
          ? 'aurora-glow-card' 
          : 'bg-card border border-border shadow-sm hover:shadow-md hover:-translate-y-1'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function Home3DClient({ featuredColleges }: Home3DClientProps) {
  const router = useRouter();
  const isAuroraMode = useStore((state) => state.isAuroraMode);

  const stats = [
    { label: 'Verified Colleges', value: '150+', icon: Building2, color: 'text-indigo-400' },
    { label: 'Highest Package', value: '₹1.68 Cr', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Avg Placement Rate', value: '94%', icon: Percent, color: 'text-violet-400' },
    { label: 'Active Students', value: '45K+', icon: Users, color: 'text-indigo-400' },
  ];

  const categories = [
    {
      title: 'Engineering',
      description: 'Find top B.Tech courses in IITs, NITs, and premier private colleges.',
      badge: 'JEE / BITSAT',
      link: '/colleges?courseType=cse',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      iconColor: 'text-indigo-400'
    },
    {
      title: 'Management',
      description: 'Explore premier MBA/PGP courses at top business schools in India.',
      badge: 'CAT / GMAT',
      link: '/colleges?courseType=pgp',
      badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      iconColor: 'text-violet-400'
    },
    {
      title: 'Medical',
      description: 'Discover top MBBS and postgraduate medical institutes like AIIMS.',
      badge: 'NEET',
      link: '/colleges?courseType=mbbs',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
  ];

  const testimonials = [
    {
      name: 'Ananya Deshmukh',
      role: 'B.Tech Student, IIT Bombay',
      content: 'Comparing IIT Bombay and IIT Delhi was incredibly easy. The detailed placement statistics were completely accurate and helped me finalize my branch decision.',
      avatar: 'AD'
    },
    {
      name: 'Rohan Malhotra',
      role: 'MBA Candidate, IIM Ahmedabad',
      content: 'The Rank Predictor tool was a lifesaver. It accurately forecasted which IIMs I had a shot at based on my CAT percentile, saving me weeks of anxiety.',
      avatar: 'RM'
    }
  ];

  return (
    <div className={`flex flex-col w-full pb-20 transition-all duration-500 ${
      isAuroraMode ? 'bg-[#07080e] text-slate-100 dark' : 'bg-background text-foreground'
    }`}>
      
      {/* 1. HERO SECTION */}
      <section className="relative z-10 pt-20 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            isAuroraMode 
              ? 'bg-primary/15 border-primary/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
              : 'bg-primary/10 border-primary/20 text-primary'
          }`}>
            <Award className="h-4 w-4 text-primary animate-pulse" />
            <span>Platform Updates: 2026 Placements Data Live</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] max-w-3xl mx-auto">
            Discover Your Perfect College{' '}
            <span className={`bg-gradient-to-r from-primary via-indigo-450 to-primary bg-clip-text text-transparent ${
              isAuroraMode ? 'drop-shadow-[0_0_20px_rgba(99,102,241,0.25)]' : ''
            }`}>
              With Certainty
            </span>
          </h1>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-semibold transition-colors ${
            isAuroraMode ? 'text-slate-350' : 'text-muted-foreground'
          }`}>
            Search, compare, and filter India&apos;s leading institutions. Predict your admission chances based on your entrance ranks with our analytics-backed advisor.
          </p>

          {/* Hologram Glassmorphic Search Slab */}
          <div className="pt-6 pb-2 w-full max-w-2xl mx-auto">
            <div className={`rounded-2xl p-3 border transition-all duration-300 ${
              isAuroraMode 
                ? 'bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:border-primary/50' 
                : 'bg-background/80 backdrop-blur-md border-border/80 shadow-lg'
            }`}>
              <HomeSearch />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Link href="/colleges">
              <Button size="lg" className="bg-primary hover:bg-primary/95 text-primary-foreground font-black px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer">
                <span>Browse Colleges</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/compare">
              <Button size="lg" variant="outline" className={`font-black px-6 rounded-xl flex items-center gap-2 cursor-pointer ${
                isAuroraMode ? 'border-white/10 text-white hover:bg-white/10 hover:text-white bg-slate-900/30' : ''
              }`}>
                <GitCompare className="h-4 w-4 text-primary" />
                <span>Compare Side-by-Side</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="relative z-20 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 -mt-6 mb-24">
        <div className={`grid grid-cols-2 gap-4 md:grid-cols-4 p-6 rounded-3xl transition-all duration-500 border ${
          isAuroraMode 
            ? 'bg-slate-900/50 backdrop-blur-xl border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
            : 'bg-background border-border/80 shadow-xl shadow-primary/5'
        }`}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <PremiumGlowCard active={isAuroraMode} key={stat.label}>
                <div className={`flex items-center space-x-4 p-4 rounded-2xl h-full border transition-all ${
                  isAuroraMode 
                    ? 'bg-slate-950/40 border-white/5 hover:border-primary/20 hover:bg-slate-950/80 shadow-sm' 
                    : 'bg-muted/10 border-transparent hover:border-primary/20 hover:bg-muted/20'
                }`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className={`text-2xl font-black leading-none ${isAuroraMode ? 'text-white' : 'text-foreground'}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-bold mt-1.5">{stat.label}</p>
                  </div>
                </div>
              </PremiumGlowCard>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED COLLEGES */}
      <section className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isAuroraMode ? 'text-white' : 'text-foreground'}`}>
              Featured Top Institutions
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed font-semibold">
              Explore highly rated institutions in engineering, business, and medicine.
            </p>
          </div>
          <Link href="/colleges">
            <Button variant="ghost" className="font-bold text-primary hover:text-primary hover:bg-primary/5 gap-1 shrink-0 cursor-pointer">
              <span>View All Colleges</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredColleges.map((college) => (
            <div key={college.id} className="h-full">
              <PremiumGlowCard active={isAuroraMode} className="h-full">
                <div className={`h-full rounded-3xl ${
                  isAuroraMode 
                    ? 'bg-slate-900/60 border border-white/5 hover:border-primary/30' 
                    : ''
                }`}>
                  <CollegeCard college={college} />
                </div>
              </PremiumGlowCard>
            </div>
          ))}
        </div>
      </section>

      {/* 4. STREAM CATEGORIES */}
      <section className={`relative z-10 py-20 border-y mb-24 w-full ${
        isAuroraMode ? 'bg-slate-900/20 border-white/5' : 'bg-muted/40 border-border/50'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isAuroraMode ? 'text-white' : 'text-foreground'}`}>
              Explore by Academic Streams
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
              Quickly browse colleges offering specialized courses aligned with major national examinations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map((cat) => (
              <PremiumGlowCard active={isAuroraMode} key={cat.title} className="h-full">
                <div className={`group relative p-6 rounded-3xl h-full border transition-all duration-300 flex flex-col justify-between ${
                  isAuroraMode 
                    ? 'bg-slate-900/40 border-white/5 hover:border-primary/30 hover:bg-slate-900/80 shadow-lg' 
                    : 'bg-background border-border/70 shadow-sm hover:shadow-lg'
                }`}>
                  <div className="space-y-4">
                    <div className={`inline-flex items-center rounded-lg border text-[10px] font-black tracking-wider uppercase px-2.5 py-1 ${cat.badgeColor}`}>
                      {cat.badge}
                    </div>
                    <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
                      {cat.title} Courses
                    </h3>
                    <p className={`text-sm leading-relaxed transition-colors ${isAuroraMode ? 'text-slate-350' : 'text-muted-foreground'}`}>
                      {cat.description}
                    </p>
                  </div>
                  <div className="pt-6">
                    <Link href={cat.link}>
                      <Button variant="ghost" className="w-full justify-between font-bold p-0 hover:bg-transparent text-primary hover:text-primary/95 group-hover:translate-x-0.5 transition-all cursor-pointer">
                        <span>Explore stream</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </PremiumGlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DUAL CTA PROMOTION: COMPARE & PREDICTOR */}
      <section className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Compare banner */}
          <PremiumGlowCard active={isAuroraMode}>
            <div className={`p-8 rounded-3xl shadow-xl flex flex-col justify-between min-h-[300px] border ${
              isAuroraMode 
                ? 'bg-gradient-to-br from-indigo-950/80 to-slate-950/80 border-indigo-500/20 shadow-indigo-950/20' 
                : 'bg-gradient-to-br from-indigo-900 to-indigo-950 border-transparent'
            }`}>
              <div className="space-y-4 max-w-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-indigo-300">
                  <GitCompare className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  Stuck Between Options?
                </h3>
                <p className="text-indigo-200/90 text-sm leading-relaxed font-semibold">
                  Compare up to 3 colleges side-by-side. Highlight best values based on annual fees, average placements, ratings, and locations instantly.
                </p>
              </div>
              <div className="pt-6">
                <Link href="/compare">
                  <Button className="bg-white text-indigo-950 hover:bg-indigo-50 font-bold px-6 py-5 rounded-xl shadow-md cursor-pointer">
                    Compare Colleges Now
                  </Button>
                </Link>
              </div>
            </div>
          </PremiumGlowCard>

          {/* Predictor banner */}
          <PremiumGlowCard active={isAuroraMode}>
            <div className={`p-8 rounded-3xl shadow-xl flex flex-col justify-between min-h-[300px] border ${
              isAuroraMode 
                ? 'bg-gradient-to-br from-purple-950/80 to-slate-950/80 border-purple-500/20 shadow-purple-950/20' 
                : 'bg-gradient-to-br from-primary to-indigo-900 border-transparent'
            }`}>
              <div className="space-y-4 max-w-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-indigo-200">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  Admission Rank Predictor
                </h3>
                <p className="text-indigo-100/90 text-sm leading-relaxed font-semibold">
                  Input your exam (JEE Main, NEET, CAT) and your ranking score. Find matching colleges based on cutoff parameters and past years trends.
                </p>
              </div>
              <div className="pt-6">
                <Link href="/predictor">
                  <Button className="bg-white text-primary hover:bg-indigo-50 font-bold px-6 py-5 rounded-xl shadow-md cursor-pointer">
                    Launch Predictor Tool
                  </Button>
                </Link>
              </div>
            </div>
          </PremiumGlowCard>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="relative z-10 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isAuroraMode ? 'text-white' : 'text-foreground'}`}>
            Trusted by Thousands of Students
          </h2>
          <p className="text-sm text-muted-foreground font-semibold">
            See how prospective students used UniScope to clear confusion and select their campus.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((test) => (
            <PremiumGlowCard active={isAuroraMode} key={test.name}>
              <div className={`p-6 rounded-3xl space-y-4 relative border transition-all duration-300 ${
                isAuroraMode 
                  ? 'bg-slate-900/40 border-white/5 shadow-lg' 
                  : 'bg-card border-border/80 shadow-sm'
              }`}>
                <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />
                <p className={`text-sm leading-relaxed italic transition-colors font-medium ${isAuroraMode ? 'text-slate-350' : 'text-muted-foreground'}`}>
                  &ldquo;{test.content}&rdquo;
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-sm">
                    {test.avatar}
                  </div>
                  <div>
                    <h4 className={`text-sm font-black leading-none ${isAuroraMode ? 'text-white' : 'text-foreground'}`}>{test.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1.5 font-bold">{test.role}</p>
                  </div>
                </div>
              </div>
            </PremiumGlowCard>
          ))}
        </div>
      </section>
    </div>
  );
}
export default Home3DClient;
