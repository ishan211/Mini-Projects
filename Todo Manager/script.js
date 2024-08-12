// Retrieve todos from local storage or initialize with an empty array
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Request notification permission on page load
if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            checkForDueTodos(); // Check for due todos on page load if notifications are allowed
        }
    });
}

// Event listener for adding a new todo
document.getElementById('addTodoButton').addEventListener('click', function() {
    const todoText = document.getElementById('todoInput').value;
    const dueDate = document.getElementById('dueDateInput').value;
    if (todoText && dueDate) {
        todos.push({ text: todoText, dueDate: new Date(dueDate) });
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
        notifyUser(`Todo added: ${todoText}`, 'Scheduled for ' + new Date(dueDate).toLocaleDateString());
        document.getElementById('todoInput').value = '';
        document.getElementById('dueDateInput').value = '';
    }
});

// Function to render the list of todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort todos by due date

    todos.forEach((todo, index) => {
        const li = document.createElement('li');

        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.disabled = true;

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = new Date(todo.dueDate).toISOString().split('T')[0]; // Set value to the due date
        dateInput.disabled = true;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            if (input.disabled && dateInput.disabled) {
                input.disabled = false;
                dateInput.disabled = false;
                editButton.textContent = 'Save';
            } else {
                todos[index] = { text: input.value, dueDate: new Date(dateInput.value) };
                localStorage.setItem('todos', JSON.stringify(todos));
                input.disabled = true;
                dateInput.disabled = true;
                editButton.textContent = 'Edit';
                renderTodos(); // Re-render to update the order after editing
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', () => {
            todos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        });

        li.appendChild(input);
        li.appendChild(dateInput);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });

    checkForDueTodos(); // Check for due todos whenever the list is rendered
}

// Function to check for due todos and notify the user
function checkForDueTodos() {
    const now = new Date();
    todos.forEach(todo => {
        const dueTime = new Date(todo.dueDate).getTime();
        if (dueTime <= now.getTime()) {
            notifyUser(`Todo due: ${todo.text}`, 'Due on ' + new Date(todo.dueDate).toLocaleDateString());
        }
    });
}

// Function to show a notification
function notifyUser(title, body) {
    if (Notification.permission === 'granted') {
        new Notification(title, { body });
    }
}

// Initial rendering of the todos when the page loads
renderTodos();
