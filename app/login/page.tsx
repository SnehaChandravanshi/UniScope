import { Metadata } from 'next';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Sign In | UniScope',
  description: 'Log in to your student dashboard to manage your saved comparisons and colleges.',
};

export default function LoginPage() {
  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-muted/10">
      <AuthForm mode="login" />
    </div>
  );
}
export const dynamic = 'force-dynamic';
