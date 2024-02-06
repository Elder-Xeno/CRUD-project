const express = require('express');
const router = express.Router();
const passport = require('passport');

// Homepage route with a login form
router.get('/', (req, res) => {
  res.render('index', { title: 'Shelfie' });
});

// Login route
router.post('/login', (req, res) => {
  console.log('User authenticated:', req.isAuthenticated());
  res.redirect('/boardgames'); // Redirect to the collection after login
});

// Google OAuth login route
// Google OAuth login route
router.get('/auth/google', (req, res, next) => {
  // If user is already authenticated, redirect to the collection
  if (req.isAuthenticated()) {
    return res.redirect('/boardgames');
  }
  // Otherwise, proceed with authentication
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));


// Google OAuth callback route
router.get('/oauth2callback',
  passport.authenticate('google', {
    successRedirect: '/boardgames',
    failureRedirect: '/',
  })
);

// OAuth logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
