let totalIncome = 0;
let totalExpenses = 0;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0]; // Default to today's date if not provided

    if (description !== '' && !isNaN(amount)) {
        const transaction = {
            description,
            amount,
            category,
            date
        };

        transactions.push(transaction);
        updateLocalStorage();
        addTransactionToDOM(transaction);
        updateSummary();

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

    if (transaction.category === 'income') {
        totalIncome += transaction.amount;
    } else {
        totalExpenses += Math.abs(transaction.amount);
    }

    listItem.innerHTML = `${transaction.date} - ${transaction.description} - $${transaction.amount.toFixed(2)} <span class="category">[${transaction.category}]</span>`;
    transactionList.appendChild(listItem);
}

function updateSummary() {
    const balance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
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
}

function init() {
    renderTransactions(transactions);
}

init();
