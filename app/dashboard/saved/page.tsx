import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { SavedDashboard } from '@/components/dashboard/SavedDashboard';
import { Bookmark, FolderHeart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Saved Items | UniScope',
  description: 'Manage your bookmarked colleges and saved comparisons on your UniScope student dashboard.',
};

export default async function SavedCollegesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/dashboard/saved');
  }

  return (
    <div className="mx-auto w-full px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* Dashboard title header */}
      <div className="border-b border-border/40 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <FolderHeart className="h-8 w-8 text-primary" />
          <span>Student Dashboard</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Welcome back, <span className="font-bold text-foreground">{session.user?.name}</span>. Manage your saved university cards and saved comparisons.
        </p>
      </div>

      {/* Main dashboard tab component */}
      <SavedDashboard />
    </div>
  );
}
export const dynamic = 'force-dynamic';
