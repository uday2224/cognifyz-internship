require('dotenv').config();
const express = require('express');
const path = require('path');
const supabase = require('./supabaseClient');
const supabasePublic = require('./supabaseClientPublic');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: './' }),
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/login');
}

/* Public */
app.get('/', async (req, res) => {
  const { data: entries, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) console.error('Supabase error:', error);
  res.render('index', { submissions: entries || [] });
});

app.get('/form', (req, res) => res.render('form', { errors: {}, values: {} }));
app.get('/thankyou', (req, res) => res.render('thankyou', { entry: {} }));

/* Auth */
app.get('/register', (req, res) => res.render('register', { errors: null }));
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.render('register', { errors: 'Provide email and password' });

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) return res.render('register', { errors: error.message || JSON.stringify(error) });

  req.session.user = { id: data.id, email: data.email };
  return res.redirect('/dashboard');
});

app.get('/login', (req, res) => res.render('login', { errors: null }));
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabasePublic.auth.signInWithPassword({ email, password });
  if (error || !data.session) return res.render('login', { errors: (error && error.message) || 'Login failed' });

  req.session.user = { id: data.user.id, email: data.user.email, access_token: data.session.access_token };
  return res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

/* Dashboard (protected) */
app.get('/dashboard', requireAuth, (req, res) => res.render('dashboard'));

/* Form submit -> Supabase */
app.post('/submit', async (req, res) => {
  const { name, email, message, password, confirmPassword } = req.body;
  const errors = {};
  if (!name || String(name).trim().length < 2) errors.name = 'Name is required (min 2 characters).';
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Valid email is required.';
  if (password && password.length > 0 && password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  if (Object.keys(errors).length) return res.status(400).render('form', { errors, values: { name, email, message } });

  const { data, error } = await supabase
    .from('entries')
    .insert([{ name: String(name).trim(), email: String(email).trim(), message: String(message || '') }])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).render('form', { errors: { form: 'DB error' }, values: { name, email, message } });
  }

  res.render('thankyou', { entry: data });
});

/* REST API */
app.get('/api/entries', async (req, res) => {
  const { data, error } = await supabase.from('entries').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/entries', requireAuth, async (req, res) => {
  const { name, email, message } = req.body;
  const { data, error } = await supabase.from('entries').insert([{ name, email, message }]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.put('/api/entries/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase.from('entries').update(req.body).eq('id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/entries/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase.from('entries').delete().eq('id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ removed: data });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
