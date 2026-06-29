import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');

const CITIES = [
  { city: 'Bathinda', state: 'Punjab' },
  { city: 'Chandigarh', state: 'UT' },
  { city: 'Mohali', state: 'Punjab' },
  { city: 'Patiala', state: 'Punjab' },
  { city: 'Ludhiana', state: 'Punjab' },
  { city: 'Amritsar', state: 'Punjab' },
  { city: 'Jalandhar', state: 'Punjab' },
  { city: 'Delhi', state: 'NCR' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Pune', state: 'Maharashtra' }
];

async function seedLatestJobs() {
  try {
    console.log("Fetching latest job listings from the internet...");
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api');
    if (!res.ok) {
      throw new Error(`API returned status: ${res.status}`);
    }

    const data = await res.json();
    const rawJobs = data.data || [];
    console.log(`Fetched ${rawJobs.length} raw jobs from ATS streams.`);

    if (rawJobs.length === 0) {
      console.log("No jobs fetched.");
      return;
    }

    // Read current DB file
    if (!fs.existsSync(DB_FILE)) {
      console.error("db.json does not exist!");
      return;
    }

    const dbContent = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(dbContent);

    if (!db.jobs) db.jobs = [];

    // Keep existing manually created recruiter jobs (non-imported ones)
    const existingManualJobs = db.jobs.filter(j => !j.id.startsWith('job-imported'));
    console.log(`Retaining ${existingManualJobs.length} manual/original jobs.`);

    const newImportedJobs = [];

    rawJobs.forEach((job, index) => {
      let cleanTitle = job.title;
      if (cleanTitle.includes(' - ')) {
        cleanTitle = cleanTitle.split(' - ')[0];
      }
      if (cleanTitle.includes(' | ')) {
        cleanTitle = cleanTitle.split(' | ')[0];
      }

      // Strip HTML description tags
      let cleanDesc = job.description ? job.description.replace(/<[^>]*>/g, '') : '';
      if (cleanDesc.length > 300) {
        cleanDesc = cleanDesc.substring(0, 300) + '...';
      }

      // Pick a random location from supported list
      const locationInfo = CITIES[index % CITIES.length];

      const salaryRange = [
        '₹6,00,000 - ₹9,50,000 / year',
        '₹8,50,000 - ₹12,00,000 / year',
        '₹12,00,000 - ₹18,00,000 / year',
        '₹15,00,000 - ₹24,00,000 / year'
      ][index % 4];

      const experienceLevel = [
        'Entry-level',
        'Mid-level',
        'Mid-level',
        'Senior-level'
      ][index % 4];

      const logoEmoji = ['🚀', '💻', '💡', '🔥', '🛡️', '⚡', '🤖', '👾'][index % 8];

      const newJob = {
        id: `job-imported-seeder-${Date.now()}-${index}`,
        title: cleanTitle,
        companyName: job.company_name,
        logoSeed: logoEmoji,
        location: `${locationInfo.city}, ${locationInfo.state}`,
        type: 'Full-time',
        mode: job.remote ? 'Remote' : (index % 2 === 0 ? 'Hybrid' : 'On-site'),
        salary: salaryRange,
        experience: experienceLevel,
        skills: job.tags && job.tags.length > 0 ? job.tags.slice(0, 4) : ['Engineering', 'Software', 'React'],
        description: cleanDesc || 'We are looking for a software professional to join our core development team.',
        requirements: [
          'Strong fundamentals in web technologies and languages',
          'Analytical mind with problem-solving attitude',
          'Good team cooperation and proactive attitude',
          'Adherence to the Hyriq Fair Work Pact commitments'
        ],
        benefits: [
          'Flexible working hours & hybrid options',
          'Comprehensive health insurance plans',
          'Skill development and training allowances'
        ],
        postedDate: new Date(Date.now() - (index * 2 * 60 * 60 * 1000)).toISOString(), // seed dates staggered by hours
        recruiterId: 'recruiter-imported',
        fairWorkPact: true,
        chatLiveHours: '10:00 AM - 6:00 PM'
      };

      newImportedJobs.push(newJob);
    });

    // Merge manual and new imported jobs
    db.jobs = [...existingManualJobs, ...newImportedJobs];
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');

    console.log(`Seeded ${newImportedJobs.length} new jobs. Total jobs in database is now: ${db.jobs.length}`);
  } catch (e) {
    console.error("Error seeding jobs:", e);
  }
}

seedLatestJobs();
