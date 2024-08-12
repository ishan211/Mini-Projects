// Retrieve todos from local storage or initialize with an empty array
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Event listener for adding a new todo
document.getElementById('addTodoButton').addEventListener('click', function() {
    const todoText = document.getElementById('todoInput').value; // Get the input value
    if (todoText) { // Check if the input is not empty
        todos.push(todoText); // Add the new todo to the list
        localStorage.setItem('todos', JSON.stringify(todos)); // Save the updated list to local storage
        renderTodos(); // Render the updated list of todos
        document.getElementById('todoInput').value = ''; // Clear the input field
    }
});

// Function to render the list of todos
function renderTodos() {
    const todoList = document.getElementById('todoList'); // Get the todo list element
    todoList.innerHTML = ''; // Clear the current list
    todos.forEach((todo, index) => { // Loop through the todos
        const li = document.createElement('li'); // Create a new list item
        li.textContent = todo; // Set the text content to the todo
        const deleteButton = document.createElement('button'); // Create a delete button
        deleteButton.textContent = 'Delete'; // Set the button text
        deleteButton.addEventListener('click', () => { // Add an event listener to delete the todo
            todos.splice(index, 1); // Remove the todo from the list
            localStorage.setItem('todos', JSON.stringify(todos)); // Save the updated list to local storage
            renderTodos(); // Re-render the list of todos
        });
        li.appendChild(deleteButton); // Add the delete button to the list item
        todoList.appendChild(li); // Add the list item to the todo list
    });
}

// Initial rendering of the todos when the page loads
renderTodos();
