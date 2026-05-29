import { Metadata } from 'next';
import { getColleges } from '@/services/collegeService';
import { Colleges3DClient } from '@/components/college/Colleges3DClient';

export const metadata: Metadata = {
  title: 'Discover Colleges | UniScope',
  description: 'Explore, search and filter top engineering, business, and medical colleges. View tuition fees, cutoff ratings, and verified salary packages.',
};

interface SearchParams {
  search?: string;
  location?: string;
  minFees?: string;
  maxFees?: string;
  rating?: string;
  ownershipType?: string;
  courseType?: string;
  sortBy?: 'rating' | 'fees' | 'placement';
  sortOrder?: 'asc' | 'desc';
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CollegesPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const currentPage = Number(searchParams.page) || 1;
  const limit = 8;

  const { colleges, total } = await getColleges({
    search: searchParams.search,
    location: searchParams.location,
    minFees: searchParams.minFees ? Number(searchParams.minFees) : undefined,
    maxFees: searchParams.maxFees ? Number(searchParams.maxFees) : undefined,
    rating: searchParams.rating ? Number(searchParams.rating) : undefined,
    ownershipType: searchParams.ownershipType,
    courseType: searchParams.courseType,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder,
    page: currentPage,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  const activeSort = searchParams.sortBy || 'rating';
  const activeOrder = searchParams.sortOrder || 'desc';

  // Pass search params as a plain serializable object so the client can build links
  const filterParams: Record<string, string> = {};
  Object.entries(searchParams).forEach(([key, val]) => {
    if (val) filterParams[key] = String(val);
  });

  return (
    <Colleges3DClient
      colleges={colleges}
      total={total}
      currentPage={currentPage}
      limit={limit}
      totalPages={totalPages}
      activeSort={activeSort}
      activeOrder={activeOrder}
      filterParams={filterParams}
    />
  );
}
