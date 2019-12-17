var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function (req, res, next) {
	console.log(req.body);
	var personInfo = req.body;
	if (!personInfo.email || !personInfo.username || !personInfo.password) {
		res.send();
	}
	var newPerson = new User({
		email: personInfo.email,
		username: personInfo.username,
		password: personInfo.password
	});
	newPerson.save(function (err, Person) {
		if (err) {
			console.log('err', err.errmsg);
			if (err.code === 11000) {
				res.send({
					"Success": "Email is already used."
				});
			}
		} else
			console.log('Success', Person);
		res.send({
			"Success": "You are regestered,You can login now."
		});
	});
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.get('/mobileverification', function (req, res, next) {
	return res.render('mobileverification.ejs');
});

router.post('/login', async function (req, res, next) {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		res.send({
			"Success": "Success!"
		});
	} catch (e) {
		if (e == 'Error: Unable to login!') {
			res.send({
				"Success": "This Email is not regestered!"
			});
		}
		res.send({
			"Success": "Wrong password!"
		});
	}
});

router.get('/profile', function (req, res, next) {
	console.log('profile', req);
	User.findOne({
		email: 'vikas@gmail.com'
	}, function (err, data) {
		if (!data) {
			res.redirect('/');
		} else {
			return res.render('data.ejs', {
				"name": data.username,
				"email": data.email
			});
		}
	});
});

module.exports = router;