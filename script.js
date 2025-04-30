// Sample products data
const products = [
    { id: 1, name: 'Product 1', price: 10.99 },
    { id: 2, name: 'Product 2', price: 19.99 },
    { id: 3, name: 'Product 3', price: 15.99 }
];

let cart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadCart();
});

// Display products
function displayProducts() {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Cookie Management Functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return JSON.parse(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

// Modify the saveCart function to use both localStorage and cookies
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    sessionStorage.setItem('cart', JSON.stringify(cart));
    setCookie('cart', cart, 7); // Save cart in cookies for 7 days
}

// Modify the loadCart function to check all storage types
function loadCart() {
    // Try to load from sessionStorage first
    const sessionCart = sessionStorage.getItem('cart');
    if (sessionCart) {
        cart = JSON.parse(sessionCart);
    } else {
        // Try cookies next
        const cookieCart = getCookie('cart');
        if (cookieCart) {
            cart = cookieCart;
        } else {
            // Finally try localStorage
            const localCart = localStorage.getItem('cart');
            if (localCart) {
                cart = JSON.parse(localCart);
            }
        }
    }
    updateCartDisplay();
    displayStorageInfo();
}

// Add function to display storage information
function displayStorageInfo() {
    const sessionCart = sessionStorage.getItem('cart');
    const localCart = localStorage.getItem('cart');
    const cookieCart = getCookie('cart');

    const storageInfo = `
        <div class="storage-info">
            <h3>Storage Information:</h3>
            <p>Session Storage: ${sessionCart ? '✓' : '✗'}</p>
            <p>Local Storage: ${localCart ? '✓' : '✗'}</p>
            <p>Cookies: ${cookieCart ? '✓' : '✗'}</p>
        </div>
    `;

    const storageDiv = document.getElementById('storage-info');
    if (storageDiv) {
        storageDiv.innerHTML = storageInfo;
    }
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartDisplay();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartInfo = document.getElementById('cart-info');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} (${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartInfo.textContent = `Cart (${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
}