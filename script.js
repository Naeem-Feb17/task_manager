const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-desc");
const dueInput = document.getElementById("task-due");
const prioritySelect = document.getElementById("task-priority");
const addBtn = document.getElementById("add-btn");

const totalCountEl = document.getElementById("total-count");
const todoCountEl = document.getElementById("todo-count");
const inprogressCountEl = document.getElementById("inprogress-count");
const doneCountEl = document.getElementById("done-count");

const statusFilter = document.getElementById("status-filter");
const priorityFilter = document.getElementById("priority-filter");
const prioritySort = document.getElementById("priority-sort");

const taskListBody = document.getElementById("task-list");

// toast element (created once)
let toastEl = null;
let toastTimeout = null;

// load tasks from localStorage
const saved = localStorage.getItem("tasks");
const tasks = saved ? JSON.parse(saved) : [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
  const total = tasks.length;
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inprogressCount = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const setText = (el, text) => {
    el.textContent = text;
    el.classList.remove("pulse");
    void el.offsetWidth; // restart animation
    el.classList.add("pulse");
  };

  setText(totalCountEl, `Total: ${total}`);
  setText(todoCountEl, `To Do: ${todoCount}`);
  setText(inprogressCountEl, `In Progress: ${inprogressCount}`);
  setText(doneCountEl, `Done: ${doneCount}`);
}

function showToast(message) {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add("show");
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastEl.classList.remove("show"), 1600);
}

function createTaskRow(task) {
  const tr = document.createElement("tr");
  tr.classList.add("fade-in");

  // Done checkbox
  const doneTd = document.createElement("td");
  const doneCheckbox = document.createElement("input");
  doneCheckbox.type = "checkbox";
  doneCheckbox.checked = task.status === "done";
  doneCheckbox.addEventListener("change", () => {
    task.status = doneCheckbox.checked ? "done" : "todo";
    saveTasks();
    render();
  });
  doneTd.appendChild(doneCheckbox);
  tr.appendChild(doneTd);

  // Title
  const titleTd = document.createElement("td");
  titleTd.textContent = task.title;
  tr.appendChild(titleTd);

  // Description
  const descTd = document.createElement("td");
  descTd.textContent = task.description || "";
  tr.appendChild(descTd);

  // Due date
  const dueTd = document.createElement("td");
  dueTd.textContent = task.dueDate || "";
  tr.appendChild(dueTd);

  // Priority
  const priorityTd = document.createElement("td");
  const priorityBadge = document.createElement("span");
  priorityBadge.className = `priority badge-${task.priority}`;
  priorityBadge.textContent = task.priority.toUpperCase();
  priorityTd.appendChild(priorityBadge);
  tr.appendChild(priorityTd);

  // Status select
  const statusTd = document.createElement("td");
  const statusSelect = document.createElement("select");
  [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ].forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    if (task.status === opt.value) option.selected = true;
    statusSelect.appendChild(option);
  });
  statusSelect.addEventListener("change", () => {
    task.status = statusSelect.value;
    saveTasks();
    render();
  });
  statusTd.appendChild(statusSelect);
  tr.appendChild(statusTd);

  // Actions
  const actionsTd = document.createElement("td");
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => {
    const newTitle = prompt("Edit title", task.title) ?? task.title;
    const newDesc =
      prompt("Edit description", task.description || "") ?? task.description;
    task.title = newTitle.trim() || task.title;
    task.description = newDesc.trim();
    saveTasks();
    render();
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => {
    if (!confirm("Delete this task?")) return;
    const idx = tasks.findIndex((t) => t.id === task.id);
    if (idx !== -1) {
      tasks.splice(idx, 1);
      saveTasks();
      render();
    }
  });

  actionsTd.appendChild(editBtn);
  actionsTd.appendChild(delBtn);
  tr.appendChild(actionsTd);

  return tr;
}

function getFilteredAndSortedTasks() {
  let result = [...tasks];

  const statusVal = statusFilter.value;
  const priorityVal = priorityFilter.value;

  if (statusVal !== "all") {
    result = result.filter((t) => t.status === statusVal);
  }

  if (priorityVal !== "all") {
    result = result.filter((t) => t.priority === priorityVal);
  }

  const sortVal = prioritySort.value;
  const order = { high: 3, medium: 2, low: 1 };

  if (sortVal === "high-low") {
    result.sort((a, b) => order[b.priority] - order[a.priority]);
  } else if (sortVal === "low-high") {
    result.sort((a, b) => order[a.priority] - order[b.priority]);
  }

  return result;
}

function render() {
  taskListBody.innerHTML = "";

  const toRender = getFilteredAndSortedTasks();
  if (toRender.length === 0) {
    const emptyRow = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.className = "empty-state";
    td.textContent = "No tasks yet. Add your first task 🚀";
    emptyRow.appendChild(td);
    taskListBody.appendChild(emptyRow);
  }

  toRender.forEach((task) => {
    const row = createTaskRow(task);
    taskListBody.appendChild(row);
  });

  updateStats();
}

function addTask() {
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const dueDate = dueInput.value;
  const priority = prioritySelect.value;

  if (!title) {
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    description,
    dueDate,
    priority,
    status: "todo",
  };

  tasks.push(newTask);

  titleInput.value = "";
  descInput.value = "";
  dueInput.value = "";
  prioritySelect.value = "medium";

  // reset filters so the new task is visible immediately
  statusFilter.value = "all";
  priorityFilter.value = "all";
  prioritySort.value = "none";

  render();
  saveTasks();
  showToast("Task added successfully ✓");
}

addBtn.addEventListener("click", addTask);
titleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
statusFilter.addEventListener("change", render);
priorityFilter.addEventListener("change", render);
prioritySort.addEventListener("change", render);

render();
