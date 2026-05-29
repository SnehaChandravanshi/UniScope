import prisma from '@/lib/prisma';
import { mockColleges } from '@/lib/mockData';
import { College } from '@/types';

let isDbAvailable = true;
let lastDbFailureTime = 0;
const DB_COOLDOWN_MS = 60000; // 1 minute cooldown

async function runWithDbFallback<T>(dbQuery: () => Promise<T>, fallbackQuery: () => T): Promise<T> {
  const now = Date.now();
  if (!isDbAvailable && now - lastDbFailureTime < DB_COOLDOWN_MS) {
    // Database is down, immediately return fallback mock data to prevent slow page response
    return fallbackQuery();
  }

  try {
    const result = await dbQuery();
    isDbAvailable = true;
    return result;
  } catch (error) {
    console.warn("Database connection issue. Falling back to local mock data.");
    isDbAvailable = false;
    lastDbFailureTime = Date.now();
    return fallbackQuery();
  }
}

export async function getColleges(params: {
  search?: string;
  location?: string;
  minFees?: number;
  maxFees?: number;
  rating?: number;
  ownershipType?: string;
  courseType?: string;
  sortBy?: 'rating' | 'fees' | 'placement';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) {
  const {
    search,
    location,
    minFees = 0,
    maxFees = 10000000,
    rating = 0,
    ownershipType,
    courseType,
    sortBy = 'rating',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = params;

  const skip = (page - 1) * limit;

  return runWithDbFallback(
    async () => {
      const where: any = {
        fees: { gte: minFees, lte: maxFees },
        rating: { gte: rating },
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }

      if (ownershipType) {
        where.ownershipType = { equals: ownershipType, mode: 'insensitive' };
      }

      if (courseType) {
        where.courses = {
          some: {
            name: { contains: courseType, mode: 'insensitive' },
          },
        };
      }

      let orderBy: any = {};
      if (sortBy === 'rating') {
        orderBy = { rating: sortOrder };
      } else if (sortBy === 'fees') {
        orderBy = { fees: sortOrder };
      } else {
        orderBy = { rating: sortOrder }; // Fallback ordering, sorted by placements in memory below
      }

      const [colleges, total] = await Promise.all([
        prisma.college.findMany({
          where,
          include: {
            courses: true,
            reviews: {
              include: { user: true }
            }
          },
          orderBy,
          skip: sortBy === 'placement' ? 0 : skip, // fetch all for memory sort if sorted by placement
          take: sortBy === 'placement' ? 100 : limit,
        }),
        prisma.college.count({ where }),
      ]);

      let typedColleges: College[] = colleges.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        location: c.location,
        fees: c.fees,
        rating: c.rating,
        ownershipType: c.ownershipType as 'Public' | 'Private',
        image: c.image,
        highlights: c.highlights,
        ranking: c.ranking || undefined,
        accreditation: c.accreditation || undefined,
        gallery: c.gallery,
        placementStats: c.placementStats as any,
        courses: c.courses.map((crs) => ({
          id: crs.id,
          collegeId: crs.collegeId,
          name: crs.name,
          duration: crs.duration,
          fees: crs.fees,
          eligibility: crs.eligibility,
        })),
        reviews: c.reviews.map((rev: any) => ({
          id: rev.id,
          userId: rev.userId,
          userName: rev.user?.name || 'Anonymous Student',
          collegeId: rev.collegeId,
          rating: rev.rating,
          comment: rev.comment,
          pros: rev.pros || undefined,
          cons: rev.cons || undefined,
          createdAt: rev.createdAt ? new Date(rev.createdAt).toISOString().split('T')[0] : undefined,
        })),
      }));

      if (sortBy === 'placement') {
        typedColleges.sort((a, b) => {
          const aPkg = a.placementStats?.averagePackage || 0;
          const bPkg = b.placementStats?.averagePackage || 0;
          return sortOrder === 'desc' ? bPkg - aPkg : aPkg - bPkg;
        });
        typedColleges = typedColleges.slice(skip, skip + limit);
      }

      return { colleges: typedColleges, total };
    },
    () => {
      let filtered = [...mockColleges];

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (c) => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
        );
      }

      if (location) {
        const loc = location.toLowerCase();
        filtered = filtered.filter((c) => c.location.toLowerCase().includes(loc));
      }

      filtered = filtered.filter((c) => c.fees >= minFees && c.fees <= maxFees);
      filtered = filtered.filter((c) => c.rating >= rating);

      if (ownershipType) {
        const type = ownershipType.toLowerCase();
        filtered = filtered.filter((c) => c.ownershipType.toLowerCase() === type);
      }

      if (courseType) {
        const course = courseType.toLowerCase();
        filtered = filtered.filter((c) =>
          c.courses?.some((crs) => crs.name.toLowerCase().includes(course))
        );
      }

      filtered.sort((a, b) => {
        if (sortBy === 'rating') {
          return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
        } else if (sortBy === 'fees') {
          return sortOrder === 'desc' ? b.fees - a.fees : a.fees - b.fees;
        } else if (sortBy === 'placement') {
          const aPkg = a.placementStats.averagePackage;
          const bPkg = b.placementStats.averagePackage;
          return sortOrder === 'desc' ? bPkg - aPkg : aPkg - bPkg;
        }
        return 0;
      });

      const total = filtered.length;
      const paginated = filtered.slice(skip, skip + limit);

      return { colleges: paginated, total };
    }
  );
}

export async function getCollegeBySlug(slug: string): Promise<College | null> {
  return runWithDbFallback<College | null>(
    async () => {
      const college = await prisma.college.findUnique({
        where: { slug },
        include: {
          courses: true,
          reviews: {
            include: { user: true }
          }
        },
      });

      if (!college) return null;

      return {
        id: college.id,
        slug: college.slug,
        name: college.name,
        description: college.description,
        location: college.location,
        fees: college.fees,
        rating: college.rating,
        ownershipType: college.ownershipType as 'Public' | 'Private',
        image: college.image,
        highlights: college.highlights,
        ranking: college.ranking || undefined,
        accreditation: college.accreditation || undefined,
        gallery: college.gallery,
        placementStats: college.placementStats as any,
        courses: college.courses.map((crs) => ({
          id: crs.id,
          collegeId: crs.collegeId,
          name: crs.name,
          duration: crs.duration,
          fees: crs.fees,
          eligibility: crs.eligibility,
        })),
        reviews: college.reviews.map((rev: any) => ({
          id: rev.id,
          userId: rev.userId,
          userName: rev.user?.name || 'Anonymous Student',
          collegeId: rev.collegeId,
          rating: rev.rating,
          comment: rev.comment,
          pros: rev.pros || undefined,
          cons: rev.cons || undefined,
          createdAt: rev.createdAt ? new Date(rev.createdAt).toISOString().split('T')[0] : undefined,
        })),
      };
    },
    () => {
      const college = mockColleges.find((c) => c.slug === slug);
      return college || null;
    }
  );
}

export async function searchColleges(query: string): Promise<College[]> {
  const q = query.toLowerCase();
  return runWithDbFallback<College[]>(
    async () => {
      const colleges = await prisma.college.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 8,
      });

      return colleges.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        location: c.location,
        fees: c.fees,
        rating: c.rating,
        ownershipType: c.ownershipType as 'Public' | 'Private',
        image: c.image,
        highlights: c.highlights,
        gallery: c.gallery,
        placementStats: c.placementStats as any,
      }));
    },
    () => {
      return mockColleges
        .filter((c) => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q))
        .slice(0, 8);
    }
  );
}

export async function getFeaturedColleges(): Promise<College[]> {
  return runWithDbFallback<College[]>(
    async () => {
      const colleges = await prisma.college.findMany({
        orderBy: { rating: 'desc' },
        take: 4,
        include: { courses: true },
      });

      return colleges.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        location: c.location,
        fees: c.fees,
        rating: c.rating,
        ownershipType: c.ownershipType as 'Public' | 'Private',
        image: c.image,
        highlights: c.highlights,
        gallery: c.gallery,
        placementStats: c.placementStats as any,
        courses: c.courses.map((crs) => ({
          id: crs.id,
          collegeId: crs.collegeId,
          name: crs.name,
          duration: crs.duration,
          fees: crs.fees,
          eligibility: crs.eligibility,
        })),
      }));
    },
    () => {
      return [...mockColleges]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
    }
  );
}
