document.addEventListener("DOMContentLoaded", () => {
  // References
  const themeToggle = document.getElementById("theme-toggle");
  const installBtn = document.getElementById("install-btn");
  const taskInput = document.getElementById("task-input");
  const taskDate = document.getElementById("task-date");
  const taskPriority = document.getElementById("task-priority");
  const addTaskBtn = document.getElementById("add-task");
  const clearAllBtn = document.getElementById("clear-all");
  const taskList = document.getElementById("task-list");
  const taskCountEl = document.getElementById("task-count");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // THEME SETUP
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "dark") {
    themeToggle.checked = true;
    document.body.classList.remove("light-mode");
  } else {
    themeToggle.checked = false;
    document.body.classList.add("light-mode");
  }

  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  });

  // PWA INSTALL PROMPT (optional)
  let deferredPrompt;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = "inline-block";
  });

  installBtn.addEventListener("click", () => {
    installBtn.style.display = "none";
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(
        choiceResult.outcome === "accepted"
          ? "User accepted the install prompt"
          : "User dismissed the install prompt"
      );
      deferredPrompt = null;
    });
  });

  // TASK RENDER
  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${task.text} (${task.date || "No date"}) [${task.priority}]</span>
        <button data-index="${index}" class="btn btn-danger">Delete</button>
      `;
      taskList.appendChild(li);
    });
    taskCountEl.textContent = `(${tasks.length} tasks)`;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // ADD TASK
  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({
        text,
        date: taskDate.value,
        priority: taskPriority.value,
      });
      taskInput.value = "";
      taskDate.value = "";
      taskPriority.value = "low";
      renderTasks();
    }
  });

  // DELETE TASK
  taskList.addEventListener("click", (e) => {
    if (e.target.matches(".btn-danger")) {
      const index = e.target.getAttribute("data-index");
      tasks.splice(index, 1);
      renderTasks();
    }
  });

  // CLEAR ALL
  clearAllBtn.addEventListener("click", () => {
    tasks = [];
    renderTasks();
  });

  renderTasks();
});
