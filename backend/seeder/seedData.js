// Helper to format dates YYYY-MM-DD
const getDateStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const users = [
  {
    name: 'Rahul Sharma',
    email: 'demo@imovies.com',
    password: 'password123',
    phone: '+91 9876543210',
    role: 'user',
  },
  {
    name: 'Admin User',
    email: 'admin@imovies.com',
    password: 'admin123',
    phone: '+91 9123456789',
    role: 'admin',
  },
];

const movies = [
  {
    title: 'Kalki 2898 AD',
    synopsis:
      'Set in a post-apocalyptic world in the year 2898 AD, a modern-day avatar of Vishnu descends to Earth to protect the world from evil forces in a high-octane spectacle combining Indian mythology and dystopian science fiction.',
    genre: ['Action', 'Sci-Fi', 'Mythology'],
    duration: 181,
    language: ['Hindi', 'Telugu', 'Tamil', 'English'],
    releaseDate: new Date('2024-06-27'),
    rating: 8.4,
    certificate: 'U/A',
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1400&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=kQDd1AhGIHk',
    director: 'Nag Ashwin',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Deepika Padukone', 'Kamal Haasan'],
    isActive: true,
  },
  {
    title: 'Jawan',
    synopsis:
      'A high-voltage emotional action journey of a man who is set out to rectify the wrongs in the society, in a bid to fulfill a promise made years ago, facing off against a monstrous outlaw who has no fear.',
    genre: ['Action', 'Thriller'],
    duration: 169,
    language: ['Hindi', 'Tamil', 'Telugu'],
    releaseDate: new Date('2023-09-07'),
    rating: 8.1,
    certificate: 'U/A',
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    bannerUrl:
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1400&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=MWOlnZSnXWE',
    director: 'Atlee',
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone'],
    isActive: true,
  },
  {
    title: 'Oppenheimer',
    synopsis:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral complexity and sheer intellectual force of the Manhattan Project.',
    genre: ['Biography', 'Drama', 'History'],
    duration: 180,
    language: ['English', 'Hindi'],
    releaseDate: new Date('2023-07-21'),
    rating: 8.9,
    certificate: 'A',
    posterUrl:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1400&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    isActive: true,
  },
  {
    title: 'Dune: Part Two',
    synopsis:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future.',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    duration: 166,
    language: ['English', 'Hindi'],
    releaseDate: new Date('2024-03-01'),
    rating: 8.6,
    certificate: 'U/A',
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    bannerUrl:
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1400&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    isActive: true,
  },
  {
    title: 'Inception',
    synopsis:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    duration: 148,
    language: ['English', 'Hindi'],
    releaseDate: new Date('2010-07-16'),
    rating: 8.8,
    certificate: 'U/A',
    posterUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1400&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    isActive: true,
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    synopsis:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    genre: ['Animation', 'Action', 'Adventure'],
    duration: 140,
    language: ['English', 'Hindi', 'Tamil'],
    releaseDate: new Date('2023-06-02'),
    rating: 8.7,
    certificate: 'U',
    posterUrl:
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    bannerUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    isActive: true,
  },
];

module.exports = { users, movies, getDateStr };

