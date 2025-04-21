const API_BASE = "https://employee-backend-ef3o.onrender.com/api/tasks";

const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const darkToggle = document.getElementById("dark-toggle");
const totalEl = document.getElementById("total");
const completedEl = document.getElementById("completed");
const inProgressEl = document.getElementById("in-progress");

// Dark mode toggle
darkToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
});

// Employee login
function filterByEmployee() {
  const empId = document.getElementById("emp-id").value;
  localStorage.setItem("employee_id", empId);
  loadTasks();
}

// Load tasks for logged-in employee
async function loadTasks() {
  const res = await fetch(API_BASE);
  let tasks = await res.json();

  const empId = localStorage.getItem("employee_id");
  if (empId) {
    tasks = tasks.filter(task => task.assigned_to == empId);
  }

  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const showActions = task.assigned_to == empId;
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.title}</strong> — ${task.status}<br/>
      Due: ${task.due_date || "N/A"} | Assigned To: ${task.assigned_to || "N/A"}
      ${showActions ? `
        <br/><button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>` : ""}
    `;
    taskList.appendChild(li);
  });

  updateDashboard(tasks);
  detectAnomalies(tasks); // NEW
}

// Add new task
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const status = document.getElementById("status").value;
  const assigned_to = parseInt(document.getElementById("assigned_to").value);
  const due_date = document.getElementById("due_date").value;

  await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, status, assigned_to, due_date }),
  });

  e.target.reset();
  loadTasks();
});

// Edit task
async function editTask(id) {
  const newTitle = prompt("New title:");
  const newStatus = prompt("New status:");
  const newAssigned = parseInt(prompt("New assigned_to:"));
  const newDueDate = prompt("New due date (YYYY-MM-DD):");

  await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: newTitle,
      status: newStatus,
      assigned_to: newAssigned,
      due_date: newDueDate,
    }),
  });

  loadTasks();
}

// Delete task
async function deleteTask(id) {
  await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  loadTasks();
}

// Dashboard Stats
function updateDashboard(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status.toLowerCase() === "completed").length;
  const inProgress = tasks.filter(t => t.status.toLowerCase() === "in progress").length;

  totalEl && (totalEl.textContent = total);
  completedEl && (completedEl.textContent = completed);
  inProgressEl && (inProgressEl.textContent = inProgress);
}

// ANOMALY DETECTION AGENT
function detectAnomalies(tasks) {
  const anomalies = [];
  const empTaskCount = {};
  const today = new Date().toISOString().split("T")[0];

  tasks.forEach(task => {
    if (task.status.toLowerCase() !== "completed" && task.due_date && task.due_date < today) {
      anomalies.push(`Task "${task.title}" is overdue (Due: ${task.due_date})`);
    }
    if (task.status.toLowerCase() === "completed" && !task.due_date) {
      anomalies.push(`Task "${task.title}" is completed but missing due date`);
    }
    const empId = task.assigned_to;
    if (empId) {
      empTaskCount[empId] = (empTaskCount[empId] || 0) + 1;
    }
  });

  for (const [empId, count] of Object.entries(empTaskCount)) {
    if (count > 5) {
      anomalies.push(`Employee ${empId} has ${count} tasks (possible overload)`);
    }
  }

  const anomalyList = document.getElementById("anomaly-list");
  anomalyList.innerHTML = anomalies.length
    ? anomalies.map(msg => `<li>${msg}</li>`).join("")
    : "<li>No anomalies found</li>";
}

// Start
loadTasks();