const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.session.user
  });
});


router.get('/mystock', ensureAuthenticated, (req, res) =>
  res.render('mystock', {
    user: req.session.user
  })
);

router.get('/mybankaccount', ensureAuthenticated, (req, res) => {
    res.render('mybankaccount', {
    user: req.session.user,
    bank: req.session.user.bank_acc
  	});

});
router.get('/user_profile', ensureAuthenticated, (req, res) =>{
  res.render('user_profile', {
    user: req.session.user
  });
});

router.get('/addcredit', ensureAuthenticated, (req, res) =>{
  res.render('addcredit', {
    user: req.session.user
  });
});

router.get('/removecredit', ensureAuthenticated, (req, res) =>{
  res.render('removecredit', {
    user: req.session.user
  });
});

router.get('/stockhist', ensureAuthenticated, (req, res) =>{
  res.render('stockhist', {
    user: req.session.user
  });
});

router.get('/buystock', ensureAuthenticated, (req, res) =>{
  res.render('buystock', {
    user: req.session.user
  });
});
module.exports = router;
