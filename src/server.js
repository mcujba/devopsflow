const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, company, message } = req.body;
        // Aici poți salva mesajul sau trimite email etc.
        res.json({ message: 'Message received successfully' });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 