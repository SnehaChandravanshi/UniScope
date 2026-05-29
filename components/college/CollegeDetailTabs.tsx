'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import { 
  Building2, 
  MapPin, 
  Star, 
  Landmark, 
  GraduationCap, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Briefcase, 
  ThumbsUp, 
  ThumbsDown, 
  Image as ImageIcon,
  MessageSquare,
  Award,
  AlertCircle,
  CheckCircle2,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatINR, formatLPA } from '@/lib/utils';
import { College, Review } from '@/types';

interface CollegeDetailTabsProps {
  college: College;
}

export function CollegeDetailTabs({ college }: CollegeDetailTabsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAuroraMode = useStore((state) => state.isAuroraMode);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Custom reviews state for interactive submissions
  const [reviewsList, setReviewsList] = useState<Review[]>(college.reviews || []);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newPros, setNewPros] = useState('');
  const [newCons, setNewCons] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Discussions tab state
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [qLoading, setQLoading] = useState(true);
  const [askTitle, setAskTitle] = useState('');
  const [askContent, setAskContent] = useState('');
  const [askSuccess, setAskSuccess] = useState('');
  const [askError, setAskError] = useState('');
  const [askSubmitting, setAskSubmitting] = useState(false);

  useEffect(() => {
    const fetchCollegeDiscussions = async () => {
      try {
        const res = await fetch(`/api/discussions?collegeId=${college.id}`);
        if (res.ok) {
          const data = await res.json();
          setQuestionsList(data);
        }
      } catch (err) {
        console.error("Error fetching college discussions:", err);
      } finally {
        setQLoading(false);
      }
    };
    fetchCollegeDiscussions();
  }, [college.id]);

  const handleAskCollegeQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=/college/${college.slug}`);
      return;
    }

    if (!askTitle.trim() || !askContent.trim()) {
      setAskError('Please fill out both title and content.');
      return;
    }

    setAskSubmitting(true);
    setAskError('');
    setAskSuccess('');

    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: askTitle,
          content: askContent,
          collegeId: college.id
        })
      });

      if (res.ok) {
        const newQ = await res.json();
        setQuestionsList([newQ, ...questionsList]);
        setAskTitle('');
        setAskContent('');
        setAskSuccess('Your question was posted successfully!');
        setTimeout(() => setAskSuccess(''), 4000);
      } else {
        const errData = await res.json();
        setAskError(errData.error || 'Failed to post question.');
      }
    } catch (err) {
      console.error(err);
      setAskError('Network error. Please try again.');
    } finally {
      setAskSubmitting(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'courses', label: 'Courses & Fees', icon: GraduationCap },
    { id: 'placements', label: 'Placements', icon: TrendingUp },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'discussions', label: 'Q&A Discussions', icon: MessageSquare },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  ];

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }

    if (!newComment.trim()) {
      setErrorMsg('Please write a comment for your review.');
      return;
    }

    const reviewObj: Review = {
      id: `rev-mock-${Date.now()}`,
      userId: session.user?.email || 'mock-id',
      userName: session.user?.name || 'Anonymous Student',
      collegeId: college.id,
      rating: newRating,
      comment: newComment,
      pros: newPros || undefined,
      cons: newCons || undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReviewsList([reviewObj, ...reviewsList]);
    setNewComment('');
    setNewPros('');
    setNewCons('');
    setNewRating(5);
    setErrorMsg('');
    setSuccessMsg('Thank you! Your review was successfully submitted.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* 1. Tab Navigation bar (Sticky) */}
      <div className={`sticky top-16 z-35 backdrop-blur border-b py-1.5 flex overflow-x-auto gap-2 scrollbar-none transition-colors duration-300 ${
        isAuroraMode ? 'bg-[#07080e]/95 border-white/5' : 'bg-background/95 border-border/60'
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // Scroll to target element smoothly
                const element = document.getElementById(`section-${tab.id}`);
                if (element) {
                  const yOffset = -140; // offset to align with header + tabs
                  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                active 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : isAuroraMode 
                    ? 'text-slate-400 hover:bg-white/5 hover:text-white' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Sections container */}
      <div className="space-y-12">
        {/* SECTION A: Overview */}
        <section id="section-overview" className="scroll-mt-40 space-y-6">
          <div className={`border p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-300 ${
            isAuroraMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md' : 'bg-card border border-border/60'
          }`}>
            <h2 className="text-xl font-bold text-foreground">About the College</h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
              {college.description}
            </p>
          </div>

          <div className={`border p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-300 ${
            isAuroraMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md' : 'bg-card border border-border/60'
          }`}>
            <h2 className="text-xl font-bold text-foreground">Key Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {college.highlights.map((h, i) => (
                <div key={i} className="flex items-start space-x-2.5">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full shrink-0 mt-0.5 ${
                    isAuroraMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-500'
                  }`}>
                    <span className="text-[10px] font-bold">✓</span>
                  </div>
                  <span className="text-muted-foreground font-semibold">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION B: Courses */}
        <section id="section-courses" className={`scroll-mt-40 border p-6 rounded-2xl shadow-sm space-y-6 transition-all duration-300 ${
          isAuroraMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md' : 'bg-card border border-border/60'
        }`}>
          <h2 className="text-xl font-bold text-foreground">Courses Offered</h2>
          <div className={`overflow-x-auto border rounded-xl ${isAuroraMode ? 'border-white/5' : 'border-border'}`}>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                  <th className="p-4">Course Title</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Annual Fees</th>
                  <th className="p-4">Eligibility Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {college.courses && college.courses.map((crs) => (
                  <tr key={crs.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{crs.name}</td>
                    <td className="p-4 text-muted-foreground">{crs.duration}</td>
                    <td className="p-4 font-medium text-foreground">{formatINR(crs.fees)}</td>
                    <td className="p-4 text-muted-foreground max-w-xs">{crs.eligibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION C: Placements */}
        <section id="section-placements" className={`scroll-mt-40 border p-6 rounded-2xl shadow-sm space-y-6 transition-all duration-300 ${
          isAuroraMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md' : 'bg-card border border-border/60'
        }`}>
          <h2 className="text-xl font-bold text-foreground">Placement Statistics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border text-center transition-all ${
              isAuroraMode ? 'bg-slate-950/40 border-white/5' : 'border-border/80 bg-muted/20'
            }`}>
              <span className="text-xs text-muted-foreground block">Average Annual Package</span>
              <span className="text-2xl font-black text-primary block mt-1.5">
                {formatLPA(college.placementStats.averagePackage)}
              </span>
            </div>
            <div className={`p-4 rounded-xl border text-center transition-all ${
              isAuroraMode ? 'bg-slate-950/40 border-white/5' : 'border-border/80 bg-muted/20'
            }`}>
              <span className="text-xs text-muted-foreground block">Highest Placement Package</span>
              <span className="text-2xl font-black text-foreground block mt-1.5">
                {formatLPA(college.placementStats.highestPackage)}
              </span>
            </div>
            <div className={`p-4 rounded-xl border text-center transition-all ${
              isAuroraMode ? 'bg-slate-950/40 border-white/5' : 'border-border/80 bg-muted/20'
            }`}>
              <span className="text-xs text-muted-foreground block">Placement Rate</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-450 block mt-1.5">
                {college.placementStats.placementPercentage}%
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Top Corporate Recruiters
            </h3>
            <div className="flex flex-wrap gap-2">
              {college.placementStats.recruiters.map((rec) => (
                <span 
                  key={rec} 
                  className="px-3 py-1 bg-background border border-border rounded-xl text-xs font-semibold text-muted-foreground"
                >
                  {rec}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION D: Reviews */}
        <section id="section-reviews" className="scroll-mt-40 space-y-6">
          <div className={`border p-6 rounded-2xl shadow-sm space-y-6 transition-all duration-300 ${
            isAuroraMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md' : 'bg-card border border-border/60'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Student Reviews</h2>
              <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-xl text-amber-500 font-bold text-sm">
                <Star className="h-4.5 w-4.5 fill-amber-500" />
                <span>{college.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {/* List Reviews */}
            {reviewsList.length > 0 ? (
              <div className="space-y-6 divide-y divide-border/60">
                {reviewsList.map((rev, index) => (
                  <div key={rev.id} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                          {rev.userName ? rev.userName[0] : 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground leading-none">{rev.userName || 'Anonymous Student'}</p>
                          {rev.createdAt && <p className="text-[10px] text-muted-foreground mt-0.5">{rev.createdAt}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-xs text-amber-400 font-bold bg-amber-400/5 px-2 py-0.5 rounded-lg">
                        <span>★ {rev.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {rev.comment}
                    </p>

                    {/* Pros and cons */}
                    {(rev.pros || rev.cons) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-muted/20 p-3 rounded-xl border border-border/30">
                        {rev.pros && (
                          <div className="space-y-1">
                            <span className="font-semibold text-emerald-600 flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" /> Pros
                            </span>
                            <span className="text-muted-foreground leading-snug">{rev.pros}</span>
                          </div>
                        )}
                        {rev.cons && (
                          <div className="space-y-1">
                            <span className="font-semibold text-rose-600 flex items-center gap-1">
                              <ThumbsDown className="h-3 w-3" /> Cons
                            </span>
                            <span className="text-muted-foreground leading-snug">{rev.cons}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic text-center py-6">No reviews submitted yet. Be the first to add yours!</p>
            )}
          </div>

          {/* Form to submit review */}
          <div className={`border p-6 rounded-2xl shadow-sm space-y-6 transition-all duration-300 ${
            isAuroraMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md shadow-lg' : 'bg-card border border-border/60'
          }`}>
            <h3 className="text-lg font-bold text-foreground">Write a Review</h3>
            
            {successMsg && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 rounded-xl text-xs font-semibold">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/25 text-destructive rounded-xl text-xs font-semibold">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {session ? (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Rating Score (1-5)</Label>
                    <Select 
                      value={String(newRating)} 
                      onValueChange={(val) => setNewRating(Number(val))}
                    >
                      <SelectTrigger className="rounded-xl border-border bg-background focus:ring-1 focus:ring-primary/20">
                        <SelectValue placeholder="Rate College" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((r) => (
                          <SelectItem key={r} value={String(r)}>
                            {r === 5 ? '★★★★★ (5/5)' : r === 4 ? '★★★★☆ (4/5)' : r === 3 ? '★★★☆☆ (3/5)' : r === 2 ? '★★☆☆☆ (2/5)' : '★☆☆☆☆ (1/5)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="review-comment" className="text-xs font-semibold text-foreground">Your Review Comment</Label>
                  <textarea
                    id="review-comment"
                    placeholder="Describe your academic experience, hostel life, and placement scenarios..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="w-full border border-border rounded-xl p-3 bg-background text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="review-pros" className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" /> Pros (Optional)
                    </Label>
                    <input
                      id="review-pros"
                      type="text"
                      placeholder="E.g. Great labs, nice library"
                      value={newPros}
                      onChange={(e) => setNewPros(e.target.value)}
                      className="w-full border border-border rounded-xl px-3 py-2 bg-background text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="review-cons" className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                      <ThumbsDown className="h-3 w-3" /> Cons (Optional)
                    </Label>
                    <input
                      id="review-cons"
                      type="text"
                      placeholder="E.g. Old hostels, strict gates"
                      value={newCons}
                      onChange={(e) => setNewCons(e.target.value)}
                      className="w-full border border-border rounded-xl px-3 py-2 bg-background text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 rounded-xl shadow-md"
                >
                  Submit Student Review
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 bg-muted/20 border border-border rounded-xl space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You must be registered and signed in to write a review.
                </p>
                <Link href="/login">
                  <Button size="sm" className="bg-primary text-primary-foreground font-semibold rounded-xl">
                    Sign In to Write Review
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* SECTION F: Q&A Discussions */}
        <section id="section-discussions" className="scroll-mt-40 space-y-6">
          <div className={`border p-6 rounded-2xl shadow-sm space-y-6 transition-all duration-300 ${
            isAuroraMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md' : 'bg-card border border-border/60'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Q&A Discussions</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                {questionsList.length} Questions
              </span>
            </div>

            {qLoading ? (
              <div className="flex items-center justify-center py-10 space-y-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : questionsList.length > 0 ? (
              <div className="space-y-4">
                {questionsList.map((q) => (
                  <Card key={q.id} className={`transition-all rounded-xl border ${
                    isAuroraMode ? 'border-white/5 bg-slate-950/30 hover:border-primary/40' : 'border-border/50 bg-background/50 hover:border-primary/30'
                  }`}>
                    <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2 flex-grow min-w-0">
                        <Link href={`/discussions/${q.id}`}>
                          <h4 className="font-bold text-base text-foreground hover:text-primary transition-colors hover:underline block truncate">
                            {q.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                          {q.content}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium pt-1">
                          <span className="flex items-center gap-0.5">
                            <User className="h-3 w-3 text-primary/70" />
                            {q.user.name || 'Anonymous Student'}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(q.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 border-border/30 pt-3 md:pt-0">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          {q._count?.answers || 0} { (q._count?.answers || 0) === 1 ? 'Answer' : 'Answers' }
                        </span>
                        
                        <Link href={`/discussions/${q.id}`}>
                          <Button size="xs" variant="ghost" className="text-[10px] font-bold text-primary rounded-lg">
                            <span>Join Thread</span>
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-border/85 rounded-xl text-center">
                <p className="text-sm text-muted-foreground italic">No discussions started yet. Ask a question about {college.name} below!</p>
              </div>
            )}
          </div>

          {/* Form to ask a question */}
          <div className={`border p-6 rounded-2xl shadow-sm space-y-6 transition-all duration-300 ${
            isAuroraMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md' : 'bg-card border border-border/60'
          }`}>
            <h3 className="text-lg font-bold text-foreground">Ask a Question about {college.name}</h3>
            
            {askSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 rounded-xl text-xs font-semibold">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                <span>{askSuccess}</span>
              </div>
            )}

            {askError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/25 text-destructive rounded-xl text-xs font-semibold">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{askError}</span>
              </div>
            )}

            {session ? (
              <form onSubmit={handleAskCollegeQuestion} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ask-title" className="text-xs font-semibold text-foreground">Question Title</Label>
                  <input
                    id="ask-title"
                    type="text"
                    placeholder="E.g. What is the average package for ECE?"
                    value={askTitle}
                    onChange={(e) => setAskTitle(e.target.value)}
                    className="w-full border border-border rounded-xl px-3 py-2 bg-background text-sm focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ask-content" className="text-xs font-semibold text-foreground">Additional Details</Label>
                  <textarea
                    id="ask-content"
                    placeholder="Provide details about your query..."
                    value={askContent}
                    onChange={(e) => setAskContent(e.target.value)}
                    rows={4}
                    className="w-full border border-border rounded-xl p-3 bg-background text-sm focus:border-primary/50 focus:outline-none placeholder:text-muted-foreground/60"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={askSubmitting}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 rounded-xl shadow-md"
                >
                  {askSubmitting ? 'Posting...' : 'Post Question'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 bg-muted/20 border border-border rounded-xl space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You must be signed in to ask a question.
                </p>
                <Link href={`/login?callbackUrl=/college/${college.slug}`}>
                  <Button size="sm" className="bg-primary text-primary-foreground font-semibold rounded-xl">
                    Sign In to Ask
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* SECTION E: Gallery */}
        <section id="section-gallery" className={`scroll-mt-40 border p-6 rounded-2xl shadow-sm space-y-6 transition-all duration-300 ${
          isAuroraMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md' : 'bg-card border border-border/60'
        }`}>
          <h2 className="text-xl font-bold text-foreground">Campus Gallery</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {college.gallery && college.gallery.map((url, i) => (
              <div key={i} className="relative h-56 rounded-xl overflow-hidden bg-muted group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Campus image ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
              </div>
            ))}
            {/* Fallback image cards if gallery is empty */}
            {(!college.gallery || college.gallery.length === 0) && (
              <>
                <div className="relative h-56 rounded-xl overflow-hidden bg-muted flex items-center justify-center text-muted-foreground border">
                  <span>No images available</span>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
export default CollegeDetailTabs;
