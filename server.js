const express = require('express');
const mongoose = require('mongoose');
const articleRouter = require('./routes/articles');
const Article = require('./models/article.model');
const app = express();
require('dotenv').config(); // Ensure to load environment variables
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//PORT
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

//Set View Engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Connect to MongoDB
mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit process with failure code
});

// Routes
app.use('/articles', articleRouter);

app.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('articles/index', { articles });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).send('Server Error'); // Return a server error status
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});