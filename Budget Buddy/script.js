let totalIncome = 0;
let totalExpenses = 0;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (description !== '' && !isNaN(amount)) {
        const transaction = {
            description,
            amount,
            category
        };

        transactions.push(transaction);
        updateLocalStorage();
        addTransactionToDOM(transaction);
        updateSummary();

        // Clear the input fields after adding
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('category').value = 'income';
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

    listItem.innerHTML = `${transaction.description} - $${transaction.amount.toFixed(2)} <span class="category">[${transaction.category}]</span>`;
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

function init() {
    transactions.forEach(addTransactionToDOM);
    updateSummary();
}

init();
