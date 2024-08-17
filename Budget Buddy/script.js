let totalIncome = 0;
let totalExpenses = 0;

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (description !== '' && !isNaN(amount)) {
        const transactionList = document.getElementById('transaction-list');
        const listItem = document.createElement('li');

        if (category === 'income') {
            totalIncome += amount;
        } else {
            totalExpenses += Math.abs(amount);
        }

        listItem.innerHTML = `${description} - $${amount.toFixed(2)} <span class="category">[${category}]</span>`;
        transactionList.appendChild(listItem);

        updateSummary();

        // Clear the input fields after adding
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('category').value = 'income';
    } else {
        alert('Please enter a valid description, amount, and select a category.');
    }
}

function updateSummary() {
    const balance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
}
