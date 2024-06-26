document.getElementById('email-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email-input').value;
    const orderDetails = document.getElementById('order-details').value;

    if (email && orderDetails) {
        fetch('http://localhost:3000/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, orderDetails })
        })
        .then(response => response.json())
        .then(result => {
            alert('Order submitted successfully');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your order. Please try again.');
        });
    } else {
        alert('Please fill in all fields.');
    }
});

document.getElementById('close-button').addEventListener('click', function() {
    document.querySelector('.qr-container').style.display = 'none';
});
