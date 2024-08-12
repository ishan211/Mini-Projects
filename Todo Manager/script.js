// Retrieve todo lists from local storage or initialize with a default list
let todoLists = JSON.parse(localStorage.getItem('todoLists')) || { 'Default': [] };
let currentList = localStorage.getItem('currentList') || 'Default';

// Function to render the list selector dropdown and initialize the selected list
function renderListSelector() {
    const listSelect = document.getElementById('listSelect');
    listSelect.innerHTML = '';
    for (const listName in todoLists) {
        const option = document.createElement('option');
        option.value = listName;
        option.textContent = listName;
        if (listName === currentList) {
            option.selected = true;
        }
        listSelect.appendChild(option);
    }
}

// Function to handle switching between todo lists
document.getElementById('listSelect').addEventListener('change', function() {
    currentList = this.value;
    localStorage.setItem('currentList', currentList);
    renderTodos();
});

// Function to create a new todo list
document.getElementById('newListButton').addEventListener('click', function() {
    const newListName = prompt('Enter the name of the new list:');
    if (newListName && !todoLists[newListName]) {
        todoLists[newListName] = [];
        localStorage.setItem('todoLists', JSON.stringify(todoLists));
        currentList = newListName;
        localStorage.setItem('currentList', currentList);
        renderListSelector();
        renderTodos();
    } else if (todoLists[newListName]) {
        alert('A list with this name already exists.');
    }
});

// Event listener for adding a new todo
document.getElementById('addTodoButton').addEventListener('click', function() {
    const todoText = document.getElementById('todoInput').value;
    const dueDate = document.getElementById('dueDateInput').value;
    if (todoText && dueDate) {
        todoLists[currentList].push({ text: todoText, dueDate: new Date(dueDate) });
        localStorage.setItem('todoLists', JSON.stringify(todoLists));
        renderTodos();
        notifyUser(`Todo added to ${currentList}: ${todoText}`, 'Scheduled for ' + new Date(dueDate).toLocaleDateString());
        document.getElementById('todoInput').value = '';
        document.getElementById('dueDateInput').value = '';
    }
});

// Function to render the list of todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    todoLists[currentList].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    todoLists[currentList].forEach((todo, index) => {
        const li = document.createElement('li');

        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.disabled = true;

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = new Date(todo.dueDate).toISOString().split('T')[0];
        dateInput.disabled = true;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            if (input.disabled && dateInput.disabled) {
                input.disabled = false;
                dateInput.disabled = false;
                editButton.textContent = 'Save';
            } else {
                todoLists[currentList][index] = { text: input.value, dueDate: new Date(dateInput.value) };
                localStorage.setItem('todoLists', JSON.stringify(todoLists));
                input.disabled = true;
                dateInput.disabled = true;
                editButton.textContent = 'Edit';
                renderTodos();
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', () => {
            todoLists[currentList].splice(index, 1);
            localStorage.setItem('todoLists', JSON.stringify(todoLists));
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
    todoLists[currentList].forEach(todo => {
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

// Request notification permission on page load
if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            checkForDueTodos(); // Check for due todos on page load if notifications are allowed
        }
    });
}

// Initial rendering of the todo lists and todos when the page loads
renderListSelector();
renderTodos();
