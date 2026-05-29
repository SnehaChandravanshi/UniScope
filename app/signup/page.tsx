import { Metadata } from 'next';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Create Account | UniScope',
  description: 'Sign up to UniScope to discover, bookmark, and compare top-rated Indian colleges.',
};

export default function SignupPage() {
  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-muted/10">
      <AuthForm mode="signup" />
    </div>
  );
}
export const dynamic = 'force-dynamic';
