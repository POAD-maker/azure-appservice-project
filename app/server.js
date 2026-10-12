const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => { console.log(`${new Date().toISOString()} ${req.method} ${req.url}`); next(); });

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token && token.startsWith('mock-token-')) {
    const parts = token.split('-');
    if (parts.length === 4) {
      req.user = { username: parts[2], role: parts[3] };
      return next();
    }
  }
  res.status(401).json({ error: 'Unauthorized: Invalid token' });
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ error: 'Forbidden: Admin access required' });
};

// --- HEALTH CHECK ---
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await db.checkConnection();
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString(), database: dbStatus ? 'connected' : 'disconnected' });
  } catch (error) { res.status(503).json({ status: 'unhealthy', error: error.message }); }
});

// --- REGISTER ENDPOINT (THIS IS WHAT WAS MISSING!) ---
app.post('/api/register', async (req, res) => {
  try {
    console.log('Register attempt:', req.body);
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const user = await db.registerUser(username, password);
    console.log('User registered:', user.username);
    res.status(201).json({ message: 'User registered successfully', username: user.username });
  } catch (error) { 
    console.error('Register error:', error.message);
    res.status(400).json({ error: error.message }); 
  }
});

// --- LOGIN ENDPOINT ---
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body.username);
    const { username, password } = req.body;
    const user = await db.loginUser(username, password);
    const token = `mock-token-${user.username}-${user.role}`;
    res.json({ token, role: user.role, username: user.username });
  } catch (error) { 
    console.error('Login error:', error.message);
    res.status(401).json({ error: error.message }); 
  }
});

// --- EVENTS ---
app.get('/api/events', async (req, res) => {
  try { res.json({ success: true, count: db.events.length, data: await db.getEvents() }); } 
  catch (error) { res.status(500).json({ error: 'Database error' }); }
});

// --- BOOKINGS ---
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { eventId, userName, userEmail } = req.body;
    const booking = await db.createBooking(eventId, userName, userEmail);
    res.status(201).json({ success: true, data: booking });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

// --- ADMIN ---
app.get('/api/admin/bookings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const bookings = await db.getAllBookings();
    res.json({ success: true, totalBookings: bookings.length, data: bookings });
  } catch (error) { res.status(500).json({ error: 'Database error' }); }
});

// --- SERVE FRONTEND ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Ticket Booking App running on port ${PORT}`));
