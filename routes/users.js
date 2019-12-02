const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const request = require('request');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  // var queryObject = {
  //       name: req.body.name,
  //       email: req.body.email,
  //       password: req.body.password,
  //       password2: req.body.password2
  //   }
  request.post('http://localhost:8000/users/register1',
    { form: { name: name, password: password, password2: password2, email: email}, },
        function (e, r, body) {
          var body1 = JSON.parse(body);
          console.log(body1.user);
          var errors = body1.error;
          if(body1.user=="yes"){
              req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
          } else{
              res.render('register', {
                errors,
                name,
                email,
                password,
                password2
              });
          }
        console.log(body);
  });
});

// Login

router.post('/login', (req, res, next) => {
  const { email, password} = req.body;
  request.post('http://localhost:8000/users/login1',
    { form: { email:email, password:password}, },
        function (e, r, body) {
          var body1 = JSON.parse(body);
          console.log(body1.error);
          if(body1.login){
            login = true;
            sess = req.session;
            sess.user = body1.user;
            user = body1.user;
            passport.serializeUser(function(user, done) {
                done(null, user.id);
            });

            passport.deserializeUser(function(id, done) {
                User.findById(id, function(err, user) {
                  done(err, user);
                });
            });
            console.log(req.session.user);
            res.redirect('/dashboard');
              

            //console.log(req.user);
          } else{
            console.log(body1.error);
            req.flash(
                  'success_msg',
                  body1.error               
            );
            res.redirect('/users/login');
          }
  });
});

// Logout
router.get('/logout', (req, res) => {
  login = false;
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// Adding bank account for the user
router.post('/addbankaccount', (req, res) => {
  const { acc_num, routing_num } = req.body;
  const id = req.session.user._id;
  request.post('http://localhost:8000/users/addbankaccount',
    { form: { id: id, acc_num: acc_num, routing_num: routing_num}, },
        function (e, r, body) {
          var body1 = JSON.parse(body);
          if(body1.update){
              req.flash(
                  'success_msg',
                  'The bank account has been added'
                );
              console.log(req.session);
              req.session.user = body1.model;
                res.redirect('/mybankaccount');
          } else{
              res.render('mybankaccount', {
                acc_num,
                routing_num
              });
          }
  });
});

//user_profile_edit
router.post('/user_profile', (req, res, next) => {
  const {name,physical_address1,physical_address2,physical_address3} = req.body;
  const id = req.session.user._id;
  request.post('http://localhost:8000/users/user_profile',
    { form: { id: id, name:name, physical_address1:physical_address1, physical_address2:physical_address2,physical_address3:physical_address3}, },
        function (e, r, body) {
          var body1 = JSON.parse(body);
          if(body1.update){
              req.flash(
                  'success_msg',
                  'The Profile has been updated'
                );
              console.log(req.session);
              req.session.user = body1.model;
              res.redirect('/dashboard');
          } else{
              res.render('user_profile', {
                name,
                physical_address1,
                physical_address2,
                physical_address3
              });
          }
  });
});

//Adding credits
router.post('/addcredit', (req, res) => {
  var credit = parseInt(req.body.credit);
  credit = credit+req.session.user.credit;
  console.log(credit);
  const id = req.session.user._id;
  request.post('http://localhost:8000/users/addcredit',
    { form: { id: id, credit:credit}, },
        function (e, r, body) {
          var body1 = JSON.parse(body);
          if(body1.update){
              req.flash(
                  'success_msg',
                  'The amount has been added'
                );
              req.session.user = body1.model;
                res.redirect('/mybankaccount');
          } else{
              res.render('addcredit', {
                credit
              });
          }
  });
});

module.exports = router;
