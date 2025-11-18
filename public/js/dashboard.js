/*
  dashboard.js — simple CRUD front-end for /api/entries
*/
document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.getElementById('refreshBtn');
  const entriesList = document.getElementById('entriesList');
  const newBtn = document.getElementById('newBtn');
  const newFormContainer = document.getElementById('newFormContainer');
  const apiForm = document.getElementById('apiForm');
  const entryId = document.getElementById('entryId');
  const apiName = document.getElementById('apiName');
  const apiEmail = document.getElementById('apiEmail');
  const apiMessage = document.getElementById('apiMessage');
  const cancelBtn = document.getElementById('cancelBtn');

  function esc(s){ return String(s||'').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  async function loadEntries(){
    entriesList.innerHTML = '<p>Loading entries…</p>';
    try {
      const resp = await fetch('/api/entries');
      const data = await resp.json();
      if (!data || !data.length) {
        entriesList.innerHTML = '<p>No entries yet.</p>';
        return;
      }
      const html = document.createElement('div');
      data.forEach(e => {
        const div = document.createElement('div');
        div.className = 'submission';
        div.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div><strong>${esc(e.name)}</strong><div class="meta">${esc(e.email)} • ${new Date(e.createdAt).toLocaleString()}</div></div>
            <div>
              <button class="btn edit" data-id="${e.id}">Edit</button>
              <button class="btn danger delete" data-id="${e.id}">Delete</button>
            </div>
          </div>
          <div class="message">${esc(e.message)}</div>
        `;
        html.appendChild(div);
      });
      entriesList.innerHTML = '';
      entriesList.appendChild(html);
      // attach handlers
      document.querySelectorAll('.edit').forEach(b => b.addEventListener('click', onEdit));
      document.querySelectorAll('.delete').forEach(b => b.addEventListener('click', onDelete));
    } catch (err) {
      entriesList.innerHTML = '<p>Error loading entries.</p>';
    }
  }

  function showNewForm(preload){
    newFormContainer.style.display = 'block';
    if (preload) {
      entryId.value = preload.id || '';
      apiName.value = preload.name || '';
      apiEmail.value = preload.email || '';
      apiMessage.value = preload.message || '';
    } else {
      entryId.value = '';
      apiName.value = '';
      apiEmail.value = '';
      apiMessage.value = '';
    }
  }

  function hideNewForm(){
    newFormContainer.style.display = 'none';
  }

  async function onEdit(e){
    const id = e.currentTarget.dataset.id;
    try {
      const resp = await fetch('/api/entries');
      const data = await resp.json();
      const found = data.find(x => String(x.id) === String(id));
      if (found) showNewForm(found);
    } catch (err) {
      alert('Error loading entry.');
    }
  }

  async function onDelete(e){
    if (!confirm('Delete this entry?')) return;
    const id = e.currentTarget.dataset.id;
    try {
      const resp = await fetch('/api/entries/' + id, { method: 'DELETE' });
      if (resp.ok) {
        loadEntries();
      } else {
        alert('Delete failed.');
      }
    } catch (err) {
      alert('Network error.');
    }
  }

  refreshBtn.addEventListener('click', loadEntries);
  newBtn.addEventListener('click', () => showNewForm());

  cancelBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    hideNewForm();
  });

  apiForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const id = entryId.value;
    const payload = { name: apiName.value, email: apiEmail.value, message: apiMessage.value };
    try {
      if (id) {
        const resp = await fetch('/api/entries/' + id, {
          method: 'PUT',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          hideNewForm();
          loadEntries();
        } else {
          const err = await resp.json();
          alert(err.error || (err.errors && err.errors.join(', ')) || 'Update failed.');
        }
      } else {
        const resp = await fetch('/api/entries', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          hideNewForm();
          loadEntries();
        } else {
          const err = await resp.json();
          alert(err.error || (err.errors && err.errors.join(', ')) || 'Create failed.');
        }
      }
    } catch (err) {
      alert('Network error.');
    }
  });

  // initial load
  loadEntries();
});
