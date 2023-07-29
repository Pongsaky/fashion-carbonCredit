// main.js

document.addEventListener("DOMContentLoaded", async function () {
    // Fetch product data from the backend API
    const response = await fetch('/product/', {
        method : "GET",
        headers : {"Content-type": "application/json"}
    });

    const products = await response.json();
    console.log(products)

    // Get the product list container
    const productContainer = document.querySelector('.product-list');

    // Create HTML elements to display each product
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        const productName = document.createElement('h3');
        productName.textContent = product['name'];

        const productDescription = document.createElement('p');
        productDescription.textContent = product['description'];

        // Add other product information as needed (e.g., image, price, etc.)

        productElement.appendChild(productName);
        productElement.appendChild(productDescription);
        // Append other product information to the product element

        productContainer.appendChild(productElement);
    });
});
