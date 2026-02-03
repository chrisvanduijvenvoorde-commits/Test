const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const noteList = document.getElementById("noteList");
const addNoteButton = document.getElementById("addNote");

const todoText = document.getElementById("todoText");
const todoPriority = document.getElementById("todoPriority");
const todoList = document.getElementById("todoList");
const addTodoButton = document.getElementById("addTodo");

const clearAllButton = document.getElementById("clearAll");

const storage = {
  notes: "studio-notes",
  todos: "studio-todos",
};

const state = {
  notes: [],
  todos: [],
};

const loadState = () => {
  state.notes = JSON.parse(localStorage.getItem(storage.notes) || "[]");
  state.todos = JSON.parse(localStorage.getItem(storage.todos) || "[]");
};

const saveState = () => {
  localStorage.setItem(storage.notes, JSON.stringify(state.notes));
  localStorage.setItem(storage.todos, JSON.stringify(state.todos));
};

const formatDate = (timestamp) =>
  new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));

const renderNotes = () => {
  noteList.innerHTML = "";
  if (!state.notes.length) {
    noteList.innerHTML = '<p class="empty-state">Nog geen notities. Leg je eerste idee vast.</p>';
    return;
  }

  state.notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";

    card.innerHTML = `
      <div class="note-title">${note.title || "Ongetitelde notitie"}</div>
      <div class="note-body">${note.body || "Geen inhoud"}</div>
      <div class="note-meta">
        <span>${formatDate(note.createdAt)}</span>
        <button class="note-action" data-id="${note.id}">Verwijder</button>
      </div>
    `;

    noteList.appendChild(card);
  });

  noteList.querySelectorAll(".note-action").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      state.notes = state.notes.filter((note) => note.id !== id);
      saveState();
      renderNotes();
    });
  });
};

const renderTodos = () => {
  todoList.innerHTML = "";
  if (!state.todos.length) {
    todoList.innerHTML = '<p class="empty-state">Geen taken. Voeg een focusmoment toe.</p>';
    return;
  }

  state.todos.forEach((todo) => {
    const card = document.createElement("div");
    card.className = "todo-card";

    card.innerHTML = `
      <input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}" />
      <div class="todo-text ${todo.completed ? "completed" : ""}">
        <strong>${todo.text}</strong>
        <span class="todo-meta">${formatDate(todo.createdAt)}</span>
      </div>
      <div class="todo-pill ${todo.priority}">${todo.priority}</div>
    `;

    todoList.appendChild(card);
  });

  todoList.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const id = Number(checkbox.dataset.id);
      const todo = state.todos.find((item) => item.id === id);
      todo.completed = checkbox.checked;
      saveState();
      renderTodos();
    });
  });
};

addNoteButton.addEventListener("click", () => {
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();

  if (!title && !body) {
    noteTitle.focus();
    return;
  }

  state.notes.unshift({
    id: Date.now(),
    title,
    body,
    createdAt: Date.now(),
  });

  noteTitle.value = "";
  noteBody.value = "";

  saveState();
  renderNotes();
});

addTodoButton.addEventListener("click", () => {
  const text = todoText.value.trim();
  if (!text) {
    todoText.focus();
    return;
  }

  state.todos.unshift({
    id: Date.now(),
    text,
    priority: todoPriority.value,
    completed: false,
    createdAt: Date.now(),
  });

  todoText.value = "";
  todoPriority.value = "medium";

  saveState();
  renderTodos();
});

clearAllButton.addEventListener("click", () => {
  state.notes = [];
  state.todos = [];
  saveState();
  renderNotes();
  renderTodos();
});

loadState();
if (!state.notes.length && !state.todos.length) {
  state.notes = [
    {
      id: Date.now(),
      title: "Welkom bij je studio",
      body: "Start met het vastleggen van ideeën of inspiratie. Alles wordt automatisch opgeslagen.",
      createdAt: Date.now(),
    },
  ];
  state.todos = [
    {
      id: Date.now() + 1,
      text: "Eerste focus-taak afronden",
      priority: "high",
      completed: false,
      createdAt: Date.now(),
    },
  ];
  saveState();
}
renderNotes();
renderTodos();
