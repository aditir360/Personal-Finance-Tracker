// DOM Elements
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');
const totalBalance = document.getElementById('total-balance');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');

let transactions = [];

transactionForm.addEventListener('submit', addTransaction);

function addTransaction(e) {
    e.preventDefault();

    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    if (!description || isNaN(amount)) return;

    const transaction = {
        id: generateID(),
        description,
        amount,
        type
    };

    transactions.push(transaction);

    updateTransactionList();
    updateSummary();
    updateChart();

    descriptionInput.value = '';
    amountInput.value = '';
}

function generateID() {
    return Math.floor(Math.random() * 1000000);
}

function updateTransactionList() {
    transactionList.innerHTML = '';

    transactions.forEach(transaction => {
        const sign = transaction.type === 'income' ? '+' : '-';
        const item = document.createElement('li');
        item.classList.add(transaction.type);
        item.innerHTML = `
            ${transaction.description} <span>${sign}$${Math.abs(transaction.amount)}</span>
            <button class="remove-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;

        transactionList.appendChild(item);
    });
}

function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    totalIncome.innerText = income.toFixed(2);
    totalExpense.innerText = expense.toFixed(2);
    totalBalance.innerText = (income - expense).toFixed(2);
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateTransactionList();
    updateSummary();
    updateChart();
}

// Chart.js Configuration
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Income', 'Expense'],
        datasets: [{
            label: 'Finances',
            data: [0, 0],
            backgroundColor: ['#2ecc71', '#e74c3c'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

function updateChart() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    myChart.data.datasets[0].data = [income, expense];
    myChart.update();
}
