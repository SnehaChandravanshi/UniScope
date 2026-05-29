import { College } from '@/types';
import { rawColleges } from './rawCollegesData';

export const mockColleges: College[] = rawColleges.map((col) => ({
  id: col.id,
  slug: col.slug,
  name: col.name,
  description: col.description,
  location: col.location,
  fees: col.fees,
  rating: col.rating,
  ownershipType: col.ownershipType,
  image: col.image,
  highlights: col.highlights,
  ranking: col.ranking || undefined,
  accreditation: col.accreditation || undefined,
  gallery: col.gallery,
  placementStats: col.placementStats,
  courses: col.courses.map((crs) => ({
    id: crs.id,
    collegeId: col.id,
    name: crs.name,
    duration: crs.duration,
    fees: crs.fees,
    eligibility: crs.eligibility,
  })),
  reviews: col.reviews.map((rev) => ({
    id: rev.id,
    userId: 'demo-user-id',
    userName: rev.userName,
    collegeId: col.id,
    rating: rev.rating,
    comment: rev.comment,
    pros: rev.pros || undefined,
    cons: rev.cons || undefined,
    createdAt: rev.createdAt,
  })),
}));
