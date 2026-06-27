import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');
const SEED_FILE = path.join(process.cwd(), 'jobs_bathinda.json');

try {
  if (!fs.existsSync(DB_FILE)) {
    console.error("Error: db.json not found in root directory.");
    process.exit(1);
  }
  
  if (!fs.existsSync(SEED_FILE)) {
    console.error("Error: jobs_bathinda.json not found in root directory.");
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  const seedJobs = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));

  if (!db.jobs) db.jobs = [];

  console.log(`Currently has ${db.jobs.length} jobs in database.`);

  seedJobs.forEach((job, index) => {
    // Generate a unique ID
    const jobId = `job-bathinda-${Date.now()}-${index}`;
    
    // Construct full job object
    const finalJob = {
      id: jobId,
      ...job,
      postedDate: "Just now",
      recruiterId: "user-admin-raj", // Seeded admin recruiter
      fairWorkPact: true
    };
    
    db.jobs.push(finalJob);
    console.log(`Added: ${job.title} at ${job.companyName}`);
  });

  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`Successfully imported ${seedJobs.length} new jobs! Total jobs: ${db.jobs.length}`);

} catch (err) {
  console.error("Error running import script:", err);
}
