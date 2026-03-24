let allProducts = []; 
let cartItems = [];

const savedCart = localStorage.getItem('cartItems');
if (savedCart) {
    cartItems = JSON.parse(savedCart);
}

const cardWrapper = document.querySelector('.card-wrapper')
const loadingMessage = document.getElementById('loading-message')
const errorMessage = document.getElementById('error-message')

const navCart = document.getElementById('nav-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const cartItemsList = document.getElementById('cart-items-list');
const sidebarTotal = document.getElementById('sidebar-total');
const sidebarTax = document.getElementById('sidebar-tax');
const cartOverlay = document.getElementById('cart-overlay');
const sidebarFooter = document.getElementById('sidebar-footer');

async function getProducts() {
    try{
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        cardWrapper.innerHTML = '';

        const response = await fetch('https://fakestoreapi.com/products')

        if (!response.ok){
            throw new Error('Что-то пошло не так');
        }
        const data = await response.json();
        allProducts = data;
        console.log('Products:', allProducts);

        loadingMessage.style.display = 'none';
        renderProducts(allProducts);
    }
    catch(error){
        console.error('Error:', error);
        loadingMessage.style.display = 'none'
        errorMessage.style.display = 'block';
    }
}

function renderProducts(products){
    cardWrapper.innerHTML = '';
    if (Array.isArray(products) && products.length > 0){
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card'
 
            const price = (product.price * 100).toLocaleString('ru-RU') + ' руб. ';
            const title = product.title.length > 50
            ? product.title.substring(0,50) + '...'
            : product.title
 
            card.innerHTML = `
            <div class="card-content">
            <img src="${product.image}" alt="${product.title}" class="card-img">
            <h3 class="card-title">${title}</h3>
            <div class="price-section">
            <div class="price-column">
                <p class="price-label">ЦЕНА:</p>
                <p class="card-price">${price}</p>
                </div>
                <button class="card-btn" type="button">
                <img src="./images/Vector.svg" alt="Add">
                </button>
                </div>
                </div>
        `;
 
            cardWrapper.appendChild(card);
            
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('card-btn') || e.target.closest('.card-btn')) {
                    const btn = card.querySelector('.card-btn');
                    btn.classList.toggle('active');
                    
                    const isActive = btn.classList.contains('active');
                    const existing = cartItems.find(item => item.id === product.id);
                    
                    if (isActive) {
                        if (existing) {
                            existing.quantity += 1;
                        } else {
                            product.quantity = 1;
                            cartItems.push(product);
                        }
                    } else {
                        removeFromCart(product.id);
                    }
                    
                    updateCartDisplay(cartItems);
                } else {
                    const link = `product-details.html?id=${product.id}`;
                    window.location.href = link;
                }
            });
        });
    }
}


const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', (e) => {
    const filtered = filterBySearch(allProducts, e.target.value);
});

function filterBySearch(products, searchTerm) {
    const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderProducts(filtered);
}

function updateCartDisplay(cartItems){
    const cartPrice = document.getElementById('cart-price');

    let sum = 0;
    cartItems.forEach(cart => {
        sum += cart.price * cart.quantity;
    })
    
    const totalPrice = (sum * 100).toLocaleString('ru-RU');
    const taxPrice = (sum * 100 * 0.05).toLocaleString('ru-RU');
    
    cartPrice.textContent = totalPrice + ' ₽';
    sidebarTotal.textContent = totalPrice;
    sidebarTax.textContent = taxPrice;

    displayCartItems();

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function renderCartItems() {
    const emptyCart = document.getElementById('empty-cart');
    
    if (cartItems.length === 0) {
        return;
    }
    
    const existingItems = cartItemsList.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());
    
    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        
        const itemPrice = (item.price * 100).toLocaleString('ru-RU');
        const itemTitle = item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title;
        
        itemDiv.innerHTML = `
            <div class="cart-item-content">
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${itemTitle}</h4>
                    <p class="cart-item-price">${itemPrice} ₽</p>
                </div>
                <button class="remove-btn" data-id="${item.id}">✕</button>
            </div>
        `;
        
        cartItemsList.appendChild(itemDiv);
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            removeFromCart(itemId);
        });
    });
}

function removeFromCart(itemId) {
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        if (cartItems[itemIndex].quantity > 1) {
            cartItems[itemIndex].quantity -= 1;
        } else {
            cartItems.splice(itemIndex, 1);
        }
        updateCartDisplay(cartItems);
    }
}

function displayCartItems() {
    const emptyCart = document.getElementById('empty-cart');
    
    console.log('displayCartItems called');
    console.log('cartItems.length:', cartItems.length);
    console.log('sidebarFooter:', sidebarFooter);
    
    if (cartItems.length === 0) {
        console.log('Cart is EMPTY - hiding footer');
        emptyCart.style.display = 'flex';
        sidebarFooter.classList.remove('show');
    } else {
        console.log('Cart has items - showing footer');
        emptyCart.style.display = 'none';
        sidebarFooter.classList.add('show');
        renderCartItems();
    }
}

function removeFromCart(itemId) {
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        if (cartItems[itemIndex].quantity > 1) {
            cartItems[itemIndex].quantity -= 1;
        } else {
            cartItems.splice(itemIndex, 1);
        }
        
        document.querySelectorAll('.card-btn').forEach(btn => {
            const btnParent = btn.closest('.card');
            const productTitle = btnParent.querySelector('.card-title').textContent;
            const product = allProducts.find(p => p.title.includes(productTitle));
            
            if (product && !cartItems.find(item => item.id === product.id)) {
                btn.classList.remove('active');
            }
        });
        
        updateCartDisplay(cartItems);
    }
}

navCart.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    displayCartItems();
});

closeSidebar.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
});

const backBtn = document.getElementById('back-btn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getProducts();
    displayCartItems();
    updateCartDisplay(cartItems);
});