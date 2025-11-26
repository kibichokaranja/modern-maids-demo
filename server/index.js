import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 4002;
const JWT_SECRET = process.env.JWT_SECRET || 'modern-maids-secret-key-change-in-production';

// CORS configuration - allow multiple origins
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ['http://localhost:3002'];

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.) in development
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // Check if origin is in allowed list
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (origin) {
      callback(new Error('Not allowed by CORS'));
    } else {
      callback(null, true);
    }
  },
  credentials: true 
}));
app.use(express.json());

const users = [
  { id: "1", name: "Admin Manager", email: "admin@modernmaids.com", password: "admin123", role: "admin" },
  { id: "2", name: "Sarah Cleaner", email: "cleaner@modernmaids.com", password: "cleaner123", role: "cleaner" },
  { id: "3", name: "Mike Cleaner", email: "mike@modernmaids.com", password: "cleaner123", role: "cleaner" }
];

const cleaners = [
  { id: "2", name: "Sarah Cleaner", status: "active", phone: "+1 (555) 123-4567", hireDate: "2024-01-15", totalJobs: 45, completedJobs: 42, rating: 4.8 },
  { id: "3", name: "Mike Cleaner", status: "active", phone: "+1 (555) 234-5678", hireDate: "2024-02-20", totalJobs: 38, completedJobs: 35, rating: 4.6 },
  { id: "4", name: "Emily Johnson", status: "offline", phone: "+1 (555) 345-6789", hireDate: "2024-03-10", totalJobs: 28, completedJobs: 26, rating: 4.9 }
];

const jobs = [
  { id: "1", customerName: "Downtown Office Building", address: "123 Business Ave, Suite 200, Dallas, TX 75201", serviceType: "Office Cleaning", scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], scheduledTime: "09:00", estimatedDuration: 3, status: "Scheduled", assignedCleanerId: "2", checkInTime: null, checkOutTime: null, completedAt: null, notes: "Focus on restrooms and kitchen area", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "2", customerName: "Residential Home - Smith Family", address: "456 Oak Street, Dallas, TX 75202", serviceType: "Deep Cleaning", scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], scheduledTime: "14:00", estimatedDuration: 4, status: "Scheduled", assignedCleanerId: "3", checkInTime: null, checkOutTime: null, completedAt: null, notes: "Pet-friendly cleaning products only", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { id: "3", customerName: "Medical Clinic", address: "789 Health Plaza, Dallas, TX 75203", serviceType: "Medical Facility Cleaning", scheduledDate: new Date().toISOString().split('T')[0], scheduledTime: "08:00", estimatedDuration: 5, status: "In Progress", assignedCleanerId: "2", checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), checkOutTime: null, completedAt: null, notes: "Sterilization required", createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: "4", customerName: "Retail Store", address: "321 Commerce Blvd, Dallas, TX 75204", serviceType: "Commercial Cleaning", scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], scheduledTime: "18:00", estimatedDuration: 2, status: "Completed", assignedCleanerId: "3", checkInTime: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), checkOutTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), notes: "Completed successfully", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "5", customerName: "Apartment Complex", address: "555 Residential Way, Dallas, TX 75205", serviceType: "Move-out Cleaning", scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], scheduledTime: "10:00", estimatedDuration: 6, status: "Scheduled", assignedCleanerId: null, checkInTime: null, checkOutTime: null, completedAt: null, notes: "Empty unit, full deep clean required", createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() }
];

const timesheets = [
  { id: "1", cleanerId: "2", cleanerName: "Sarah Cleaner", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], checkInTime: "08:45", checkOutTime: "17:30", totalHours: 8.75, jobsCompleted: 3, status: "Submitted" },
  { id: "2", cleanerId: "3", cleanerName: "Mike Cleaner", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], checkInTime: "09:00", checkOutTime: "18:00", totalHours: 9.0, jobsCompleted: 2, status: "Submitted" },
  { id: "3", cleanerId: "2", cleanerName: "Sarah Cleaner", date: new Date().toISOString().split('T')[0], checkInTime: "08:00", checkOutTime: null, totalHours: 0, jobsCompleted: 0, status: "In Progress" }
];

const activityLog = [
  { id: "1", message: "Server started - Modern Maids demo data loaded", timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
  { id: "2", message: "New cleaning job created for Downtown Office Building", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: "3", message: "Job #1 assigned to Sarah Cleaner", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
  { id: "4", message: "Sarah Cleaner checked in for Job #3 at Medical Clinic", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "5", message: "Job #4 completed by Mike Cleaner", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
];

function addActivityLog(message) {
  const entry = { id: String(Date.now()), message, timestamp: new Date().toISOString() };
  activityLog.unshift(entry);
  if (activityLog.length > 100) activityLog.pop();
  return entry;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  addActivityLog(`User ${user.name} (${user.role}) logged in`);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/me', authenticateToken, (req, res) => { res.json(req.user); });

app.get('/api/cleaners', authenticateToken, requireAdmin, (req, res) => { res.json(cleaners); });

app.post('/api/cleaners', authenticateToken, requireAdmin, (req, res) => {
  const { name, phone, hireDate } = req.body;
  if (!name) return res.status(400).json({ error: 'Cleaner name required' });
  const newCleaner = { id: String(Date.now()), name, phone: phone || "", hireDate: hireDate || new Date().toISOString().split('T')[0], status: "active", totalJobs: 0, completedJobs: 0, rating: 0 };
  cleaners.push(newCleaner);
  addActivityLog(`Admin created new cleaner: ${name}`);
  res.status(201).json(newCleaner);
});

app.get('/api/cleaners/:id/metrics', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const cleaner = cleaners.find(c => c.id === id);
  if (!cleaner) return res.status(404).json({ error: 'Cleaner not found' });
  const cleanerJobs = jobs.filter(j => j.assignedCleanerId === id);
  const completedJobs = cleanerJobs.filter(j => j.status === 'Completed');
  const inProgressJobs = cleanerJobs.filter(j => j.status === 'In Progress');
  const jobsWithDuration = completedJobs.filter(j => j.checkInTime && j.checkOutTime);
  const avgDuration = jobsWithDuration.length > 0 ? jobsWithDuration.reduce((sum, j) => { const duration = (new Date(j.checkOutTime) - new Date(j.checkInTime)) / (1000 * 60 * 60); return sum + duration; }, 0) / jobsWithDuration.length : 0;
  res.json({ cleaner, totalJobs: cleanerJobs.length, completedJobs: completedJobs.length, inProgressJobs: inProgressJobs.length, pendingJobs: cleanerJobs.filter(j => j.status === 'Scheduled').length, completionRate: cleanerJobs.length > 0 ? (completedJobs.length / cleanerJobs.length * 100).toFixed(1) : 0, averageJobDuration: avgDuration.toFixed(2), recentJobs: cleanerJobs.slice(0, 10) });
});

app.get('/api/jobs', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') res.json(jobs);
  else res.json(jobs.filter(job => job.assignedCleanerId === req.user.id));
});

app.post('/api/jobs', authenticateToken, requireAdmin, (req, res) => {
  const { customerName, address, serviceType, scheduledDate, scheduledTime, estimatedDuration, assignedCleanerId, notes } = req.body;
  if (!customerName || !address || !serviceType || !scheduledDate || !scheduledTime) return res.status(400).json({ error: 'Missing required fields' });
  const newJob = { id: String(Date.now()), customerName, address, serviceType, scheduledDate, scheduledTime, estimatedDuration: estimatedDuration || 2, status: "Scheduled", assignedCleanerId: assignedCleanerId || null, checkInTime: null, checkOutTime: null, completedAt: null, notes: notes || "", createdAt: new Date().toISOString() };
  jobs.push(newJob);
  addActivityLog(`New cleaning job created for ${customerName}`);
  res.status(201).json(newJob);
});

app.patch('/api/jobs/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params; const { status } = req.body;
  const validStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const job = jobs.find(j => j.id === id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (req.user.role === 'cleaner' && job.assignedCleanerId !== req.user.id) return res.status(403).json({ error: 'You can only update your assigned jobs' });
  job.status = status;
  if (status === 'Completed') {
    job.completedAt = new Date().toISOString();
    if (!job.checkOutTime) job.checkOutTime = new Date().toISOString();
    const cleaner = cleaners.find(c => c.id === job.assignedCleanerId);
    if (cleaner) { cleaner.completedJobs = (cleaner.completedJobs || 0) + 1; cleaner.totalJobs = (cleaner.totalJobs || 0) + 1; }
  }
  addActivityLog(`Job #${id} status updated to ${status} by ${req.user.name}`);
  res.json(job);
});

app.post('/api/jobs/:id/checkin', authenticateToken, (req, res) => {
  const { id } = req.params; const job = jobs.find(j => j.id === id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (req.user.role === 'cleaner' && job.assignedCleanerId !== req.user.id) return res.status(403).json({ error: 'You can only check in to your assigned jobs' });
  if (job.checkInTime) return res.status(400).json({ error: 'Already checked in' });
  job.checkInTime = new Date().toISOString(); job.status = 'In Progress';
  addActivityLog(`${req.user.name} checked in for Job #${id} at ${job.customerName}`);
  res.json(job);
});

app.post('/api/jobs/:id/checkout', authenticateToken, (req, res) => {
  const { id } = req.params; const job = jobs.find(j => j.id === id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (req.user.role === 'cleaner' && job.assignedCleanerId !== req.user.id) return res.status(403).json({ error: 'You can only check out from your assigned jobs' });
  if (!job.checkInTime) return res.status(400).json({ error: 'Must check in before checking out' });
  if (job.checkOutTime) return res.status(400).json({ error: 'Already checked out' });
  job.checkOutTime = new Date().toISOString();
  addActivityLog(`${req.user.name} checked out from Job #${id} at ${job.customerName}`);
  res.json(job);
});

app.get('/api/jobs/completed', authenticateToken, (req, res) => {
  const completedJobs = jobs.filter(j => j.status === 'Completed');
  if (req.user.role === 'cleaner') return res.json(completedJobs.filter(j => j.assignedCleanerId === req.user.id));
  res.json(completedJobs);
});

app.get('/api/timesheets', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') res.json(timesheets);
  else res.json(timesheets.filter(t => t.cleanerId === req.user.id));
});

app.post('/api/timesheets', authenticateToken, (req, res) => {
  const { date, checkInTime, checkOutTime } = req.body;
  if (!date || !checkInTime) return res.status(400).json({ error: 'Date and check-in time required' });
  let totalHours = 0;
  if (checkOutTime) {
    const [inHour, inMin] = checkInTime.split(':').map(Number);
    const [outHour, outMin] = checkOutTime.split(':').map(Number);
    totalHours = ((outHour * 60 + outMin) - (inHour * 60 + inMin)) / 60;
  }
  const cleaner = cleaners.find(c => c.id === req.user.id);
  const cleanerName = cleaner ? cleaner.name : req.user.name;
  const newTimesheet = { id: String(Date.now()), cleanerId: req.user.id, cleanerName, date, checkInTime, checkOutTime: checkOutTime || null, totalHours: totalHours.toFixed(2), jobsCompleted: 0, status: checkOutTime ? "Submitted" : "In Progress" };
  timesheets.push(newTimesheet);
  addActivityLog(`${req.user.name} submitted timesheet for ${date}`);
  res.status(201).json(newTimesheet);
});

app.get('/api/activity', authenticateToken, requireAdmin, (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(activityLog.slice(0, limit));
});

app.get('/api/dashboard/stats', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    totalJobs: jobs.length,
    scheduledJobs: jobs.filter(j => j.status === 'Scheduled').length,
    inProgressJobs: jobs.filter(j => j.status === 'In Progress').length,
    completedJobs: jobs.filter(j => j.status === 'Completed').length,
    activeCleaners: cleaners.filter(c => c.status === 'active').length,
    totalCleaners: cleaners.length,
    completionRate: jobs.length > 0 ? ((jobs.filter(j => j.status === 'Completed').length / jobs.length) * 100).toFixed(1) : 0
  });
});

app.get('/api/health', (req, res) => { res.json({ status: 'ok' }); });

app.listen(PORT, () => {
  console.log(` Modern Maids Server running on http://localhost:${PORT}`);
  console.log(` Demo data loaded:`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${cleaners.length} cleaners`);
  console.log(`   - ${jobs.length} jobs`);
  console.log(`   - ${timesheets.length} timesheets`);
  console.log(`   - ${activityLog.length} activity log entries`);
});