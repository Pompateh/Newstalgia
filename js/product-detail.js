document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail');
    let currentProduct = JSON.parse(localStorage.getItem('currentProduct'));
    let products = [];

    const fetchProducts = async () => {
        try {
            const response = await fetch('./data/products.json');
            products = await response.json();
            initializeProduct();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const initializeProduct = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        currentProduct = products.find(prod => prod.id === productId) || products[0];
        renderProductDetail();
    };

const renderProductDetail = () => {
    if (currentProduct) {
        productDetailContainer.innerHTML = `
            <div class="detail_head">
                <div class="detail_back"><a href="shop.html">Back</a></div>
                <div class="product_name">${currentProduct.name}</div>
                <div class="detail_next"><a href="#" id="nextProduct">Next</a></div>
            </div>
            <div class="detail_content">
                <div class="detail_main_img">
                    <img src="${currentProduct.image}" alt="${currentProduct.name}">
                </div>
<div class="product_story">
    <h3>Story</h3>
    <p>${currentProduct.story ? currentProduct.story : 'No story available for this product.'}</p>
</div>
                <div class="detail_img_grid">
                    <img src="${currentProduct.image1}" alt="${currentProduct.name} Detail 1">
                    <img src="${currentProduct.image2}" alt="${currentProduct.name} Detail 2">
                </div>
                <div class="detail_bottom_img">
                    <img src="${currentProduct.image3}" alt="${currentProduct.name} Detail 3">
                </div>
            </div>
            <div class="detail_end">
                <a href="index.html">Home</a>
                <div class="get_btn"><a href="#" id="addToCart">Add to Cart</a></div>
                <a href="shop.html">Shop</a>
            </div>
        `;
        

        document.getElementById('addToCart').addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(currentProduct.id);
            alert('Product added to cart!');
        });

        document.getElementById('nextProduct').addEventListener('click', navigateToNext);
        document.getElementById('nextProductBottom').addEventListener('click', navigateToNext);
        document.getElementById('prevProduct').addEventListener('click', navigateToPrev);
        document.getElementById('prevProductBottom').addEventListener('click', navigateToPrev);
    } else {
        productDetailContainer.innerHTML = '<p>Product not found.</p>';
    }
};

const navigateToNext = (e) => {
    e.preventDefault();
    const currentIndex = products.findIndex(prod => prod.id === currentProduct.id);
    const nextIndex = (currentIndex + 1) % products.length;
    currentProduct = products[nextIndex];
    updateURL();
    renderProductDetail();
};

const navigateToPrev = (e) => {
    e.preventDefault();
    const currentIndex = products.findIndex(prod => prod.id === currentProduct.id);
    const prevIndex = (currentIndex - 1 + products.length) % products.length;
    currentProduct = products[prevIndex];
    updateURL();
    renderProductDetail();
};

const updateURL = () => {
    const newUrl = `${window.location.pathname}?id=${currentProduct.id}`;
    history.pushState(null, '', newUrl);
};

const addToCart = (product_id) => {
    let carts = JSON.parse(localStorage.getItem('cart')) || [];
    let positionThisProductInCart = carts.findIndex(value => value.product_id == product_id);
    if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }
    localStorage.setItem('cart', JSON.stringify(carts));
};

fetchProducts();
});
