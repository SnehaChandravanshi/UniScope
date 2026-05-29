import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { rawColleges } from '../lib/rawCollegesData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');
  try {
    // Clear tables
    await prisma.savedCollege.deleteMany();
    await prisma.savedComparison.deleteMany();
    await prisma.review.deleteMany();
    await prisma.course.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.college.deleteMany();
    await prisma.user.deleteMany();

    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = await prisma.user.create({
      data: {
        id: "demo-user-id",
        name: "Demo Student",
        email: "demo@example.com",
        password: hashedPassword,
      },
    });
    console.log('Created demo user:', demoUser.email);

    for (const col of rawColleges) {
      const createdCollege = await prisma.college.create({
        data: {
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
          ranking: col.ranking,
          accreditation: col.accreditation,
          gallery: col.gallery,
          placementStats: col.placementStats as any,
        },
      });

      for (const course of col.courses) {
        await prisma.course.create({
          data: {
            id: course.id,
            collegeId: createdCollege.id,
            name: course.name,
            duration: course.duration,
            fees: course.fees,
            eligibility: course.eligibility,
          },
        });
      }

      for (const review of col.reviews) {
        await prisma.review.create({
          data: {
            id: review.id,
            userId: demoUser.id,
            collegeId: createdCollege.id,
            rating: review.rating,
            comment: review.comment,
            pros: review.pros || null,
            cons: review.cons || null,
          },
        });
      }
    }

    // Seed discussions
    console.log('Seeding Q&A / Discussions...');
    const questionsData = [
      {
        id: "q-1",
        title: "How is the hostel life and mess food at IIT Bombay?",
        content: "I am considering joining IIT Bombay CSE this year. Can anyone share details about the hostel facilities, room sharing in the first year, and the quality of food in the mess?",
        collegeId: "col-iitb",
        answers: [
          {
            id: "a-1",
            content: "Hostel life at IIT Bombay is amazing. First-year students are usually allocated Hostels 15 or 16, which are newer and have double-sharing rooms. The mess food in these newer hostels is quite decent, with a good variety of vegetarian and non-vegetarian options. The campus culture and late-night study sessions make it worth it!"
          },
          {
            id: "a-2",
            content: "Totally agree with the above. The older hostels (H1 to H10) are a bit compact, but they are currently undergoing renovation. Mess food varies from hostel to hostel, but you can always eat at the canteens like Hostels 5 and 12, which are open till 2-3 AM."
          }
        ]
      },
      {
        id: "q-2",
        title: "Is it worth choosing FMS Delhi over IIM Kozhikode/Lucknow for marketing?",
        content: "FMS is known as the ROI king with very low fees. But do we get the same level of marketing roles and global opportunities as IIM Lucknow or Kozhikode?",
        collegeId: "col-fms",
        answers: [
          {
            id: "a-3",
            content: "FMS is absolutely stellar for marketing. Top FMCG recruiters like HUL, P&G, ITC, and L'Oreal visit the campus and offer exactly the same roles (sales & marketing management trainee) as they do at IIMA/B/C/L. The ROI is unbeatable since your total fees are around 2 Lakhs, whereas IIMs charge 20-25 Lakhs."
          }
        ]
      },
      {
        id: "q-3",
        title: "What is the class schedule and coding culture like at IIIT Hyderabad?",
        content: "I have heard that IIIT Hyderabad is very academics-heavy and has a strict coding workload. How do students manage coding contests, research work, and exams?",
        collegeId: "col-iiith",
        answers: [
          {
            id: "a-4",
            content: "It is indeed highly rigorous. You get assignments almost every week, and classes are mandatory. However, the coding culture is unmatched. The peer group pushes you to participate in GSoC, ACM-ICPC, and hackathons. If you love computer science, you'll manage it, but expect late nights!"
          }
        ]
      },
      {
        id: "q-4",
        title: "Are there good sports facilities at BITS Pilani?",
        content: "I play competitive football and want to know about the sports fields, coaches, and sports fests at BITS Pilani (Pilani campus).",
        collegeId: "col-bits",
        answers: [
          {
            id: "a-5",
            content: "Yes! BITS Pilani has a massive sports complex called SAC (Student Activity Center) which has a fully equipped gym, indoor badminton courts, and table tennis. The main sports ground has a high-quality football field, athletic tracks, and cricket pitches. BOSM (BITS Open Sports Meet) is one of the largest college sports fests in the country, attracting teams nationwide."
          }
        ]
      },
      {
        id: "q-5",
        title: "How to prepare for the CAT exam while working full-time?",
        content: "I have a 9-6 software engineering job and want to prepare for CAT to get into top IIMs. How many hours should I study daily, and when should I start taking mock tests?",
        collegeId: null,
        answers: [
          {
            id: "a-6",
            content: "Start by studying 2 hours on weekdays (early morning or late night) and 5-6 hours on weekends. Focus on building concepts in Quantitative Aptitude and Verbal Ability first. Start taking sectional mock tests from June and full-length mocks from August. Consistency is key!"
          }
        ]
      }
    ];

    for (const q of questionsData) {
      const createdQuestion = await prisma.question.create({
        data: {
          id: q.id,
          title: q.title,
          content: q.content,
          userId: demoUser.id,
          collegeId: q.collegeId,
        },
      });

      for (const ans of q.answers) {
        await prisma.answer.create({
          data: {
            id: ans.id,
            content: ans.content,
            userId: demoUser.id,
            questionId: createdQuestion.id,
          },
        });
      }
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
    console.log('Ensure you have configured a running database in .env to seed. Continuing seed execution...');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
