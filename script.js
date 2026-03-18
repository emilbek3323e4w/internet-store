const cardWrapper = document.querySelector('.card-wrapper')
const loadingMessage = document.getElementById('loading-message')
const errorMessage = document.getElementById('error-message')


let allProducts = []; 

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
        })
    }
    
    document.querySelectorAll('.card-btn').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
        });
    });
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


document.addEventListener('DOMContentLoaded', getProducts);
