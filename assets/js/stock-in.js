// Function to retrieve products from local storage
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Function to populate product dropdown
function populateProductDropdown() {
    const products = getProducts();
    const productSelect = document.getElementById('product-select');

    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        option.dataset.rate = product.cost; // Storing the cost (instead of price) in a data attribute
        productSelect.appendChild(option);
    });
}

// Function to load product details into form fields
function loadProductDetails() {
    const productSelect = document.getElementById('product-select');
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const rate = selectedOption.dataset.rate;

    document.getElementById('rate').value = rate;
    calculateAmount(); // Recalculate amount when product is selected
}

// Function to calculate amount based on quantity and rate
function calculateAmount() {
    const quantity = document.getElementById('quantity').value;
    const rate = document.getElementById('rate').value;
    const amount = quantity * rate;
    document.getElementById('amount').value = formatCurrency(amount);
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

// Function to add stock in to transaction table
function addStockIn(event) {
    event.preventDefault();

    const productName = document.getElementById('product-select').value;
    const quantity = document.getElementById('quantity').value;
    const rate = document.getElementById('rate').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;

    const tableBody = document.getElementById('transaction-table-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${productName}</td>
        <td>${quantity}</td>
        <td>${formatCurrency(rate)}</td>
        <td>${amount}</td>
        <td>${date}</td>
    `;
    tableBody.appendChild(row);

    // Clear the form for the next entry
    document.getElementById('stock-in-form').reset();
}

// Function to finalize transaction
function finalizeTransaction() {
    const tableBody = document.getElementById('transaction-table-body');
    const rows = tableBody.querySelectorAll('tr');
    const transactions = getTransactions();

    rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        const transaction = {
            serialNumber: transactions.length + 1,
            productName: columns[0].textContent,
            quantity: parseInt(columns[1].textContent, 10),
            rate: parseFloat(columns[2].textContent.replace(/[₦,]/g, '')),
            amount: parseFloat(columns[3].textContent.replace(/[₦,]/g, '')),
            date: columns[4].textContent,
            transactionType: 'Stock In'
        };
        transactions.push(transaction);
    });

    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Clear the table after finalizing
    tableBody.innerHTML = '';

    alert('Transaction finalized successfully!');
}

// Function to retrieve transactions from local storage
function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
}

// Initialize the page by populating the product dropdown
window.onload = populateProductDropdown;
