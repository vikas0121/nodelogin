const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: 'YOUR_API_KEY',
    apiSecret: 'YOUR_API_SECRET'
});
var express = require('express');
var router = express.Router();

router.post('/register', async (req, res) => {
    // A user registers with a mobile phone number
    let phoneNumber = req.body.number;
    console.log(phoneNumber);
    nexmo.verify.request({
        number: phoneNumber,
        brand: 'Awesome Company'
    }, (err,
        result) => {
        if (err) {
            res.sendStatus(500);
        } else {
            let requestId = result.request_id;
            if (result.status == '0') {
                res.render('verify', {
                    requestId: requestId
                }); // Success! Now, have your user enter the PIN
            } else {
                res.status(401).send(result.error_text);
            }
        }
    });
});

router.post('/verify', async (req, res) => {
    console.log('verify');
    let pin = req.body.pin;
    let requestId = req.body.requestId;
    console.log(requestId);
    console.log(pin);
    nexmo.verify.check({
        request_id: requestId,
        code: pin
    }, (err, result) => {
        if (err) {
            // handle the error
        } else {
            if (result && result.status == '0') { // Success!
                res.status(200).send('Account verified!');
                res.render('status', {
                    message: 'Account verified! ?'
                });
            } else {
                // handle the error - e.g. wrong PIN
            }
        }
    });
});

module.exports = router;