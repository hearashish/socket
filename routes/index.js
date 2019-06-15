var express = require('express');
var bodyParser  =  require("body-parser");
var router = express.Router();
var mw = require('../my-middleware.js');

var connection = require('../config/database');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.msg) {
        var msg = req.session.msg;
        req.session.destroy(function(err) {
            // cannot access session here
        })
        res.render('index', { title: 'Website','errMsg':msg });
    } else if (req.session.email){
        res.redirect('/users/dashboard');
    } else {
        res.render('index', { title: 'Website' });
    }
});

router.use('/home',mw({ option1: '1', option2: '2' }));

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'home' });
});

router.post('/validate-login', function(req, res, next) {
    connection.dbconnect(function(db){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.userEmail)){
            db.collection('users').find({email:req.body.userEmail,pass:req.body.userPassword}).toArray(function (err, k) {
                if (err) throw err
                else
                    if (k.length==0)
                    {
                        console.log(k);
                        req.session.msg = 'Invalid Username or Password';
                        res.redirect('/');
                    } else {
                        req.session.email = req.body.userEmail;
                        res.redirect('/users/dashboard');
                    }
            })
        } else {
            req.session.msg = 'Invalid Email Address';
            res.redirect('/');
        }
    });
});

module.exports = router;
