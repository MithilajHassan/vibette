
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(()=>console.log('insideeee called'))
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/'); // Redirect to home page after successful authentication
  }
);

module.exports ={ router}