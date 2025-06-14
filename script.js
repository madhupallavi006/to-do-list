let tasks = [];
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const category = document.getElementById('category');
const dueDate = document.getElementById('dueDate');
const importInput = document.getElementById('importInput');

// Login simulation
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username && password) {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.container').style.display = 'flex';
  } else {
    alert("Please enter username and password");
  }
}

// Add task
function addTask() {
  if (!taskInput.value) return;
  const task = {
    text: taskInput.value,
    category: category.value,
    date: dueDate.value,
    completed: false
  };
  tasks.push(task);
  taskInput.value = '';
  renderTasks();
}

document.getElementById('addBtn').addEventListener('click', addTask);

document.getElementById('toggleMode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    if (
      (filter === 'active' && task.completed) ||
      (filter === 'completed' && !task.completed)
    ) return;

    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${task.text}</strong> (${task.category}, ${task.date})</span>
      <div>
        <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>`;
    li.style.textDecoration = task.completed ? 'line-through' : 'none';
    taskList.appendChild(li);
  });
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Filter buttons
['allTasks', 'activeTasks', 'completedTasks'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    const filter = id.replace('Tasks', '').toLowerCase();
    renderTasks(filter);
  });
});

// Export
exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(tasks)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'tasks.json';
  link.click();
};

// Import
importBtn.onclick = () => importInput.click();
importInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      tasks = JSON.parse(reader.result);
      renderTasks();
    } catch {
      alert('Invalid file!');
    }
  };
  reader.readAsText(file);
};
