const express = require('express');
const Article = require('./../models/article.model');
const router = express.Router();

// Route to display all articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find(); // Fetch all articles
        res.render('articles/index', { articles });
    } catch (error) {
        console.log(error);
        res.redirect('/'); // Redirect in case of error
    }
});

// Route to render form for new article
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});

// Route to display a single article based on slug
router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug }); 
        if (article) {
            res.render('articles/show', { article });
        } else {
            res.redirect('/articles');
        }
    } catch (error) {
        console.log(error);
        res.redirect('/articles');
    }
});

// Route to handle new article creation
router.post('/', async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });

    try {
        await article.save();
        res.redirect(`/articles/${article.slug}`); 
    } catch (error) {
        console.log(error);
        res.redirect('/articles/new'); 
    }
});

// Route to render form for editing an article
router.get('/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.render('articles/edit', { article });
    } catch (error) {
        console.log(error);
        res.redirect('/articles');
    }
});

// Route to handle article update
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try{
        const article = await Article.findByIdAndUpdate(id, {
            title: req.body.title,
            description: req.body.description,
            markdown: req.body.markdown
        }, { new: true });
        res.redirect(`/articles/${article.slug}`);
    } catch (error){
        console.log(error);
        res.redirect(`/articles/edit/${id}`);
    }
})

//Route to delete article
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try{
        const article = await Article.findByIdAndDelete(id);
        if(article)
            res.redirect('/articles');
        else
            res.redirect(`/articles/${id}`);
    } catch (error){
        console.log(error)
    }
})

module.exports = router;
