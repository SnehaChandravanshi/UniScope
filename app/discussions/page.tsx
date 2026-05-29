'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  PlusCircle, 
  User, 
  Calendar, 
  MessageCircle, 
  Building2, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { mockColleges } from '@/lib/mockData';
import { useStore } from '@/store/useStore';

interface QuestionAuthor {
  id: string;
  name: string | null;
}

interface QuestionCollege {
  id: string;
  name: string;
  slug: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: QuestionAuthor;
  college: QuestionCollege | null;
  _count: {
    answers: number;
  };
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active: boolean;
}

function TiltCard({ children, className = '', onClick, active }: TiltCardProps) {
  return (
    <div
      onClick={onClick}
      className={`transition-all duration-300 ${
        active 
          ? 'aurora-glow-card' 
          : 'bg-card border border-border shadow-sm hover:shadow-md hover:-translate-y-1'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

function HologramFormCard({ children, className = '', active }: { children: React.ReactNode; className?: string; active: boolean }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    setCoords({ x, y });
  };

  return (
    <div
      className={`glass-holo-slab rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${className} ${active && isHovered ? 'shadow-2xl border-primary/20' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {active && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(99, 102, 241, 0.12), transparent 80%)`
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default function DiscussionsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Design View Mode state - linked globally
  const isAuroraMode = useStore((state) => state.isAuroraMode);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('all');
  
  // Ask Question Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCollegeId, setNewCollegeId] = useState<string>('none');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let url = '/api/discussions';
      const params = new URLSearchParams();
      if (selectedCollegeId !== 'all') {
        params.append('collegeId', selectedCollegeId);
      }
      if (search.trim()) {
        params.append('search', search);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCollegeId, search]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/login?callbackUrl=/discussions');
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) {
      setErrorMsg('Please enter both a title and details for your question.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          collegeId: newCollegeId === 'none' ? null : newCollegeId,
        }),
      });

      if (res.ok) {
        const createdQ = await res.json();
        setQuestions([createdQ, ...questions]);
        setNewTitle('');
        setNewContent('');
        setNewCollegeId('none');
        setSuccessMsg('Your question was posted successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || 'Failed to post your question.');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full px-4 sm:px-8 lg:px-12 py-10 space-y-10">
      {/* 1. Header Details */}
      <div className="border-b border-border/40 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary animate-pulse" />
            <span>Discussion Forum</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-1.5 leading-relaxed font-medium">
            Ask questions, share answers, and connect with peers regarding admissions, campus life, and preparation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Questions Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls: Search and Filter */}
          <div className={`flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border ${
            isAuroraMode ? 'bg-slate-900/40 border-white/5 shadow-md' : 'bg-muted/20 border-border/60'
          }`}>
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 rounded-xl border-border bg-background py-5 focus:ring-1 focus:ring-primary/20 text-base"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select 
                value={selectedCollegeId} 
                onValueChange={(val) => setSelectedCollegeId(val || 'all')}
              >
                <SelectTrigger className="rounded-xl border-border bg-background focus:ring-1 focus:ring-primary/20 text-base py-5">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Discussions</SelectItem>
                  <SelectItem value="general_only">General Discussions</SelectItem>
                  {mockColleges.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feed List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground font-semibold">Loading discussions feed...</p>
            </div>
          ) : questions.length > 0 ? (
            <div className="space-y-6">
              <AnimatePresence>
                {questions
                  .filter(q => selectedCollegeId === 'general_only' ? !q.college : true)
                  .map((q, idx) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                  >
                    <TiltCard active={isAuroraMode} onClick={() => router.push(`/discussions/${q.id}`)}>
                      <Card className={`rounded-2xl border transition-all duration-300 ${
                        isAuroraMode 
                          ? 'border-white/5 bg-slate-900/60 backdrop-blur-md shadow-lg hover:border-primary/40' 
                          : 'border-border/80 hover:border-primary/45 bg-card hover:shadow-md'
                      }`}>
                        <CardContent className="p-6 space-y-4">
                          {/* Tags & Meta */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            {q.college ? (
                              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-bold">
                                <Building2 className="h-3.5 w-3.5" />
                                {q.college.name}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-secondary/80 text-secondary-foreground px-2.5 py-1 rounded-lg font-bold">
                                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                                General Q&A
                              </span>
                            )}
                            
                            <div className="flex items-center gap-4 text-muted-foreground font-semibold">
                              <span className="flex items-center gap-1 font-bold text-foreground/80">
                                <User className="h-3.5 w-3.5 text-primary/70" />
                                {q.user.name || 'Anonymous Student'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(q.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          {/* Title & snippet */}
                          <div className="space-y-2">
                            <h3 className="text-xl font-black text-foreground hover:text-primary transition-colors decoration-primary/45 decoration-2 leading-snug">
                              {q.title}
                            </h3>
                            <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed font-semibold">
                              {q.content}
                            </p>
                          </div>

                          {/* Footer stats */}
                          <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-2">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                              <MessageCircle className="h-4.5 w-4.5 text-primary" />
                              {q._count.answers} {q._count.answers === 1 ? 'Answer' : 'Answers'}
                            </span>
                            
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:text-primary/95 gap-1 group rounded-xl">
                              <span>Join Discussion</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border/80 rounded-2xl text-center space-y-4 max-w-md mx-auto">
              <div className="h-12 w-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No discussions found</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Try refining your search query or choosing another category filter. Or be the first to ask!
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Ask Question panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <HologramFormCard active={isAuroraMode}>
              <div className="pb-5">
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 text-foreground">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <span>Ask a Question</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-normal font-semibold">
                  Get responses from the alumni and peer community.
                </p>
              </div>
              
              <div>
                {successMsg && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold animate-in fade-in">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/25 text-destructive rounded-xl text-xs font-semibold animate-in fade-in">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {session ? (
                  <form onSubmit={handleAskQuestion} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="question-title" className="text-xs font-bold text-foreground">Question Title</Label>
                      <Input
                        id="question-title"
                        type="text"
                        placeholder="E.g., What are the timings of the library?"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="rounded-xl border-border bg-background focus:ring-1 focus:ring-primary/20"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="question-content" className="text-xs font-bold text-foreground">Elaborate Details</Label>
                      <textarea
                        id="question-content"
                        placeholder="Provide background context or detail out your queries..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        rows={5}
                        className="w-full border border-border rounded-xl p-3 bg-background text-sm focus:border-primary/55 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Associate with College</Label>
                      <Select 
                        value={newCollegeId} 
                        onValueChange={(val) => setNewCollegeId(val || 'none')}
                      >
                        <SelectTrigger className="rounded-xl border-border bg-background focus:ring-1 focus:ring-primary/20 text-sm">
                          <SelectValue placeholder="General Question" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">General Question (None)</SelectItem>
                          {mockColleges.map((col) => (
                            <SelectItem key={col.id} value={col.id}>
                              {col.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl text-sm py-4 shadow-md shadow-primary/10 transition-transform active:scale-95 mt-2 cursor-pointer"
                    >
                      {submitting ? 'Posting...' : 'Post Question'}
                    </Button>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/15 border border-border/60 rounded-xl space-y-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-sm text-foreground">Authentication Required</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                        You must be signed in to ask new questions or submit answers.
                      </p>
                    </div>
                    <Link href={`/login?callbackUrl=/discussions`} className="w-full">
                      <Button size="sm" className="w-full bg-primary text-primary-foreground font-semibold rounded-xl cursor-pointer">
                        Sign In Now
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </HologramFormCard>
          </div>
        </div>
      </div>
    </div>
  );
}
