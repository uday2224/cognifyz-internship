/*
  form.js — Task 4
  - live password strength + suggestions
  - conditional field show/hide (example: show 'company' when role=professional)
  - AJAX submit (fetch), parse server HTML response to detect success,
    then fetch /api/entries to update submissions list
  - toast notifications
*/

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('demoForm');
  if (!form) return; // only run on form page

  // elements
  const pwd = document.getElementById('password');
  const cpwd = document.getElementById('confirmPassword');
  const submitBtn = document.getElementById('submitBtn');
  const email = document.getElementById('email');
  const nameInput = document.getElementById('name');
  const pwdStrength = document.getElementById('pwd-strength');

  // create toast container
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  function showToast(msg, type = 'info', timeout = 3500) {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    toastContainer.appendChild(t);
    setTimeout(() => t.classList.add('visible'), 10);
    setTimeout(() => t.classList.remove('visible'), timeout - 300);
    setTimeout(() => t.remove(), timeout);
  }

  // password scoring
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

  function passwordLabel(score) {
    if (score <= 1) return 'Very weak';
    if (score === 2) return 'Weak';
    if (score === 3) return 'Okay';
    if (score === 4) return 'Good';
    return 'Strong';
  }

  function updateStrengthUI() {
    const s = scorePassword(pwd.value);
    if (!pwdStrength) return;
    pwdStrength.textContent = pwd.value ? `Strength: ${passwordLabel(s)}` : '';
    // subtle color cue
    pwdStrength.dataset.score = s;
  }

  pwd.addEventListener('input', updateStrengthUI);

  // conditional fields example (if you add a select with id="role")
  const roleSelect = document.getElementById('role');
  if (roleSelect) {
    const conditional = document.getElementById('company-field');
    roleSelect.addEventListener('change', () => {
      if (roleSelect.value === 'professional') {
        conditional.style.display = 'block';
      } else {
        conditional.style.display = 'none';
      }
    });
  }

  // helper: basic email validator
  function isValidEmail(v) { return /^\S+@\S+\.\S+$/.test(v); }

  // AJAX submit to avoid full page navigation and to show toasts
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    // client-side quick checks
    if (!nameInput.value || nameInput.value.trim().length < 2) {
      showToast('Name must be at least 2 characters.', 'error');
      submitBtn.disabled = false;
      return;
    }
    if (!isValidEmail(email.value)) {
      showToast('Enter a valid email.', 'error');
      submitBtn.disabled = false;
      return;
    }
    if (pwd.value.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      submitBtn.disabled = false;
      return;
    }
    if (pwd.value !== cpwd.value) {
      showToast('Passwords do not match.', 'error');
      submitBtn.disabled = false;
      return;
    }

    // prepare form body
    const formData = new URLSearchParams(new FormData(form));

    try {
      // send fetch, allow redirects with manual follow
      const resp = await fetch('/submit', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      // server responds with HTML (thank you) or re-rendered form (400).
      const text = await resp.text();

      // simple success detection: check for "Thank you" title snippet
      if (resp.ok && /Thank you/i.test(text)) {
        showToast('Submission successful!', 'success');
        // update submissions list by fetching API and updating DOM (if home has .submissions-list)
        try {
          const listResp = await fetch('/api/entries');
          const entries = await listResp.json();
          // attempt to update submissions list on current page (if present)
          const listEl = document.querySelector('.submissions-list');
          if (listEl) {
            // rebuild list
            listEl.innerHTML = '';
            entries.forEach(s => {
              const li = document.createElement('li');
              li.className = 'submission';
              li.innerHTML = `<div><strong>${escapeHtml(s.name)}</strong><div class="meta">${escapeHtml(s.email)} • ${new Date(s.createdAt).toLocaleString()}</div></div><div class="message">${escapeHtml(s.message || '')}</div>`;
              listEl.prepend(li);
            });
          }
        } catch (err) {
          // ignore
        }
        // clear the form
        form.reset();
        updateStrengthUI();
        submitBtn.disabled = false;
        return;
      } else {
        // server sent validation errors in HTML; try to extract error messages or show generic
        // attempt to find error text inside returned HTML
        const errMatch = text.match(/class="error">([^<]+)</i);
        if (errMatch && errMatch[1]) {
          showToast(errMatch[1].trim(), 'error');
        } else {
          showToast('Submission failed. Please check inputs.', 'error');
        }
      }
    } catch (err) {
      showToast('Network error. Try again.', 'error');
    }

    submitBtn.disabled = false;
  });

  // small helper to escape HTML when inserting text
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }
});
