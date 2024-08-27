let totalIncome = 0;
let totalExpenses = 0;
let transactions = [];
let currentUser = null;
let incomeExpenseChart;

function login() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        currentUser = username;
        loadUserData();
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
    } else {
        alert('Please enter a username.');
    }
}

function logout() {
    currentUser = null;
    transactions = [];
    totalIncome = 0;
    totalExpenses = 0;
    document.getElementById('transaction-list').innerHTML = '';
    updateSummary();
    updateChart();
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('app-section').style.display = 'none';
}

function loadUserData() {
    const userData = JSON.parse(localStorage.getItem(`budget_${currentUser}`)) || [];
    transactions = userData;
    renderTransactions(transactions);
    updateSummary();
    updateChart();
}

function saveUserData() {
    localStorage.setItem(`budget_${currentUser}`, JSON.stringify(transactions));
}

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0]; // Default to today's date if not provided

    if (description !== '' && !isNaN(amount)) {
        const transaction = {
            id: generateId(),
            description,
            amount,
            category,
            date
        };

        transactions.push(transaction);
        saveUserData();
        addTransactionToDOM(transaction);
        updateSummary();
        updateChart();

        // Clear the input fields after adding
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('category').value = 'income';
        document.getElementById('date').value = '';
    } else {
        alert('Please enter a valid description, amount, and select a category.');
    }
}

function addTransactionToDOM(transaction) {
    const transactionList = document.getElementById('transaction-list');
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', transaction.id);

    if (transaction.category === 'income') {
        totalIncome += transaction.amount;
    } else {
        totalExpenses += Math.abs(transaction.amount);
    }

    listItem.innerHTML = `
        ${transaction.date} - ${transaction.description} - $${transaction.amount.toFixed(2)} <span class="category">[${transaction.category}]</span>
        <div class="transaction-actions">
            <button class="edit" onclick="editTransaction('${transaction.id}')">Edit</button>
            <button onclick="deleteTransaction('${transaction.id}')">Delete</button>
        </div>
    `;
    transactionList.appendChild(listItem);
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);

    if (transaction) {
        document.getElementById('description').value = transaction.description;
        document.getElementById('amount').value = transaction.amount;
        document.getElementById('category').value = transaction.category;
        document.getElementById('date').value = transaction.date;

        deleteTransaction(id); // Remove the old transaction so the new one can be added with updated info
    }
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveUserData();
    renderTransactions(transactions);
    updateChart();
}

function updateSummary() {
    const balance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
}

function updateChart() {
    incomeExpenseChart.data.datasets[0].data = [totalIncome, totalExpenses];
    incomeExpenseChart.update();
}

function filterTransactions() {
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
    const filterCategory = document.getElementById('filter-category').value;

    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const startMatch = startDate ? transactionDate >= new Date(startDate) : true;
        const endMatch = endDate ? transactionDate <= new Date(endDate) : true;
        const categoryMatch = filterCategory === 'all' || transaction.category === filterCategory;

        return startMatch && endMatch && categoryMatch;
    });

    renderTransactions(filteredTransactions);
}

function renderTransactions(filteredTransactions) {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    totalIncome = 0;
    totalExpenses = 0;

    filteredTransactions.forEach(addTransactionToDOM);
    updateSummary();
    updateChart();
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function initChart() {
    const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
    incomeExpenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Income vs Expenses',
                data: [totalIncome, totalExpenses],
                backgroundColor: ['#28a745', '#dc3545'],
                borderColor: ['#28a745', '#dc3545'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

function init() {
    initChart();
}

init();
