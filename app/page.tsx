import { getFeaturedColleges } from '@/services/collegeService';
import { Home3DClient } from '@/components/home/Home3DClient';

export default async function Home() {
  const featuredColleges = await getFeaturedColleges();

  return <Home3DClient featuredColleges={featuredColleges} />;
}
