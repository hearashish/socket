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
        console.log(req.body);
        db.collection('users').find({name:req.body.userEmail,pass:req.body.userPassword}).toArray(function (err, k) {
            if (err) throw err
            else
                if (k.length==0)
                {
                    console.log(k);
                    //res.send('Invalid Username or Password');
                    req.session.msg = 'Invalid Username or Password';
                    res.redirect('/');
                } else {
                    res.send(k);
                }
        })
    });
});

module.exports = router;
