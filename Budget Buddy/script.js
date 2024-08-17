let totalIncome = 0;
let totalExpenses = 0;

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (description !== '' && !isNaN(amount)) {
        const transactionList = document.getElementById('transaction-list');
        const listItem = document.createElement('li');

        if (amount >= 0) {
            totalIncome += amount;
            listItem.classList.add('income');
        } else {
            totalExpenses += Math.abs(amount);
            listItem.classList.add('expense');
        }

        listItem.innerHTML = `${description} - $${amount.toFixed(2)}`;
        transactionList.appendChild(listItem);

        updateSummary();

        // Clear the input fields after adding
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
    } else {
        alert('Please enter both a valid description and amount.');
    }
}

function updateSummary() {
    const balance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
}
