const express = require('express');
const path = require('path');
const sanitizeHtml = (s) => String(s || '').replace(/[<>]/g, '');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory temp storage for demo
const submissions = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Helper: email regex (simple but effective)
const emailRe = /^\S+@\S+\.\S+$/;

// Helper: password strength test
function passwordStrength(password) {
  let score = 0;
  if (!password) return score;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[\W_]/.test(password)) score++;
  return score; // 0..5
}

// Home
app.get('/', (req, res) => {
  res.render('index', { submissions });
});

// Form page
app.get('/form', (req, res) => {
  res.render('form', { errors: {}, values: {} });
});

// Handle form POST
app.post('/submit', (req, res) => {
  const { name, email, message, password, confirmPassword } = req.body;
  const errors = {};

  // name
  if (!name || String(name).trim().length < 2) errors.name = 'Name is required (min 2 characters).';

  // email
  if (!email || !emailRe.test(email)) errors.email = 'Valid email is required.';

  // password
  if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  // optional: enforce stronger strength if desired
  const strength = passwordStrength(password);
  if (strength < 3) {
    errors.passwordStrength = 'Password is weak — include uppercase, lowercase, number, and symbols for a stronger password.';
  }

  if (Object.keys(errors).length) {
    return res.status(400).render('form', { errors, values: { name, email, message } });
  }

  const entry = {
    id: submissions.length + 1,
    name: String(name).trim(),
    email: String(email).trim(),
    message: sanitizeHtml(message),
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
