import fs from 'fs';
import path from 'path';

const DB_JS_FILE = path.join(process.cwd(), 'server', 'db.js');
const SEED_FILE = path.join(process.cwd(), 'jobs_bathinda.json');

try {
  if (!fs.existsSync(DB_JS_FILE)) {
    console.error("Error: server/db.js not found.");
    process.exit(1);
  }
  
  if (!fs.existsSync(SEED_FILE)) {
    console.error("Error: jobs_bathinda.json not found.");
    process.exit(1);
  }

  let dbJsContent = fs.readFileSync(DB_JS_FILE, 'utf-8');
  const seedJobs = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));

  // Let's format the jobs to look exactly like the ones in db.js
  let formattedJobs = "";
  seedJobs.forEach((job, index) => {
    const jobId = `job-bathinda-${index + 1}`;
    formattedJobs += `,\n  {\n`;
    formattedJobs += `    id: '${jobId}',\n`;
    formattedJobs += `    title: '${job.title}',\n`;
    formattedJobs += `    companyName: '${job.companyName}',\n`;
    formattedJobs += `    logoSeed: '${job.logoSeed}',\n`;
    formattedJobs += `    location: '${job.location}',\n`;
    formattedJobs += `    type: '${job.type}',\n`;
    formattedJobs += `    mode: '${job.mode}',\n`;
    formattedJobs += `    salary: '${job.salary}',\n`;
    formattedJobs += `    experience: '${job.experience}',\n`;
    formattedJobs += `    skills: ${JSON.stringify(job.skills)},\n`;
    formattedJobs += `    description: ${JSON.stringify(job.description)},\n`;
    formattedJobs += `    requirements: ${JSON.stringify(job.requirements)},\n`;
    formattedJobs += `    benefits: ${JSON.stringify(job.benefits)},\n`;
    formattedJobs += `    postedDate: 'Just now',\n`;
    formattedJobs += `    recruiterId: 'user-recruiter-1',\n`;
    formattedJobs += `    fairWorkPact: true\n`;
    formattedJobs += `  }`;
  });

  // Target the end of the defaultJobs array in db.js (line 340-341)
  // We can search for the end of job-12:
  // "recruiterId: 'user-recruiter-1',\n    fairWorkPact: true\n  }\n];"
  const targetPattern = "recruiterId: 'user-recruiter-1',\n    fairWorkPact: true\n  }\n];";
  const replacement = `recruiterId: 'user-recruiter-1',\n    fairWorkPact: true\n  }${formattedJobs}\n];`;

  if (dbJsContent.includes(targetPattern)) {
    dbJsContent = dbJsContent.replace(targetPattern, replacement);
    fs.writeFileSync(DB_JS_FILE, dbJsContent, 'utf-8');
    console.log("Successfully appended new jobs to server/db.js defaultJobs array!");
  } else {
    console.error("Pattern not found in server/db.js! Check targetPattern.");
  }

} catch (err) {
  console.error("Error modifying server/db.js:", err);
}
