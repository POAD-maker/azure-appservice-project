const bcrypt = require('bcryptjs');
const saltRounds = 10;

const db = {
  users: [
    { username: 'admin', password: bcrypt.hashSync('password123', saltRounds), role: 'admin' },
    { username: 'user', password: bcrypt.hashSync('password123', saltRounds), role: 'user' }
  ],
  events: [
    { id: 1, name: 'DevOps Bootcamp Final Presentation', date: '2026-10-15', category: 'Education', price: 0, totalSeats: 50, bookedSeats: 0 },
    { id: 2, name: 'Cloud Architecture Summit', date: '2026-11-01', category: 'Technology', price: 150, totalSeats: 100, bookedSeats: 0 },
    { id: 3, name: 'Azure App Service Workshop', date: '2026-11-10', category: 'Workshop', price: 75, totalSeats: 25, bookedSeats: 0 }
  ],
  bookings: []
};

const database = {
  registerUser: async (username, password) => {
    const exists = db.users.find(u => u.username === username);
    if (exists) throw new Error('Username already taken');
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = { username, password: hashedPassword, role: 'user' };
    db.users.push(newUser);
    return newUser;
  },

  loginUser: async (username, password) => {
    const user = db.users.find(u => u.username === username);
    if (!user) throw new Error('Invalid username or password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid username or password');
    return user;
  },

  getEvents: async () => db.events.map(e => ({ ...e, availableSeats: e.totalSeats - e.bookedSeats })),
  
  createBooking: async (eventId, userName, userEmail) => {
    const event = db.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    if (event.bookedSeats >= event.totalSeats) throw new Error('Event is sold out');
    const isDuplicate = db.bookings.some(b => b.eventId === eventId && b.userEmail === userEmail);
    if (isDuplicate) throw new Error('This email has already booked this event.');
    const booking = { id: Date.now(), eventId, eventName: event.name, category: event.category, price: event.price, userName, userEmail, bookedAt: new Date().toISOString() };
    db.bookings.push(booking);
    event.bookedSeats += 1;
    return booking;
  },

  getAllBookings: async () => db.bookings,
  checkConnection: async () => true
};

module.exports = database;
