/**
 * JobHub Database Seed Script
 * Run: node seed.js
 * Seeds 1 poster user + 20 diverse job listings into MongoDB.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const JOBS = [
  {
    title: 'Senior React Developer',
    company: 'Stripe',
    salary: 145000,
    type: 'remote',
    description:
      'Join our frontend platform team to build high-performance payment UIs used by millions. You will own complex React components, drive performance improvements, and mentor junior engineers.',
  },
  {
    title: 'Node.js Backend Engineer',
    company: 'Shopify',
    salary: 130000,
    type: 'remote',
    description:
      'Design and scale RESTful and GraphQL APIs that power Shopify\'s merchant platform. Experience with Node.js, PostgreSQL, and Redis is required.',
  },
  {
    title: 'Full Stack Engineer',
    company: 'Notion',
    salary: 140000,
    type: 'hybrid',
    description:
      'Work across the entire stack — from React/TypeScript on the frontend to Go microservices on the backend. You\'ll help build features used by 30M+ users.',
  },
  {
    title: 'DevOps Engineer',
    company: 'Cloudflare',
    salary: 135000,
    type: 'remote',
    description:
      'Manage and automate CI/CD pipelines, Kubernetes clusters, and cloud infrastructure on AWS/GCP. Strong knowledge of Terraform and Helm required.',
  },
  {
    title: 'Machine Learning Engineer',
    company: 'OpenAI',
    salary: 200000,
    type: 'onsite',
    description:
      'Train, fine-tune, and deploy large language models. Collaborate with research scientists to move models from prototype to production at massive scale.',
  },
  {
    title: 'UI/UX Designer',
    company: 'Figma',
    salary: 115000,
    type: 'hybrid',
    description:
      'Design intuitive, accessible, and beautiful interfaces for Figma\'s creative tools. Conduct user research, create wireframes, and ship pixel-perfect designs.',
  },
  {
    title: 'Data Engineer',
    company: 'Airbnb',
    salary: 140000,
    type: 'hybrid',
    description:
      'Build and maintain scalable data pipelines using Spark, Airflow, and dbt. Partner with data scientists to deliver clean, reliable datasets for analytics.',
  },
  {
    title: 'iOS Developer',
    company: 'Duolingo',
    salary: 125000,
    type: 'remote',
    description:
      'Build delightful learning experiences in Swift. Work closely with designers and product managers to ship features to 50M+ daily active learners.',
  },
  {
    title: 'Android Engineer',
    company: 'Spotify',
    salary: 128000,
    type: 'remote',
    description:
      'Develop and optimize Spotify\'s Android app using Kotlin. Work on music playback, offline caching, and social sharing features loved by 600M users.',
  },
  {
    title: 'Product Manager',
    company: 'Linear',
    salary: 155000,
    type: 'remote',
    description:
      'Define the roadmap for Linear\'s project management suite. Gather customer feedback, write detailed specs, and work alongside a world-class engineering team.',
  },
  {
    title: 'Site Reliability Engineer',
    company: 'GitHub',
    salary: 150000,
    type: 'remote',
    description:
      'Ensure GitHub\'s platform is always available and performant. Respond to incidents, build runbooks, and eliminate toil through automation.',
  },
  {
    title: 'Python Developer',
    company: 'Palantir',
    salary: 138000,
    type: 'onsite',
    description:
      'Build data analytics and workflow orchestration tools in Python. You\'ll work with government and enterprise clients to solve high-stakes problems.',
  },
  {
    title: 'Frontend Engineer (Vue.js)',
    company: 'GitLab',
    salary: 120000,
    type: 'remote',
    description:
      'Contribute to GitLab\'s open-source DevSecOps platform. Write clean, accessible Vue.js components and collaborate with a fully remote team across time zones.',
  },
  {
    title: 'Blockchain Developer',
    company: 'Coinbase',
    salary: 160000,
    type: 'hybrid',
    description:
      'Build smart contracts and DeFi integrations on Ethereum and other L2 chains. Strong Solidity skills and experience with Hardhat/Foundry required.',
  },
  {
    title: 'Cloud Solutions Architect',
    company: 'Vercel',
    salary: 175000,
    type: 'remote',
    description:
      'Design scalable edge infrastructure solutions for enterprise customers. Guide teams on migrating workloads to the Vercel platform and Next.js.',
  },
  {
    title: 'QA Automation Engineer',
    company: 'Atlassian',
    salary: 105000,
    type: 'remote',
    description:
      'Build and maintain automated test suites using Playwright and Jest. Improve release velocity and confidence for Jira and Confluence product lines.',
  },
  {
    title: 'Database Administrator',
    company: 'PlanetScale',
    salary: 118000,
    type: 'remote',
    description:
      'Manage and optimize PostgreSQL and MySQL databases at massive scale. Design sharding strategies and help customers achieve zero-downtime schema migrations.',
  },
  {
    title: 'Technical Writer',
    company: 'Twilio',
    salary: 95000,
    type: 'remote',
    description:
      'Create world-class API documentation, tutorials, and developer guides for Twilio\'s communication APIs. Make complex topics accessible and engaging.',
  },
  {
    title: 'Cybersecurity Analyst',
    company: 'CrowdStrike',
    salary: 120000,
    type: 'onsite',
    description:
      'Monitor, detect, and respond to security threats across enterprise networks. Perform threat hunting, vulnerability assessments, and incident response.',
  },
  {
    title: 'Junior Web Developer',
    company: 'Buffer',
    salary: 72000,
    type: 'remote',
    description:
      'A great role for developers with 1–2 years of experience. Build features for Buffer\'s social media scheduling platform using React and Rails in a fully async, remote-first team.',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Job.deleteMany({});
  console.log('🗑️  Cleared existing jobs');

  // Create or find a system poster user
  let poster = await User.findOne({ username: 'admin_poster' });
  if (!poster) {
    poster = await User.create({
      username: 'admin_poster',
      password: 'poster123',
      userType: 'poster',
    });
    console.log('👤 Created poster user: admin_poster / poster123');
  } else {
    console.log('👤 Using existing poster: admin_poster');
  }

  // Insert all jobs
  const jobDocs = JOBS.map((j) => ({ ...j, posterId: poster._id, savedBy: [] }));
  await Job.insertMany(jobDocs);
  console.log(`✅ Inserted ${JOBS.length} jobs successfully!`);

  console.log('\n🎉 Seed complete! You can now log in as:');
  console.log('   Username: admin_poster');
  console.log('   Password: poster123');
  console.log('   Role:     Job Poster');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
