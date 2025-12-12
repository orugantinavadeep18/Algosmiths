import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testUsers = [
  {
    fullName: 'Raj Kumar',
    username: 'raj_kumar',
    email: 'raj@example.com',
    phone: '+918765432100',
    password: 'Test@1234',
    accountStatus: 'active',
    isActive: true,
    location: {
      type: 'Point',
      coordinates: [78.4867, 17.3850] // Hyderabad city center
    },
    address: 'Hyderabad, Telangana',
    rating: 4.5,
    completedTasks: 15,
    hourlyRate: 500,
    title: 'Web Developer'
  },
  {
    fullName: 'Priya Singh',
    username: 'priya_singh',
    email: 'priya@example.com',
    phone: '+918765432101',
    password: 'Test@1234',
    accountStatus: 'active',
    isActive: true,
    location: {
      type: 'Point',
      coordinates: [78.5, 17.39] // Near Hyderabad
    },
    address: 'Banjara Hills, Hyderabad',
    rating: 4.8,
    completedTasks: 28,
    hourlyRate: 600,
    title: 'UI/UX Designer'
  },
  {
    fullName: 'Arjun Patel',
    username: 'arjun_patel',
    email: 'arjun@example.com',
    phone: '+918765432102',
    password: 'Test@1234',
    accountStatus: 'active',
    isActive: true,
    location: {
      type: 'Point',
      coordinates: [78.47, 17.38] // Close to city center
    },
    address: 'Jubilee Hills, Hyderabad',
    rating: 4.3,
    completedTasks: 10,
    hourlyRate: 450,
    title: 'Mobile Developer'
  },
  {
    fullName: 'Neha Sharma',
    username: 'neha_sharma',
    email: 'neha@example.com',
    phone: '+918765432103',
    password: 'Test@1234',
    accountStatus: 'active',
    isActive: true,
    location: {
      type: 'Point',
      coordinates: [78.52, 17.40] // Different area
    },
    address: 'Kondapur, Hyderabad',
    rating: 4.7,
    completedTasks: 22,
    hourlyRate: 550,
    title: 'Data Analyst'
  },
  {
    fullName: 'Vikram Kumar',
    username: 'vikram_kumar',
    email: 'vikram@example.com',
    phone: '+918765432104',
    password: 'Test@1234',
    accountStatus: 'active',
    isActive: true,
    location: {
      type: 'Point',
      coordinates: [78.45, 17.37] // Different area
    },
    address: 'Secunderabad, Hyderabad',
    rating: 4.6,
    completedTasks: 18,
    hourlyRate: 500,
    title: 'Graphic Designer'
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Hash passwords
    for (let user of testUsers) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    // Clear existing test users
    console.log('Clearing existing test users...');
    await User.deleteMany({
      username: { $in: testUsers.map(u => u.username) }
    });
    console.log('✅ Cleared existing test users');

    // Insert new users
    console.log('Inserting test users...');
    const insertedUsers = await User.insertMany(testUsers);
    console.log(`✅ Successfully inserted ${insertedUsers.length} test users`);

    // List inserted users
    console.log('\n📍 Test Users Added:');
    insertedUsers.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.fullName} (@${user.username})`);
      console.log(`   Location: [${user.location.coordinates[0]}, ${user.location.coordinates[1]}]`);
      console.log(`   Address: ${user.address}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Rating: ${user.rating}⭐`);
      console.log('');
    });

    console.log('🎉 Database seeded successfully!');
    console.log('\nYou can now test the map nearby workers feature.');
    console.log('Login with any of these credentials:');
    testUsers.forEach(user => {
      console.log(`- Email: ${user.email} | Password: Test@1234`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

seedDatabase();
