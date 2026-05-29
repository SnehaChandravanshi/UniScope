export interface PlacementStats {
  averagePackage: number; // in LPA, e.g. 21.8
  highestPackage: number; // in LPA, e.g. 82.0
  placementPercentage: number; // e.g. 95
  recruiters: string[];
}

export interface Course {
  id: string;
  collegeId: string;
  name: string;
  duration: string;
  fees: number; // in INR per year
  eligibility: string;
}

export interface Review {
  id: string;
  userId: string;
  userName?: string;
  collegeId: string;
  rating: number;
  comment: string;
  pros?: string;
  cons?: string;
  createdAt?: string;
}

export interface College {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: string;
  fees: number; // average annual fees in INR
  rating: number;
  placementStats: PlacementStats;
  ownershipType: 'Public' | 'Private';
  image: string;
  highlights: string[];
  ranking?: string;
  accreditation?: string;
  gallery: string[];
  courses?: Course[];
  reviews?: Review[];
  createdAt?: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  college?: College;
}

export interface SavedComparison {
  id: string;
  userId: string;
  collegeIds: string[];
  colleges?: College[];
}
