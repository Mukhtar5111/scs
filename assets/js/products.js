let products = [];

// Load products and populate dropdowns
function loadProducts() {
    products = JSON.parse(localStorage.getItem("products")) || [];
    const productSelect = document.getElementById("product-select");
    const productSelectOut = document.getElementById("product-select-out");

    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.productName;
        option.textContent = product.productName;
        productSelect.appendChild(option);

        const optionOut = document.createElement("option");
        optionOut.value = product.productName;
        optionOut.textContent = product.productName;
        productSelectOut.appendChild(optionOut);
    });
}

// Populate the cost price field based on selected product
function populatePrice() {
    const selectedProduct = document.getElementById("product-select").value;
    const product = products.find(p => p.productName === selectedProduct);
    if (product) {
        document.getElementById("cost").value = product.costPrice.toFixed(2);
    }
}

// Populate the selling price field based on selected product
function populateSellingPrice() {
    const selectedProduct = document.getElementById("product-select-out").value;
    const product = products.find(p => p.productName === selectedProduct);
    if (product) {
        document.getElementById("price").value = product.sellingPrice.toFixed(2);
    }
}

function addProduct(event) {
    event.preventDefault();
    const productName = document.getElementById("product-name").value;
    const costPrice = parseFloat(document.getElementById("cost-price").value);
    const sellingPrice = parseFloat(document.getElementById("selling-price").value);

    const product = { productName, costPrice, sellingPrice };
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    updateProductTable();
    loadProducts(); // Reload products to update dropdowns
    document.getElementById("product-form").reset();
}

// Initialize products on load
document.addEventListener("DOMContentLoaded", () => {
    products = JSON.parse(localStorage.getItem("products")) || [];
    loadProducts();
    updateProductTable();
});
