var express = require('express');
var router = express.Router();
var User = require('../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/register', async function (req, res, next) {
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
		sess = req.session;
		sess.email = req.body.email;

		// Create a token
		const payload = {
			email: user.email
		};
		const options = {
			expiresIn: '2d',
			issuer: 'sample'
		};
		const secret = config.get('JWT_SECRET');
		const token = jwt.sign(payload, secret, options);
		const result = {
			token,
			user
		}
		res.status(200).send(result);
		// res.send({
		// 	"Success": "Success!"
		// });
	} catch (e) {
		console.log(e);
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
	sess = req.session;
	User.findOne({
		email: sess.email
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