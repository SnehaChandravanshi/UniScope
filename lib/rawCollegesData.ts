export interface RawCourse {
  id: string;
  name: string;
  duration: string;
  fees: number;
  eligibility: string;
}

export interface RawReview {
  id: string;
  rating: number;
  comment: string;
  pros?: string;
  cons?: string;
  userName: string;
  createdAt: string;
}

export interface RawCollege {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: string;
  fees: number;
  rating: number;
  ownershipType: 'Public' | 'Private';
  image: string;
  ranking: string;
  accreditation: string;
  highlights: string[];
  placementStats: {
    averagePackage: number;
    highestPackage: number;
    placementPercentage: number;
    recruiters: string[];
  };
  gallery: string[];
  courses: RawCourse[];
  reviews: RawReview[];
}

export const rawColleges: RawCollege[] = [
  // --- ENGINEERING ---
  {
    id: "col-iitm",
    slug: "iit-madras",
    name: "Indian Institute of Technology, Madras",
    description: "Established in 1959, IIT Madras is a public technical and research university located in Chennai, Tamil Nadu. It is consistently ranked as the #1 Engineering Institution in India by the NIRF. The campus is spread over 617 acres of self-contained forest land adjacent to the Guindy National Park.",
    location: "Chennai, Tamil Nadu",
    fees: 215000,
    rating: 4.95,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/IIT_Madras_Campus.jpg",
    ranking: "NIRF Rank 1 (Engineering)",
    accreditation: "Institute of Eminence",
    highlights: [
      "Ranked #1 Engineering Institute in India for 9 consecutive years",
      "Home to the IITM Research Park, India's first university-driven park",
      "Vibrant student fests: Shaastra (technical) and Saarang (cultural)",
      "Excellent research centers in quantum computing, AI, and robotics"
    ],
    placementStats: {
      averagePackage: 22.4,
      highestPackage: 131.6,
      placementPercentage: 96,
      recruiters: ["Google", "Microsoft", "Texas Instruments", "Qualcomm", "Apple", "Goldman Sachs", "McKinsey"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iitm-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 215000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" },
      { id: "crs-iitm-ece", name: "B.Tech Electrical Engineering", duration: "4 Years", fees: 215000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" },
      { id: "crs-iitm-mech", name: "B.Tech Mechanical Engineering", duration: "4 Years", fees: 210000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" }
    ],
    reviews: [
      { id: "rev-iitm-1", rating: 5, comment: "Unparalleled academic environment. The opportunity to work with world-class faculty at the Research Park is incredible.", pros: "Outstanding placements, green eco-friendly campus, great student autonomy", cons: "Chennai weather can get extremely hot in summers", userName: "Siddharth Iyer", createdAt: "2026-04-10" }
    ]
  },
  {
    id: "col-iitd",
    slug: "iit-delhi",
    name: "Indian Institute of Technology, Delhi",
    description: "Indian Institute of Technology Delhi is a public research university located in Hauz Khas, Delhi. Established in 1961, it has a prominent stature in engineering and technology education. Its startup incubator, TBIU, is widely celebrated for spawning multiple Indian unicorns.",
    location: "New Delhi, Delhi",
    fees: 225000,
    rating: 4.90,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0d/IIT_Delhi_Main_Building.jpeg",
    ranking: "NIRF Rank 2 (Engineering)",
    accreditation: "Institute of Eminence",
    highlights: [
      "Prime location in Hauz Khas, South Delhi, offering great industry connectivity",
      "Stellar startup ecosystem with leading entrepreneurship cells",
      "World-class high performance computing and nanotechnology facilities",
      "Dynamic campus life with Rendezvous (cultural festival)"
    ],
    placementStats: {
      averagePackage: 21.9,
      highestPackage: 145.0,
      placementPercentage: 95,
      recruiters: ["Microsoft", "Google", "Goldman Sachs", "Uber", "Tower Research", "Amazon", "Bain & Company"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iitd-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 225000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" },
      { id: "crs-iitd-mnc", name: "B.Tech Mathematics and Computing", duration: "4 Years", fees: 225000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" }
    ],
    reviews: [
      { id: "rev-iitd-1", rating: 5, comment: "Awesome coding culture. The peer environment pushes you to excel. Placements are absolute class.", pros: "Top-tier coding environment, incubation support, South Delhi location", cons: "Hostel rooms are somewhat small for dual sharing", userName: "Aditi Sharma", createdAt: "2026-03-24" }
    ]
  },
  {
    id: "col-iitb",
    slug: "iit-bombay",
    name: "Indian Institute of Technology, Bombay",
    description: "Located in Powai, Mumbai, IIT Bombay is a premier public university globally famed for engineering education and research. Established in 1958, it attracts the top-most rankers of the JEE Advanced examination annually. Its alumni network includes several tech CEOs and industry leaders.",
    location: "Mumbai, Maharashtra",
    fees: 220000,
    rating: 4.92,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/IITBMainBuildingCROP.jpg",
    ranking: "NIRF Rank 3 (Engineering)",
    accreditation: "Institute of Eminence",
    highlights: [
      "Top choice for the absolute top rankers in the JEE Advanced",
      "Vibrant campus bordered by Powai Lake and Vihar Lake",
      "Mood Indigo, the largest college cultural festival in Asia",
      "Excellent entrepreneurship center (SINE)"
    ],
    placementStats: {
      averagePackage: 23.5,
      highestPackage: 168.0,
      placementPercentage: 97,
      recruiters: ["Google", "Microsoft", "Qualcomm", "TATA", "McKinsey", "Goldman Sachs", "Sony Japan"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iitb-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 220000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" },
      { id: "crs-iitb-ee", name: "B.Tech Electrical Engineering", duration: "4 Years", fees: 220000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" },
      { id: "crs-iitb-mech", name: "B.Tech Mechanical Engineering", duration: "4 Years", fees: 215000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" }
    ],
    reviews: [
      { id: "rev-iitb-1", rating: 5, comment: "It is a dream come true. The students are the sharpest minds in the country. The brand opens gates globally.", pros: "Elite brand, Powai lake, SINE incubator, international offers", cons: "Extreme academic load during midsems", userName: "Rohit Malhotra", createdAt: "2026-05-18" }
    ]
  },
  {
    id: "col-iitk",
    slug: "iit-kanpur",
    name: "Indian Institute of Technology, Kanpur",
    description: "IIT Kanpur was established in 1959 under the assistance of the Kanpur Indo-American Programme. It has a heavy focus on research and possesses a unique student-run airstrip, a national wind tunnel facility, and globally recognized physics and computing departments.",
    location: "Kanpur, Uttar Pradesh",
    fees: 222000,
    rating: 4.85,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/03/IITKLibrary.jpg",
    ranking: "NIRF Rank 4 (Engineering)",
    accreditation: "Institute of Eminence",
    highlights: [
      "Sprawling, green 1000-acre residential campus with superior sports complexes",
      "First institute in India to offer Computer Science education",
      "Private airstrip for aeronautical and glider programs",
      "Flexible curriculum structure allowing minors in other disciplines"
    ],
    placementStats: {
      averagePackage: 20.0,
      highestPackage: 125.0,
      placementPercentage: 94,
      recruiters: ["Microsoft", "Google", "Intel", "Amazon", "Rubrik", "Qualcomm", "Jaguar Land Rover"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1607237138185-eedd996e5b09?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iitk-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 222000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" },
      { id: "crs-iitk-aero", name: "B.Tech Aerospace Engineering", duration: "4 Years", fees: 222000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" }
    ],
    reviews: [
      { id: "rev-iitk-1", rating: 4.8, comment: "Excellent academic freedom and labs. The coding culture is outstanding.", pros: "Research freedom, massive green campus, sports centers", cons: "Kanpur city connection is limited compared to metro IITs", userName: "Vikas Verma", createdAt: "2026-02-12" }
    ]
  },
  {
    id: "col-iitkgp",
    slug: "iit-kharagpur",
    name: "Indian Institute of Technology, Kharagpur",
    description: "Established in 1951, IIT Kharagpur is the oldest and largest IIT by campus size (2100 acres). Its historical main building was built at the site of the Hijli Detention Camp. It is known for its diverse streams, including law, management, and medical technology.",
    location: "Kharagpur, West Bengal",
    fees: 223000,
    rating: 4.80,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Bubai_Manna_%28IIT_Kharagpur_main_building%29.jpg",
    ranking: "NIRF Rank 6 (Engineering)",
    accreditation: "Institute of Eminence",
    highlights: [
      "First IIT established in India, rich historical heritage",
      "Largest campus in India (2100 acres) with 22 student halls of residence",
      "Vasant (Spring Fest) and Kshitij (Asia's largest techno-management fest)",
      "Dedicated School of Medical Science and Technology"
    ],
    placementStats: {
      averagePackage: 19.0,
      highestPackage: 120.0,
      placementPercentage: 93,
      recruiters: ["Google", "Microsoft", "Goldman Sachs", "Intel", "Samsung", "Schlumberger", "Shell"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iitkgp-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 223000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" },
      { id: "crs-iitkgp-ece", name: "B.Tech Electronics & Comm. Eng.", duration: "4 Years", fees: 223000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" }
    ],
    reviews: [
      { id: "rev-iitkgp-1", rating: 4.7, comment: "Massive campus, outstanding alumni network. Student fests are phenomenal.", pros: "Huge campus life, great sports facility, global placements", cons: "Located 120km away from Kolkata, travel takes time", userName: "Sourav Bose", createdAt: "2026-03-01" }
    ]
  },
  {
    id: "col-iitr",
    slug: "iit-roorkee",
    name: "Indian Institute of Technology, Roorkee",
    description: "IIT Roorkee, formerly the Thomason College of Civil Engineering (established in 1847), is the oldest technical institution in Asia. Incorporated as an IIT in 2001, it is globally recognized for civil, structural, and water resources engineering.",
    location: "Roorkee, Uttarakhand",
    fees: 221000,
    rating: 4.78,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/73/Mahatma_Gandhi_Central_Library.jpg",
    ranking: "NIRF Rank 5 (Engineering)",
    accreditation: "Institute of Eminence",
    highlights: [
      "Oldest technical institution in Asia (founded in 1847)",
      "Famed Civil and Earth Sciences research departments",
      "Stately British-era main building and clean green campus",
      "Excellent placement records in software and core sectors"
    ],
    placementStats: {
      averagePackage: 18.5,
      highestPackage: 122.0,
      placementPercentage: 92,
      recruiters: ["Microsoft", "Google", "Amazon", "Uber", "Qualcomm", "L&T", "TATA Projects"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1498243691219-0f41f2e1a223?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525921429624-479b6c294520?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iitr-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 221000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" },
      { id: "crs-iitr-civil", name: "B.Tech Civil Engineering", duration: "4 Years", fees: 221000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" }
    ],
    reviews: [
      { id: "rev-iitr-1", rating: 4.8, comment: "Rich heritage, very modern campus amenities. Placements are very strong.", pros: "Historical legacy, great civil department, natural beauty", cons: "Winter weather is very chilly", userName: "Nitin Sharma", createdAt: "2026-04-05" }
    ]
  },
  {
    id: "col-iitg",
    slug: "iit-guwahati",
    name: "Indian Institute of Technology, Guwahati",
    description: "Established in 1994, IIT Guwahati is located on the northern banks of the Brahmaputra River in Assam. Famed for having the most scenic campus in India, the institute excels in biotechnology, design, and nanotechnology.",
    location: "Guwahati, Assam",
    fees: 219000,
    rating: 4.75,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Administrative_Building%2C_IIT_Guwahati.jpg",
    ranking: "NIRF Rank 7 (Engineering)",
    accreditation: "Institute of Eminence",
    highlights: [
      "Scenic 740-acre campus bordered by hills and the Brahmaputra River",
      "Advanced research hubs for energy, environment, and nanotechnology",
      "Vibrant student fest: Alcheringa (cultural) and Techniche",
      "Top-tier global university ranking inclusions"
    ],
    placementStats: {
      averagePackage: 18.0,
      highestPackage: 110.0,
      placementPercentage: 91,
      recruiters: ["Google", "Microsoft", "Intel", "Adobe", "Texas Instruments", "Oracle", "Goldman Sachs"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iitg-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 219000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" },
      { id: "crs-iitg-biotech", name: "B.Tech Biotechnology", duration: "4 Years", fees: 219000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" }
    ],
    reviews: [
      { id: "rev-iitg-1", rating: 4.7, comment: "Scenic campus that feels like a resort. High quality facilities and very active placements.", pros: "Stunning landscape, top-tier labs, cooperative peers", cons: "Located away from central Guwahati city", userName: "Pranjal Baruah", createdAt: "2026-03-15" }
    ]
  },
  {
    id: "col-iith",
    slug: "iit-hyderabad",
    name: "Indian Institute of Technology, Hyderabad",
    description: "IIT Hyderabad was established in 2008 in Kandi, Sangareddy. It is highly active in research collaborations with Japan and features state-of-the-art architectures, including climate-friendly structural designs.",
    location: "Hyderabad, Telangana",
    fees: 230000,
    rating: 4.82,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/IIT_Hyderabad.png",
    ranking: "NIRF Rank 8 (Engineering)",
    accreditation: "National Importance",
    highlights: [
      "Heavy research collaborations with Japanese universities",
      "Stellar placements in software development, AI, and chip design",
      "State-of-the-art infrastructure built with futuristic designs",
      "Located near the technology hubs of Hyderabad"
    ],
    placementStats: {
      averagePackage: 20.1,
      highestPackage: 90.0,
      placementPercentage: 94,
      recruiters: ["Microsoft", "Google", "Qualcomm", "TSMC", "Samsung R&D", "Goldman Sachs", "Mercedes-Benz"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iith-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 230000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" },
      { id: "crs-iith-ee", name: "B.Tech Electrical Engineering", duration: "4 Years", fees: 230000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Advanced score" }
    ],
    reviews: [
      { id: "rev-iith-1", rating: 4.9, comment: "IITH offers great design-centric curricula. Industry ties with Japan are exceptional.", pros: "Modern design, Japanese collaborations, great placement percentage", cons: "Campus is still under construction in some parts", userName: "Arjun Reddy", createdAt: "2026-05-02" }
    ]
  },
  {
    id: "col-nitt",
    slug: "nit-trichy",
    name: "National Institute of Technology, Tiruchirappalli",
    description: "NIT Trichy, established in 1964 as Regional Engineering College, is recognized as the top NIT in India. It is celebrated for its outstanding undergraduate placements, active student fests (Pragyan and Festember), and extensive academic facilities.",
    location: "Trichy, Tamil Nadu",
    fees: 145000,
    rating: 4.65,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/31/National_Institute_of_Technology%2C_Trichy.jpg",
    ranking: "NIRF Rank 9 (Engineering)",
    accreditation: "National Importance",
    highlights: [
      "Ranked #1 among NITs in the country consistently",
      "Vibrant club culture and tech fests (Pragyan is ISO certified)",
      "Sprawling 800-acre residential campus",
      "Stellar return on investment due to affordable government fees"
    ],
    placementStats: {
      averagePackage: 15.5,
      highestPackage: 52.8,
      placementPercentage: 93,
      recruiters: ["TCS", "Infosys", "Cisco", "Intel", "Samsung", "Qualcomm", "Microsoft", "Amazon"]
    },
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/9/91/Clock_Tower_NITT.jpg",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-nitt-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 145000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Main score" },
      { id: "crs-nitt-ece", name: "B.Tech Electronics & Comm. Eng.", duration: "4 Years", fees: 145000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Main score" }
    ],
    reviews: [
      { id: "rev-nitt-1", rating: 4.6, comment: "Sprawling campus, Pragyan and Festember are legendary. Great value for money and outstanding core placements.", pros: "Brand value, low fees, stellar coding scene", cons: "Mess food is hit or miss", userName: "Priya Pillai", createdAt: "2026-01-18" }
    ]
  },
  {
    id: "col-nitk",
    slug: "nit-surathkal",
    name: "National Institute of Technology Karnataka, Surathkal",
    description: "NITK Surathkal, established in 1960, is located on a beautiful beachside campus in Mangalore. It is highly ranked for civil, mechanical, and computer engineering, featuring a private beach and outstanding alumni network.",
    location: "Mangalore, Karnataka",
    fees: 150000,
    rating: 4.68,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/37/NITK_Main_Building.jpg",
    ranking: "NIRF Rank 12 (Engineering)",
    accreditation: "National Importance",
    highlights: [
      "Only college in India with its own private beach and lighthouse",
      "Highly renowned B.Tech CSE department with stellar cutoff ranks",
      "Sprawling 295-acre campus along the Arabian Sea",
      "Stellar placement records in software and core branches"
    ],
    placementStats: {
      averagePackage: 15.0,
      highestPackage: 54.0,
      placementPercentage: 94,
      recruiters: ["Microsoft", "Google", "Amazon", "Uber", "Oracle", "Goldman Sachs", "TATA Motors"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-nitk-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 150000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Main score" },
      { id: "crs-nitk-it", name: "B.Tech Information Technology", duration: "4 Years", fees: 150000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Main score" }
    ],
    reviews: [
      { id: "rev-nitk-1", rating: 4.8, comment: "Walking on the private beach after classes is the best stress buster. Placements are very strong here.", pros: "Beach view, coding culture, great local food", cons: "Humid climate throughout the year", userName: "Karan Shetty", createdAt: "2026-03-22" }
    ]
  },
  {
    id: "col-nitr",
    slug: "nit-rourkela",
    name: "National Institute of Technology, Rourkela",
    description: "NIT Rourkela is one of the premier national institutes of technology in eastern India. Established in 1961, it holds a high ranking in engineering education, offering extensive research opportunities in metallurgy, ceramics, and chemical sciences.",
    location: "Rourkela, Odisha",
    fees: 140000,
    rating: 4.58,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8b/NITMainGate.jpg",
    ranking: "NIRF Rank 19 (Engineering)",
    accreditation: "National Importance",
    highlights: [
      "Sprawling 1200-acre lush green campus (one of the largest NITs)",
      "Excellent research in Materials and Metallurgical engineering",
      "Vibrant student fest: Innovision (tech fest) and Nitrutsav",
      "High placement volume across various sectors"
    ],
    placementStats: {
      averagePackage: 13.8,
      highestPackage: 48.0,
      placementPercentage: 91,
      recruiters: ["TCS", "Infosys", "Wipro", "Intel", "Deloitte", "Aditya Birla Group", "PwC"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1498243691219-0f41f2e1a223?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-nitr-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 140000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Main score" },
      { id: "crs-nitr-ece", name: "B.Tech Electronics & Comm. Eng.", duration: "4 Years", fees: 140000, eligibility: "Class 12 (75% aggregate in PCM) + JEE Main score" }
    ],
    reviews: [
      { id: "rev-nitr-1", rating: 4.6, comment: "Lush green campus, great research infrastructure. Placements are solid for tech branches.", pros: "Lush greenery, great facilities, affordable fees", cons: "Located in a steel township, travel is somewhat remote", userName: "Aman Patnaik", createdAt: "2026-02-14" }
    ]
  },
  {
    id: "col-bits",
    slug: "bits-pilani",
    name: "Birla Institute of Technology and Science, Pilani",
    description: "BITS Pilani is a leading private deemed university known for its strict merit-only admissions policy and zero-reservation system. BITS is celebrated for its unique features like the 'Practice School' internship program and 'Zero Attendance Policy'.",
    location: "Pilani, Rajasthan",
    fees: 540000,
    rating: 4.75,
    ownershipType: "Private",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/BITS-Pilani_campus_aerial_view.jpg",
    ranking: "Top Private Engineering Institute",
    accreditation: "NAAC A++",
    highlights: [
      "Zero attendance policy fosters self-responsibility",
      "Practice School (PS-1 and PS-2) provides 7+ months of corporate experience",
      "No reservation system - purely merit-based entry via BITSAT",
      "Top-tier startup founders alumni list (BITSian network)"
    ],
    placementStats: {
      averagePackage: 20.5,
      highestPackage: 80.0,
      placementPercentage: 94,
      recruiters: ["Salesforce", "Google", "Amazon", "Nvidia", "Adobe", "PwC", "JPMorgan", "Apple"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-bits-cse", name: "B.E. Computer Science", duration: "4 Years", fees: 540000, eligibility: "Class 12 with 75% in PCM + BITSAT score" },
      { id: "crs-bits-eee", name: "B.E. Electrical & Electronics", duration: "4 Years", fees: 540000, eligibility: "Class 12 with 75% in PCM + BITSAT score" }
    ],
    reviews: [
      { id: "rev-bits-1", rating: 4.7, comment: "The Practice School system ensures you get industry-ready even before graduating. Plus, the alumni network is exceptionally supportive.", pros: "No attendance rule, Practice School, alumni network", cons: "Fees are significantly higher than IITs", userName: "Rahul Verma", createdAt: "2026-03-24" }
    ]
  },
  {
    id: "col-iiith",
    slug: "iiit-hyderabad",
    name: "International Institute of Information Technology, Hyderabad",
    description: "IIIT Hyderabad is an autonomous research university focusing on information technology, computer sciences, and electronics. It is widely considered one of the top institutes in Asia for coding, algorithmic programming, and AI research.",
    location: "Hyderabad, Telangana",
    fees: 400000,
    rating: 4.85,
    ownershipType: "Private",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/83/IIITH_Boys_Hostel.jpg",
    ranking: "NIRF Rank 14 (Engineering)",
    accreditation: "NAAC A+",
    highlights: [
      "Unmatched coding culture and GSoC achievements",
      "Undergraduates participate in active research from 2nd year",
      "Located in Gachibowli, the tech hub of Hyderabad",
      "Stellar placement records rivaling top IITs"
    ],
    placementStats: {
      averagePackage: 30.2,
      highestPackage: 102.5,
      placementPercentage: 99,
      recruiters: ["Google", "Facebook", "Microsoft", "Apple", "Adobe", "Rubrik", "Uber"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1607237138185-eedd996e5b09?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iiith-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 400000, eligibility: "JEE Main percentile or UGEE exam" },
      { id: "crs-iiith-ece", name: "B.Tech Electronics & Comm.", duration: "4 Years", fees: 400000, eligibility: "JEE Main percentile or UGEE exam" }
    ],
    reviews: [
      { id: "rev-iiith-1", rating: 4.9, comment: "If you love coding, this is heaven. Competitive programming culture is intense. Placements are unbelievably good.", pros: "Coding culture, coding labs, research, placement packages", cons: "No non-tech courses, campus is small", userName: "Rohan Das", createdAt: "2026-05-14" }
    ]
  },
  {
    id: "col-vit",
    slug: "vellore-institute-of-technology",
    name: "Vellore Institute of Technology, Vellore",
    description: "VIT is a premier private university located in Vellore, Tamil Nadu. It is highly popular for its massive student intake, modern campus infrastructure, and wide range of industrial research collaborations.",
    location: "Vellore, Tamil Nadu",
    fees: 200000,
    rating: 4.25,
    ownershipType: "Private",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/43/Technology_Tower%28VIT%29.jpg",
    ranking: "NIRF Rank 11 (Engineering)",
    accreditation: "NAAC A++",
    highlights: [
      "Flexible Credit System (FFCS) lets you choose your own teachers & slots",
      "Vibrant international relations and semester-abroad options",
      "Huge state-of-the-art campus and hostel blocks",
      "Very high placement volume with hundreds of recruiters"
    ],
    placementStats: {
      averagePackage: 9.5,
      highestPackage: 45.0,
      placementPercentage: 90,
      recruiters: ["Cognizant", "Wipro", "TCS", "Accenture", "Microsoft", "Intel", "Ebay", "Dell"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-vit-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 200000, eligibility: "Class 12 with 60% in PCM + VITEEE exam" },
      { id: "crs-vit-ece", name: "B.Tech Electronics and Comm.", duration: "4 Years", fees: 195000, eligibility: "Class 12 with 60% in PCM + VITEEE exam" }
    ],
    reviews: [
      { id: "rev-vit-1", rating: 4.0, comment: "FFCS is a blessing if you plan your timetables well. The campus is premium and clean, but the crowd is huge.", pros: "FFCS system, good infrastructure, multiple recruiters", cons: "Massive student crowd, strict curfew timings", userName: "Sameer Sen", createdAt: "2026-02-28" }
    ]
  },
  {
    id: "col-dtu",
    slug: "dtu-delhi",
    name: "Delhi Technological University, Delhi",
    description: "Delhi Technological University (formerly Delhi College of Engineering) is a premier state government university in Delhi. Established in 1941, it has a stellar reputation for engineering education and a highly active placement cell.",
    location: "New Delhi, Delhi",
    fees: 220000,
    rating: 4.55,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/DelhiCollegeOfEngineering_BawanaCampus.jpg",
    ranking: "NIRF Rank 29 (Engineering)",
    accreditation: "NAAC A",
    highlights: [
      "One of the oldest engineering colleges in India (founded in 1941)",
      "Excellent coding culture and high percentage of JEE Main top rankers",
      "Sprawling 164-acre campus in Rohini, Delhi",
      "Stellar placement records, especially in software and analytics"
    ],
    placementStats: {
      averagePackage: 16.5,
      highestPackage: 82.0,
      placementPercentage: 92,
      recruiters: ["Google", "Microsoft", "Amazon", "Uber", "Qualcomm", "Goldman Sachs", "Morgan Stanley"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-dtu-cse", name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 220000, eligibility: "Class 12 (60% aggregate in PCM) + JEE Main score via JAC Delhi" },
      { id: "crs-dtu-ece", name: "B.Tech Electronics & Comm. Eng.", duration: "4 Years", fees: 220000, eligibility: "Class 12 (60% aggregate in PCM) + JEE Main score via JAC Delhi" }
    ],
    reviews: [
      { id: "rev-dtu-1", rating: 4.6, comment: "DCE legacy is massive. Excellent placements in tech companies and a great campus life.", pros: "Delhi location advantage, high packages, large alumni network", cons: "Hostel seat availability is limited for Delhi residents", userName: "Aditya Verma", createdAt: "2026-04-18" }
    ]
  },

  // --- MANAGEMENT ---
  {
    id: "col-iima",
    slug: "iim-ahmedabad",
    name: "Indian Institute of Management, Ahmedabad",
    description: "IIM Ahmedabad is India's leading business school. Renowned for its rigorous Case Method pedagogy, the institute prepares global business leaders and records some of the highest package placements globally.",
    location: "Ahmedabad, Gujarat",
    fees: 1250000,
    rating: 5.0,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Iima_new_campus_panorama.jpg",
    ranking: "NIRF Rank 1 (Management)",
    accreditation: "EQUIS Accredited",
    highlights: [
      "Ranked #1 Business School in India",
      "Case study methodology based learning",
      "Beautiful Louis Kahn brick architecture campus",
      "Unparalleled domestic and international placement packages"
    ],
    placementStats: {
      averagePackage: 32.8,
      highestPackage: 115.0,
      placementPercentage: 100,
      recruiters: ["McKinsey", "BCG", "Bain & Company", "Goldman Sachs", "HUL", "TAS"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iima-pgp", name: "PGP (MBA Equivalent)", duration: "2 Years", fees: 1250000, eligibility: "Bachelor's Degree + CAT qualification" }
    ],
    reviews: [
      { id: "rev-iima-1", rating: 5, comment: "The Red Brick campus is a dream. Case discussions are intensely stimulating. Placements are 100% with top management consultancies.", pros: "Peer learning, case study model, high average salary", cons: "Extreme academic load, sleep-deprived weeks", userName: "Vikram Mehta", createdAt: "2026-05-10" }
    ]
  },
  {
    id: "col-iimb",
    slug: "iim-bangalore",
    name: "Indian Institute of Management, Bangalore",
    description: "IIM Bangalore is a top business school in Asia. Its proximity to the Silicon Valley of India provides students with strong corporate exposures, startup connect, and consulting opportunities.",
    location: "Bangalore, Karnataka",
    fees: 1220000,
    rating: 4.9,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/17/IIMB_Campus3.jpg",
    ranking: "NIRF Rank 2 (Management)",
    accreditation: "EQUIS Accredited",
    highlights: [
      "Stellar tech-startup integration and mentorship",
      "Beautiful green stone architecture campus",
      "Exceptional corporate and industry collaborations",
      "Highly qualified global faculty"
    ],
    placementStats: {
      averagePackage: 35.3,
      highestPackage: 110.0,
      placementPercentage: 100,
      recruiters: ["Boston Consulting Group", "Bain & Co", "McKinsey", "Microsoft", "JPMorgan", "Amazon"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iimb-pgp", name: "PGP (MBA)", duration: "2 Years", fees: 1220000, eligibility: "Graduation + CAT exam" }
    ],
    reviews: [
      { id: "rev-iimb-1", rating: 4.9, comment: "IIMB offers great flexibility in electives. The campus is green and peaceful, perfect for studying.", pros: "Silicon Valley location, corporate relations, campus design", cons: "Very competitive grading", userName: "Divya Reddy", createdAt: "2026-03-02" }
    ]
  },
  {
    id: "col-iimc",
    slug: "iim-calcutta",
    name: "Indian Institute of Management, Calcutta",
    description: "IIM Calcutta was the first IIM established in India (1961). Globally renowned as a finance powerhouse, its campus is situated around scenic natural lakes. It features top finance, analytics, and strategy placements.",
    location: "Kolkata, West Bengal",
    fees: 1200000,
    rating: 4.92,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Indian_Institute_of_Management_Kolkata%2C_Auditorium.jpg",
    ranking: "NIRF Rank 3 (Management)",
    accreditation: "Triple Crown (AACSB, AMBA, EQUIS)",
    highlights: [
      "First IIM established in the country (1961)",
      "Known as the 'Finance Campus' of India with stellar investment banking offers",
      "Sprawling Joka campus containing seven beautiful natural lakes",
      "Only Indian member of CEMS Global Alliance in Management Education"
    ],
    placementStats: {
      averagePackage: 35.0,
      highestPackage: 112.0,
      placementPercentage: 100,
      recruiters: ["Goldman Sachs", "Morgan Stanley", "JPMorgan Chase", "McKinsey", "BCG", "Avendus Capital"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1525921429624-479b6c294520?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iimc-pgp", name: "PGP (MBA Equivalent)", duration: "2 Years", fees: 1200000, eligibility: "Graduation + CAT exam" }
    ],
    reviews: [
      { id: "rev-iimc-1", rating: 5, comment: "If you love finance or quantitative fields, Joka is unparalleled. The lakes provide a peaceful vibe.", pros: "Finance placements, quantitative coursework, lakes campus", cons: "Extreme winter/summer humidity in West Bengal", userName: "Arnab Banerjee", createdAt: "2026-04-12" }
    ]
  },
  {
    id: "col-iimk",
    slug: "iim-kozhikode",
    name: "Indian Institute of Management, Kozhikode",
    description: "IIM Kozhikode was established in 1996 in the picturesque Kunnamangalam hills of Kerala. It is renowned for its gender diversity ratios and modern business pedagogy.",
    location: "Kozhikode, Kerala",
    fees: 1050000,
    rating: 4.75,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/33/IIM_Kozhikode_Aerial_View_s.jpg",
    ranking: "NIRF Rank 4 (Management)",
    accreditation: "AMBA & EQUIS",
    highlights: [
      "Famed campus situated on two scenic hilltops in Kerala",
      "Leading business school for gender diversity initiatives",
      "Robust placement structures, particularly in marketing and consulting",
      "Excellent executive MBA programs"
    ],
    placementStats: {
      averagePackage: 31.0,
      highestPackage: 72.0,
      placementPercentage: 100,
      recruiters: ["Bain & Co", "McKinsey", "Accenture Strategy", "HUL", "Nestle", "Amazon", "Microsoft"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iimk-pgp", name: "PGP (MBA)", duration: "2 Years", fees: 1050000, eligibility: "Graduation + CAT exam" }
    ],
    reviews: [
      { id: "rev-iimk-1", rating: 4.8, comment: "Stunning hills view campus. The peer group is very diverse. Very active placement support.", pros: "Hilltop scenery, high gender diversity, great consulting offers", cons: "Heavy rainfall seasons can restrict outdoor movements", userName: "Anjali Menon", createdAt: "2026-03-05" }
    ]
  },
  {
    id: "col-iiml",
    slug: "iim-lucknow",
    name: "Indian Institute of Management, Lucknow",
    description: "Established in 1984, IIM Lucknow is recognized for its rigorous academic structure, outstanding placements, and heavy focus on sustainable and green management fields.",
    location: "Lucknow, Uttar Pradesh",
    fees: 1000000,
    rating: 4.80,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Academic_block_II_of_IIM_Lucknow.jpg",
    ranking: "NIRF Rank 6 (Management)",
    accreditation: "AACSB and AMBA",
    highlights: [
      "Famed as the academic 'HelL' due to its extreme academic rigor",
      "Sprawling 190-acre brick campus in the historic city of Lucknow",
      "Highly renowned consulting, finance, and corporate strategy recruiters",
      "First IIM to establish a satellite campus in Noida for executive studies"
    ],
    placementStats: {
      averagePackage: 32.2,
      highestPackage: 80.0,
      placementPercentage: 100,
      recruiters: ["McKinsey", "BCG", "Bain & Company", "Goldman Sachs", "HUL", "TAS", "Aditya Birla"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-iiml-pgp", name: "PGP (MBA)", duration: "2 Years", fees: 1000000, eligibility: "Graduation + CAT exam" }
    ],
    reviews: [
      { id: "rev-iiml-1", rating: 4.8, comment: "Extremely rigorous. It tests your boundaries but prepares you perfectly for the corporate world.", pros: "Stellar placements, academic discipline, good green campus", cons: "Very high stress levels during case submissions", userName: "Aman Kapoor", createdAt: "2026-04-14" }
    ]
  },
  {
    id: "col-fms",
    slug: "fms-delhi",
    name: "Faculty of Management Studies, Delhi University",
    description: "FMS Delhi is a premier business school under the University of Delhi. Famed as the 'ROI King of India', it offers one of the lowest MBA tuition fees (~1.0L/yr) in the world while matching IIM Ahmedabad in placement averages.",
    location: "New Delhi, Delhi",
    fees: 100000,
    rating: 4.85,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Delhi_School_of_Economics%2C_University_of_Delhi.jpg",
    ranking: "Top Business School (Highest ROI)",
    accreditation: "University of Delhi affiliated",
    highlights: [
      "Highest Return on Investment (ROI) globally for an MBA program",
      "Tuition fees are virtually nominal (~1 Lakh/year) compared to IIMs",
      "Located in South/North Delhi with exceptional corporate access",
      "Stellar placement records matching the top three IIMs"
    ],
    placementStats: {
      averagePackage: 34.1,
      highestPackage: 123.0,
      placementPercentage: 100,
      recruiters: ["Morgan Sachs", "McKinsey", "BCG", "Bain & Co", "HUL", "ITC", "Google"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-fms-mba", name: "MBA (Management)", duration: "2 Years", fees: 100000, eligibility: "Graduation + CAT percentile (Usually 99.5+)" }
    ],
    reviews: [
      { id: "rev-fms-1", rating: 4.9, comment: "Unbelievable ROI. You pay peanuts for tuition and graduate with packages averaging over 34 LPA.", pros: "Incredible ROI, prime corporate ties, South Delhi location", cons: "Small red brick campus, less campus hostel facilities", userName: "Aditya Goel", createdAt: "2026-05-01" }
    ]
  },
  {
    id: "col-xlri",
    slug: "xlri-jamshedpur",
    name: "Xavier School of Management, Jamshedpur",
    description: "XLRI Jamshedpur, established in 1949, is the oldest business school in India. It is universally recognized as the top Human Resource Management (HRM) program in Asia and features elite marketing and consulting placements.",
    location: "Jamshedpur, Jharkhand",
    fees: 1300000,
    rating: 4.88,
    ownershipType: "Private",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Xlri_Campus%2C_Jamshedpur.jpg",
    ranking: "NIRF Rank 9 (Management)",
    accreditation: "AACSB, AMBA, EQUIS",
    highlights: [
      "Oldest business school in India, founded by Jesuit fathers in 1949",
      "Universally ranked as the best Human Resource Management program in Asia",
      "Stellar placement records in consulting, corporate finance, and marketing",
      "Famous XL-IIMC annual sports meet and strong alumni bonding"
    ],
    placementStats: {
      averagePackage: 32.7,
      highestPackage: 98.0,
      placementPercentage: 100,
      recruiters: ["Bain & Company", "BCG", "Goldman Sachs", "HUL", "P&G", "TAS", "ITC", "Microsoft"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-xlri-pgp", name: "PGP (MBA)", duration: "2 Years", fees: 1300000, eligibility: "Graduation + XAT qualification score" }
    ],
    reviews: [
      { id: "rev-xlri-1", rating: 4.9, comment: "The XL culture is legendary. The bonds you make here stay for life. HRM placements are outstanding.", pros: "Jesuit culture, HRM dominance in Asia, high corporate package offers", cons: "Located in Jamshedpur, direct airport connectivity is restricted", userName: "Sneha Sen", createdAt: "2026-03-18" }
    ]
  },

  // --- MEDICAL ---
  {
    id: "col-aiims",
    slug: "aiims-delhi",
    name: "All India Institute of Medical Sciences, New Delhi",
    description: "AIIMS New Delhi is the leading medical institute and public hospital in India. Established in 1956, it offers top-tier medical education (MBBS, MD/MS) and conducts advanced biomedical research.",
    location: "New Delhi, Delhi",
    fees: 1628,
    rating: 5.0,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cd/AIIMS_-New_Delhi%27s_Ward_Block.jpg",
    ranking: "NIRF Rank 1 (Medical)",
    accreditation: "Supreme Medical Council of India",
    highlights: [
      "Highest ranked medical college in South Asia",
      "Virtually free medical education with top facilities",
      "Huge patient flow offers unparalleled clinical exposure",
      "Top-tier residency programs"
    ],
    placementStats: {
      averagePackage: 18.0,
      highestPackage: 35.0,
      placementPercentage: 100,
      recruiters: ["AIIMS Residency", "Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "Global Research"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-aiims-mbbs", name: "MBBS (Medical Degree)", duration: "5.5 Years", fees: 1628, eligibility: "Class 12 with 60% in PCB + NEET Rank 1-100" }
    ],
    reviews: [
      { id: "rev-aiims-1", rating: 5, comment: "Clinical exposure at AIIMS is unbelievable. You treat cases that other doctors only read in textbooks. The fees are practically zero.", pros: "World-class clinical exposure, peer groups, zero fees", cons: "Extremely hectic, overcrowded OPDs", userName: "Dr. Rohan Gupta", createdAt: "2026-04-12" }
    ]
  },
  {
    id: "col-pgimer",
    slug: "pgimer-chandigarh",
    name: "Postgraduate Institute of Medical Education and Research",
    description: "PGIME&R Chandigarh is a premier public medical research university. Founded in 1962, it is globally recognized for advanced specialties, postgraduate residencies, and extensive clinical research.",
    location: "Chandigarh, Punjab/Haryana",
    fees: 5000,
    rating: 4.88,
    ownershipType: "Public",
    image: "https://images.collegedunia.com/public/college_data/images/campusimage/1529574488pgi.jpg",
    ranking: "NIRF Rank 2 (Medical)",
    accreditation: "National Importance",
    highlights: [
      "Ranked #2 Medical Institute in India consistently",
      "Elite tertiary healthcare and referral center in North India",
      "Unparalleled research in medical specialties and surgical technology",
      "Highly competitive residency programs"
    ],
    placementStats: {
      averagePackage: 17.0,
      highestPackage: 30.0,
      placementPercentage: 100,
      recruiters: ["PGIMER Residency", "Max Hospitals", "Medanta", "Fortis Healthcare", "Govt Medical Services"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-pgi-md", name: "MD (Doctor of Medicine)", duration: "3 Years", fees: 5000, eligibility: "MBBS degree + INI-CET qualified score" }
    ],
    reviews: [
      { id: "rev-pgi-1", rating: 4.9, comment: "The PG training here is world-class. Hectic hours but the clinical learning is massive.", pros: "Highly qualified consultants, heavy case volume, clean city", cons: "Exacting workloads with little leisure time", userName: "Dr. Preet Kaur", createdAt: "2026-01-20" }
    ]
  },
  {
    id: "col-cmc",
    slug: "cmc-vellore",
    name: "Christian Medical College, Vellore",
    description: "CMC Vellore, established in 1900, is a highly reputed private medical college and hospital. Famed for pioneering major medical milestones in India (like the first open-heart surgery and bone marrow transplant), it focus heavily on community health.",
    location: "Vellore, Tamil Nadu",
    fees: 52000,
    rating: 4.80,
    ownershipType: "Private",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3b/CMCH_Vellore.JPG",
    ranking: "NIRF Rank 3 (Medical)",
    accreditation: "NABH and NABL Accredited",
    highlights: [
      "Founded in 1900, rich history of medical firsts in India",
      "Strong emphasis on community healthcare and ethical practice",
      "Sprawling clinical infrastructure treating millions of patients annually",
      "Highly selective merit-based entry via NEET"
    ],
    placementStats: {
      averagePackage: 12.0,
      highestPackage: 24.0,
      placementPercentage: 98,
      recruiters: ["CMC Residency", "Apollo Hospitals", "Christian Mission Hospitals", "Fortis", "Aster DM Healthcare"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-cmc-mbbs", name: "MBBS (Medical Degree)", duration: "5.5 Years", fees: 52000, eligibility: "Class 12 (60% aggregate in PCB) + NEET qualified rank" }
    ],
    reviews: [
      { id: "rev-cmc-1", rating: 4.8, comment: "Highly ethical environment. The community medicine posting is eye-opening. Great learning facilities.", pros: "Community care focus, ethical values, clinical guidance", cons: "Vellore town has hot climate", userName: "Dr. Sandeep Thomas", createdAt: "2026-03-24" }
    ]
  },
  {
    id: "col-jipmer",
    slug: "jipmer-puducherry",
    name: "Jawaharlal Institute of Postgraduate Medical Education & Research",
    description: "JIPMER Puducherry is a premier public medical university under the Ministry of Health, India. Famed for its clean campus and state-of-the-art super-specialty blocks, JIPMER offers heavily subsidized quality education.",
    location: "Puducherry, Pondicherry",
    fees: 12000,
    rating: 4.82,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/JIPMER.jpg",
    ranking: "NIRF Rank 5 (Medical)",
    accreditation: "National Importance",
    highlights: [
      "Subsidized medical degree program with top-tier equipment",
      "Huge referral campus in South India with a super-specialty hospital",
      "Excellent research culture in molecular biology and pharmacy",
      "Clean, beautiful campus in the French-heritage city of Pondicherry"
    ],
    placementStats: {
      averagePackage: 15.0,
      highestPackage: 28.0,
      placementPercentage: 100,
      recruiters: ["JIPMER Residency", "Apollo Hospitals", "Govt Medical Services", "Fortis", "Gastro Research Labs"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-jipmer-mbbs", name: "MBBS (Medical Degree)", duration: "5.5 Years", fees: 12000, eligibility: "Class 12 (60% aggregate in PCB) + NEET/INI-CET score" }
    ],
    reviews: [
      { id: "rev-jipmer-1", rating: 4.9, comment: "Subsidized top-tier education. Pondicherry campus life is relaxed but OPDs are highly educational.", pros: "Low fee structure, beautiful French town proximity, great clinical equipment", cons: "Highly competitive peer atmosphere", userName: "Dr. Lakshmi Priya", createdAt: "2026-04-18" }
    ]
  },
  {
    id: "col-kgmu",
    slug: "kgmu-lucknow",
    name: "King George's Medical University, Lucknow",
    description: "King George's Medical University is a premier public medical university in Lucknow, Uttar Pradesh. Established in 1911, it is famous for its Gothic-style structural designs, vast patient flow, and outstanding medical pedagogy.",
    location: "Lucknow, Uttar Pradesh",
    fees: 55000,
    rating: 4.70,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/26/KGMU_Lucknow.jpg",
    ranking: "NIRF Rank 12 (Medical)",
    accreditation: "Medical Council of India",
    highlights: [
      "Historic medical university founded in 1911",
      "One of the largest patient intakes in North India offering huge clinical records",
      "Stately British Gothic campus architecture",
      "Elite list of alumni practicing medicine globally"
    ],
    placementStats: {
      averagePackage: 13.0,
      highestPackage: 22.0,
      placementPercentage: 97,
      recruiters: ["KGMU Residency", "Apollo Hospitals", "Medanta", "UP Health Services", "Fortis"]
    },
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/3/31/KGMU_BUILDING.jpg",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-kgmu-mbbs", name: "MBBS (Medical Degree)", duration: "5.5 Years", fees: 55000, eligibility: "Class 12 (50% aggregate in PCB) + NEET score" }
    ],
    reviews: [
      { id: "rev-kgmu-1", rating: 4.7, comment: "Steep learning curve due to massive patient inflow. Gothic heritage campus is unique.", pros: "Immense case exposure, historical pride, solid training", cons: "Overcrowded wards and hectic night shifts", userName: "Dr. Amit Tripathi", createdAt: "2026-05-02" }
    ]
  },
  {
    id: "col-mamc",
    slug: "mamc-delhi",
    name: "Maulana Azad Medical College, New Delhi",
    description: "MAMC New Delhi is a premier public medical college affiliated with the University of Delhi. Famed for its associated Lok Nayak and GB Pant hospitals, it provides excellent clinical training and handles massive daily patient flow.",
    location: "New Delhi, Delhi",
    fees: 15000,
    rating: 4.86,
    ownershipType: "Public",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Maulana_Azad_Medical_College.jpg",
    ranking: "NIRF Rank 24 (Medical)",
    accreditation: "University of Delhi affiliated",
    highlights: [
      "Affiliated with Lok Nayak Hospital (2900 beds) offering outstanding clinical exposure",
      "Located in central Delhi, near Connaught Place",
      "Extremely subsidized fees for top medical degrees",
      "Highly selective entrance requirements via NEET"
    ],
    placementStats: {
      averagePackage: 16.0,
      highestPackage: 26.0,
      placementPercentage: 99,
      recruiters: ["MAMC Residency", "Delhi Health Services", "Apollo Hospitals", "Max Healthcare", "Fortis"]
    },
    gallery: [
      "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80"
    ],
    courses: [
      { id: "crs-mamc-mbbs", name: "MBBS (Medical Degree)", duration: "5.5 Years", fees: 15000, eligibility: "Class 12 (60% aggregate in PCB) + NEET Rank 1-250" }
    ],
    reviews: [
      { id: "rev-mamc-1", rating: 4.9, comment: "LNJP hospital clinical exposure is unmatched. Subsidized fees and a central Delhi location are major pros.", pros: "Central Delhi location, LNJP exposure, low fees", cons: "Extremely busy residency rosters", userName: "Dr. Rohit Gupta", createdAt: "2026-04-12" }
    ]
  }
];
