var express = require('express');
var router = express.Router();
const config = require('config');
var uniqid = require('uniqid');
const validateToken = require('../utils').validateToken;
const Busboy = require('busboy');
const AWS = require('aws-sdk');
var FileUpload = require('../models/file');
var HttpStatus = require('http-status-codes');


router.post('/upload', validateToken, async function (req, res, next) {
    try {
        // This grabs the additional parameters so in this case passing     
        // in "element1" with a value.
        const email = req.body.email;
        console.log(email);
        console.log(req.files);
        var busboy = new Busboy({
            headers: req.headers
        });
        // The file upload has completed
        await busboy.on('finish', async function () {
            var file = req.files.file;
            const fileData = await uploadToS3(file);
            var fileObj = new FileUpload({
                location: fileData.Location,
                Key: fileData.Key,
                email
            });
            await fileObj.save();
            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: "Success!",
                data: fileData
            });
        });
        req.pipe(busboy);
    } catch (e) {
        return res.send({
            status: HttpStatus.BAD_REQUEST,
            "error": e
        });
    }

});


async function uploadToS3(file) {
    let s3bucket = new AWS.S3({
        accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
        Bucket: config.get('AWS_S3_BUCKET'),
        ACL: 'public-read'
    });
    // const bukcket = await s3bucket.createBucket({
    //     Bucket: config.get('AWS_S3_BUCKET')
    // }).promise();
    //console.log('bukcket', bukcket);
    const result = await s3bucket.upload({
        Bucket: config.get('AWS_S3_BUCKET'),
        Key: uniqid() + '_' + file.name,
        Body: file.data,
    }).promise();
    return result;
}

router.post('/delete', validateToken, async function (req, res, next) {
    try {
        let s3bucket = new AWS.S3({
            accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
            Bucket: config.get('AWS_S3_BUCKET')
        });
        const Key = req.body.Key;
        s3bucket.deleteObject({
            Key,
            Bucket: config.get('AWS_S3_BUCKET')
        }, function (err, data) {
            if (err) {
                throw new Error(err);
            }
            res.status(200).send({
                status: HttpStatus.OK,
                message: 'Success!',
                data
            });
        });
    } catch (e) {
        return res.send({
            status: HttpStatus.BAD_REQUEST,
            "error": e
        });
    }
});

module.exports = router;