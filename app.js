const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory temp storage for demo
const submissions = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Home
app.get('/', (req, res) => {
  res.render('index', { submissions });
});

// Form page
app.get('/form', (req, res) => {
  res.render('form', { errors: null, values: {} });
});

// Handle form POST
app.post('/submit', (req, res) => {
  const { name, email, message, password, confirmPassword } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) errors.push('Name is required (min 2 chars).');
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
  if (password !== confirmPassword) errors.push('Passwords do not match.');

  if (errors.length) {
    return res.status(400).render('form', { errors, values: req.body });
  }

  const entry = {
    id: submissions.length + 1,
    name: name.trim(),
    email: email.trim(),
    message: (message || '').trim(),
    createdAt: new Date().toISOString()
  };

  submissions.push(entry);
  res.render('thankyou', { entry });
});

// simple dashboard API for quick testing
app.get('/api/entries', (req, res) => {
  res.json(submissions);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
