document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail');
    let currentProduct = JSON.parse(localStorage.getItem('currentProduct'));

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
    } else {
        productDetailContainer.innerHTML = '<p>Product not found.</p>';
    }
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

    renderProductDetail();
});