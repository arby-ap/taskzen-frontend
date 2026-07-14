const API = "https://taskzen-backend-6w8c.onrender.com/tasks";

let tasks = [];
let editingTaskId = null;

const form = document.getElementById("task-form");
const list = document.getElementById("task-list");

//LOAD TASKS (GET)
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

//ADD TASK (POST)
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

//EDIT TASK
function editTask(task){
  console.log(task);

    editingTaskId = task.id;
    document.getElementById("title").value = task.title || "";
    document.getElementById("description").value = task.description || "";
    document.getElementById("priority").value = task.priority || "low";
    document.getElementById("status").value = task.status || "pending";
    document.getElementById("dueDate").value = task.dueDate || "";
    document.querySelector(".form-section h2").textContent = "✏ Edit Task";
    form.querySelector("button").textContent = "Save Changes";
    document.getElementById("cancelEdit").style.display="block";
    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

//DELETE TASK
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

// UPDATE TASK (PUT)
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



//FORM SUBMIT
if(form){

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();

    if(!title){

        alert("Title is required");

        return;

    }

    const task = {

        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        priority: document.getElementById("priority").value,
        status: document.getElementById("status").value,
        dueDate: document.getElementById("dueDate").value

    };

    if(editingTaskId){

        updateTask(editingTaskId,task);

        editingTaskId=null;

        form.querySelector("button").textContent="Add Task";

        document.querySelector(".form-section h2").textContent="Add New Task";

    }

    else{

        addTask(task);

    }

    form.reset();

});

}

//RENDER TASKS
function renderTasks() {

    list.innerHTML = "";

    // ---------- Statistics ----------

    const total = tasks.length;

    const pending = tasks.filter(t => t.status !== "done").length;

    const done = tasks.filter(t => t.status === "done").length;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("doneTasks").textContent = done;

    // ---------- Search ----------

    const searchInput = document.querySelector(".task-header input");

    const keyword = searchInput
        ? searchInput.value.toLowerCase()
        : "";

    const filteredTasks = tasks.filter(task =>

        task.title.toLowerCase().includes(keyword) ||

        (task.description || "")
            .toLowerCase()
            .includes(keyword)

    );

    // ---------- Cards ----------

    filteredTasks.forEach(t => {
      

        const li = document.createElement("li");

        li.className = `task-card ${t.priority}`;

        const date = t.dueDate

            ? new Date(t.dueDate).toLocaleDateString()

            : "No Due Date";

        li.innerHTML = `

        <h3>${t.title}</h3>

        <p>${t.description || "No description."}</p>

        <br>

        <strong>Status:</strong> ${t.status}

        <br>

        <strong>Priority:</strong>

        <span class="priority ${t.priority}">
            ${t.priority.toUpperCase()}
        </span>

        <br>

        <strong>Due:</strong> ${date}

        `;

        // ---------- Buttons ----------

        const buttons = document.createElement("div");
        buttons.className = "task-buttons";
        const edit = document.createElement("button");
        edit.textContent = "Edit";
edit.onclick = () => {

    editTask(t);

};

        const toggle = document.createElement("button");

        toggle.textContent =

            t.status === "done"

            ? "Mark Pending"

            : "Mark Done";

        toggle.onclick = () => {

            const newStatus =

                t.status === "done"

                ? "pending"

                : "done";

            updateTask(t.id, {

                ...t,

                status:newStatus

            });

        };

        const del = document.createElement("button");

        del.textContent = "Delete";

        del.onclick = () => {

            if(confirm("Delete this task?")){

                deleteTask(t.id);

            }

        };

        buttons.append(toggle);

        buttons.append(edit);

        buttons.append(del);

        li.append(buttons);

        list.append(li);

    });

}

const cancelBtn = document.getElementById("cancelEdit");

if(cancelBtn){

    cancelBtn.onclick = () => {

        editingTaskId = null;

        form.reset();

        document.querySelector(".form-section h2").textContent = "Add New Task";

        form.querySelector("button").textContent = "Add Task";

        cancelBtn.style.display = "none";

    };

}


// INITIAL LOAD
document.addEventListener("DOMContentLoaded", loadTasks);
// ---------- SEARCH ----------

const search = document.querySelector(".task-header input");

if(search){

search.addEventListener("input",renderTasks);

}

// ============================
// TASKZEN AI ASSISTANT
// ============================

const titleInput = document.getElementById("title");

const descriptionInput = document.getElementById("description");

function analyzeTask(){

if(!titleInput)return;

const text=(

titleInput.value+" "+descriptionInput.value

).toLowerCase();

const card=document.getElementById("aiSuggestion");

const priorityText=document.getElementById("aiPriorityText");

const reason=document.getElementById("aiReason");

if(text.trim()===""){

card.style.display="none";

return;

}

let priority="🟢 LOW";

let value="low";

let explanation="Routine task with no urgent keywords detected.";

if(

text.includes("exam")||

text.includes("project")||

text.includes("deadline")||

text.includes("urgent")||

text.includes("assignment")||

text.includes("presentation")||

text.includes("final")

){

priority="🔴 HIGH";

value="high";

explanation="This task appears related to a project or important deadline.";

}

else if(

text.includes("meeting")||

text.includes("study")||

text.includes("research")||

text.includes("report")||

text.includes("quiz")

){

priority="🟡 MEDIUM";

value="medium";

explanation="This task requires preparation but is not immediately urgent.";

}

document.getElementById("priority").value=value;

priorityText.textContent="Suggested Priority: "+priority;

reason.textContent=explanation;

card.style.display = "block";

card.style.display = "block";

priorityText.textContent = " Reading task...";

reason.textContent = "Understanding your task description...";

setTimeout(() => {

    priorityText.textContent = " Looking for keywords...";

    reason.textContent = "Comparing against productivity patterns...";

    setTimeout(() => {

        document.getElementById("priority").value = value;

        priorityText.textContent = "Suggested Priority: " + priority;

        reason.textContent = explanation;

    }, 1000);

}, 1000);

}

let aiTimer;
let aiThinking;

function scheduleAI(){

    clearTimeout(aiTimer);
    clearTimeout(aiThinking);

    const card = document.getElementById("aiSuggestion");

    if(titleInput.value.trim()==="" && descriptionInput.value.trim()===""){

        card.style.display="none";
        return;

    }

    aiTimer = setTimeout(() => {

        analyzeTask();

    }, 800);

}

if(titleInput && descriptionInput){

    titleInput.addEventListener("input", scheduleAI);

    descriptionInput.addEventListener("input", scheduleAI);

}
