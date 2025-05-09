let totalPrice = 0;
let order = 0;
let cartItems = [];

// Render products in their respective sections
async function displayProducts() {
    try {
        const response = await fetch('./shop.json');
        const products = await response.json();

        // Filter by category
        const menProducts = products.filter(product => product.category === 'men');
        const womenProducts = products.filter(product => product.category === 'women');
        const kidsProducts = products.filter(product => product.category === 'kids');

        renderCategory(menProducts, '.cardbox');
        renderCategory(womenProducts, '.wbox');
        renderCategory(kidsProducts, '.kbox');
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderCategory(products, containerSelector) {
    const container = document.querySelector(containerSelector);
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'ccard position-relative';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
            </div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        container.appendChild(card);
    });
    // Attach event listeners for add to cart
    container.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToCartById(id);
        });
    });
}

// Helper to get product by id
async function getProductById(id) {
    const response = await fetch('./shop.json');
    const products = await response.json();
    return products.find(product => product.id === id);
}

async function addToCartById(id) {
    const product = await getProductById(id);
    if (!product) return;
    const existing = cartItems.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }
    totalPrice += parseFloat(product.price.replace('$', ''));
    order += 1;
    renderCart();
}

function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;
    cartContainer.innerHTML = '';
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        document.querySelector('.total-value').textContent = 'Total: $0.00';
        document.querySelector('.order').textContent = '0';
        return;
    }
    cartItems.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">${item.price} x ${item.quantity}</p>
            </div>
            <button class="btn btn-sm btn-outline-danger delete" data-idx="${idx}"><i class="fas fa-trash"></i></button>
        `;
        cartContainer.appendChild(div);
    });
    // Remove buttons
    cartContainer.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.closest('button').getAttribute('data-idx'));
            removeCartItem(idx);
        });
    });
    document.querySelector('.total-value').textContent = `Total: $${totalPrice.toFixed(2)}`;
    document.querySelector('.order').textContent = `${order}`;
}

function removeCartItem(idx) {
    const item = cartItems[idx];
    totalPrice -= parseFloat(item.price.replace('$', '')) * item.quantity;
    order -= item.quantity;
    cartItems.splice(idx, 1);
    renderCart();
}

// Cart visibility
const cartButton = document.getElementById('cart');
const cartContainer = document.querySelector('.cartcont');
const closeButton = document.getElementById('cross');

cartButton.addEventListener('click', (e) => {
    e.preventDefault();
    cartContainer.classList.add('active');
});
closeButton.addEventListener('click', () => {
    cartContainer.classList.remove('active');
});
document.addEventListener('click', (e) => {
    if (!cartContainer.contains(e.target) && !cartButton.contains(e.target)) {
        cartContainer.classList.remove('active');
    }
});

// Initial cart state
renderCart();
// Show products
window.addEventListener('DOMContentLoaded', displayProducts);
