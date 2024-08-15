// Function to retrieve products from local storage
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Function to retrieve transactions from local storage
function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
}

// Function to format currency values
function formatCurrency(value) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Function to display a product row
function createProductRow(product) {
    const row = document.createElement('tr');

    // Color coding for low stock
    if (product.quantity <= product.lowStockAlert) {
        row.style.backgroundColor = 'red';
    }

    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${formatCurrency(product.cost)}</td>
        <td>${formatCurrency(product.price)}</td>
    `;

    return row;
}

// Function to display products in the table
function displayProducts() {
    const products = getProducts();
    const tableBody = document.getElementById('products-table-body');
    tableBody.innerHTML = '';

    products.forEach((product) => {
        const row = createProductRow(product);
        tableBody.appendChild(row);
    });
}

// Function to search products
function searchProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const products = getProducts();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchInput));

    const tableBody = document.getElementById('products-table-body');
    tableBody.innerHTML = '';

    filteredProducts.forEach((product) => {
        const row = createProductRow(product);
        tableBody.appendChild(row);
    });
}

// Function to create a transaction row
function createTransactionRow(transaction, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${transaction.productName}</td>
        <td>${transaction.quantity}</td>
        <td>${formatCurrency(transaction.rate)}</td>
        <td>${formatCurrency(transaction.quantity * transaction.rate)}</td>
        <td>${transaction.date}</td>
        <td>${transaction.type}</td>
    `;
    return row;
}

// Function to display transactions in the transactions table
function displayTransactions() {
    const transactions = getTransactions();
    const tableBody = document.getElementById('transactions-table-body');
    tableBody.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const row = createTransactionRow(transaction, index);
        tableBody.appendChild(row);
    });
}

// Function to filter transactions based on date and type
function filterTransactions() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const transactionType = document.querySelector('input[name="transaction-type"]:checked').value;

    const transactions = getTransactions();
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const withinDateRange = (!startDate || transactionDate >= new Date(startDate)) &&
                                (!endDate || transactionDate <= new Date(endDate));
        const typeMatches = transactionType === 'all' || transaction.type === transactionType;

        return withinDateRange && typeMatches;
    });

    const tableBody = document.getElementById('transactions-table-body');
    tableBody.innerHTML = '';

    filteredTransactions.forEach((transaction, index) => {
        const row = createTransactionRow(transaction, index);
        tableBody.appendChild(row);
    });

    updateSummaryMetrics();
}

// Function to calculate and display summary metrics
function updateSummaryMetrics() {
    const transactions = getTransactions();
    const products = getProducts();

    let totalSales = 0;
    let totalPurchases = 0;
    let currentStockValue = 0;

    transactions.forEach(transaction => {
        const amount = transaction.quantity * transaction.rate;
        if (transaction.type === 'in') {
            totalPurchases += amount;
        } else if (transaction.type === 'out') {
            totalSales += amount;
        }
    });

    products.forEach(product => {
        currentStockValue += product.quantity * product.cost;
    });

    const grossProfit = totalSales - totalPurchases;

    document.getElementById('total-sales').textContent = formatCurrency(totalSales);
    document.getElementById('total-purchases').textContent = formatCurrency(totalPurchases);
    document.getElementById('gross-profit').textContent = formatCurrency(grossProfit);
    document.getElementById('stock-value').textContent = formatCurrency(currentStockValue);
}

// Function to set default dates for the date pickers
function setDefaultDates() {
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    startDate.valueAsDate = firstDayOfMonth;
    endDate.valueAsDate = lastDayOfMonth;
}

// Function to print the current stock table
function printStock() {
    const printContent = document.querySelector('.current-stock').innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Stock</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Function to print the transactions table
function printTransactions() {
    const printContent = document.querySelector('.transactions-table').innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Transactions</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Function to logout (placeholder, to be implemented)
function logout() {
    alert('Logging out...');
    // Redirect to login page or perform logout actions
}

// Initializing functions
setDefaultDates();
displayProducts();
displayTransactions();
updateSummaryMetrics();
