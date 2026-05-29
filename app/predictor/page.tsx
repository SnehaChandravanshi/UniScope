'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  GraduationCap, 
  HelpCircle, 
  ChevronRight, 
  TrendingUp, 
  Building2, 
  Award,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockColleges } from '@/lib/mockData';
import { useStore } from '@/store/useStore';
import { College } from '@/types';
import { CollegeCard } from '@/components/college/CollegeCard';

const EXAMS = [
  { id: 'JEE', label: 'JEE Main (Engineering)' },
  { id: 'NEET', label: 'NEET (Medical)' },
  { id: 'CAT', label: 'CAT (Management)' }
];

const CATEGORIES = [
  { id: 'General', label: 'General / Open' },
  { id: 'OBC', label: 'OBC-NCL' },
  { id: 'SC', label: 'Scheduled Caste (SC)' },
  { id: 'ST', label: 'Scheduled Tribe (ST)' }
];

// Zod Validation Schema
const predictorSchema = z.object({
  exam: z.enum(['JEE', 'NEET', 'CAT']),
  category: z.enum(['General', 'OBC', 'SC', 'ST']),
  rank: z.number({ message: 'Please enter a valid rank/percentile' })
    .int('Rank must be a whole number')
    .positive('Rank must be a positive number')
});

type PredictorFormValues = z.infer<typeof predictorSchema>;

interface PredictionResult {
  college: College;
  chance: 'Safety' | 'Target' | 'Reach';
  chanceColor: string;
  courseName: string;
  cutoffRank: number;
}

export default function PredictorPage() {
  const isAuroraMode = useStore((state) => state.isAuroraMode);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PredictorFormValues>({
    resolver: zodResolver(predictorSchema),
    defaultValues: {
      exam: 'JEE',
      category: 'General',
    }
  });

  const selectedExam = watch('exam');

  const onSubmit = (data: PredictorFormValues) => {
    const userRank = data.rank;
    const matches: PredictionResult[] = [];

    // Mock Cutoff Ranges based on mockColleges
    // For general category. Adjust slightly for OBC/SC/ST (+25% OBC, +60% SC, +100% ST cutoffs)
    let categoryMultiplier = 1;
    if (data.category === 'OBC') categoryMultiplier = 1.35;
    if (data.category === 'SC') categoryMultiplier = 1.9;
    if (data.category === 'ST') categoryMultiplier = 2.5;

    if (data.exam === 'JEE') {
      const jeeCutoffs: Record<string, { rank: number; course: string }> = {
        'col-iitb': { rank: 1200, course: 'B.Tech Computer Science and Engineering' },
        'col-iitd': { rank: 2200, course: 'B.Tech Computer Science and Engineering' },
        'col-iitm': { rank: 3000, course: 'B.Tech Computer Science and Engineering' },
        'col-iitk': { rank: 3500, course: 'B.Tech Computer Science and Engineering' },
        'col-iitkgp': { rank: 4000, course: 'B.Tech Computer Science and Engineering' },
        'col-iitr': { rank: 4500, course: 'B.Tech Computer Science and Engineering' },
        'col-iitg': { rank: 5500, course: 'B.Tech Computer Science and Engineering' },
        'col-iith': { rank: 6000, course: 'B.Tech Computer Science and Engineering' },
        'col-iiith': { rank: 6500, course: 'B.Tech Computer Science and Engineering' },
        'col-bits': { rank: 11000, course: 'B.E. Computer Science' },
        'col-nitk': { rank: 12000, course: 'B.Tech Computer Science and Engineering' },
        'col-nitt': { rank: 14000, course: 'B.Tech Computer Science and Engineering' },
        'col-nitr': { rank: 18000, course: 'B.Tech Computer Science and Engineering' },
        'col-dtu': { rank: 22000, course: 'B.Tech Computer Science and Engineering' },
        'col-vit': { rank: 35000, course: 'B.Tech Computer Science and Engineering' }
      };

      Object.entries(jeeCutoffs).forEach(([collegeId, info]) => {
        const college = mockColleges.find((c) => c.id === collegeId);
        if (!college) return;

        const baseCutoff = info.rank;
        const adjustedCutoff = Math.round(baseCutoff * categoryMultiplier);

        // Compute matching criteria
        // Safety: Rank is less than 80% of adjusted cutoff (e.g. cutoff is 2000, rank is 1500)
        // Target: Rank is within 80% to 110% of adjusted cutoff
        // Reach: Rank is within 110% to 135% of adjusted cutoff (challenging but possible in round 3)
        if (userRank <= adjustedCutoff * 0.8) {
          matches.push({
            college,
            chance: 'Safety',
            chanceColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            courseName: info.course,
            cutoffRank: adjustedCutoff
          });
        } else if (userRank <= adjustedCutoff * 1.1) {
          matches.push({
            college,
            chance: 'Target',
            chanceColor: 'bg-indigo-500/10 text-primary border-primary/20',
            courseName: info.course,
            cutoffRank: adjustedCutoff
          });
        } else if (userRank <= adjustedCutoff * 1.35) {
          matches.push({
            college,
            chance: 'Reach',
            chanceColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
            courseName: info.course,
            cutoffRank: adjustedCutoff
          });
        }
      });
    } else if (data.exam === 'NEET') {
      const neetCutoffs: Record<string, { rank: number; course: string }> = {
        'col-aiims': { rank: 80, course: 'MBBS (Medical Degree)' },
        'col-mamc': { rank: 180, course: 'MBBS (Medical Degree)' },
        'col-jipmer': { rank: 250, course: 'MBBS (Medical Degree)' },
        'col-cmc': { rank: 350, course: 'MBBS (Medical Degree)' },
        'col-kgmu': { rank: 700, course: 'MBBS (Medical Degree)' }
      };

      Object.entries(neetCutoffs).forEach(([collegeId, info]) => {
        const college = mockColleges.find((c) => c.id === collegeId);
        if (!college) return;

        const baseCutoff = info.rank;
        const adjustedCutoff = Math.round(baseCutoff * categoryMultiplier);

        if (userRank <= adjustedCutoff * 0.8) {
          matches.push({
            college,
            chance: 'Safety',
            chanceColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            courseName: info.course,
            cutoffRank: adjustedCutoff
          });
        } else if (userRank <= adjustedCutoff * 1.1) {
          matches.push({
            college,
            chance: 'Target',
            chanceColor: 'bg-indigo-500/10 text-primary border-primary/20',
            courseName: info.course,
            cutoffRank: adjustedCutoff
          });
        } else if (userRank <= adjustedCutoff * 1.3) {
          matches.push({
            college,
            chance: 'Reach',
            chanceColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
            courseName: info.course,
            cutoffRank: adjustedCutoff
          });
        }
      });
    } else if (data.exam === 'CAT') {
      // For CAT, we usually receive rank or percentile. Let's assume Rank.
      // If it is rank (1 to 2000), let's map:
      const catCutoffs: Record<string, { rank: number; course: string }> = {
        'col-iima': { rank: 400, course: 'PGP (MBA Equivalent)' },
        'col-iimb': { rank: 650, course: 'PGP (MBA)' },
        'col-iimc': { rank: 500, course: 'PGP (MBA Equivalent)' },
        'col-iiml': { rank: 800, course: 'PGP (MBA)' },
        'col-iimk': { rank: 950, course: 'PGP (MBA)' },
        'col-xlri': { rank: 900, course: 'PGP (MBA)' },
        'col-fms': { rank: 1200, course: 'MBA (Management)' }
      };

      Object.entries(catCutoffs).forEach(([collegeId, info]) => {
        const college = mockColleges.find((c) => c.id === collegeId);
        if (!college) return;

        const baseCutoff = info.rank;
        const adjustedCutoff = Math.round(baseCutoff * categoryMultiplier);

        if (userRank <= adjustedCutoff * 0.8) {
          matches.push({
            college,
            chance: 'Safety',
            chanceColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            courseName: info.course,
            cutoffRank: adjustedCutoff
          });
        } else if (userRank <= adjustedCutoff * 1.1) {
          matches.push({
            college,
            chance: 'Target',
            chanceColor: 'bg-indigo-500/10 text-primary border-primary/20',
            courseName: info.course,
            cutoffRank: adjustedCutoff
          });
        } else if (userRank <= adjustedCutoff * 1.35) {
          matches.push({
            college,
            chance: 'Reach',
            chanceColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
            courseName: info.course,
            cutoffRank: adjustedCutoff
          });
        }
      });
    }

    // Sort matches: Safety first, then Target, then Reach
    matches.sort((a, b) => {
      const order = { Safety: 1, Target: 2, Reach: 3 };
      return order[a.chance] - order[b.chance];
    });

    setResults(matches);
    setHasSearched(true);
  };

  // Group results
  const safetyColleges = results.filter((r) => r.chance === 'Safety');
  const targetColleges = results.filter((r) => r.chance === 'Target');
  const reachColleges = results.filter((r) => r.chance === 'Reach');

  return (
    <div className="mx-auto w-full px-4 sm:px-8 lg:px-12 py-10 space-y-10">
      {/* 1. Header Details */}
      <div className="border-b border-border/40 pb-6">
        <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span>Cutoff Predictor Tool</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-1.5 leading-relaxed font-medium">
          Predict your admission prospects for India&apos;s elite engineering, medical, and business programs. Enter your rank scores from national exams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Panel */}
        <div className="lg:col-span-1">
          <Card className={`rounded-2xl border sticky top-24 transition-all duration-300 ${
            isAuroraMode ? 'bg-slate-900/60 border-white/5 shadow-lg shadow-black/10 backdrop-blur-md' : 'bg-card border-border shadow-sm'
          }`}>
            <CardHeader className="pb-5">
              <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Eligibility Parameters</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Fill details based on your scorecard keys.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* 1. Exam Name */}
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-bold text-foreground">Select Entrance Exam</Label>
                  <Select 
                    defaultValue="JEE"
                    onValueChange={(val) => setValue('exam', val as any)}
                  >
                    <SelectTrigger className="rounded-xl border-border bg-background focus:ring-1 focus:ring-primary/20 text-base py-5">
                      <SelectValue placeholder="Select Exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAMS.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.exam && <p className="text-xs text-destructive font-semibold">{errors.exam.message}</p>}
                </div>

                {/* 2. Category */}
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-bold text-foreground">Category Seat Quota</Label>
                  <Select 
                    defaultValue="General"
                    onValueChange={(val) => setValue('category', val as any)}
                  >
                    <SelectTrigger className="rounded-xl border-border bg-background focus:ring-1 focus:ring-primary/20 text-base py-5">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-destructive font-semibold">{errors.category.message}</p>}
                </div>

                {/* 3. Rank */}
                <div className="space-y-2">
                  <Label htmlFor="predictor-rank" className="text-sm sm:text-base font-bold text-foreground">
                    {selectedExam === 'CAT' ? 'CAT All India Rank' : selectedExam === 'NEET' ? 'NEET AIR Score' : 'JEE Main All India Rank'}
                  </Label>
                  <Input
                    id="predictor-rank"
                    type="number"
                    placeholder="Enter rank score"
                    {...register('rank', { valueAsNumber: true })}
                    className="rounded-xl border-border bg-background text-base py-5"
                  />
                  {errors.rank && <p className="text-xs text-destructive font-semibold">{errors.rank.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold py-6 rounded-xl mt-2 flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 text-base sm:text-lg cursor-pointer"
                >
                  <span>Predict My Chances</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Output Lists */}
        <div className="lg:col-span-2 space-y-8">
          {hasSearched ? (
            results.length > 0 ? (
              <div className="space-y-8">
                
                {/* A. Safety Category (High Chance) */}
                {safetyColleges.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-emerald-500 flex items-center gap-1.5 px-1">
                      <CheckCircle2 className="h-4.5 w-4.5" />
                      <span>Safety (Very High Chance of Admission)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {safetyColleges.map((r) => (
                        <div key={r.college.id} className={`relative rounded-3xl h-full transition-all duration-300 ${
                          isAuroraMode ? 'aurora-glow-card' : 'border shadow-sm hover:shadow-md hover:-translate-y-1'
                        }`}>
                          <CollegeCard college={r.college} />
                          <div className="absolute bottom-20 left-5 bg-background/95 backdrop-blur border border-border px-3 py-1.5 rounded-xl text-[10px] font-semibold text-muted-foreground shadow-sm z-20">
                            Target Course: <span className="text-primary font-bold">{r.courseName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* B. Target Category (Good Chance) */}
                {targetColleges.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-primary flex items-center gap-1.5 px-1">
                      <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                      <span>Target (Likely/Good Admission Prospect)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {targetColleges.map((r) => (
                        <div key={r.college.id} className={`relative rounded-3xl h-full transition-all duration-300 ${
                          isAuroraMode ? 'aurora-glow-card' : 'border shadow-sm hover:shadow-md hover:-translate-y-1'
                        }`}>
                          <CollegeCard college={r.college} />
                          <div className="absolute bottom-20 left-5 bg-background/95 backdrop-blur border border-border px-3 py-1.5 rounded-xl text-[10px] font-semibold text-muted-foreground shadow-sm z-20">
                            Target Course: <span className="text-primary font-bold">{r.courseName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* C. Reach Category (Challenging) */}
                {reachColleges.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-amber-500 flex items-center gap-1.5 px-1">
                      <AlertTriangle className="h-4.5 w-4.5" />
                      <span>Reach (Borderline / Spot Round Cutoff)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {reachColleges.map((r) => (
                        <div key={r.college.id} className={`relative rounded-3xl h-full transition-all duration-300 ${
                          isAuroraMode ? 'aurora-glow-card' : 'border shadow-sm hover:shadow-md hover:-translate-y-1'
                        }`}>
                          <CollegeCard college={r.college} />
                          <div className="absolute bottom-20 left-5 bg-background/95 backdrop-blur border border-border px-3 py-1.5 rounded-xl text-[10px] font-semibold text-muted-foreground shadow-sm z-20">
                            Target Course: <span className="text-primary font-bold">{r.courseName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* No matching colleges found */
              <div className="flex flex-col items-center justify-center p-16 border border-dashed border-border bg-card rounded-3xl text-center space-y-5 max-w-xl mx-auto">
                <AlertTriangle className="h-14 w-14 text-amber-500" />
                <h3 className="text-2xl font-black text-foreground">No Matching Colleges</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
                  Unfortunately, based on your rank of {watch('rank')} and quota ({watch('category')}), we couldn&apos;t find matching options. Elite cutoffs generally close earlier. Try predicting with a different quota or score.
                </p>
              </div>
            )
          ) : (
            /* Idle initial view */
            <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-border rounded-2xl bg-card shadow-inner space-y-5 min-h-[380px]">
              <div className="h-18 w-18 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center">
                <Search className="h-9 w-9" />
              </div>
              <h3 className="text-2xl font-black text-foreground">Awaiting Parameters</h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md font-medium">
                Enter your exam details and rank in the left eligibility panel. We will instantly query historic cutoff structures and present matches grouped by select probability.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
