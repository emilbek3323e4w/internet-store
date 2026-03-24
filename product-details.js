let cartItems = [];

const savedCart = localStorage.getItem('cartItems');
if (savedCart) {
    cartItems = JSON.parse(savedCart);
}

async function getProducts() {
    try{
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error('Error fetching products:', error);
    }
}


async function displayProductDetails(){
    const allProducts = await getProducts();

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    const product = allProducts.find(item => item.id === parseInt(productId));

    if (product) {
        window.currentProduct = product;  
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-price').textContent = (product.price * 100) + ' ₽';
    }
}

function addToCartFromDetails(product) {
    const existing = cartItems.find(item => item.id === product.id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        product.quantity = 1;
        cartItems.push(product);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    alert(`${product.title} added to cart!`);
}

document.addEventListener('DOMContentLoaded', () => {
    displayProductDetails();
});
