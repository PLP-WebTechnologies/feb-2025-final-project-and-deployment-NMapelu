// Products Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        category: "electronics",
        image: "images/products/headphones.jpg",
        description: "High-quality wireless headphones with noise cancellation."
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "electronics",
        image: "images/products/smartwatch.jpg",
        description: "Feature-packed smartwatch with health monitoring."
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 24.99,
        category: "clothing",
        image: "images/products/tshirt.jpg",
        description: "Comfortable 100% cotton t-shirt in various colors."
    },
    {
        id: 4,
        name: "Denim Jeans",
        price: 59.99,
        category: "clothing",
        image: "images/products/jeans.jpg",
        description: "Classic fit denim jeans for everyday wear."
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 79.99,
        category: "home",
        image: "images/products/coffeemaker.jpg",
        description: "Programmable coffee maker with 12-cup capacity."
    },
    {
        id: 6,
        name: "Blender",
        price: 49.99,
        category: "home",
        image: "images/products/blender.jpg",
        description: "High-speed blender for smoothies and food preparation."
    },
    {
        id: 7,
        name: "Laptop",
        price: 899.99,
        category: "electronics",
        image: "images/products/laptop.jpg",
        description: "Thin and light laptop with powerful performance."
    },
    {
        id: 8,
        name: "Running Shoes",
        price: 89.99,
        category: "clothing",
        image: "images/products/shoes.jpg",
        description: "Comfortable running shoes with cushioned soles."
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');
const cartCountElements = document.querySelectorAll('.cart-count');
const productsGrid = document.querySelector('.products-grid');
const categoryFilter = document.getElementById('category-filter');
const searchInput = document.getElementById('search-input');
const cartItemsContainer = document.querySelector('.cart-items');
const emptyCartMessage = document.querySelector('.empty-cart-message');
const subtotalElement = document.querySelector('.subtotal');
const totalAmountElement = document.querySelector('.total-amount');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the page
    updateCartCount();
    
    // Load products if on products page or home page
    if (productsGrid) {
        displayProducts(products);
        
        // Add event listeners for filtering
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterProducts);
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', filterProducts);
        }
    }
    
    // Load cart if on cart page
    if (cartItemsContainer) {
        displayCartItems();
        updateCartSummary();
    }
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
});

// Functions
function toggleMobileMenu() {
    navMenu.classList.toggle('show');
}

function displayProducts(productsToDisplay) {
    productsGrid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function filterProducts() {
    const selectedCategory = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredProducts = products;
    
    // Filter by category
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filteredProducts);
}

function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function displayCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <p class="remove-item" data-id="${item.id}">Remove</p>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners for quantity changes and removal
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    item.quantity += 1;
    updateCart();
}

function updateQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const newQuantity = parseInt(e.target.value);
    const item = cart.find(item => item.id === productId);
    
    if (newQuantity >= 1) {
        item.quantity = newQuantity;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
    updateCartSummary();
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    }
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 5.99;
    const total = subtotal + shipping;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalAmountElement.textContent = `$${total.toFixed(2)}`;
}