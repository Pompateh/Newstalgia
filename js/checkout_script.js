document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    const purchaseButton = document.getElementById('purchase-button');
    const closeButton = document.getElementById('close-button');
    const backButton = document.getElementById('back-button');

    // Function to retrieve cart data from localStorage
    const getCartFromLocalStorage = () => {
        let cart = [];
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        return cart;
    }

    // Retrieve listProducts from main page's script or another source
    const listProducts = [
        { id: '1', name: 'Piconto Font', price: 15 },
        { id: '2', name: 'Piconto Font1', price: 20 },
        { id: '3', name: 'Piconto Font2', price: 25 },
        { id: '4', name: 'Piconto Font3', price: 30 },
        { id: '5', name: 'Piconto Font4', price: 35 },
        { id: '6', name: 'Piconto Font5', price: 35 },
        { id: '7', name: 'Piconto Font6', price: 35 },
        { id: '8', name: 'Piconto Font7', price: 35 },
        { id: '9', name: 'Piconto Font8', price: 35 },
        // Add all your products here
    ];

    // Function to render cart items in the checkout page
    const renderCartItems = () => {
        const cart = getCartFromLocalStorage();
        let totalPrice = 0;

        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            let product = listProducts.find(p => p.id === item.product_id);

            if (product) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${item.quantity}</td>
                    <td>${(product.price * item.quantity).toFixed(2)}$</td>
                `;
                cartItemsContainer.appendChild(row);

                totalPrice += product.price * item.quantity;
            } else {
                console.warn('Product not found for id:', item.product_id);
            }
        });

        checkoutTotalPrice.textContent = totalPrice.toFixed(2) + '$';
    }

    purchaseButton.addEventListener('click', () => {
        const cart = getCartFromLocalStorage();
        const orderDetails = cart.map(item => `${item.quantity}x ${listProducts.find(p => p.id === item.product_id).name}`).join(', ');
        const totalAmount = checkoutTotalPrice.textContent.trim(); // Get total amount from displayed text

        // Redirect to QR code page with order details and total amount as URL parameters
        window.location.href = `qr_code.html?order=${encodeURIComponent(orderDetails)}&total=${encodeURIComponent(totalAmount)}`;
    });

    closeButton.addEventListener('click', () => {
        window.location.href = 'shop.html'; // Redirect to shop page
    });

    renderCartItems();
});
