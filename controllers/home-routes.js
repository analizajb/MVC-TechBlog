const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// get all posts for homepage
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
      include: [User]
    })
      .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
  
        res.render('homepage', {
          posts,
          loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// Get a single post
router.get('/post/:id', (req, res) => {
    Post.findOne(req.params.id, {
        include: [
            User,
            {
                model: Comment,
                include: [User]
            },
        ],
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id'});
          return;
        }
  
        // Serialize the data
        const post = dbPostData.get({ plain: true });
  
        // Pass data to template
        res.render('single-post', {
          post,
          loggedIn: req.session.loggedIn
        });
      })
  
      
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// Alow user to log in
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
});


// Make a route for user to sign up
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('signup');
});

module.exports = router;