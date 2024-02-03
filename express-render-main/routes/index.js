const express = require('express');
const router = express.Router();
const passport = require('passport');

//Homepage route with a login form
router.get('/', (req, res) => {
  res.render('index');
});

// Login route
router.post('/login', (req, res) => {
  res.redirect('/collection'); // Redirect to the collection after login
});


// Google OAuth login route
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate('google', {
  successRedirect: '/collection',
  failureRedirect: '/',
}));

// OAuth logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;