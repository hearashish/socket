var express = require('express');
var bodyParser  =  require("body-parser");
var router = express.Router();

var connection = require('../config/database');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'home' });
});

/* Creating new user */
router.post('/signup', function(req, res, next) {
	connection.dbconnect(function(db){
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.userEmail)){
			db.collection("users").insertOne({display_name:req.body.displayName,email:req.body.userEmail,pass:req.body.userPassword}, function(err, result) {
				if (err) {
					throw err;
				} else {
					console.log("Document inserted");
					connection.closeConnection();
					res.send(result);
					// close the connection to db when you are done with it
				}
			});
		} else {
  			res.render('signup', { title: 'home' });
		}
	});
});

/* Moving to dashboard */
router.get('/dashboard', function(req, res, next) {
	if (req.session.email) {
		res.render('dashboard', { title: 'Website',layout: 'users-layout.hbs'});
		//res.render('dashboard');
	} else {
		res.redirect('/');
	}
});

router.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
        // cannot access session here
    })
	res.redirect('/');
});

router.get('/new-post', function(req, res, next) {
	if (req.session.email) {
		res.render('new-post', { title: 'Website',layout: 'users-layout.hbs'});
		//res.render('dashboard');
	} else {
		res.redirect('/');
	}
});

module.exports = router;
