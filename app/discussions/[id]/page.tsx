'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageSquare, 
  User, 
  Calendar, 
  Building2, 
  HelpCircle,
  CornerDownRight,
  Send,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useStore } from '@/store/useStore';

interface Author {
  id: string;
  name: string | null;
}

interface College {
  id: string;
  name: string;
  slug: string;
  image?: string;
  location?: string;
  rating?: number;
}

interface Answer {
  id: string;
  content: string;
  createdAt: string;
  user: Author;
}

interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: Author;
  college: College | null;
  answers: Answer[];
}

export default function DiscussionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: session } = useSession();
  const isAuroraMode = useStore((state) => state.isAuroraMode);
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Answer[]>([]);
  
  // New Answer Form
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchQuestionDetails = async () => {
    try {
      const res = await fetch(`/api/discussions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setQuestion(data);
        setAnswers(data.answers || []);
      } else {
        router.push('/discussions');
      }
    } catch (error) {
      console.error('Error fetching question details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
  }, [id]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=/discussions/${id}`);
      return;
    }

    if (!answerContent.trim()) {
      setErrorMsg('Please write an answer before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/discussions/${id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answerContent }),
      });

      if (res.ok) {
        const newAnswer = await res.json();
        setAnswers([...answers, newAnswer]);
        setAnswerContent('');
        setSuccessMsg('Your answer was submitted successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || 'Failed to submit your answer.');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground font-semibold">Loading discussion thread...</p>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="mx-auto w-full px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* Back link */}
      <div>
        <Link href="/discussions" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/90 hover:underline">
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Discussions Board</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Question and Answers */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Question Thread Main Card */}
          <Card className={`rounded-2xl border transition-all duration-300 ${
            isAuroraMode 
              ? 'border-white/5 bg-slate-900/60 shadow-xl backdrop-blur-md' 
              : 'border-border/80 bg-card shadow-sm'
          }`}>
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Tag & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                {question.college ? (
                  <Link href={`/college/${question.college.slug}`}>
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/15 transition-colors">
                      <Building2 className="h-4 w-4" />
                      {question.college.name}
                    </span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-lg font-bold">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    General Q&A
                  </span>
                )}
                
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold">
                    <User className="h-4 w-4 text-primary/70" />
                    {question.user.name || 'Anonymous Student'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(question.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Title & Body content */}
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
                  {question.title}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {question.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Answers Feed Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CornerDownRight className="h-5 w-5 text-primary" />
              <span>Responses ({answers.length})</span>
            </h3>

            {answers.length > 0 ? (
              <div className="space-y-4">
                {answers.map((ans, idx) => (
                  <motion.div
                    key={ans.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: ans.id ? idx * 0.05 : 0 }}
                  >
                    <Card className={`rounded-2xl border transition-all duration-300 ${
                      isAuroraMode 
                        ? 'border-white/5 bg-slate-900/40 shadow-sm' 
                        : 'border-border/60 bg-muted/10'
                    }`}>
                      <CardContent className="p-5 sm:p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 font-bold text-foreground">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase">
                              {ans.user.name ? ans.user.name[0] : 'U'}
                            </div>
                            <span>{ans.user.name || 'Anonymous Student'}</span>
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(ans.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {ans.content}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-border/80 rounded-2xl text-center">
                <p className="text-sm text-muted-foreground italic">No responses posted yet. Be the first to share your knowledge!</p>
              </div>
            )}
          </div>

          {/* Submit Answer Form */}
          <Card className={`rounded-2xl border transition-all duration-300 ${
            isAuroraMode 
              ? 'border-white/5 bg-slate-900/60 shadow-lg backdrop-blur-md' 
              : 'border-border bg-card shadow-sm'
          }`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">Write a Response</CardTitle>
              <CardDescription className="text-xs">Provide helpful answers to support your peers.</CardDescription>
            </CardHeader>
            <CardContent>
              {successMsg && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 rounded-xl text-xs font-semibold">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/25 text-destructive rounded-xl text-xs font-semibold">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {session ? (
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="answer-input" className="sr-only">Your Answer</Label>
                    <textarea
                      id="answer-input"
                      placeholder="Write your detailed answer here, sharing facts or personal experiences..."
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      rows={5}
                      className="w-full border border-border rounded-xl p-3 bg-background text-sm focus:border-primary/55 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl text-xs py-3 px-5 shadow-sm gap-1.5 self-end"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Submit Response'}</span>
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/15 border border-border/50 rounded-xl space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You must be authenticated to write a response.
                  </p>
                  <Link href={`/login?callbackUrl=/discussions/${id}`}>
                    <Button size="sm" className="bg-primary text-primary-foreground font-semibold rounded-xl">
                      Sign In to Answer
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Context/Widgets */}
        <div className="lg:col-span-1 space-y-6">
          {/* Related College Widget (if any) */}
          {question.college && (
            <Card className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
              isAuroraMode 
                ? 'border-white/5 bg-slate-900/60 shadow-lg backdrop-blur-md' 
                : 'border-border/80 bg-card shadow-sm'
            }`}>
              <div className={`px-5 py-4 border-b ${
                isAuroraMode ? 'bg-white/5 border-white/5 text-indigo-300 font-bold' : 'bg-primary/5 border-border/40 text-primary font-bold'
              }`}>
                <span className="text-[10px] uppercase tracking-wider">Related College Context</span>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center space-x-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {question.college.image && (
                    <img 
                      src={question.college.image} 
                      alt={question.college.name} 
                      className="h-12 w-12 object-cover rounded-xl border bg-muted shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-foreground truncate">{question.college.name}</h4>
                    {question.college.location && (
                      <span className="text-[10px] text-muted-foreground flex items-center mt-0.5">
                        <MapPin className="h-3 w-3 mr-0.5 text-primary" />
                        {question.college.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/30 pt-3 text-xs">
                  {question.college.rating && (
                    <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/5 px-2.5 py-0.5 rounded-lg border border-amber-500/10">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{question.college.rating.toFixed(1)} / 5.0</span>
                    </div>
                  )}
                  
                  <Link href={`/college/${question.college.slug}`}>
                    <Button size="xs" variant="outline" className="rounded-lg text-[10px] font-bold py-1 px-2">
                      <span>View Profile</span>
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Guidelines widget */}
          <Card className={`rounded-2xl border p-5 space-y-3 transition-all duration-300 ${
            isAuroraMode 
              ? 'border-white/5 bg-slate-900/60 shadow-lg backdrop-blur-md' 
              : 'border-border/80 bg-card shadow-sm'
          }`}>
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Community Rules</h4>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
              <li>Be respectful and supportive.</li>
              <li>Keep topics relevant to academic studies and admissions.</li>
              <li>Avoid posting personal or contact details.</li>
              <li>Helpful responses can build a better network.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
