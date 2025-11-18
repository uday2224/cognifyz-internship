document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('demoForm');
  const pwd = document.getElementById('password');
  const cpwd = document.getElementById('confirmPassword');
  const submitBtn = document.getElementById('submitBtn');
  const email = document.getElementById('email');
  const nameInput = document.getElementById('name');
  const pwdStrength = document.getElementById('pwd-strength');

  function scorePassword(p) {
    let score = 0;
    if (!p) return score;
    if (p.length >= 8) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[\W_]/.test(p)) score++;
    return score; // 0..5
  }

  function updateStrengthUI() {
    const s = scorePassword(pwd.value);
    const labels = ['Very weak','Weak','Okay','Good','Strong'];
    if (!pwd.value) { pwdStrength.textContent = ''; return; }
    const idx = Math.max(0, Math.min(4, s-1));
    pwdStrength.textContent = `Strength: ${labels[Math.max(0, idx)]}`;
  }

  pwd.addEventListener('input', updateStrengthUI);

  function isValidEmail(v) { return /^\S+@\S+\.\S+$/.test(v); }

  form.addEventListener('submit', (e) => {
    let hasError = false;
    if (!nameInput.value || nameInput.value.trim().length < 2) {
      alert('Name must be at least 2 characters.');
      hasError = true;
    }
    if (!isValidEmail(email.value)) {
      alert('Enter a valid email.');
      hasError = true;
    }
    if (pwd.value.length < 6) {
      alert('Password must be at least 6 characters.');
      hasError = true;
    }
    if (pwd.value !== cpwd.value) {
      alert('Passwords do not match.');
      hasError = true;
    }
    if (hasError) {
      e.preventDefault();
      return;
    }
    // let server perform final validation & return inline errors if any
  });
});
