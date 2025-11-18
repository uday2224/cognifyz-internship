const express = require('express');
const path = require('path');
const sanitizeHtml = (s) => String(s || '').replace(/[<>]/g, '');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for demo (replace with DB in Task 6)
let submissions = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// helper: find by id
function findIndexById(id) {
  return submissions.findIndex(s => String(s.id) === String(id));
}

// Home
app.get('/', (req, res) => {
  res.render('index', { submissions });
});

// Form page
app.get('/form', (req, res) => {
  res.render('form', { errors: {}, values: {} });
});

// Dashboard UI
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Handle form POST (legacy route used by form submit)
app.post('/submit', (req, res) => {
  const { name, email, message, password, confirmPassword } = req.body;
  const errors = {};

  if (!name || String(name).trim().length < 2) errors.name = 'Name is required (min 2 characters).';
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Valid email is required.';
  if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  if (Object.keys(errors).length) {
    return res.status(400).render('form', { errors, values: { name, email, message } });
  }

  const entry = {
    id: submissions.length ? (Math.max(...submissions.map(s => s.id)) + 1) : 1,
    name: String(name).trim(),
    email: String(email).trim(),
    message: sanitizeHtml(message),
    createdAt: new Date().toISOString()
  };

  submissions.push(entry);
  res.render('thankyou', { entry });
});

/*
  REST API (JSON) - Task 5
  - GET /api/entries        -> list all
  - POST /api/entries       -> create new (JSON body: name,email,message)
  - PUT /api/entries/:id    -> update (JSON body: name,email,message)
  - DELETE /api/entries/:id -> delete
*/

// List entries
app.get('/api/entries', (req, res) => {
  res.json(submissions);
});

// Create entry
app.post('/api/entries', (req, res) => {
  const { name, email, message } = req.body;
  const errors = [];
  if (!name || String(name).trim().length < 2) errors.push('Name must be at least 2 characters.');
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required.');
  if (errors.length) return res.status(400).json({ errors });

  const entry = {
    id: submissions.length ? (Math.max(...submissions.map(s => s.id)) + 1) : 1,
    name: String(name).trim(),
    email: String(email).trim(),
    message: sanitizeHtml(message),
    createdAt: new Date().toISOString()
  };
  submissions.push(entry);
  res.status(201).json(entry);
});

// Update entry
app.put('/api/entries/:id', (req, res) => {
  const id = req.params.id;
  const idx = findIndexById(id);
  if (idx === -1) return res.status(404).json({ error: 'Entry not found' });

  const { name, email, message } = req.body;
  if (name && String(name).trim().length < 2) return res.status(400).json({ error: 'Name must be at least 2 characters.' });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Valid email is required.' });

  if (name !== undefined) submissions[idx].name = String(name).trim();
  if (email !== undefined) submissions[idx].email = String(email).trim();
  if (message !== undefined) submissions[idx].message = sanitizeHtml(message);
  submissions[idx].updatedAt = new Date().toISOString();

  res.json(submissions[idx]);
});

// Delete entry
app.delete('/api/entries/:id', (req, res) => {
  const id = req.params.id;
  const idx = findIndexById(id);
  if (idx === -1) return res.status(404).json({ error: 'Entry not found' });
  const removed = submissions.splice(idx, 1)[0];
  res.json({ removed });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
