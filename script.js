let products = [];
let cart = [];

const productList = document.getElementById("productList");
const searchBar = document.getElementById("searchBar");
const cartList = document.getElementById("cartList");
const totalPriceElement = document.getElementById("totalPrice");
const checkoutButton = document.getElementById("checkoutButton");

function displayProducts(productsToDisplay) {
    productList.innerHTML = "";
    if (!productsToDisplay || !Array.isArray(productsToDisplay)) {
        productList.innerHTML = "<p>No products available.</p>";
        return;
    }
    productsToDisplay.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        alert(`${product.name} added to the cart!`);
        viewCart();
    }
}

function viewCart() {
    cartList.innerHTML = "";
    if (cart.length === 0) {
        cartList.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach((item) => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartList.appendChild(cartItem);
        });
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    viewCart();
}

searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});

checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some products before checking out.");
        return;
    }
    alert("Thank you for your purchase! Your order has been placed.");
    cart = [];
    viewCart();
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('/db.json') // Use root-relative path
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.products && Array.isArray(data.products)) {
                products = data.products;
                displayProducts(products);
            } else {
                throw new Error('Invalid data format in db.json');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            productList.innerHTML = "<p>Failed to load products. Ensure db.json is valid and in the root directory.</p>";
        });
    viewCart();
});