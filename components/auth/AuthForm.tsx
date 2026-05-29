'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';

// Zod Schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isAuroraMode = useStore((state) => state.isAuroraMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form setup
  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error);
        setLoading(false);
      } else {
        router.push('/dashboard/saved');
        router.refresh();
      }
    } catch (err) {
      setErrorMsg('An unexpected authentication error occurred.');
      setLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error || 'Signup failed. Please try again.');
        setLoading(false);
      } else {
        setSuccessMsg(json.message || 'Registration successful!');
        
        // Auto sign in user after successful registration
        const loginRes = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (loginRes?.error) {
          // If auto sign in fails, redirect to login page
          setTimeout(() => {
            router.push('/login');
          }, 1500);
        } else {
          setTimeout(() => {
            router.push('/dashboard/saved');
            router.refresh();
          }, 1000);
        }
      }
    } catch (err) {
      setErrorMsg('An error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className={`border shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 ${
        isAuroraMode 
          ? 'bg-slate-900/60 border-white/5 backdrop-blur-md shadow-black/40' 
          : 'bg-card border-border/80'
      }`}>
        {/* Visual Gradient Header */}
        <div className={`p-6 flex flex-col items-center justify-center border-b transition-colors ${
          isAuroraMode 
            ? 'bg-white/5 border-white/5' 
            : 'bg-gradient-to-r from-primary/10 to-indigo-500/10 border-border/40'
        }`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-extrabold mt-3 text-foreground tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1 text-center font-semibold">
            {mode === 'login' 
              ? 'Sign in to access your saved colleges and comparisons' 
              : 'Register to save colleges and predict cutoffs'}
          </CardDescription>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Notifications */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/25 text-destructive rounded-xl text-xs font-semibold animate-shake">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 rounded-xl text-xs font-semibold">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs font-semibold text-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground/80" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="student@example.com"
                    {...registerLogin('email')}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all ${
                      isAuroraMode 
                        ? 'border-white/10 bg-slate-950/40 text-white focus:border-primary/50' 
                        : 'border-border bg-background focus:border-primary/50'
                    }`}
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-[10px] text-destructive font-semibold">{loginErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="login-password" className="text-xs font-semibold text-foreground">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground/80" />
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    {...registerLogin('password')}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all ${
                      isAuroraMode 
                        ? 'border-white/10 bg-slate-950/40 text-white focus:border-primary/50' 
                        : 'border-border bg-background focus:border-primary/50'
                    }`}
                  />
                </div>
                {loginErrors.password && (
                  <p className="text-[10px] text-destructive font-semibold">{loginErrors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-5 rounded-xl shadow-lg shadow-primary/10 mt-6 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="signup-name" className="text-xs font-semibold text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground/80" />
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="Amit Kumar"
                    {...registerSignup('name')}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all ${
                      isAuroraMode 
                        ? 'border-white/10 bg-slate-950/40 text-white focus:border-primary/50' 
                        : 'border-border bg-background focus:border-primary/50'
                    }`}
                  />
                </div>
                {signupErrors.name && (
                  <p className="text-[10px] text-destructive font-semibold">{signupErrors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-email" className="text-xs font-semibold text-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground/80" />
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="amit@example.com"
                    {...registerSignup('email')}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all ${
                      isAuroraMode 
                        ? 'border-white/10 bg-slate-950/40 text-white focus:border-primary/50' 
                        : 'border-border bg-background focus:border-primary/50'
                    }`}
                  />
                </div>
                {signupErrors.email && (
                  <p className="text-[10px] text-destructive font-semibold">{signupErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-password" className="text-xs font-semibold text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground/80" />
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    {...registerSignup('password')}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all ${
                      isAuroraMode 
                        ? 'border-white/10 bg-slate-950/40 text-white focus:border-primary/50' 
                        : 'border-border bg-background focus:border-primary/50'
                    }`}
                  />
                </div>
                {signupErrors.password && (
                  <p className="text-[10px] text-destructive font-semibold">{signupErrors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-5 rounded-xl shadow-lg shadow-primary/10 mt-6 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Quick Demo Assist */}
          {mode === 'login' && (
            <div className={`p-3.5 rounded-xl border mt-4 text-xs leading-relaxed font-semibold ${
              isAuroraMode 
                ? 'border-primary/20 bg-primary/10 text-slate-300' 
                : 'border-primary/20 bg-primary/5 text-muted-foreground'
            }`}>
              <span className="font-bold text-primary flex items-center gap-1 mb-1">
                <Sparkles className="h-3.5 w-3.5" /> Demo credentials:
              </span>
              Use <code className="font-semibold text-foreground">demo@example.com</code> with password <code className="font-semibold text-foreground">password123</code> to instantly sign in and explore the saved dashboard!
            </div>
          )}
        </CardContent>

        <CardFooter className={`px-6 py-4 border-t text-center flex justify-center text-xs text-muted-foreground font-semibold ${
          isAuroraMode ? 'bg-white/5 border-white/5' : 'bg-muted/20 border-t border-border/40'
        }`}>
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Create one here
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
export default AuthForm;
