function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;

    if (description !== '' && amount !== '') {
        const transactionList = document.getElementById('transaction-list');

        const listItem = document.createElement('li');
        listItem.innerHTML = `${description} - $${amount}`;
        
        transactionList.appendChild(listItem);

        // Clear the input fields after adding
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
    } else {
        alert('Please enter both a description and an amount.');
    }
}
