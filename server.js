const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/submit-order', (req, res) => {
    const { email, orderDetails } = req.body;

    // Configure nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'heetran.work@gmail.com',
            pass: '31122000h'
        }
    });

    // Email options
    const mailOptions = {
        from: 'heetran.work@gmail.com',
        to: email, // Send confirmation to the user's email
        subject: 'Order Confirmation',
        text: `Thank you for your order!\n\nOrder Details:\n${orderDetails}\n\nWe will process your order soon.`
    };

    // Send email to the user
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending confirmation email' });
        }
        console.log('Email sent:', info.response);
        res.json({ message: 'Order received successfully' });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
