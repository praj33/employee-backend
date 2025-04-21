const API_URL = 'http://localhost:5000/api/tasks';
let editingTaskId = null;
let activeFilter = 'all';

window.addEventListener('DOMContentLoaded', () => loadTasks());

function loadTasks(filter = 'all') {
  activeFilter = filter;
  fetch(API_URL)
    .then(res => res.json())
    .then(tasks => {
      const list = document.getElementById('task-list');
      list.innerHTML = '';

      let total = 0, completed = 0, inProgress = 0, overdue = 0;
      const today = new Date().toISOString().split('T')[0];

      tasks.forEach(task => {
        const status = task.status.toLowerCase();
        total++;
        if (status === 'completed') completed++;
        else if (status === 'in progress') inProgress++;
        if (task.due_date < today && status !== 'completed') overdue++;

        // Apply filter
        if (
          activeFilter === 'completed' && status !== 'completed' ||
          activeFilter === 'in progress' && status !== 'in progress' ||
          activeFilter === 'overdue' && !(task.due_date < today && status !== 'completed')
        ) return;

        const li = document.createElement('li');
        li.className = 'task-item';

        const text = document.createElement('div');
        text.textContent = `${task.title} - ${task.status} (Due: ${task.due_date})`;

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-pen"></i>';
        editBtn.title = 'Edit';
        editBtn.onclick = () => startEdit(task);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.id);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(text);
        li.appendChild(actions);
        list.appendChild(li);
      });

      document.getElementById('total-tasks').textContent = total;
      document.getElementById('completed-tasks').textContent = completed;
      document.getElementById('inprogress-tasks').textContent = inProgress;
      document.getElementById('overdue-tasks').textContent = overdue;
    });
}

function startEdit(task) {
  editingTaskId = task.id;
  document.getElementById('title').value = task.title;
  document.getElementById('status').value = task.status;
  document.getElementById('assigned_to').value = task.assigned_to;
  document.getElementById('due_date').value = task.due_date;
  document.querySelector('#task-form button').textContent = 'Update Task';
}

function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then(() => loadTasks(activeFilter));
}

document.getElementById('task-form').addEventListener('submit', e => {
  e.preventDefault();

  const task = {
    title: document.getElementById('title').value,
    status: document.getElementById('status').value,
    assigned_to: parseInt(document.getElementById('assigned_to').value),
    due_date: document.getElementById('due_date').value,
  };

  const method = editingTaskId ? 'PUT' : 'POST';
  const url = editingTaskId ? `${API_URL}/${editingTaskId}` : API_URL;

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  }).then(() => {
    e.target.reset();
    editingTaskId = null;
    document.querySelector('#task-form button').textContent = 'Add Task';
    loadTasks(activeFilter);
  });
});

// Dark mode toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  document.getElementById('theme-toggle').textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});