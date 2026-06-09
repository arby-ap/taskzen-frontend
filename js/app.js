const API = "https://taskzen-backend-production.up.railway.app/tasks";

let tasks = [];

const form = document.getElementById("task-form");
const list = document.getElementById("task-list");

// ✅ LOAD TASKS (GET)
async function loadTasks() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Failed to load tasks");

    tasks = await res.json();
    renderTasks();
  } catch (err) {
    alert(err.message);
  }
}

// ✅ ADD TASK (POST)
async function addTask(task) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    });

    if (!res.ok) throw new Error("Create failed");

    await loadTasks();
  } catch (err) {
    alert(err.message);
  }
}

// ✅ DELETE TASK
async function deleteTask(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Delete failed");

    await loadTasks();
  } catch (err) {
    alert(err.message);
  }
}

// ✅ UPDATE TASK (PUT)
async function updateTask(id, updatedTask) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTask)
    });

    if (!res.ok) throw new Error("Update failed");

    await loadTasks();
  } catch (err) {
    alert(err.message);
  }
}

// ✅ FORM SUBMIT
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = form.title.value.trim();

  if (!title) {
    alert("Title is required");
    return;
  }

  const task = {
    title: form.title.value, 
    description: form.description.value,
    priority: form.priority.value,
    status: form.status.value,
    dueDate: form.dueDate.value
  };

  addTask(task);
  form.reset();
});

// ✅ RENDER FUNCTION
function renderTasks() {
  list.innerHTML = "";

  tasks.forEach(t => {
    const li = document.createElement("li");
    li.className = `task-card ${t.priority}`;

    li.innerHTML = `
      <strong>${t.title}</strong><br>
      <small>${t.description || ""}</small><br>
      ${t.status} | ${t.priority}<br>
      Due: ${t.dueDate || "N/A"}
    `;

    // ✅ BUTTON CONTAINER
    const btnContainer = document.createElement("div");
    btnContainer.className = "task-buttons";

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.addEventListener("click", () => deleteTask(t.id));

    const toggle = document.createElement("button");
    toggle.textContent = "Toggle Status";
    toggle.addEventListener("click", () => {
      const newStatus = t.status === "done" ? "pending" : "done";
      updateTask(t.id, { ...t, status: newStatus });
    });

    btnContainer.append(del, toggle);
    li.appendChild(btnContainer);

    list.appendChild(li);
  });
}

// ✅ INITIAL LOAD
document.addEventListener("DOMContentLoaded", loadTasks);
