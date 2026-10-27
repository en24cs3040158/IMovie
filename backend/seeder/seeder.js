const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const { users, movies, getDateStr } = require('./seedData');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';
    console.log(`📡 Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // Clear existing data
    console.log('🧹 Clearing previous collections...');
    await User.deleteMany();
    await Movie.deleteMany();
    await Showtime.deleteMany();
    await Booking.deleteMany();

    // Insert Users
    console.log('👤 Seeding default users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users.`);
    console.log(`   - Demo User: demo@imovies.com / password123`);
    console.log(`   - Admin:     admin@imovies.com / admin123`);

    // Insert Movies
    console.log('🎬 Seeding movies...');
    const createdMovies = await Movie.insertMany(movies);
    console.log(`✅ Created ${createdMovies.length} movies.`);

    // Create realistic showtimes for the next 3 days
    console.log('🎟️ Seeding showtimes & seating layouts...');
    const showtimesToInsert = [];
    const times = ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM', '10:45 PM'];
    const formats = ['2D', '3D', 'IMAX 3D', '4DX'];
    const screens = [
      { name: 'PVR INOX Palladium', screen: 'Audi 1 (IMAX Laser)', city: 'Mumbai' },
      { name: 'Cinepolis Grand Mall', screen: 'Audi 3 (Dolby Atmos)', city: 'Mumbai' },
      { name: 'PVR ICON Gold Class', screen: 'Audi 5 (4DX)', city: 'Mumbai' },
    ];

    for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
      const showDate = getDateStr(dayOffset);

      for (const movie of createdMovies) {
        // Create 2 to 3 showtimes per movie per day
        const selectedTimes = times.slice(0, 3);
        for (let i = 0; i < selectedTimes.length; i++) {
          const theaterChoice = screens[i % screens.length];
          const formatChoice = formats[i % formats.length];

          // Simulate some pre-booked seats to show real-time seat availability
          const randomPreBooked = [];
          if (dayOffset === 0 && i === 1) {
            randomPreBooked.push('A3', 'A4', 'B5', 'C3', 'C4', 'E5');
          } else if (dayOffset === 0 && i === 2) {
            randomPreBooked.push('B3', 'B4', 'C1', 'C2', 'D4', 'D5', 'G2');
          } else if (dayOffset === 1 && i === 0) {
            randomPreBooked.push('A1', 'A2', 'C6');
          }

          showtimesToInsert.push({
            movie: movie._id,
            theater: theaterChoice,
            showDate,
            startTime: selectedTimes[i],
            format: formatChoice,
            pricing: {
              platinum: 380,
              gold: 260,
              silver: 180,
            },
            totalSeats: 64,
            bookedSeats: randomPreBooked,
            isActive: true,
          });
        }
      }
    }

    const createdShowtimes = await Showtime.insertMany(showtimesToInsert);
    console.log(`✅ Created ${createdShowtimes.length} showtimes across upcoming dates.`);

    // Create an initial sample booking for demo user
    const demoUser = createdUsers.find((u) => u.email === 'demo@imovies.com');
    if (demoUser && createdShowtimes.length > 0) {
      const sampleShowtime = createdShowtimes[0];
      await Booking.create({
        bookingId: 'IM-' + new Date().toISOString().slice(2, 7).replace('-', '') + '-DEMO1',
        user: demoUser._id,
        movie: sampleShowtime.movie,
        showtime: sampleShowtime._id,
        seats: [
          { seatNumber: 'C3', tier: 'gold', price: 260 },
          { seatNumber: 'C4', tier: 'gold', price: 260 },
        ],
        subtotal: 520,
        convenienceFee: 50,
        totalAmount: 570,
        paymentDetails: {
          method: 'UPI',
          transactionId: 'TXN-DEMO12345',
          status: 'Completed',
        },
        status: 'Confirmed',
      });
      console.log('✅ Created initial sample booking for demo user.');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error while seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

