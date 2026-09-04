require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Skill = require('../models/Skill');
const ConnectionRequest = require('../models/ConnectionRequest');

const skillsData = [
  { name: 'React', category: 'Development' },
  { name: 'JavaScript', category: 'Development' },
  { name: 'HTML/CSS', category: 'Development' },
  { name: 'Next.js', category: 'Development' },
  { name: 'Node.js', category: 'Development' },
  { name: 'Express', category: 'Development' },
  { name: 'MongoDB', category: 'Development' },
  { name: 'Python', category: 'Development' },
  { name: 'C', category: 'Development' },
  { name: 'C++', category: 'Development' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Photoshop', category: 'Design' },
  { name: 'Illustrator', category: 'Design' },
  { name: 'Video Editing', category: 'Design' },
  { name: 'Graphic Design', category: 'Design' },
  { name: 'Digital Marketing', category: 'Marketing' },
  { name: 'SEO', category: 'Marketing' },
  { name: 'Photography', category: 'Creative' },
  { name: 'Public Speaking', category: 'Communication' },
  { name: 'English', category: 'Languages' },
  { name: 'Spanish', category: 'Languages' }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data to ensure a clean demo environment
    await User.deleteMany({});
    await Skill.deleteMany({});
    await ConnectionRequest.deleteMany({});
    console.log('Cleared existing database records.');

    // Seed Skills
    const seededSkills = await Skill.insertMany(skillsData);
    console.log(`Seeded ${seededSkills.length} skills successfully.`);

    // Password Hashing helper
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Seed Demo Users
    const usersData = [
      {
        name: 'Mohammad Arafat Amin',
        email: 'arafat@skillswap.demo',
        password: await hashPassword('Arafat123'),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        bio: 'Frontend Developer. I enjoy building web applications and learning new technologies.',
        location: 'Dhaka, Bangladesh',
        teachingSkills: ['React', 'JavaScript', 'HTML/CSS'],
        learningSkills: ['UI/UX Design', 'Photoshop', 'Node.js']
      },
      {
        name: 'Maya Islam',
        email: 'maya@skillswap.demo',
        password: await hashPassword('Maya123'),
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
        bio: 'UI/UX Designer who loves crafting high-fidelity design prototypes and wireframes.',
        location: 'Sylhet, Bangladesh',
        teachingSkills: ['UI/UX Design', 'Photoshop'],
        learningSkills: ['React', 'JavaScript']
      },
      {
        name: 'Nafis Rahman',
        email: 'nafis@skillswap.demo',
        password: await hashPassword('Nafis123'),
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
        bio: 'Fullstack engineer working primarily on backend APIs and database optimizations.',
        location: 'Chittagong, Bangladesh',
        teachingSkills: ['Node.js', 'Express', 'MongoDB'],
        learningSkills: ['React', 'UI/UX Design']
      },
      {
        name: 'Sami Ahmed',
        email: 'sami@skillswap.demo',
        password: await hashPassword('Sami123'),
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
        bio: 'Student and aspiring programmer. Interested in systems programming and languages.',
        location: 'Rajshahi, Bangladesh',
        teachingSkills: ['C', 'C++', 'Python'],
        learningSkills: ['HTML/CSS', 'JavaScript']
      },
      {
        name: 'Rafi Chowdhury',
        email: 'rafi@skillswap.demo',
        password: await hashPassword('Rafi123'),
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
        bio: 'Digital marketer and content creator. Love taking photos and writing SEO copies.',
        location: 'Khulna, Bangladesh',
        teachingSkills: ['Digital Marketing', 'SEO', 'Photography'],
        learningSkills: ['Video Editing', 'Python']
      },
      {
        name: 'Tanjim Hasan',
        email: 'tanjim@skillswap.demo',
        password: await hashPassword('Tanjim123'),
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
        bio: 'Language enthusiast and teacher. Can help you improve spoken communication.',
        location: 'Barisal, Bangladesh',
        teachingSkills: ['English', 'Public Speaking'],
        learningSkills: ['UI/UX Design', 'Digital Marketing']
      }
    ];

    const seededUsers = await User.insertMany(usersData);
    console.log(`Seeded ${seededUsers.length} users successfully.`);

    // Create a few default request statuses for dashboard validation
    const arafat = seededUsers.find(u => u.email === 'arafat@skillswap.demo');
    const nafis = seededUsers.find(u => u.email === 'nafis@skillswap.demo');
    const sami = seededUsers.find(u => u.email === 'sami@skillswap.demo');
    const rafi = seededUsers.find(u => u.email === 'rafi@skillswap.demo');
    const tanjim = seededUsers.find(u => u.email === 'tanjim@skillswap.demo');

    const requestsData = [
      {
        sender: nafis._id,
        receiver: arafat._id,
        status: 'pending'
      },
      {
        sender: sami._id,
        receiver: arafat._id,
        status: 'accepted'
      },
      {
        sender: rafi._id,
        receiver: tanjim._id,
        status: 'accepted'
      }
    ];

    const seededRequests = await ConnectionRequest.insertMany(requestsData);
    console.log(`Seeded ${seededRequests.length} active/pending connection requests.`);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedDB();
